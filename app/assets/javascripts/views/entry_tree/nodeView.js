
DeepThought.Views.nodeView = Backbone.Marionette.CollectionView.extend({
  //itemView: DeepThought.Views.treeView,
  tagName: "ul",
  id: "ul1",
  initialize: function() {
    this.root_id = this.options.root_id;
    console.log(this.collection);
  },

  emptyView: DeepThought.Views.childlessView,

  onRender: function() {
    var that = this;
    setTimeout(function() {
      if (that.el.firstChild.tagName === "LI" && $(":focus").length === 0) {
        that.focusOnTextArea(that.el.firstChild);
      }
  
      var headerShow = new DeepThought.Views.headerView({
        model: DeepThought.rootCollection.get(that.root_id)
      });
      $("#content").prepend(headerShow.render().$el);
      if ($(":focus").length === 0) {
        $("#ta"+that.root_id).focus();
      }
    }, 0);
  },

  itemViewOptions: function(){
    return { root_id: this.root_id,
      siblings: this.collection }
  },

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  }
});
