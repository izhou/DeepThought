DeepThought.Views.treeView = Backbone.Marionette.CompositeView.extend({
  template: 'entry_tree/nodeForm',
  templateHelpers: function() {
    return { model:this.model};
  },
  tagName: "li",
  itemView: DeepThought.Views.treeView,

  initialEvents: {
    "keydown :input" : "testing"
  },

  testing: function() {
    console.log("wee");
  },

  events: {
    "change": "saveEntry",
    "click .view-toggle" : "toggleView",
    "mouseover" : "displayButton",
    "mouseout" : "hideButton",
    "keydown :input" : "keyHandler",
  },
  
  onRender: function() {
    var that = this;
    if (!this.model.get("expanded")) {
      setTimeout(function() {
        $("#ul"+that.model.get("id")).toggle();
      }, 0);
    }
  },

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  },

  initialize: function(options) {
    var children = DeepThought.rootCollection.where({parent_id: this.model.id})
    this.collection = new DeepThought.Collections.EntryTree(children);
    this.parent_id =  this.model.get("parent_id");
    (this.$el).attr("id",this.model.get("id"));
  },

  saveEntry: function() {
    event.stopPropagation();
    var id = this.model.get("id");
    console.log("saveEntry, id:"+id+" parent:"+this.model.get("parent_id"));
    var formData = $("#form"+id).serializeJSON();
    this.model.save(formData);      
  },

  appendHtml: function(collectionView,itemView) {
    if (itemView.model.get("is_new")) {
      itemView.model.set("parent_id", itemView.model.get("parent_id"))
      $(itemView.el).insertAfter(this.el);
      this.focusOnTextArea(itemView.el);
    } else {
      collectionView.$("#ul"+itemView.model.get("parent_id")).append(itemView.el);
    }
  },

  displayButton: function() {
    event.stopPropagation();
    $("#button"+this.model.id).css({opacity: 1});
  },

  hideButton: function() {
    event.stopPropagation();
    $("#button"+this.model.id).css({opacity: 0});
  },

  toggleView: function(){
    event.preventDefault();
    event.stopPropagation();
    console.log(this.model);
    $("#ul"+this.model.get("id")).toggle("slow");
    var button = document.getElementById("button"+this.model.get("id"))
    console.log("here");
    if (this.model.get("expanded")) {
      this.model.set("expanded", false);
      button.value="+";
    } else {
      this.model.set("expanded", true);
      button.value="-";
    }
    this.model.save();
  },

  keyHandler:function() {
    var that = this;
    event.stopPropagation();
    switch(event.keyCode) {
      case 13: //enter key
        this.createEntry(event);
        break;
      case 8: //backspace
        var title = $("#form"+this.model.get("id")).serializeJSON().entry.title;
        if (title.length === 0)
          this.deleteEntry(event);
        break;
      case 9: //tabbing
        this.changeTab(event);
        break;
      case 38: //up arrow
        this.goUp(event);
        break;
      case 40: //down arrow
        this.goDown(event);
        break;
      case 39: //right arrow
        this.zoomIn(event);
        break;
    }
    this.$el.focus();
  },

  zoomIn:function(event) {
    if (event.shiftKey && event.ctrlKey) {
      DeepThought.router.navigate('#/entries/'+this.model.get("id"), true);
    }
  },

  createEntry: function(event) {
    event.preventDefault();
    var parent_id = this.model.get("parent_id");
    this.collection.create({
      title:"", 
      parent_id: parent_id,
      is_new: true},
      {wait: true}
    );
  },

  deleteEntry: function(event) {
    event.preventDefault();
    this.goUp(event);
    this.model.destroy();
  },

  changeTab: function(event) {
    event.preventDefault();
    var originalCollection = this.model.collection;
    if (event.shiftKey) {  //tab backwards
      var ancestry = this.model.get("ancestry").split("/");
      var grandparent = ancestry[ancestry.length-2]
      if (grandparent) {
        var newParentID = grandparent;
        this.$el.insertAfter(this.$el.parent().parent());
      }      
    } else {  //tab forward
      previousElement = _.last(this.$el.prev());
      console.log(previousElement)
      if (previousElement) 
        var newParentID = parseInt(previousElement.id);
      else
        var newParentID = this.model.parent_id;
      this.$el.appendTo($("#ul"+newParentID));
    }
    if (newParentID) {  
      this.model.save({parent_id: newParentID});
      this.focusOnTextArea(this.el);
    }
  },

  goUp: function(event) {
    event.preventDefault();
    if (this.$el.prev()[0]) {
      var prevElement = this.findDeepestPrev(this.$el.prev()[0]);
    } else {
      var parent = this.$el.parent().parent()[0];
      if (parent.tagName === "LI") {
        var prevElement = parent;
      }
    }
    if (prevElement)
      this.focusOnTextArea(prevElement);
  },

  findDeepestPrev: function(el) {
    if (el.children[1].children.length === 0) {
      return el;
    } else {
      var lastChild = _.last(el.children[1].children);
      return this.findDeepestPrev(lastChild);
    }
  },

  goDown: function(event) {
    event.preventDefault();
    if (this.$el.children()[1].children[0]) {
      var nextElement = this.$el.children()[1];
    } else {
      var nextSibling = this.findNextSibling(this.el);
      if (nextSibling.tagName === "LI") {
        var nextElement = nextSibling;
      }
    }
    if (nextElement)
      this.focusOnTextArea(nextElement);

  },

  findNextSibling: function(el) {
    if (el.nextElementSibling) {
      return el.nextElementSibling;
    } else if (el.parentElement) {
      return this.findNextSibling(el.parentElement.parentElement);
    }
  }

})