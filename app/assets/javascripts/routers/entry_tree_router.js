DeepThought.Router = Backbone.Router.extend({

  routes: {
    "": "rootShow",
    "entries/:id" : "nodeShow"
  },

  rootShow: function(){
    this.nodeShow(1)
    // var root = this.rootCollection;
    // var rootShow = new DeepThought.Views.EntryNode({
    //   collection: root,
    //   itemView: DeepThought.Views.EntryTree
    // })
    // var render = rootShow.render();
    // $("#content").html(render.$el)
  },

  nodeShow: function(id){
    var node = DeepThought.rootCollection.get(id);
    //console.log(node)
    var children = DeepThought.rootCollection.where({parent_id : parseInt(id)});
    //console.log(children);

    var nodeShow = new DeepThought.Views.nodeView({
      collection: new DeepThought.Collections.EntryTree(children),
      itemView: DeepThought.Views.treeView
    });

    var render = nodeShow.render();
    $("#content").html(render.$el);

    var header = JST['entry_tree/header']({
      node: node
    });
    $("#content").prepend(header);
  }
});
