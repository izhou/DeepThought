window.DeepThought = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    console.log("ffoooo");
    var entries = new DeepThought.Collections.EntryTree();
    entries.fetch({
      success: function(data) {
        console.log("successhere");
        DeepThought.router = new DeepThought.Router(data);
        Backbone.history.start();
      }
    })
  }
};

