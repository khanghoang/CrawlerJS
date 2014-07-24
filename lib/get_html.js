getHtml = function(font,url,config){
  if(typeof font.statusHeader == 'undefined'){font.statusHeader = [200];}
  var agent = randomAgent();

  var options = {
    //method: font.type,
    url: url.get,
    pool: {maxSockets: 999},
    timeout: 30000,
    jar:true,
    followRedirect: true,
    maxRedirects: 10,
    headers: {
      'User-Agent': agent,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  if(typeof font.encoding != 'undefined' && font.encoding == 'binary'){
    options.encoding = font.encoding;
  }
  if(typeof font.proxy !== 'undefined'){
    options.proxy = getRandomProxy();
    if(options.proxy === false){
      delete options.proxy;
    }
  }else if(typeof config.localProxy != 'undefined'){
    options.proxy = config.localProxy;
  }
  if(typeof config.oauth != 'undefined'){
    options.oauth = config.oauth;
  }
  if(font.preview === 3){
    if(typeof font.postSample != 'undefined'){
      options.form = querystring.parse(font.postSample);
    }
  }else{
    if(typeof font.post != 'undefined'){
      options.form = querystring.parse(url.post);
    }
  }
  if(font.preview === 3){
    if(typeof font.refererSample != 'undefined'){
      options.headers.referer = querystring.parse(font.refererSample);
    }
  }else{
    if(typeof font.referer != 'undefined'){
      options.headers.referer = querystring.parse(font.referer);
    }
  }

/*
    body: '', // passe os parametros quando o method for patch, post ou put
    json: true, // se o retorno for json
    jar: true, // se tem cookies ou captcha
    'auth': {
      'user': 'username',
      'pass': 'password',
      'sendImmediately': false
    },
    oauth : {
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      token: access_token.oauth_token,
      verifier: access_token.oauth_verifier
    }
*/

  var addUrl = function(get,post){
    if(typeof get != undefined){
      url.get = get;
      if(typeof post != undefined){
        url.post = post;
      }
      getHtml(font, url,config);
    }
  }


  var cookieOptions = clone(options);
  cookieOptions.url = font.cookie;

  var getCookie = 0;

  if(font.preview === 3){
    if(typeof font.cookieSample != 'undefined'){
      getCookie = 1;
    }
  }else{
    if(typeof font.cookie != 'undefined'){
      getCookie = 2;
    }
  }

  if(getCookie > 0){
    if(getCookie == 2){
      cookieOptions.url = font.cookie;
    }else{
      cookieOptions.url = font.cookieSample;
    }
    request(cookieOptions,function(){
      request(options,function(e,r,body){getUrl(font,url,config,e,r,body)});
    });
  }else{
    request(options,function(e,r,body){getUrl(font,url,config,e,r,body)});
  }
}

getUrl = function(font,url,config,error,response,body){
  if(!error){
    if(checkStatusHeader(response.statusCode, font.statusHeader)){
      if(font.preview === 0 || font.preview === 3){
        $ = cheerio.load(body,{
          ignoreWhitespace: true,
          xmlMode: true
        });

        var dataArray = {};

        var currentTime = new Date();

        for(var i in font.extractors){
          $(font.extractors[i].selector).each(function(e, elem){
            var data = {};
            eval(font.extractors[i].elements);
            if(objectLength(data) > 0){
              if(typeof url.csvId !== 'undefined'){
                data.csv_id = url.csvId;
              }
              data.get = url.get;
              if(typeof url.post != 'undefined'){
                data.post = url.post;
              }
              data.at = currentTime.getFullYear()+'-'+currentTime.getMonth()+'-'+currentTime.getDay()+' '+currentTime.getHours()+':'+currentTime.getMinutes()+':'+currentTime.getSeconds()+'.'+currentTime.getMilliseconds();
              if(font.preview === 0){
                if(typeof font.extractors[i].csv != 'undefined'){
                  stream[i]['csv'].write(toCsv(JSON.stringify([data]),font.extractors[i].csv.separator,font.extractors[i].csv.delimiter));
                }
                if(typeof font.extractors[i].json != 'undefined'){
                  stream[i]['json'].write(JSON.stringify(data)+'\n');
                }
                if(typeof font.extractors[i].mongoCollection != 'undefined'){
                  data['_id'] = getUuid('xxxxxxxxxxxxxxxx');
                  stream[i]['mongoCollection'].insert(data);
                }
              }else if(font.preview === 3){
                console.log(data);
              }
            }else{
              url['error'] = 'No Results';
              if(font.preview === 0){
                if(typeof font.extractors[i].csv != 'undefined'){
                  streamLog[i]['csv'].write(toCsv(JSON.stringify([url]),font.extractors[i].csv.separator,font.extractors[i].csv.delimiter));
                }
                if(typeof font.extractors[i].json != 'undefined'){
                  streamLog[i]['json'].write(JSON.stringify(url)+'\n');
                }
                if(typeof font.extractors[i].mongoCollection != 'undefined'){
                  streamLog[i]['mongoCollection'].insert(url);
                }
              }else{
                console.log(url);
              }
            }
            delete data;
          });
        }
      }else{
        console.log(body);
      }
    }else{
      url['error'] = 'Unexpected Status Code: ' + response.statusCode;
      if(font.preview === 0){
        for(var i in font.extractors){
          if(typeof font.extractors[i].csv != 'undefined'){
            streamLog[i]['csv'].write(toCsv(JSON.stringify([url]),font.extractors[i].csv.separator,font.extractors[i].csv.delimiter));
          }
          if(typeof font.extractors[i].json != 'undefined'){
            streamLog[i]['json'].write(JSON.stringify(url)+'\n');
          }
          if(typeof font.extractors[i].mongoCollection != 'undefined'){
            streamLog[i]['mongoCollection'].insert(url);
          }
        }
      }else{
        console.log(url);
      }
    }
  }else{
    url['error'] = JSON.stringify(error);
    if(font.preview === 0){
      for(var i in font.extractors){
        if(typeof font.extractors[i].csv != 'undefined'){
          streamLog[i]['csv'].write(toCsv(JSON.stringify([url]),font.extractors[i].csv.separator,font.extractors[i].csv.delimiter));
        }
        if(typeof font.extractors[i].json != 'undefined'){
          streamLog[i]['json'].write(JSON.stringify(url)+'\n');
        }
        if(typeof font.extractors[i].mongoCollection != 'undefined'){
          streamLog[i]['mongoCollection'].insert(url);
        }
      }
    }else{
      console.log(url);
    }
  }
};
