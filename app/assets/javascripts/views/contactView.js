DeepThought.Views.searchView = Backbone.View.extend({
  template: JST['contact'],

  render: function() {
    var renderedContent = this.template();
    $("#content").html(renderedContent);
    
    return this;
  }
})
