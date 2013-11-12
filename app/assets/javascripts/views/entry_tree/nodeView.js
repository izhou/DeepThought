
DeepThought.Views.nodeView = Backbone.Marionette.CollectionView.extend({
  //itemView: DeepThought.Views.treeView,
  tagName: "ul",
  id: "ul1",
  initialize: function() {
    this.root_id = this.options.root_id;
  },

  emptyView: DeepThought.Views.childlessView,

  onRender: function() {
    var that = this;
    setTimeout(function() {
      if (that.el.firstChild.tagName === "LI")
      that.focusOnTextArea(that.el.firstChild);
    }, 0);
  },

  itemViewOptions: function(){
    return { root_id: this.root_id }
  },

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  }
});
