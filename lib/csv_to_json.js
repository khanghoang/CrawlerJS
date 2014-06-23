readCsv = function(font,url,config){
  var file = './' + font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['file'];
  var stream = require("fs").createReadStream(file);
  stream.on('data', onData).buffer = '';

  function onData(chunk){
    var i, hasData = Buffer.isBuffer(chunk);
    if (hasData){
      stream.buffer += chunk.toString('utf8');
      if (stream.paused)
        return;
    }
    if ((i = stream.buffer.indexOf('\n')) > -1) {
      var line = stream.buffer.substring(0, i);
      stream.buffer = stream.buffer.substring(i + 1);
      stream.pause();
      stream.paused = true;
      onLine(font, url, config, line, onData);
    } else if (!hasData) {
      stream.resume();
      stream.paused = false;
    }
  }
  function onLine(font, url, config, line, cb){
    setTimeout(function(){
      line = line.replace('\r','');
      data = line.split(",");
      toJson(font,url,data,config);
      cb();
    }, parseInt(font.interval/font.limiter));
  }
}

toJson = function(font,url,row,config){
  if(typeof row[0] !=='undefined' && row[0] !=''){
    if(typeof row[1] !=='undefined' && row[1] !=''){
      url.csvId = row[1];
    }
    if(typeof font['encodeGet'] != 'undefined'){
      row[0] = encodeURIComponent(row[0]);
    }
    url[font['type']] = font[font['type']].replace(font[font['type']+'Attributes'][font[font['type']+'CurrentEntry']]['parameter'], row[0]);
    var fontTemp = clone(font);
    fontTemp[font['type']+'CurrentEntry']++;
    fontTemp[font['type']] = url[font['type']];
    getEntry(fontTemp,url,config);
  }
}
