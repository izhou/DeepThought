DeepThought.Views.treeView = Backbone.Marionette.CompositeView.extend({
  template: 'entry_tree/nodeForm',
  templateHelpers: function() {
    return { model:this.model};
  },
  tagName: "li",
  itemView: DeepThought.Views.treeView,
  itemViewOptions: function(){
    return {siblings: this.siblings};
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
    var children = this.model.collection.where({parent_id: this.model.id})
    
    this.collection = new DeepThought.Collections.EntryTree(children);

    this.siblings = this.options.siblings;
    this.siblings[this.model.get("id")] = this.collection
    DeepThought.collections[this.model.get("id")] = this.collection;
    this.parent_id =  this.model.get("parent_id");
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
        this.zoomIn(event);
        break;
      case 37: //left arrow
        this.zoomOut(event);
        break;
    }
    this.$el.focus();
  },

  zoomIn:function(event) {
    if (event.shiftKey && event.ctrlKey) {
      DeepThought.router.navigate('#/entries/'+this.model.get("id"), 
        {wait: true, success: function() {
            Backbone.history.stop();
            Backbone.history.start();
          }}
        );
    }
  },

  zoomOut:function(event) {
    if (event.shiftKey && event.ctrlKey) {
      var grandparent_id = this.findGrandparent(this.model);
      if (grandparent_id)
        DeepThought.router.navigate('#/entries/'+grandparent_id, 
          {wait: true, success: function() {
            Backbone.history.stop();
            Backbone.history.start();
          }}
        );
    }
  },

  createEntry: function(event) {
    event.preventDefault();
    var rank = this.findNewRank(this);
    var that = this;
    console.log(DeepThought.collections[this.parent_id]);
    DeepThought.collections[this.parent_id].create({
      title:"", 
      parent_id: this.parent_id,
      rank: rank,
      is_new: true},
      {wait: true, success: function() {
        that.focusOnTextArea(that.el.nextSibling);
      }}
    );
  },

  findNewRank: function(view){
    var siblings = DeepThought.collections[view.parent_id]
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
    this.model.destroy();
  },

  changeTab: function(event) {
    event.preventDefault();
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
          var newRank = (parent.get("rank" + nextRank))/2
        }
        this.model.save({parent_id: grandparent_id, rank: newRank}, {success: function(){
          DeepThought.collections[that.parent_id].remove(that.model);
          DeepThought.collections[grandparent_id].add(that.model);
          that.focusOnTextArea($("#"+that.model.id));
        }});
      }
    } else {
      var position = DeepThought.collections[this.parent_id].models.indexOf(this.model);
      if (position !== 0) {
        var previousSibling = DeepThought.collections[this.parent_id].models[position - 1];

        if (_.first(previousSibling.models)) {
          var newRank = (_.first(previousSibling.models).get("rank"))/2;
        } else {
          var newRank = 1;
        }
        this.model.save({parent_id: previousSibling.get("id"), rank:newRank}, {success: function(){
          DeepThought.collections[that.parent_id].remove(that.model);
          DeepThought.collections[previousSibling.get("id")].add(that.model);
          that.focusOnTextArea($("#"+that.model.id)[0]);
        }})
      }
    }
  },

  findGrandparent: function(model) {
    var ancestry = model.get("ancestry").split("/");
    return ancestry[ancestry.length-2];
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
    if (prevElement) {
      this.focusOnTextArea(prevElement);
    } else if ($("#ul0")[0]) {
      this.focusOnTextArea($("#ul0")[0]);
    }
  },

  findDeepestPrev: function(el) {
    if (el.children[1].children.length === 0 || !$(el.children[1]).is(":visible")) {
      return el;
    } else {
      var lastChild = _.last(el.children[1].children);
      return this.findDeepestPrev(lastChild);
    }
  },

  goDown: function(event) {
    event.preventDefault();
    if (this.$el.children()[1].children[0] && $(this.$el.children()[1]).is(":visible")) {
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