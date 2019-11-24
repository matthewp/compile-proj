
function optimize(context) {
  let { script, rawHtml } = context;

  if(script) {
    context.html = `${rawHtml}
<script type="module">${script}
</script>`;
  } else {
    context.html = rawHtml;
  }
}

exports.optimize = optimize;