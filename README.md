<img src="http://crawlerjs.org/content/images/2014/Jun/logo-5.png" alt="Crawler-js, Open source framework crawler in node.js" width="432px" height="81" />

[Visit crawlerjs.org for more info](http://crawlerjs.org)

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
      csv: 'worlds.csv'
    }
  ]
}

crawlerJS(worlds)
```
