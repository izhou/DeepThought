DeepThought.Views.treeView = Backbone.Marionette.CompositeView.extend({
  template: 'entry_tree/nodeForm',
  templateHelpers: function() {
    return { model:this.model};
  },
  tagName: "li",
  className: "droppable",
  itemView: DeepThought.Views.treeView,
  itemViewOptions: function(){
    return {siblings: this.siblings,
      parent: this.model};
  },

  events: {
    "change": "saveEntry",
    "click .view-toggle" : "toggleView",
    // "mouseover" : "displayButtons",
    // "mouseout" : "hideButtons",
    "keydown :input" : "keyHandler",
    "drop" : "dropHandler",
    "dragstart" : "dragstartHandler",
    "dragstop": "dragstopHandler"
  },

  dropHandler: function() {
    console.log("you dropped!");
  },

  dragstartHandler: function() {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.target);
    console.log(event.currentTarget);
    this.$("#"+this.model.get("id")).addClass("draggedList");
    this.$("#arrow"+this.model.get("id")).css({color:"black"});
    console.log(this.model);
    console.log("ONE AT A TIME?!!!!");
  },

  dragstopHandler: function() {
    $("#"+this.model.get("id")).removeClass("draggedList");
    $("#arrow"+this.model.get("id")).css({color:"gray"});
    console.log("STOPSOTPSOTOPSOPOST");

  },

  // onRender: function() {
  //   var that = this;
  //   if (!this.model.get("expanded")) {
  //     setTimeout(function() {
  //       $("#ul"+that.model.get("id")).toggle();
  //     }, 0);
  //   }
  // },

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  },

  initialize: function(options) {
    var children = this.model.collection.where({parent_id: this.model.id})
    this.collection = new DeepThought.Collections.EntryTree(children);
    var that = this;

    DeepThought.collections[this.model.get("id")] = DeepThought.collections[this.model.get("id")] || this.collection;
    //this.collection.bind("add", this.render());
    //DeepThought.collections[this.model.get("id")].bind("add", this.createEntry);
    DeepThought.parents[this.model.get("id")] = DeepThought.parents[this.model.get("id")] || this.model.get("parent_id");
    (this.$el).attr("id",this.model.get("id"));
  },

  saveEntry: function() {
    event.stopPropagation();
    var id = this.model.get("id");
    var formData = $("#form"+id).serializeJSON();
    this.model.save(formData);
  },

  appendHtml: function(collectionView,itemView) {
    var itemIndex = itemView.model.collection.indexOf(itemView.model);
    var prevItem = itemView.model.collection.models[itemIndex - 1]
    if (itemView.model.get("is_new") && prevItem) {
      collectionView.$("#"+prevItem.get("id")).after(itemView.el);
    } else {
      collectionView.$("#ul"+itemView.model.get("parent_id")).append(itemView.el);
    }
  },
  // appendHtml: function(collectionView,itemView) {
  //   var model = itemView.model;
  //   var position = DeepThought.collections[model.get("parent_id")].models.indexOf(model);
  //   if (position === 0) {
  //     var parent_id = DeepThought.parents[itemView.model.get("id")];
  //     collectionView.$("#ul"+itemView.model.get("parent_id")).append(itemView.el);
    
  //   } else {
  //     var prevItem = DeepThought.collections[model.get("parent_id")].models[position - 1];
  //     collectionView.$("#"+prevItem.get("id")).after(itemView.el);
  //   }
  // },

  displayButtons: function() {
    event.stopPropagation();
    $("#button"+this.model.id).css({opacity: 1});
    $("#arrow"+this.model.id).css({opacity: 1, zIndex: 10});
  },

  hideButtons: function() {
    event.stopPropagation();
    $("#button"+this.model.id).css({opacity: 0});
    $("#arrow"+this.model.id).css({opacity: 0});
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
    event.stopPropagation();
    switch(event.which) {
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
        if (event.ctrlKey)
          this.zoomIn(event);
        break;
      case 37: //left arrow
        if (event.ctrlKey)
          this.zoomOut(event);
        break;
      case 32:
        if (event.ctrlKey)
          this.toggleView(event);
    }
    this.$el.focus();
  },

  zoomIn:function(event) {    
    DeepThought.router.navigate('#/entries/'+this.model.get("id"), 
      {wait: true, success: function() {
          Backbone.history.stop();
          Backbone.history.start();
        }
      }
    );
  },

  zoomOut:function(event) {  
    var grandparent_id = this.findGrandparent(this.model);
    if (grandparent_id)
      DeepThought.router.navigate('#/entries/'+grandparent_id, 
        {wait: true, success: function() {
          Backbone.history.stop();
          Backbone.history.start();
        }
      }
    );
  },

  createEntry: function(event) {
    event.preventDefault();
    this.saveEntry(event);
    var rank = this.findNewRank(this);
    var that = this;
    console.log(DeepThought.collections[this.model.get("parent_id")]);
    DeepThought.collections[this.model.get("parent_id")].create({
      title:"", 
      parent_id: this.model.get("parent_id"),
      rank: rank,
      is_new: true},
      {wait: true, success: function() {
        DeepThought.parents[that.model.get("id")] = that.model.get("parent_id");
        that.focusOnTextArea(that.el.nextSibling);
      }}
    );
  },

  findNewRank: function(view){
    var siblings = DeepThought.collections[view.model.get("parent_id")];
    var index = siblings.models.indexOf(view.model);
    var rank = view.model.get("rank");
    if (index === siblings.models.length - 1) {
      return rank + 1;
    } else {
      return (rank + siblings.models[index+1].get("rank"))/2;
    }
  },

  deleteEntry: function(event) {
    event.preventDefault();
    var that = this;
    this.goUp(event);
    var id = this.model.get("id");
    delete DeepThought.collections[id];
    delete DeepThought.parents[id];
    this.model.destroy();
  },

  changeTab: function(event) {
    //this.saveEntry(event);
    var that = this;
    if (event.shiftKey) { //tab back
      var grandparent_id = this.findGrandparent(this.model);
      if (DeepThought.collections[grandparent_id]) {
        var parent = DeepThought.collections[grandparent_id].get(this.model.get("parent_id"));
        var parentIdx = DeepThought.collections[grandparent_id].indexOf(parent);
        if (parent === _.last(DeepThought.collections[grandparent_id].models)) {
          var newRank = parent.get("rank") + 1;
        } else {
          var nextRank = DeepThought.collections[grandparent_id].models[parentIdx+1].get("rank");
          var newRank = (parent.get("rank") + nextRank)/2
        }
        var old_parent_id = this.model.get("parent_id");
        this.model.save({parent_id: grandparent_id, rank: newRank}, {success: function(){

          DeepThought.collections[old_parent_id].remove(that.model);
          DeepThought.collections[grandparent_id].add(that.model);
          DeepThought.parents[that.model.get("id")] = grandparent_id;
          that.focusOnTextArea($("#"+that.model.id)[0]);
        }})
      }
    } else {
      var position = DeepThought.collections[this.model.get("parent_id")].models.indexOf(this.model)
      if (position !== 0) {
        var previousSibling = DeepThought.collections[this.model.get("parent_id")].models[position - 1];

        if (DeepThought.collections[previousSibling.get("id")].length !== 0) {
          var newRank = (_.last(DeepThought.collections[previousSibling.get("id")].models).get("rank") + 1);
        } else {
          var newRank = 1;
        }
        var old_parent_id = this.model.get("parent_id");
        DeepThought.parents[that.model.get("id")] = previousSibling.get("id");
        this.model.save({parent_id: previousSibling.get("id"), rank:newRank}, {success: function(){
          DeepThought.collections[old_parent_id].remove(that.model);
          DeepThought.collections[previousSibling.get("id")].add(that.model, {success: function(){
            that.focusOnTextArea($("#"+that.model.id)[0]);
          }});
          
        }}) 
      }
    }
  },

  findGrandparent: function(model) {
    var parent_id = DeepThought.parents[model.get("id")];
    return DeepThought.parents[parent_id];
  },

  goUp: function(event) {
    event.preventDefault();
    var position = DeepThought.collections[this.model.get("parent_id")].models.indexOf(this.model);
    if (position !== 0) {
      var prevSibling = DeepThought.collections[this.model.get("parent_id")].models[position - 1];
      var prevElement = this.findDeepestPrev(prevSibling);
    } else {
      var prevElement = $("#"+this.model.get("parent_id"))[0];
    }
    if (prevElement) {
      this.focusOnTextArea(prevElement);
    }
  },

  findDeepestPrev: function(model) {
    if (DeepThought.collections[model.get("id")].length === 0) {
      return $("#"+model.get("id"))[0];
    } else {
      var lastChild = _.last(DeepThought.collections[model.get("id")].models);
      return this.findDeepestPrev(lastChild);
    }
  },

  goDown: function(event) {
    event.preventDefault();
    if (DeepThought.collections[this.model.get("id")].length !== 0) {
      var firstChild = _.first(DeepThought.collections[this.model.get("id")].models)
      var nextElement =  $("#"+firstChild.id)[0];
    } else {
      var nextElement = this.findNextElement(this.model);
    }
    if (nextElement) {
      this.focusOnTextArea(nextElement);
    }
  },

  findNextElement: function(model) {
    if (DeepThought.collections[model.get("parent_id")]) {    
        var siblings = DeepThought.collections[model.get("parent_id")].models;
      var position = siblings.indexOf(model);
      if (position !== siblings.length - 1) {
        return $("#"+siblings[position + 1].get("id"))[0];
      } else {
        return this.findNextElement(model.collection.get(model.get("parent_id")));
      }
    }
  },
})