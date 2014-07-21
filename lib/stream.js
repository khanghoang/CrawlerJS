createStream = function(font,complement){
  var stream = [];

  var isMongoDB = false;

  for(var i in font.extractors){
    stream[i] = {};
    if(typeof font.extractors[i].json != 'undefined'){
      stream[i]['json'] = fs.createWriteStream(font.extractors[i].json.replace(".",complement), {flags: 'a'});
    }
    if(typeof font.extractors[i].csv != 'undefined'){
      stream[i]['csv'] = fs.createWriteStream(font.extractors[i].csv.name.replace(".",complement), {flags: 'a'});
      if(typeof font.extractors[i].csv.delimiter == 'undefined'){
        font.extractors[i].csv.delimiter = '"';
      }
      if(typeof font.extractors[i].csv.separator == 'undefined'){
        font.extractors[i].csv.separator = ';';
      }
    }
    if(typeof font.extractors[i].mongoCollection != 'undefined'){
      if(isMongoDB == false){
        var isMongoDB = true;
        mongoDb = mongoq(config.mongoDB, {auto_reconect:false, safe:false, timeout: 1, host:config.mongoDBHost, port:config.mongoDBPort});
      }
      if(complement == '-log.'){
        stream[i]['mongoCollection'] = mongoDb.collection(font.extractors[i].mongoCollection+'-log');
      }else{
        stream[i]['mongoCollection'] = mongoDb.collection(font.extractors[i].mongoCollection);
      }
    }
  }
  return stream;
}
