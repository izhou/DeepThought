DeepThought.Views.searchlessView = Backbone.Marionette.ItemView.extend({
  template: 'entry_tree/emptySearch',


  initialize: function() {
    this.root_id = parseInt(this.options.root_id);
  },
});
