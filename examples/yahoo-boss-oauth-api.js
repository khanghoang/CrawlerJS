var crawlerjs = require('../index.js');

var font = {
  interval: 100,
  getSample: 'http://yboss.yahooapis.com/ysearch/news?format=xml&abstract=long&market=pt-br&sort=date&q=rodrigorizando',
  get: 'http://yboss.yahooapis.com/ysearch/news?format=xml&abstract=long&market=pt-br&sort=date&q="[words:[rodrigorizando:dr%20trakina:corinthians]]"',
  preview: 0,
  extractors: [
    {
      selector: 'results result',
      callback: function(err, html){
        if(!err){
          data = {};
          data.url = html.children('url').text().replace('|', '');
          data.titulo = html.children('title').text().replace('|', '');
          data.descricao = html.children('abstract').text().replace('|', '');
          data.date = html.children('date').text().replace('|', '');
          data.idioma = html.children('language').text().replace('|', '');
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

var config = {
  oauth: {
    consumer_key: 'xxxxx',
    consumer_secret: 'xxxxx'
  }
}

crawlerjs(font,config);
