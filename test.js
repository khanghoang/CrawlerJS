var crawlerJS = require('./index.js');

var worlds = {
  interval: 500,
  getSample: 'http://www.tibia.com/community/?subtopic=worlds',
  get: '[csv:test.csv:|:0:1]|[numbers:0:5:1]',
  statusHeader: [200],
  block: ['your ip is blocked'],
  preview: 1,
  extractors: [
    {
      dataType: '0',
      selector: '.TableContentContainer table.TableContent tr',
      elements: "data.world = $(this).children('td').eq(0).children('a').attr('href'); if(typeof data.world == 'undefined'){delete data.world;}",
      csv: 'worlds.csv'
    }
  ]
}

crawlerJS(worlds)