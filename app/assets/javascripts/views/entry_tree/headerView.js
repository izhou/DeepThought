DeepThought.Views.headerView = Backbone.View.extend({
  template: JST['entry_tree/header'],  

  events: {
    "click .star" : "starEntry",
    "change" : "saveEntry",
    "keydown :input" : "keyHandler"
  },

  keyHandler: function() {
    switch(event.which) {
      case 37: //left arrow
        if (event.shiftKey) 
          this.zoomOut(event);
        break;
      case 13: //enter
        this.createChild(event);
        break;
      case 40: //down arrow
        this.goDown(event);
    }
  },

  starEntry: function(){
    console.log("starrr!")
    event.preventDefault();
    event.stopPropagation();

    if (this.model.get("starred")) {
      this.model.save({"starred": false});
      DeepThought.starredCollection.remove(this.model);
      this.render();
    } else {
      this.model.save({"starred": true});
      DeepThought.starredCollection.add(this.model);
      this.render();
    }

  },

  zoomOut:function(event) {
    event.preventDefault();
    console.log("boooooo");
    var parent_id = this.model.get("parent_id");
//    var grandparent_id = this.findGrandparent(this.model);
    if(parent_id) {
      var entryShow = new DeepThought.Views.nodeView({
        collection: DeepThought.allCollections[parent_id],
        itemView: DeepThought.Views.treeView,
        root_id: parent_id
      });
    $("#content").html(entryShow.render().$el);
    }
  },

  createChild: function(event) {
    event.preventDefault();
    DeepThought.rootCollection.create({
      title:"",
      parent_id: this.model.id
    }, {wait: true});
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

  findGrandparent: function(model) {
    var parent_id = DeepThought.allParents[model.get("id")];
    return DeepThought.allParents[parent_id];
  },

})


