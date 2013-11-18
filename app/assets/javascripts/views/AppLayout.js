AppLayout = Backbone.Marionette.Layout.extend({
  template: JST['layout'],

  regions: {
    menu: "#menu",
    content: "#content"
  }
});

var layout = new AppLayout();
layout.render();