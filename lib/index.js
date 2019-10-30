const fsc = require('fs-cheerio');
const { printDoc } = require('./print.js');

module.exports = compile;

async function compile(pth) {
  let $ = await fsc.readFile(pth);
  let html = printDoc($);
  return html;
}