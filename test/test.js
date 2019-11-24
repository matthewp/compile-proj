const compile = require('../lib/index.js');

async function example() {
  let result = await compile(__dirname + '/input/counter.html');
  console.log(result.html);
}

example();