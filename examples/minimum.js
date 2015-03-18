var Crawler = require('../');

var manifest = {

  // Automatic start the crawler, so we don't need to call .start()
  start: true,

  // Where we will Crawl our data
  target: {
    url: 'https://wikipedia.org/wiki/Leet',
  },

  // List of extractors that will operate over the content
  extractors: [{

    // The name for this extractor
    name: 'article',

    // Fields to be extracted from the each found root
    fields: {
      // Those xPath expressions will be based
      // on the root
      title: '//*[@id="firstHeading"]/text()',
      description: '//*[@id="mw-content-text"]//p(0)'
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
  console.log('Ooopa! ' + err.stack);
});

// This way we know that the job is done
job.on('end', function() {
  console.log('The job is done');
});
