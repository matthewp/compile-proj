const compileScript = require('./script.js');
const compileTemplate = require('./template.js');
const { dedent } = require('dentist');
const fsc = require('fs-cheerio');

module.exports = async function(pth) {
  let $ = await fsc.readFile(pth);
  let template = compileTemplate($);
  let script = compileScript($);

  let base = {
    functions: [
      `
      function init(data) {
        ${build(template.init)}
      }
      `
    ]
  }

  let src = build(template, script, base);
  return src;
};

function build(...sources) {
  let parts = ['imports', 'variables', 'functions', 'exports'];
  let all = [];
  for(let part of parts) {
    let args = sources.map(source => source[part]);
    let src = buildPart(...args).join('\n');
    all.push(dedent(src));
  }
  return all.join('\n\n').trim();
}

function buildPart(...args) {
  let arr = [];
  for(let item of args) {
    arr.push(item);
  }
  return arr;
}