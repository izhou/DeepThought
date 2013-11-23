DeepThought.Router = Backbone.Router.extend({

  routes: {
    "": "rootShow",
    "entries/:id" : "nodeShow",
    "search" : "searchShow",
    "contact" : "contactShow",
    "star": "starShow",
    "shortcuts": "shortcutShow"
  },

  rootShow: function(){
    var root = DeepThought.rootCollection.findWhere({parent_id: null});
    this.nodeShow(root.get("id"));
  },

  nodeShow: function(id){
    if (DeepThought.allCollections[id]) {
      var nodeShow = new DeepThought.Views.nodeView({
        collection: DeepThought.allCollections[id],
        itemView: DeepThought.Views.treeView,
        root_id: id
      });

      var render = nodeShow.render();
      $("#content").html(render.$el);

      $(function() {
        $( ".draggable" ).draggable({axis: "y", revert:true, zIndex:100});
        $( ".droppable" ).droppable({hoverClass:"drop-hover", greedy:true, tolerance: "intersect"});
      });

        $('textarea').autogrow();
    } else {
      $("#content").html("<div style='color:red'>You do not belong here! Go back.</div>")
    }
  },

  contactShow: function() {
    var contactShow = new DeepThought.Views.contactView();
    console.log("reached here");
    $("#content").html(contactShow.render().$el); 
  },

  searchShow: function() {
    var searchShow = new DeepThought.Views.searchView();
    $("#content").html(searchShow.render().$el);
  },

  starShow: function() {

    //var starShow = new DeepThought.Views.starView();
    $("#footer_container").append("<div class='star-container'></div>");
    var starShow = new DeepThought.Views.starView();
    $(".star-container").append(starShow);
  }
});
