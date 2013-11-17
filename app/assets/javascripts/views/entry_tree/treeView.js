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
      parent: this.model,
      className: "child"};
  },

  initialize: function(options) {
    var children = this.model.collection.where({parent_id: this.model.id})
    this.collection = DeepThought.collections[this.model.get("id")] || new DeepThought.Collections.EntryTree(children);
    DeepThought.collections[this.model.get("id")] = this.collection;
    DeepThought.parents[this.model.get("id")] = DeepThought.parents[this.model.get("id")] || this.model.get("parent_id");
    (this.$el).attr("id",this.model.get("id"));
    (this.$el).addClass(this.options.className)
  },

  onRender: function() {
    var that = this;
    if (this.model.get("expanded") === false) {
      setTimeout(function() {
        $("#ul"+that.model.get("id")).toggle();
        $("#bullet"+that.model.get("id")).addClass("bullet-shadow");
      }, 0);
    }
  },

  appendHtml: function(collectionView,itemView) {
    var itemIndex = DeepThought.collections[itemView.model.get("parent_id")].models.indexOf(itemView.model);
    var prevItem = DeepThought.collections[itemView.model.get("parent_id")].models[itemIndex - 1]
    if (itemView.model.get("is_new")) {
      if (prevItem) {
        collectionView.$("#"+prevItem.get("id")).after(itemView.el);
      } else {
        collectionView.$("#ul"+itemView.model.get("parent_id")).prepend(itemView.el);
      }
    } else {
      collectionView.$("#ul"+itemView.model.get("parent_id")).append(itemView.el);
    }
  },

  events: {
    "change": "saveEntry",
    "click .view-toggle" : "toggleView",
    "mouseover" : "displayButtons",
    "mouseout" : "hideButtons",
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

  focusOnTextArea: function(el) {
    el.firstElementChild.getElementsByTagName("textarea")[0].focus();
  },

  saveEntry: function() {
    event.stopPropagation();
    var id = this.model.get("id");
    var formData = $("#form"+id).serializeJSON();
    this.model.save(formData);
  },

  keyHandler:function() {
    switch(event.which) {
      case 13: //enter key
        if (event.shiftKey) {
          this.completeEntry(event);
        } else {
          this.createEntry(event);
        }
        break;
      case 8: //backspace
        var title = $("#form"+this.model.get("id")).serializeJSON().entry.title;
        if (title.length === 0)
          this.deleteEntry(event);
        break;
      case 9: //tabbing
        if (event.shiftKey){
          this.tabBackward(event);
        } else { 
          this.tabForward(event);
        }
        break;
      case 38: //up arrow
        if (event.ctrlKey)
          this.moveUp(event);
        else
           this.goUp(event);
        break;
      case 40: //down arrow
        if (event.ctrlKey){
          this.moveDown(event);
        } else {
          this.goDown(event);
        }
        break;
      case 39: //right arrow
        if (event.shiftKey) {
          this.zoomIn(event);
        } else if (event.ctrlKey){
          this.tabForward(event);
        }
        break;
      case 37: //left arrow
        if (event.shiftKey)
          this.zoomOut(event);
        else if (event.ctrlKey)
          this.tabBackward(event);
        break;
      case 32:
        if (event.ctrlKey)
          this.toggleView(event);
    }
    this.$el.focus();
  },

  completeEntry: function() {
    event.stopPropagation();
    event.preventDefault();
    console.log("here");
    $("#"+this.model.id).toggleClass("completed");
    this.model.save({"completed" : true}, {success: function(){
      this.render();      
    }})

  },

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
    var that = this;

    this.model.save({"expanded" : !this.model.get("expanded")},
      {success: function(){ 
        $("#bullet"+ that.model.get("id")).toggleClass("bullet-shadow");
        var button = $("#button"+that.model.get("id"));
        button.attr("value", (button[0].value === '+' ? '-' : '+'));
        $("#ul"+that.model.get("id")).slideToggle(300);
      }
    })
  },

  changeRoot: function(id) {
    var newRootId = id || this.model.get("id");
    var entryShow = new DeepThought.Views.nodeView({
      collection: DeepThought.collections[newRootId],
      itemView: DeepThought.Views.treeView,
      root_id: newRootId
    });
    $("#content").html(entryShow.render().$el);
  },

  zoomIn:function(event) {
    var that = this;
    DeepThought.rootCollection.fetch({success: function(){
      var entryShow = new DeepThought.Views.nodeView({
        collection: DeepThought.collections[that.model.get("id")],
        itemView: DeepThought.Views.treeView,
        root_id: that.model.get("id")
      });
      $("#content").html(entryShow.render().$el); 
    }});    
  },

  zoomOut:function(event) {  
    var grandparent_id = this.findGrandparent(this.model);
    if(grandparent_id) {
      DeepThought.rootCollection.fetch({success: function(){
        var entryShow = new DeepThought.Views.nodeView({
          collection: DeepThought.collections[grandparent_id],
          itemView: DeepThought.Views.treeView,
          root_id: grandparent_id
        });
      $("#content").html(entryShow.render().$el);
      }});
    }
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
    var id = this.model.get("id");
    if ( DeepThought.collections[id].models.length === 0 || event.shiftKey){
      var that = this;
      this.goUp(event);
      
      delete DeepThought.collections[id];
      delete DeepThought.parents[id];
      this.model.destroy();
    }
  },
