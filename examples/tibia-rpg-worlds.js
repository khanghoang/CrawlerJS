var crawlerjs = require('../index.js');

var worlds = {
  interval: 1000,
  getSample: 'http://www.tibia.com/community/?subtopic=worlds',
  get: 'http://www.tibia.com/community/?subtopic=worlds',
  preview: 0,
  extractors: [
    {
      selector: '.TableContentContainer table.TableContent tr',
      callback: function(err, html){
        if(!err){
          data = {};
          data.world = html.children('td').eq(0).children('a').attr('href');
          if(typeof data.world == 'undefined'){
            delete data.world;
          }
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

crawlerjs(worlds);
