const fsc = require('fs-cheerio');
const { printDoc } = require('./print.js');
const generate = require('./generator.js').generate;
const optimize = require('./optimize.js').optimize;
const parse = require('./parser.js').parseSync;
const transform = require('./transformer.js').transformSync;

module.exports = compile;

/**
 * Compilers should:
 * 1. Parse
 * 2. Transform
 * 3. Print
*/

async function compile(pth) {
  let $ = await fsc.readFile(pth);
  
  $ = parse($);

  let context = {
    $,
    bindings: new Map(),
    handlers: new Map()
  };

  transform(context);
  context.rawHtml = generate($);
  optimize(context);
  return context;
}