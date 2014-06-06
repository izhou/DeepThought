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
        if (event.ctrlKey) 
          this.zoomOut(event);
        break;
      case 13: //enter
        this.createEntry(event);
        break;
      case 40: //down arrow
        this.goDown(event);
        break;
    }
  },

  starEntry: function(){
    console.log("starrr!")
    event.preventDefault();
    event.stopPropagation();

    if (this.model.get("starred")) {
      this.model.save({"starred": false});
      DeepThought.starredCollection.remove(this.model);
    } else {
      this.model.save({"starred": true});
      DeepThought.starredCollection.add(this.model);  
    }
    
    this.render();
  },


  zoomOut:function(event) {  
    this.saveEntry(event);
    var parent_id = this.model.get("parent_id");;
    if(parent_id)
      DeepThought.router.navigate("#/entries/"+parent_id);
  },

  createEntry: function(event) {
    event.preventDefault();
    var that = this;
    var rank = 0;
    if (DeepThought.allCollections[this.model.id].length > 0) {
      rank = DeepThought.allCollections[this.model.id].models[0].get("rank") - 1;
    }
    var newEntry = DeepThought.allCollections[this.model.id].create({
      title:"",
      parent_id: this.model.id,
      rank: rank,
      is_new: true}, 
      { wait: true, success: function() {
        DeepThought.allParents[newEntry.id] = newEntry.id;
        DeepThought.rootCollection.add(newEntry);
        that.focusOnTextArea(that.el.nextSibling);
      }}
    )
  },

  // createChild: function(event) {
  //   event.preventDefault();
  //   DeepThought.rootCollection.create({
  //     title:"",
  //     parent_id: this.model.id
  //   }, {wait: true});
  // },


  //   createEntry: function(event) {
  //   event.preventDefault();
  //   //this.saveEntry(event);
  //   var rank = this.findNewRank(this);
  //   var that = this;
  //   var newEntry = DeepThought.allCollections[this.model.get("parent_id")].create({
  //     title:"", 
  //     parent_id: this.model.get("parent_id"),
  //     rank: rank,
  //     is_new: true},
  //     {wait: true, success: function() {
  //       DeepThought.allParents[that.model.get("id")] = that.model.get("parent_id");
  //       DeepThought.rootCollection.add(newEntry);
  //       that.focusOnTextArea(that.el.nextSibling);
  //     }}
  //   );
  // },


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


