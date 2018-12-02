const Section = require('./section.js');

module.exports = compileTemplate;

const bindingExpr = /{([A-Za-z0-9\$]+)}/g;

class BindingPart {
  constructor(name) {
    this.name = name;
  }
}

function hasBinding(str) {
  return bindingExpr.test(str);
}

function getBinding(str) {
  bindingExpr.lastIndex = 0;
  let lastStart = 0;
  let parts = [];

  while(true) {
    let part = bindingExpr.exec(str);
    
    if(!part) {
      let static = str.substr(lastStart);
      if(static) {
        parts.push(static);
      }
      break;
    }

    parts.push(str.substr(lastStart, part.index - lastStart));
    parts.push(new BindingPart(part[1]));

    lastStart = lastStart + part.index + part[0].length;
  }
  return parts;
}

class Path {
  constructor(node, path = '', parent) {
    this.node = node;
    this.parent = parent;
    this.path = this._getPath(path);
    this.$ = null;
  }

  _getPath(path) {
    if(this.parent) {
      let parentPath = this.parent.path;
      if(parentPath.length) {
        return parentPath + '.' + path;
      }
    }
    return path;
  }

  get rootId() {
    if(this.parent) {
      return this.parent.rootId;
    }
    return this._rootId != null ? this._rootId : 0;
  }

  set rootId(val) {
    if(this.parent) {
      this.parent.rootId = val;
    }
    this._rootId = val;
  }

  nextId() {
    this.rootId++;
    return this.rootId;
  }

  compile() {
    this.discoverBindings();

    let bindings = [];
    this.traverse(child => {
      if(child.bindings) {
        bindings.push.apply(bindings, child.bindings);
      }
    });
    this.bindings = bindings;
  }

  discoverBindings() {
    let node = this.node;
    let $ = this.$;
    switch(node.type) {
      case 'text':
        let text = node.nodeValue;
        if(hasBinding(text)) {
          let parts = getBinding(text);
          if(parts.length > 1) {
            let repl = '';
            for(let part of parts) {
              if(typeof part === 'string') {
                repl += part;
              } else {
                repl += `<span data-tmpl="${this.nextId()}">${part.name}</span>`;
              }
            }
            $(node).replaceWith($(repl));
          }
          
        }
        break;
    }
  }

  traverse(fn) {
    let child = this.node.firstChild;
    let last = 'firstChild';
    while(child) {
      let path = new Path(child, last, this);
      path.$ = this.$;
      path.compile();
      fn(path);

      child = child.nextSibling;
    }
  }
}

class CompileResult {
  constructor(root, template) {
    this.root = root;
    this.src = template.html();
  }

  compile() {
    this.imports = [];

    let templateSrc = `
let template = document.createElement('template');
template.innerHTML = \`${this.src}\`;`;
    this.variables = [templateSrc];
    
    let fnSrc = `
      function clone() {
        return document.importNode(template.content, true);
      }
    `;

    this.functions = [fnSrc];

    this.init = new Section();
    this.init.variables = [
      `let frag = clone();`,
      `let test2`
    ];
  }
}

function compileTemplate($) {
  let template = $('template')[0];
  if(!template) {
    throw new Error('A top-level template is required.');
  }

  let root = new Path(template.firstChild);
  root.$ = $;
  root.compile();

  let $template = $(template);
  let result = new CompileResult(root, $template);
  result.compile();
  return result;
}