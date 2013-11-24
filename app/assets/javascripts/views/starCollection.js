DeepThought.Views.starCollectionView = Backbone.Marionette.CollectionView.extend({
  className: "star-container",
  appendHtml: function(collectionView, itemView, index){
    var container =  collectionView.$el;
    var children = container.children();
    if (children.size() <= index) {
      container.append(itemView.el);
    } else {
      children.eq(index).before(itemView.el);
    }
  }
})