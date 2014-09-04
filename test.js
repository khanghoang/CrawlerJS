var crawlerJS = require('./index.js');

var crawler = {
  interval: 1000,
  getSample: 'http://science.gsfc.nasa.gov/sed//index.cfm?fuseAction=people.staffList&navOrgCode=600&navTab=nav_about_us&PageNum=1',
  get: 'http://science.gsfc.nasa.gov/sed//index.cfm?fuseAction=people.staffList&navOrgCode=600&navTab=nav_about_us&PageNum=[numbers:1:10000:100]',
  preview: 0,
  extractors: [
    {
      selector: '#border-spacing tr',
      elements: "data.nome = $(this).children('td').eq(0).children('a').text(); data.filial = $(this).children('td').eq(3).text();  data.telefone = $(this).children('td').eq(4).text();",
      mongoCollection: 'funcionarios-da-nasa'
    }
  ]
}

var config = {
  localProxy: 'http://spobrproxy:3128/',
  mongoDB: 'captacoes',
  mongoDBHost: 'localhost',
  mongoDBPort: '27017'
}

crawlerJS(crawler,config);
