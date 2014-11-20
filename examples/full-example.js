var Crawler = require('../');

var manifest = {

  // Automatic start the crawler, so we don't need to call .start()
  start: true,

  // Where we will Crawl our data
  target: {
    url: 'http://techcrunch.com/startups/page/{{number}}',
    agent: {
      headers: {
        'User-Agent': 'CrawlerJS v1.0.0-alpha'
      },
      strictSSL: false
    },
    ranges: {
      number: [0, 100, 5], // from 0 to 100 and step 5 numbers each time
      // letter: ['a', 'z'] // from a to z, put {{letter}} where you want it
      // Or add your own range, in this case use {{custom1.fieldName}}
      // custom1: {
      //   plugin: 'mongodb',
      //   options: {
      //     collection: 'users',
      //     query: {
      //       email: /@gmail.com/i,
      //       created: {$gt: new Date(2010, 10, 10)}
      //     }
      //   }
      // },
      // custom2: { // add {{custom2.fieldName}} in your url
      //   plugin: 'csv',
      //   options: {
      //     file: __dirname + './users.csv'
      //   }
      // }

    },
    interval: 1 * 60 * 1000, // Wait 60 seconds between each access

    // This schema will be validated against every response and will not parse
    // if the validation fails
    validation: {
        statusCode: ['number', ['valid', 200]],
        headers: {
          'Content-Type': ['string', ['min', 1], ['max', 80]]
        },
        body: ['string', ['regex', /PostTile/]]
    },

    // This will prevent the crawler to access the page, usefull
    // for the preview of the URLs that the crawler will hit
    test: true
  },

  // List of modules to load from node_modules, you dont need to supply
  // crawlerjs- at the beggining of the name
  plugins: {
    mongodb: {
      connection: 'mongodb://localhost/techcrunch'
    },
    csv: true
  },

  // List of extractors that will operate over the content
  extractors: [{
    // The name for this extractor
    name: 'questions',

    // Add a root key, so you can iterate over every element
    // found with this xPath expression
    root: '//div[@class="question-summary"]',

    // Fields to be extracted from the each found root
    fields: {
      // Those xPath expressions will be based
      // on the root
      question: '//a[1]/text()',
      link: '//a[1]/@href'
    },

    // Validate every parsed field against this schema, it will
    // not emit the parsed data if the validation fails
    validation: {
      question: ['string', ['min', 10], ['max', 80]],
      link: ['string', ['min', 10], ['max', 80], ['regex', /https/]]
    },

    // Configure a plugin for this particular extractor
    plugins: {
      mongodb: {
      },
      csv: {
        output: __dirname + '/startups.csv'
      }
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
