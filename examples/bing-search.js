var crawlerjs = require('../index.js');

var crawler = {
  interval: 170,
  getSample: 'http://www.bing.com/search?format=rss&first=1&count=50&q=rodrigorizando',
  get: 'http://www.bing.com/search?format=rss&first=1&count=50&q=rodrigorizando',
  statusHeader: [200],
  preview: 0,
  extractors: [
    {
      selector: 'item',
      callback: function(err, html){
        if(!err){
          data = {};
          data.title = html.children('title').text();
          data.link = html.children('link').text();
          data.description = html.children('description').text();
          if(data.link == ''){ data = [] }
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

crawlerjs(crawler);
