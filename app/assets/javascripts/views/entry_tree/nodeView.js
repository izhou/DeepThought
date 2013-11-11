
DeepThought.Views.nodeView = Backbone.Marionette.CollectionView.extend({
  //itemView: DeepThought.Views.treeView,
  tagName: "ul",
  id: "ul1",
  initialize: function() {
    this.root_id = this.options.root_id;
    var that = this;
    $(document).bind('keydown', function(e) {
      if (e.which == 37) {
        that.zoomOut();
      }
    });
  },

  emptyView: DeepThought.Views.childlessView,

  onRender: function() {
    var that = this;
    setTimeout(function() {
      if (that.el.firstChild.tagName === "LI")
      that.focusOnTextArea(that.el.firstChild);
    }, 0);
  },

  zoomOut: function() {
    if (event.shiftKey && event.ctrlKey) {
      var parent_id = DeepThought.rootCollection.get(this.root_id).get("parent_id");
      DeepThought.router.navigate('/entries/'+parent_id, true);
    }
  },

  itemViewOptions: function(){
    return { root_id: this.root_id }
  },

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  }
});
