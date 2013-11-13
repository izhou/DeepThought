DeepThought.Collections.EntryTree = Backbone.Collection.extend({
  model: DeepThought.Models.EntryNode,
  url: "/entries",
  comparator: function(model) {
    return model.get("rank");
  }
});
