CrawlerJS
=====

## Example to use

```js
var CrawlerJS = require('CrawlerJS');

var worlds = {
  name: 'Tibia.com - Worlds',
  description: 'Worlds',
  tags: ['tibia','players','rpg','game'],
  limiter: 1,
  interval: 1000, // 'second', 'minute', 'day', or milliseconds
  getSample: 'http://www.tibia.com/community/?subtopic=worlds',
  get: 'http://www.tibia.com/community/?subtopic=worlds',
  statusHeader: [200],
  block: ['captcha','bloqueado','abuso de servidor'],
  preview: 0, // 0 = start crawler, 1 = view urls, 2 = view html, 3 = view crawled data
  extractors: [
    {
      dataType: '0', // 0 = html/xml, 1 = json
      selector: '.TableContentContainer table.TableContent tr',
      elements: "data.world = $(this).children('td').eq(0).children('a').attr('href'); if(typeof data.world == 'undefined'){delete data.world;}",
      csv: 'worlds.csv',
      mongoCollection: 'tibiaWorlds'
    }
  ]
}

var config = {
  mongoDB: 'tibiatics',
  mongoDBHost: 'localhost',
  mongoDBPort: '27017'
}

CrawlerJS(worlds,config)
```