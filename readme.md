[![CrawlerJS](assets/crawlerjs.jpg)](https://github.com/CrawlerJS/CrawlerJS)
----
[![Coverage Status](https://img.shields.io/coveralls/CrawlerJS/CrawlerJS.svg)](https://coveralls.io/r/CrawlerJS/CrawlerJS)
[![Build Status](https://secure.travis-ci.org/CrawlerJS/CrawlerJS.png)](https://travis-ci.org/CrawlerJS/CrawlerJS)
[![Dependencies Status](https://david-dm.org/CrawlerJS/CrawlerJS.png)](https://david-dm.org/CrawlerJS/CrawlerJS)
[![DevDependencies Status](https://david-dm.org/CrawlerJS/CrawlerJS/dev-status.png)](https://david-dm.org/CrawlerJS/CrawlerJS)


Open source module for crawling web pages for information and data. This module
is extremely extensible and pluggable, feel free to play with it.

### Examples

In this example we will be searching StackOverflow for the most recently
questions about Node.js, other examples can be [found here](examples/).

```javascript
var Crawler = require('crawler-js');
var manifest = {
  target: {
    // Here we need some infos to acess the website
    url: 'https://stackoverflow.com/questions/tagged/node.js',
    headers: ['User-Agent', 'CrawlerJS']
  },
  extractors: [{
    // The name for this extractor
    name: 'questions',
    // Add a root key, so you can iterate over every element
    // found with this xPath expression
    root: '//div[@class="question-summary"]',
    fields: {
      // Those xPath expressions will be based
      // on the root
      question: '//a[1]/text()',
      link: '//a[1]/@href'
    }
  }, {
    name: 'count',
    fields: {
      // We don't have a root element, so this expression
      // will have all the document as the root and will
      // not iterate
      count: '//*[@id="sidebar"]/div[1]/div[1]/text()',
    }
  }]
};

// Create a new job for your manifest
var job = new Crawler(manifest);

// Listen for data extracted
job.on('data', function(data) {
  console.log('Data extracted for %s:', data.name);
  console.log(data.data);
});

// If something bad happens..
job.on('error', function(err) {
  throw err;
});

// This way we know that the job is done
job.on('end', function() {
  console.log('The job is done');
});


// Start our job
job.start();
```

### Testing

Testing is easy, you need to have `grunt-cli` installed globally, clone this
repository, `npm install` inside the folder and run `grunt test`.

### Todos

* Add inline comments inside [the code](lib/).
* Propper documentation.
* API reference.
* More tests.

### License

Copyright (c) 2014, Rodrigo Matheus <rodrigorizando@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.



