CrawlerJS = function(font,config){
  if(typeof config == 'undefined'){var config = {};}
  font.type = 'get',
  font.getAttributes = [],
  font.getCurrentEntry = 0,
  font.postAttributes = [],
  font.postCurrentEntry = 0;

  if(font.preview < 2){
    if(font.preview == 0){
      stream = [];
      streamLog = [];

      var isMongoDB = false;

      for(var i in font.extractors){
        stream[i] = {};
        streamLog[i] = {};
        if(typeof font.extractors[i].json != 'undefined'){
          stream[i]['json'] = fs.createWriteStream(font.extractors[i].json, {flags: 'w'});
          streamLog[i]['json'] = fs.createWriteStream(font.extractors[i].json.replace(".","_log."), {flags: 'w'});
        }
        if(typeof font.extractors[i].csv != 'undefined'){
          stream[i]['csv'] = fs.createWriteStream(font.extractors[i].csv, {flags: 'w'});
          streamLog[i]['csv'] = fs.createWriteStream(font.extractors[i].csv.replace(".","_log."), {flags: 'w'});
        }
        if(typeof font.extractors[i].mongoCollection != 'undefined'){
          if(isMongoDB == false){
            var isMongoDB = true;
            mongoDb = mongoq(config.mongoDB, {auto_reconect:false, safe:false, timeout: 1, host:config.mongoDBHost, port:config.mongoDBPort});
          }
          stream[i]['mongoCollection'] = mongoDb.collection(font.extractors[i].mongoCollection);
          streamLog[i]['mongoCollection'] = mongoDb.collection(font.extractors[i].mongoCollection+'_log');
        }
      }

    }
    font.getAttributes = getAttributes(font.get);
    font.postAttributes = getAttributes(font.post);
    getEntry(font,{get:font['get']},config);
  }else{
    getEntry(font,{get:font['getSample']},config);
  }
}

getAttributes = function(entry){
  var numbers = /\[numbers:(.[0-9]{0,10}?):(.[0-9]{0,10}?):(.[0-9]{0,10}?)\]/gim;
  var letters = /\[letters:(.[0-9]{0,}?)\]/gim;
  var csv = /\[csv:(.*?){0,}:(.*?){0,}:(.[0-9]{0,10}?):(.[0-9]{0,10}?)\]/gim;
  var mongodb = /\[mongodb:(.[\w]{0,}?):(.[\w]{0,}?):(.[\w]{0,}?)\]/gim;
  var words = /\[words:\[(.*?){0,}\]\]/gim;
  var types = [];

  if(csv.test(entry) == true){
    var types = types.concat(entry.match(csv));
  }
  if(mongodb.test(entry) == true){
    var types = types.concat(entry.match(mongodb));
  }
  if(words.test(entry) == true){
    var types = types.concat(entry.match(words));
  }
  if(numbers.test(entry) == true){
    var types = types.concat(entry.match(numbers));
  }
  if(letters.test(entry) == true){
    var types = types.concat(entry.match(letters));
  }

  var allAttributes = [];

  for(n in types){
    var url = types[n].replace(/(\[|\])/gim,'');
    var attribute = url.split(':');

    var attributes = [];
    attributes['name'] = attribute[0];
    attributes['parameter'] = types[n];

    if(attribute[0] == 'numbers'){
      attributes['init'] = parseInt(attribute[1]);
      attributes['size'] = parseInt(attribute[2]);
      attributes['diff'] = parseInt(attribute[3]);
      attributes['position'] = parseInt(attribute[1]);
    }
    else if(attribute[0] == 'letters'){
      attributes['init'] = 0;
      attributes['size'] = parseInt(attribute[1]);
      attributes['position'] = 0;
      attributes['letters'] = lettersCombinations(parseInt(attribute[1]));
      attributes['size'] = attributes['letters'].length-1;
    }
    else if(attribute[0] == 'csv'){
      attributes['file'] = attribute[1];
      attributes['delimiter'] = attribute[2];
      attributes['data'] = attribute[3];
      attributes['csvId'] = attribute[4];
      attributes['position'] = 0;
      attributes['size'] = 1;
    }
    if(attribute[0] == 'mongodb'){
      attributes['collection'] =attribute[1];
      attributes['key'] = attribute[2];
      attributes['id'] = attribute[3];
    }
    else if(attribute[0] == 'words'){
      attribute = attribute.splice(1);
      attributes['init'] = 0;
      attributes['words'] = attribute;
      attributes['position'] = 1;
      attributes['size'] = attribute.length-1;
    }
    allAttributes[n] = attributes;
  }
  return allAttributes;
}

