var Crawler = require('../');

var manifest = {
  target: {
    url: 'http://techcrunch.com/startups/page/{{number}}',
    ranges: {
      number: [0, 100, 5] // from 0 to 100 and step 5 numbers each time
      // letter: ['a', 'z'] // from a to z, put {{letter}} where you want it
      // resource: 'csv' // configure this resource and put {{resource:csv}}
      // resource: 'mongodb' // configure it and put {{resource:mongodb}}

    },
    interval: 1 * 60 * 1000 // Wait 60 seconds between each access
  },
  resources: {
    csv: {
      plugin: 'csv'
    },
    mongodb: {
      plugin: 'mongodb',
      options: {
        collection: 'users',
        field: 'name',
        query: {
          email: /@gmail.com/i
        }
      }
    }
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
