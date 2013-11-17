DeepThought.Router = Backbone.Router.extend({

  routes: {
    "": "rootShow",
    "entries/:id" : "nodeShow",
    "search" : "searchShow",
    "contact" : "contactShow"
  },

  rootShow: function(){
    this.nodeShow(1);
  },

  nodeShow: function(id){
    var node = DeepThought.rootCollection.get(id);
    DeepThought.collections = DeepThought.collections || new Object();
    DeepThought.parents = DeepThought.parents || new Object();
    var children = DeepThought.rootCollection.where({parent_id : parseInt(id)});
    var nodeShow = new DeepThought.Views.nodeView({
      collection: new DeepThought.Collections.EntryTree(children),
      itemView: DeepThought.Views.treeView,
      root_id: id
    });

    // var node = DeepThought.rootCollection.get(id);
    // DeepThought.collections = DeepThought.collections || new Object();
    // DeepThought.parents = DeepThought.parents || new Object();
    // var children = DeepThought.rootCollection.where({parent_id : parseInt(id)});
    // var nodeShow = new DeepThought.Views.nodeView({
    //   collection: new DeepThought.Collections.EntryTree(children),
    //   itemView: DeepThought.Views.treeView,
    //   root_id: id
    // });

    var render = nodeShow.render();
    $("#content").html(render.$el);

    $(function() {
      $( ".draggable" ).draggable({axis: "y", revert:true, zIndex:100});
      $( ".droppable" ).droppable({hoverClass:"drop-hover", greedy:true, tolerance: "intersect"});
    });
  },

  contactShow: function() {
    var contactShow = new DeepThought.Views.contactView();
    console.log("reached here");
    $("#content").html(contactShow.render().$el); 
  },

  searchShow: function() {
    var searchShow = new DeepThought.Views.searchView();
    $("#content").html(searchShow.render().$el);
  }
});
