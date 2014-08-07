getHtml = function(font,url,config){
  if(typeof font.statusHeader == 'undefined'){font.statusHeader = [200];}
  var agent = randomAgent();
  var options = {
//    method: font.type,
    url: url.get,
    pool: {maxSockets: 999},
    jar:true,
    followRedirect: true,
    maxRedirects: 10,
    headers: {
      'User-Agent': agent,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  if(typeof font.timeout != 'undefined'){
    options.timeout = font.timeout;
  }else{
    options.timeout = 30000;
  }
  if(typeof font.encoding != 'undefined' && font.encoding == 'binary'){
    options.encoding = font.encoding;
  }
  if(typeof config.localProxy != 'undefined'){
    if(config.proxy == 'random'){
      options.proxy = getRandomProxy();
    }else{
      options.proxy = config.localProxy;
    }
  }
  if(typeof config.oauth != 'undefined'){
    options.oauth = config.oauth;
  }
  if(typeof config.auth != 'undefined'){
    options.auth = config.auth;
  /*'auth': {
    'user': 'username',
    'pass': 'password',
    'sendImmediately': false
  }*/
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
        $ = cheerio.load(body,{ignoreWhitespace: true, xmlMode: true});
        var data = {};
        for(var i in font.extractors){
          if(typeof font.extractors[i].selector != 'undefined' && font.extractors[i].selector != '*'){
            $(font.extractors[i].selector).each(function(e, elem){
              eval(font.extractors[i].elements);
              if(objectLength(data) > 0){
                getResult(font,url,data,stream);
              }else{
                getResult(font,url,{error:'No Results','otherAttempts':font.tryAgain},streamLog);
              }
              delete data;
            });
          }else{
            eval(font.extractors[i].elements);
            getResult(font,url,data,stream);
          }
        }
      }else{
        console.log(body);
      }
    }else{
      var data = {};
      data['error'] = 'Unexpected Status Code: ' + response.statusCode;
      data['otherAttempts'] = font.tryAgain;
      //data['html'] = body.replace(/\n/g," ").replace(/\r\n/g," ").replace(/\t/g," ");
      getResult(font,url,data,streamLog);
      if(typeof font.tryAgain != 'undefined' && font.tryAgain > 0){
        font.tryAgain = font.tryAgain-1;
        getHtml(font,url,config);
      }else if(typeof font.tryAgain != 'undefined' && font.tryAgain > -1){
        font.tryAgain = (-1);
        getHtml(font,url,config);
      }
    }
  }else{
    var data = {};
    data['error'] = JSON.stringify(error).replace(/"/g,"");
    data['otherAttempts'] = font.tryAgain;
    getResult(font,url,data,streamLog);
    if(typeof font.tryAgain != 'undefined' && font.tryAgain > 0){
      font.tryAgain = font.tryAgain-1;
      getHtml(font,url,config);
    }else if(typeof font.tryAgain != 'undefined' && font.tryAgain > -1){
      font.tryAgain = (-1);
      getHtml(font,url,config);
    }
  }
}

var getResult = function(font,url,data,streamFile){
  if(typeof url.csvId !== 'undefined'){
    data.csv_id = url.csvId;
  }
  data.get = url.get;
  if(typeof url.post != 'undefined'){
    data.post = url.post;
  }
  data.at = String(new Date().getTime());
  if(font.preview == 0){
    for(var i in font.extractors){
      if(typeof font.extractors[i].csv != 'undefined'){
        streamFile[i]['csv'].write(toCsv(JSON.stringify([data]),font.extractors[i].csv.separator,font.extractors[i].csv.delimiter));
      }
      if(typeof font.extractors[i].json != 'undefined'){
        streamFile[i]['json'].write(JSON.stringify(data)+'\n');
      }
      if(typeof font.extractors[i].mongoCollection != 'undefined'){
        streamFile[i]['mongoCollection'].insert(data);
      }
    }
  }else{
    console.log(data);
  }
}
