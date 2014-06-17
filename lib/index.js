var utils = require('./utils')
, check_status_header = require('./check_status_header')
, get_html = require('./get_html')
, get_proxies = require('./get_proxies')
, json_to_csv = require('./json_to_csv')
, csv_to_json = require('./csv_to_json')
, random_agent = require('./random_agent')
, map_urls = require('./map_urls')
, get_combinations = require('./get_combinations')
, letters_combinations = require('./letters_combinations');

module.exports = oriun;

oriun.version = JSON.parse(require("fs").readFileSync(require("path").join(__dirname, '..', 'package.json'), 'utf8'))['version'];
oriun.utils = utils;
oriun.check_status_header = check_status_header;
oriun.get_html = get_html;
oriun.get_proxies = get_proxies;
oriun.json_to_csv = json_to_csv;
oriun.csv_to_json = csv_to_json;
oriun.random_agent = random_agent;
oriun.map_urls = map_urls;
oriun.get_combinations = get_combinations;
oriun.letters_combinations = letters_combinations;
