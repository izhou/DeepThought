DeepThought.Models.EntryNode = Backbone.Model.extend({
  defaults: {
    "expanded" : true
  }
  // initialize: function() {
  //   var children = this.get("child_ids");
  //   if(children) {
  //     this.children = new DeepThought.Collections.EntryTree(children);
  //     this.unset("children");
  //   }
  // }
});
