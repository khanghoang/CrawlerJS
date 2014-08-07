fs = require("fs")
, request = require('request')
, cheerio = require('cheerio')
, querystring = require('querystring')
, Converter = require("csvtojson").core.Converter
, mongoq = require('mongoq');

request = request.defaults({jar: true});

var utils = require('./utils')
, check_status_header = require('./check_status_header')
, stream = require('./stream')
, get_proxies = require('./get_proxies')
, json_to_csv = require('./json_to_csv')
, read_csv = require('./read_csv')
, read_mongodb = require('./read_mongodb')
, random_agent = require('./random_agent')
, get_html = require('./get_html')
, map_urls = require('./map_urls')
, get_combinations = require('./get_combinations')
, letters_combinations = require('./letters_combinations');

module.exports = CrawlerJS;

CrawlerJS.version = JSON.parse(fs.readFileSync(require("path").join(__dirname, '..', 'package.json'), 'utf8'))['version'];
CrawlerJS.utils = utils;
CrawlerJS.check_status_header = check_status_header;
CrawlerJS.get_html = get_html;
CrawlerJS.get_proxies = get_proxies;
CrawlerJS.json_to_csv = json_to_csv;
CrawlerJS.read_csv = read_csv;
CrawlerJS.read_mongodb = read_mongodb;
CrawlerJS.random_agent = random_agent;
CrawlerJS.map_urls = map_urls;
CrawlerJS.get_combinations = get_combinations;
CrawlerJS.letters_combinations = letters_combinations;
