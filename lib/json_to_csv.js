toCsv = function(objArray,separator,delimiter){
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  for (var i = 0; i < array.length; i++){
    var line = '';
    for (var index in array[i]){
      if (line != ''){
        line += separator;
      }
      line += delimiter+array[i][index].replace(separator,' ')+delimiter;
    }
    if (line != '') str += line + '\r\n'
  }
  return str;
}
