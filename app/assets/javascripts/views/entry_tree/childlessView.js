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
    var that = this;
    DeepThought.rootCollection.create({
      title:"",
      parent_id: this.model.id,
      rank: 1
    });
    DeepThought.rootCollection.fetch({wait: true, success: function() {
      Backbone.history.stop();
      Backbone.history.start();
    }})
  },
});