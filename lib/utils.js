getParams = function(qs){
  var qs = qs.split("+").join(" ");
  var params = {}, tokens,
  re = /[?&]?([^=]+)=([^&]*)/g;
  var first = 1;
  while (tokens = re.exec(qs)){
    if(first == 1){
      var tempParam = tokens[1].split('?');
      params[decodeURIComponent(tempParam[1])] = decodeURIComponent(tokens[2]);
      first = 0;
    }else{
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
  }
  return params;
}

objectLength = function(obj){
  var size = 0;
  for(var key in obj){
    if(obj.hasOwnProperty(key)) size++;
  }
  return size;
};

getUuid = function(mask){
  return mask.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

clone = function(obj){
  if(obj === null || typeof obj  !== 'object'){
    return obj;
  }else{
    var temp = obj.constructor();
    for(var key in obj){
      temp[key] = clone(obj[key]);
    }
    return temp;
  }
}

rawUrlDecode = function(str){
  return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function(){
    return '%25';
  }));
}
