// This is an example for crawling StackOverflow's engine,
// first we need to create our manifest, or configuration

var Crawler = require('../');
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
