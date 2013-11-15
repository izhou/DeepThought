
DeepThought.Views.nodeView = Backbone.Marionette.CollectionView.extend({
  //itemView: DeepThought.Views.treeView,
  
  tagName: "ul",
  id: "ul1",
  initialize: function() {
    this.root_id = this.options.root_id;
    DeepThought.collections[this.root_id] = this.collection;
  },

  onRender: function() {
    var that = this;
    console.log(DeepThought.rootCollection);
    console.log(that.root_id);
    setTimeout(function() {
      var headerShow = new DeepThought.Views.headerView({
        model: DeepThought.rootCollection.get(that.root_id)
      });
      $("#content").prepend(headerShow.render().$el);

      if ($(":focus").length === 0) {
         var children = DeepThought.collections[that.root_id].models;
         if (children.length !== 0 ){
          $("#ta"+_.first(children).get("id")).focus();
         } else {
          console.log($("#ta"+that.root_id));
          $("#ta"+that.root_id).focus();
         }
       }
    }, 0);
  },

  itemViewOptions: function(){
    var root_id = this.options.root_id;
    return {root_id: root_id}
    
  },

  emptyView: DeepThought.Views.childlessView,

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  },

  appendHtml: function(collectionView, itemView, index){
    var $container = collectionView.itemViewContainer ? collectionView.$(collectionView.itemViewContainer) : collectionView.$el;
    if (index === 0){
      $container.prepend(itemView.el);
    } else {
      $container.children().eq(index - 1).after(itemView.el);
    }
  }

});