getEntry = function(font,url,config){
  if(typeof font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']] !== 'undefined'){
    if(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['name'] == 'numbers'){
      var count = 0;
      for(i=font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['init']; i<=font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['size']; i=i+font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['diff']){
        url[font['type']] = font[font['type']].replace(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['parameter'],i);
        var fontTemp = clone(font);
        if(count == font.limiter){
          fontTemp[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['init'] = i+font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['diff'];
          setTimeout(function(){getEntry(fontTemp,url,config)}, fontTemp.interval);
          break;
        }else{
          fontTemp[font['type']+'CurrentEntry']++;
          fontTemp[font['type']] = url[font['type']];
          getEntry(fontTemp,url,config);
        }
        count++;
      }
    }
    else if(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['name'] == 'letters'){
      var count = 0;
      for(var i=font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['init']; i<font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['letters'].length; i++){
        url[font['type']] = font[font['type']].replace(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['parameter'],font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['letters'][i]);
        var fontTemp = clone(font);
        if(count == font.limiter){
          fontTemp[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['init'] = i;
          setTimeout(function(){getEntry(fontTemp,url,config)}, fontTemp.interval);
          break;
        }else{
          fontTemp[font['type']+'CurrentEntry']++;
          fontTemp[font['type']] = url[font['type']];
          getEntry(fontTemp,url,config);
        }
        count++;
      }
    }
    else if(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['name'] == 'words'){
      var count = 0;
      for(var i=font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['init']; i<font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['words'].length; i++){
        if(typeof font['encode'+font['type']] != 'undefined'){
          var urlTemp = encodeURIComponent(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['words'][i]);
        }else{
          var urlTemp = font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['words'][i];
        }
        url[font['type']] = font[font['type']].replace(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['parameter'],urlTemp);
        var fontTemp = clone(font);
        if(count == font.limiter){
          fontTemp[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['init'] = i;
          setTimeout(function(){getEntry(fontTemp,url,config)}, fontTemp.interval);
          break;
        }else{
          fontTemp[font['type']+'CurrentEntry']++;
          fontTemp[font['type']] = url[font['type']];
          getEntry(fontTemp,url,config);
        }
        count++;
      }
    }
    else if(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['name'] == 'csv'){
      readCsv(font,url,config);
    }
    else if(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['name'] == 'mongodb'){
      readMongodb(font,url,config);
    }
  }else{
    if(font[font['type']+'Attributes'].length == 0){
      if(font.preview > 1){
        url['get'] = font['getSample'];
        if(font['postSample'] != ''){
          url['post'] = font['postSample'];
        }
      }else{
        url['get'] = font['get'];
        if(font['post'] != ''){
          url['post'] = font['post'];
        }
      }
    }
    putItem(font,url,config);
  }
}

putItem = function (font,url,config){
    if((font['get'] != '' && font['post'] == '') || (font['get'] != '' && font['post'] != '' && font['type'] == 'post')){
      if(font.preview === 1){
        console.log(JSON.stringify(url));
      }else{
        var font = clone(font);
        var url = clone(url);
        getHtml(font,url,config);
      }
    }else{
      font['type'] = "post";
      var fontTemp = clone(font);
      fontTemp[font['type']+'CurrentEntry']=0;
      getEntry(fontTemp,url,config);
      font['type'] = "get";
    }
}
