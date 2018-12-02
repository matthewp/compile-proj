let template = document.createElement('template');
template.innerHTML = `
  <div>Hello <span data-tmpl="1">name</span>!</div>
  <input type="text" value="{name}" on-keyup="{updateName}">
`;

function clone() {
  return document.importNode(template.content, true);
}
    


function init(data) {
  let frag = clone();,let test2
}

export default init;
