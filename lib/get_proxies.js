var csvConverterToJson = require("csvtojson").core.Converter;
var path = require('path'); 

getProxies = function(){
  var file = './proxies.txt';
  if(path.existsSync(file)){
    var csvConverter = new csvConverterToJson(false);
    var readStream=require("fs").createReadStream(file);
    var started = false;
    proxies = [];
    csvConverter.on("record_parsed",function(row){
      rowTemp = [];
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
      proxies.push(rowTemp);
    });
    csvConverter.from(readStream);
  } 
}

getRandomProxy = function(){
  if(typeof proxies != 'undefined'){
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    return proxy[0];
  }else{
    return false;
  }
}

getProxies();
