
function collectText(el) {
  return (el.children || []).reduce((t, i) => {
    t += i.data;
    return t;
  }, '');
}

function traverse($, el, cb) {
  $(el.children).each((i, el) => {
    cb(el);
    switch(el.nodeType) {
      case 1: {
        traverse($, el, cb);
        break;
      }
    }
  });
}

exports.collectText = collectText;
exports.traverse = traverse;