Marionette.Renderer.render = function(template, data) {
//makes Marionette compatible with EJS
  if(typeof template === 'function') {
      return template(data);
  }
  else {
      if(!JST[template]) throw "Template '" + template + "' not found!";
      return JST[template](data);
  }
};

// NEW selector
jQuery.expr[':'].Contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

// OVERWRITES old selecor
jQuery.expr[':'].contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};