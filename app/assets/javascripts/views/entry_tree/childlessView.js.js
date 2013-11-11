DeepThought.Views.childlessView = Backbone.Marionette.ItemView.extend({
  template: 'entry_tree/emptyCollection',

  events: {
    "click .first-task" : "makeNewTask"
  },

  initialize: function() {
    this.root_id = parseInt(this.options.root_id);
    console.log("here");
    this.model = DeepThought.rootCollection.get(this.root_id);
  },

  makeNewTask: function(){
    DeepThought.rootCollection.create({
      title:"",
      parent_id: this.model.id
    });
    this.rerender();
  },

  rerender: function(){
    var node = this.model
    console.log(DeepThought.rootCollection)
    var children = DeepThought.rootCollection.where({parent_id : parseInt(this.root_id)});
    
    var nodeShow = new DeepThought.Views.nodeView({
      collection: new DeepThought.Collections.EntryTree(children),
      itemView: DeepThought.Views.treeView,
      root_id: this.root_id
    });

    var render = nodeShow.render();
    $("#content").html(render.$el);      

  }

  // makeNewTask: function(){
  //   // DeepThought.rootCollection.create({
  //   //   title:"boo",
  //   //   parent_id: this.model.id
  //   // }, {wait: true});
  //   // var children = function() 
  //   //   {return DeepThought.rootCollection.where({parent_id: parseInt(this.model.id)})};

  //   var nodeShow = new DeepThought.Views.nodeView({
  //     collection: new DeepThought.Collections.EntryTree(children),
  //     itemView: DeepThought.Views.treeView,
  //     createFirst: true
  //   });

  //   this.$el.html(nodeShow.render().$el);
  //   //nodeShow.createEntry();
  // }
});


  // nodeShow: function(id){
  //   var node = DeepThought.rootCollection.get(id);
  //   var children = DeepThought.rootCollection.where({parent_id : parseInt(id)});
  //   if (children.length !== 0 ){
  //     var nodeShow = new DeepThought.Views.nodeView({
  //       collection: new DeepThought.Collections.EntryTree(children),
  //       itemView: DeepThought.Views.treeView,
  //       id: id
  //     });
  //   } else {
  //     console.log("heyo");
  //     var nodeShow = new DeepThought.Views.childlessView({
  //       model: node
  //     })
  //   }
