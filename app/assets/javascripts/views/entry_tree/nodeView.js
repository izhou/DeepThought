
DeepThought.Views.nodeView = Backbone.Marionette.CollectionView.extend({

  tagName: "ul",
  id: "ul1",
  initialize: function() {
    this.root_id = this.options.root_id;
  },

  onRender: function() {
    var that = this;
    setTimeout(function() {
      if ($(":focus").length === 0) {
         var children = DeepThought.allCollections[that.root_id].models;
         if (children.length !== 0 ){
          $("#ta"+_.first(children).get("id")).focus();
         } else {
          $("#ta"+that.root_id).focus();
         }
       }
    }, 0);
  },

  itemViewOptions: function(){
    var root_id = this.options.root_id;
    return {root_id: root_id};
    
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

    $('textarea').autosize();
  }

});
