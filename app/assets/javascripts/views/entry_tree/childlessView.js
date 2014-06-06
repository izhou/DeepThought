DeepThought.Views.childlessView = Backbone.Marionette.ItemView.extend({
  template: 'entry_tree/emptyCollection',

  events: {
    "click .first-task" : "makeNewTask"
  },

  initialize: function() {
    this.root_id = parseInt(this.options.root_id);
  },

  makeNewTask: function(){
    var that = this;
    var newTask  = DeepThought.allCollections[this.root_id].create({
      title:"",
      parent_id: this.root_id,
      rank: 1,
      is_new: true
    }, {wait:true, success: function() {
      DeepThought.rootCollection.add(newTask);
    }});
  },
});
