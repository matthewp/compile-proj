const compile = require('../lib/index.js');

async function example() {
  let src = await compile(__dirname + '/input/helloworld.html');
  console.log(src);
}

example();