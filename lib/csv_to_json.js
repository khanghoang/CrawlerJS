var csvConverterToJson = require("csvtojson").core.Converter;

readCsv = function(font,url,config){
  var file = './' + font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['file'];
  var csvConverter = new csvConverterToJson(false);
  var readStream=require("fs").createReadStream(file);
  var started = false;
  csvConverter.on("record_parsed",function(row){
    var rowTemp = [];
    if(started == false){
      for(i in row){
        rowTemp.push(i);
      }
      started = true;
    }else{
      for(i in row){
        rowTemp.push(row[i]);
      }
    }
    toJson(font,url,rowTemp,config);
  });
  csvConverter.from(readStream);
}

toJson = function(font,url,row,config){
  if(typeof row[1] !=='undefined' && row[1] !=''){
    if(typeof row[0] !=='undefined' && row[0] !=''){
      url.csvId = row[0];
    }
    if(typeof font['encodeGet'] != 'undefined'){
      row[1] = encodeURIComponent(row[1]);
    }
    url[font['type']] = font[font['type']].replace(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['parameter'], row[1]);
    var fontTemp = clone(font);
    fontTemp[font['type']+'CurrentEntry']++;
    fontTemp[font['type']] = url[font['type']];
    getEntry(fontTemp,url,config);
  }
}
