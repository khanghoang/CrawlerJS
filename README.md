<img src="https://photos-2.dropbox.com/t/0/AADTqU9SijzmfNTVOZXqSqEsMoCo-0FUCDftbvNh5UeYmQ/12/2099895/png/2048x1536/3/1403874000/0/2/logo.png/6WtfDE_vWesVcKlDD_h7b1w1puH9YzLN0vVXJcmQ4fA" alt="Crawler-js, Open source framework crawler in node.js" width="432px" heigth="81" />

[Visit crawlerjs.org for more info](https://crawlerjs.org)

I was upset not to have something simple to extract information to do experiments. Thus was born the CrawlerJS, a platform that enables extract information from any websites without having to keep worrying about developing.

Rodrigo Matheus

## Example to use

```js
var crawlerJS = require('CrawlerJS');

var worlds = {
  limiter: 1,
  interval: 1000,
  getSample: 'http://www.tibia.com/community/?subtopic=worlds',
  get: 'http://www.tibia.com/community/?subtopic=worlds',
  statusHeader: [200],
  block: ['your ip is blocked'],
  preview: 0,
  extractors: [
    {
      dataType: '0',
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

crawlerJS(worlds,config)
```