// var id = this.model.get("id");
// var formData = $("#form"+id).serializeJSON();
// this.model.save(formData);
  tabForward: function(event) {
    var that = this;
    var position = DeepThought.collections[this.model.get("parent_id")].models.indexOf(this.model);
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
        if (previousSibling.get("expanded") === false){        
          previousSibling.save({"expanded":true},{success: function() {
            $("#ul"+previousSibling.get("id")).slideToggle(300);
            $("#bullet"+previousSibling.get("id")).removeClass("bullet-shadow");
            $("#button"+previousSibling.get("id")).value = '-';
          }});
        }
        DeepThought.collections[previousSibling.get("id")].add(that.model, {wait: true});
        DeepThought.parents[that.model.get("id")] = previousSibling.get("id");
        that.focusOnTextArea($("#"+that.model.id)[0]);
      }}) 
    }
  },

  tabBackward: function(event) {
    var that = this;
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
        DeepThought.collections[grandparent_id].add(that.model, {wait: true});
        DeepThought.parents[that.model.get("id")] = grandparent_id;
        that.focusOnTextArea($("#"+that.model.id)[0]);
      }})
    }
  },

  findGrandparent: function(model) {
    var parent_id = DeepThought.parents[model.get("id")];
    return DeepThought.parents[parent_id];
  },

  goUp: function(event) {
    event.preventDefault();
    var index = $("textarea.entry-title:visible").index($("#ta"+this.model.get("id")));
    var priorElement = $("textarea.entry-title:visible")[index - 1];
    if (priorElement) {
      priorElement.focus();
    }
  },

  goDown: function(event) {
    event.preventDefault();
    var index = $("textarea.entry-title:visible").index($("#ta"+this.model.get("id")));
    var nextElement = $("textarea.entry-title:visible")[index + 1];
    if (nextElement) {
      nextElement.focus();
    }
  },

  moveUp: function(event) {
    var siblings = DeepThought.collections[this.model.get("parent_id")];
    var position = siblings.indexOf(this.model);
    if (position !== 0) {
      var newParentId = this.model.get("parent_id");
      var previousSibling = siblings.models[position - 1];
      if (position === 1) {
        var newRank = previousSibling.get("rank")/2;
      } else {
        var newRank = (siblings.models[position - 2].get("rank") + previousSibling.get("rank"))/2;
      }
    } else {
      var newParent = this.moveUpHelper(this.model.get("id"), 0);
      if (!newParent)
        return;
      var newParentId = newParent.get("id");
      if (DeepThought.collections[newParentId].models.length === 0) {
        var newRank = 1;
      } else {
        var newRank = _.last(DeepThought.collections[newParentId].models).get("rank") + 1;
      }
    }
    var that = this;
    DeepThought.collections[that.model.get("parent_id")].remove(that.model);
    this.model.save({rank: newRank, is_new: true, parent_id: newParentId}, {wait: true, success: function(){ 
      DeepThought.collections[newParentId].add(that.model);
      DeepThought.parents[that.model.get("id")] = newParentId;
      that.focusOnTextArea($("#"+that.model.id)[0]);
    }});
  },

  moveUpHelper: function(model_id, tier) {
    if (!DeepThought.parents[model_id])
      return undefined;
    var siblings = DeepThought.collections[DeepThought.parents[model_id]].models;
    var position = siblings.indexOf(_.findWhere(siblings, {id: model_id}));
    if (position !== 0) {
      var previousSibling = siblings[position - 1];
      return this.digDownHelper(previousSibling, tier);
    } else {
      return this.moveUpHelper(DeepThought.parents[model_id], tier + 1)
    }
  },

  digDownHelper: function(previousSibling, tier) {
    if (DeepThought.collections[previousSibling.get("id")].models.length === 0 || tier === 1) {
      return previousSibling;
    } else {
      return this.digDownHelper(_.last(DeepThought.collections[previousSibling.get("id")].models), tier - 1);
    }
  },

  moveDown: function(event){
    var siblings = DeepThought.collections[this.model.get("parent_id")];
    var position = siblings.indexOf(this.model);
    if (position !== siblings.models.length - 1) {
      var newParentId = this.model.get("parent_id");
      nextSibling = siblings.models[position + 1];  
      if (position === siblings.models.length - 2) {
        var newRank = nextSibling.get("rank") + 1;
      } else {
        var newRank = (siblings.models[position + 2].get("rank") + nextSibling.get("rank")) / 2;
      }
    } else {
      var newParent = this.digUpHelper(this.model.get("id"), 0);
      if (!newParent)
        return;
      var newParentId = newParent.get("id");
      if (DeepThought.collections[newParentId].models.length === 0) {
        var newRank = 1;
      } else {
        var newRank = _.first(DeepThought.collections[newParentId].models).get("rank") / 2;
      }
    }
    var that = this;
    DeepThought.collections[this.model.get("parent_id")].remove(this.model);
    this.model.save({rank: newRank, is_new: true, parent_id: newParentId}, {wait: true, success: function(){ 
      
      DeepThought.collections[newParentId].add(that.model);
      DeepThought.parents[that.model.get("id")] = newParentId;
      that.focusOnTextArea($("#"+that.model.id)[0]);
    }});
  },

  digUpHelper: function(model_id, tier) {
    var parent_id = DeepThought.parents[model_id]
    var uncles = DeepThought.collections[DeepThought.parents[parent_id]].models;
    var parentPosition = uncles.indexOf(_.findWhere(uncles, {id: parent_id}));
    if (parentPosition === uncles.length - 1) {
      return this.digUpHelper(parent_id, tier + 1);
    } else {
      var nextUncle = uncles[parentPosition + 1];
      return this.moveDownHelper(nextUncle, tier);
    }
  },

  moveDownHelper: function(nextUncle, tier) {
    if (DeepThought.collections[nextUncle.get("id")].models.length === 0 || tier === 0) {
      return nextUncle;
    } else {
      return this.moveDownHelper(_.first(DeepThought.collections[nextUncle.get("id")].models), tier - 1);
    }
  }

})