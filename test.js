var crawlerJS = require('./index.js');

var worlds = {
  interval: 1000,
  getSample: 'http://www.tibia.com/community/?subtopic=worlds&world=Xerena',
  get: 'http://www.tibia.com/community/?subtopic=worlds&world=[mongodb:test:name:id]&wasreloaded=1',
  preview: 0,
  extractors: [
    {
      selector: '.InnerTableContainer tr',
      elements: "data.char = String($(this).children('td').eq(0).children('a').text()); if(data.char == ''){data = {};}",
      mongoCollection: 'players'
    }
  ]
}

var config = {
  mongoDB:'TDC',
  mongoDBHost: 'localhost',
  mongoDBPort: '27017'
}

crawlerJS(worlds,config);