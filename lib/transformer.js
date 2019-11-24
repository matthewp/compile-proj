const { traverse } = require('./dom.js');

function bindingValue(text) {
  return /{([a-zA-Z0-9]+)}/.exec(text)[1];
}

function assignId($el, suggestedText) {
  let currentId = $el.attr('id');
  if(currentId) {
    return currentId;
  }
  let id = suggestedText;
  $el.attr('id', id);
  return id;
}

function assignIds($, $el, bindings) {
  let text = $el.text();
  if(text.includes('{')) {
    let binding = bindingValue(text)
    let $par = $el.parent();
    let id = assignId($par, `${binding}-text`);
    bindings.set(binding, id);
  }
}

function assignHandlers($el, handlers) {
  for(let [name, value] of Object.entries($el.attr())) {
    if(name.startsWith('on:')) {
      let eventName = name.substr(name.indexOf(':') + 1);
      let binding = bindingValue(value);
      let id = assignId($el, `${binding}-el`);
      handlers.set(id, [eventName, binding]);
    }
  }
}

function transformSync(context) {
  let { $, bindings, handlers } = context;
  let script;
  traverse($, $('head')[0], el => {
    if(el.nodeType === 1 && el.name === 'script') {
      script = el;
    }
  })
  traverse($, $('body')[0], el => {
    switch(el.nodeType) {
      case 1: {
        let $el = $(el);
        assignHandlers($el, handlers);
        break;
      }
      case 3: {
        assignIds($, $(el), bindings);
        break;
      }
    }
  });

  if(script && handlers.size) {
    let scriptTextNode = script.children[0];

    let handlerScript = '';
    for(let [id, [eventName, action]] of handlers) {
      handlerScript += `\ndocument.getElementById('${id}').on${eventName} = ${action};`;
    }

    context.script = scriptTextNode.data + handlerScript;
  }

  return $;
}

exports.transformSync = transformSync;