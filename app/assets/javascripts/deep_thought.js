window.DeepThought = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var rootCollection = new DeepThought.Collections.EntryTree();
    rootCollection.fetch({
      success: function(data) {
        console.log(data);
        DeepThought.router = new DeepThought.Router(data);
        Backbone.history.start();
      }
    })
  }
};

