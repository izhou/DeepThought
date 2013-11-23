DeepThought.Views.starView = Backbone.Marionette.ItemView.extend({
  initialize: function() {
    this.id = this.model.get("id");
  },
  template: JST['star'],
  templateHelpers: function(){
    return {model: this.model}
  },
  tagName: function(){
    var id = this.model.get("id");
    return "a href='#/entries/"+id +"'";
  },
  
  className: "star-page uk-panel-box"
})