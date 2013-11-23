DeepThought.Views.starCollectionView = Backbone.Marionette.CollectionView.extend({
  className: "star-container",
  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.prepend(itemView.el);
  }
})