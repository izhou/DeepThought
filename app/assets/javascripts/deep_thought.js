window.DeepThought = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    DeepThought.rootCollection = new DeepThought.Collections.EntryTree();
    DeepThought.rootCollection.fetch({
      success: function(data) {
        DeepThought.allCollections = new Object();
        DeepThought.rootCollection.models.forEach(function(model) {
          var children = DeepThought.rootCollection.where({"parent_id": model.get("id")});
          var childrenColl = new DeepThought.Collections.EntryTree(children);
          DeepThought.allCollections[model.get("id")] = childrenColl;
        })

        DeepThought.allParents = new Object();
        DeepThought.rootCollection.models.forEach(function(model) {
          DeepThought.allParents[model.get("id")] = model.get("parent_id");
        })

        var starred = DeepThought.rootCollection.where({starred: true});
        DeepThought.starredCollection = new DeepThought.Collections.EntryTree(starred);
        var starShow = new DeepThought.Views.starCollectionView({
          collection: DeepThought.starredCollection,
          itemView: DeepThought.Views.starView
        });

        $("#footer_container").append(starShow.render().$el);
        $(".star-container").hide();

        $("#showStars").click(function() {
          $(".star-container").show();
          setTimeout(function() {
            $(window).one("click",function() {
              $(".star-container").slideUp();
            });
          },0);
        });


        DeepThought.router = new DeepThought.Router(data);
        Backbone.history.start();
      }
    })
  }
};
