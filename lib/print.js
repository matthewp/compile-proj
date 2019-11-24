exports.print = print;
exports.printDoc = printDoc;

function printAttrs(attrs) {
  return Object.entries(attrs).reduce((acc, [name, value]) => {
    return ` ${name}="${value}"`;
  }, '');
}

function print($, $$) {
  let out = '';
  $$.each((i, el) => {
    let $el = $(el);

    switch(el.nodeType) {
      case 1: {
        out += `<${el.tagName}${printAttrs($el.attr())}>${print($, $(el.children))}</${el.tagName}>`;
        break;
      };
      case 3: {
        out += $el.text();
        break;
      }
    }    
  });
  return out;
}

function printDoc($) {
  let head = print($, $('head').children());
  let body = print($, $('body').children());

  return `<!doctype html>
<html lang="en">
${head}${head.length ? '\n' : ''}${body}`;
}