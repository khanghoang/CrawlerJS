toCsvValue = function(theValue, sDelimiter) {
  var t = typeof (theValue), output;
  if(typeof (sDelimiter) === "undefined" || sDelimiter === null){
    sDelimiter = '"';
  }
  if(t === "undefined" || t === null){
    output = "";
  }else if (t === "string"){
    output = sDelimiter + theValue + sDelimiter;
  }else{
    output = String(theValue);
  }
  return output;
}

toCsv = function(objArray){
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  for (var i = 0; i < array.length; i++){
    var line = '';
    for (var index in array[i]){
      if (line != ''){
        line = line.replace('|',' ');
        line += '|';
      }
      line += array[i][index];
    }
    if (line != '') str += line + '\r\n'
  }
  return str;
}
