
DeepThought.Views.nodeView = Backbone.Marionette.CollectionView.extend({
  //itemView: DeepThought.Views.treeView,
  tagName: "ul",
  id: "ul1",
  initialize: function() {
    this.root_id = this.options.root_id;
    console.log(this.root_id);
  },

  itemViewOptions: function(){
    return { root_id: this.root_id }
  },

  emptyView: DeepThought.Views.childlessView
//THIS IS THE KICKER
});
