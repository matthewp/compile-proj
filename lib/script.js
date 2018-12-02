
module.exports = compileScript;

class CompileResult {
  compile() {
    let fnSrc = `
      function init(data) {
        let frag = clone();
        
        function update(data = {}) {
          return frag;
        }

        return update;
      }
    `;

    //this.functions = [fnSrc];
    this.exports = ['export default init;'];
  }
}


function compileScript($) {
  let result = new CompileResult();
  result.compile();
  return result;
}