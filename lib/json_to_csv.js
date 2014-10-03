toCsv = function(objArray,separator,delimiter){
  if(typeof separator == 'undefined'){separator = ';';}
  if(typeof delimiter == 'undefined'){delimiter = '"';}
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  for (var i = 0; i < array.length; i++){
    var line = '';
    for (var index in array[i]){
      if (line != ''){
        line = line.split(delimiter).join("");
        line += separator;
      }
      line += (delimiter+array[i][index]+delimiter).split(separator).join("");
    }
    if (line != '') str += line + '\r\n'
  }
  return str;
}
