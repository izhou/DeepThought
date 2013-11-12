DeepThought.Views.headerView = Backbone.View.extend({
  template: JST['entry_tree/header'],  

  events: {
    "change" : "saveEntry",
    "keydown :input" : "keyHandler"
  },

  keyHandler: function() {
    switch(event.which) {
      case 37: //left arrow
        this.zoomOut(event);
        break;
      case 13: //enter
        this.createChild(event);
        break;
      case 40: //down arrow
        this.goDown(event);
    }
  },

  zoomOut: function(event) {
    event.preventDefault();
    if (event.which === 37 && event.shiftKey && event.ctrlKey){
      DeepThought.router.navigate('#/entries/'+this.model.get("parent_id"), 
        {wait: true, success: function() {
          Backbone.history.stop();
          Backbone.history.start();
        }}
      );
    }
  },

  createChild: function(event) {
    event.preventDefault();
    DeepThought.rootCollection.create({
      title:"",
      parent_id: this.model.id
    }, {wait: true, success: function() {
      Backbone.history.stop();
      Backbone.history.start();
    }});
  },

  goDown: function(event) {
    event.preventDefault();
     if (this.el.nextSibling.firstChild.tagName === "LI") {
      this.focusOnTextArea(this.el.nextSibling.firstChild);

     }
  },

  render: function() {
    var renderedContent = this.template({
      model: this.model
    });
    this.$el.html(renderedContent);
    return this;
  },

  saveEntry: function() {
    var formData = $("#form"+this.model.get("id")).serializeJSON();
    this.model.save(formData);
  },

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  },

})


