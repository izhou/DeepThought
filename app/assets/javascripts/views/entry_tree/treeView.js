DeepThought.Views.treeView = Backbone.Marionette.CompositeView.extend({
  template: 'entry_tree/nodeForm',
  templateHelpers: function() {
    return { model:this.model};
  },
  tagName: "li",
  itemView: DeepThought.Views.treeView,

  events: {
    "change": "saveEntry",
    "click .view-toggle" : "toggleView",
    "mouseover" : "displayButton",
    "mouseout" : "hideButton",
    "keydown :input" : "keyHandler",

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
      var newItemView = JST['entry_tree/nodeForm']({
        model: itemView.model
      });
      $(this.el.parentElement).append(itemView.el);
    } else {
      collectionView.$("#ul"+itemView.model.get("parent_id")).append(itemView.el);
      //collectionView.$("#ul"+this.model.get("id")).append(itemView.el);
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
    }
    this.$el.focus();
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
    this.model.destroy();
    this.$el.prev().focus(); 
  },

  changeTab: function(event) {
    event.preventDefault();
    var originalCollection = this.model.collection;
    if (event.shiftKey) {  //tab backwards
      var ancestry = this.model.get("ancestry").split("/");
      var grandparent = ancestry[ancestry.length-2]
      var newParentID = grandparent || this.model.get("parent_id");
    } else {  //tab forward
      previousElement = _.last(this.$el.prev());
      console.log(previousElement)
      if (previousElement) 
        var newParentID = parseInt(previousElement.id);
      else
        var newParentID = this.model.parent_id;
    }
    console.log(newParentID);
    this.$el.appendTo($("#ul"+newParentID));
    this.model.save({parent_id: newParentID});
    var that = this;
    setTimeout(function(){
      that.$el.focus();
    }, 0);
    console.log("i reach here");
    console.log($(":focus"));
  },

  goUp: function(event) {
    event.preventDefault();
    previousElement = this.$el.prev()[0];
    if (previousElement) {
      console.log(previousElement);
      previousElement.focus();
    }
  },

  goDown: function(event) {
    event.preventDefault();
    console.log(this);
    if (this.model.get("child_ids")[0]) {
      console.log("babies");
      var nextElement = document.getElementById(_.last(this.model.get("child_ids")))
    } else if (this.$el.next()[0]){
      console.log("bros");
      var nextElement = this.$el.next()[0];
    } else {
      var nextElement = "fuck you";
    }

    var nextForm = nextElement.firstElementChild;
    console.log(nextForm.getElementsByTagName("textarea"));
    nextForm.getElementsByTagName("textarea")[0].focus();

  }

})