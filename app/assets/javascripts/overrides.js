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