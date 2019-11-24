

function printAttrs(attrs) {
  return Object.entries(attrs).reduce((acc, [name, value]) => {
    return ` ${name}="${value}"`;
  }, '');
}

function insertDollar(str) {
  return str.replace('{', '${');
}

function extract($, $$) {
  let out = '';
  $$.each((i, el) => {
    let $el = $(el);

    switch(el.nodeType) {
      case 1: {
        out += `<${el.tagName}${printAttrs($el.attr())}>${extract($, $(el.children))}</${el.tagName}>`;
        break;
      };
      case 3: {
        out += insertDollar($el.text());
        break;
      }
    }    
  });
  return out;
}

function collectText(el) {
  return (el.children || []).reduce((t, i) => {
    t += i.data;
    return t;
  }, '');
}

function generate($) {
  let scriptEl;
  let script = '';
  let $headChildren = $('head').children();

  $headChildren.each((i, el) => {
    if(el.nodeType === 1 && el.tagName === 'script') {
      scriptEl = el;
      script = collectText(el).trim();
    }
  });

  let body = extract($, $('body').children());

  let fnBody = `
${script};

return \`${body}\`;
  `;

  let fn = new Function(fnBody);
  return fn();
}

exports.generate = generate;