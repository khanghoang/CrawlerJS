var request = require('request')
, cheerio = require('cheerio'),
querystring = require('querystring');

getHtml = function(font, url,config){
  var agent = randomAgent();

  var options = {
    method: font.type,
    url: url.get,
    pool: {maxSockets: 999},
    timeout: 30000,
    followRedirect: true,
    maxRedirects: 10,
    headers: {
      'User-Agent': agent,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    //,encoding: 'binary'
  };
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

  request(options, function(error, response, body){
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
                    stream[i]['csv'].write(toCsv(JSON.stringify([data])));
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
                    streamLog[i]['csv'].write(toCsv(JSON.stringify([url])));
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
              streamLog[i]['csv'].write(toCsv(JSON.stringify([url])));
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
            streamLog[i]['csv'].write(toCsv(JSON.stringify([url])));
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
  });
}
