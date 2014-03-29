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
      root_id: this.root_id,
      className: "child"}; //className to add vertical tablines css
  },

  initialize: function(options) {
    this.collection = DeepThought.allCollections[this.model.get("id")] || new DeepThought.Collections.EntryTree();
    DeepThought.allCollections[this.model.get("id")] = this.collection;
    DeepThought.allParents[this.model.get("id")] = DeepThought.allParents[this.model.get("id")] || this.model.get("parent_id");
    (this.$el).attr("id",this.model.get("id"));
    (this.$el).addClass(this.options.className);
    this.root_id = parseInt(this.options.root_id);
  },

  onRender: function() { //to initially deal with expanded items.
    var that = this;
    if (this.model.get("expanded") === false) {
      setTimeout(function() {
        $("#ul"+that.model.get("id")).toggle();
        $("#bullet"+that.model.get("id")).addClass("bullet-shadow");
      }, 0);
    }
  },

  appendHtml: function(collectionView,itemView) {
    var itemIndex = DeepThought.allCollections[itemView.model.get("parent_id")].models.indexOf(itemView.model);
    var prevItem = DeepThought.allCollections[itemView.model.get("parent_id")].models[itemIndex - 1]
    if (itemView.model.get("is_new")) {
      if (prevItem) {
        collectionView.$("#"+prevItem.get("id")).after(itemView.el);
      } else {
        collectionView.$("#ul"+itemView.model.get("parent_id")).prepend(itemView.el);
      }
    } else {
      collectionView.$("#ul"+itemView.model.get("parent_id")).append(itemView.el);
    }

    $('textarea').autosize();
  },

  events: {
    "change": "saveEntry",
    "click .view-toggle" : "toggleView",
    "mouseover" : "displayButtons",
    "mouseout" : "hideButtons",
    "keydown :input" : "keyHandler",
    "drop" : "dropHandler",
    "dragstart" : "dragstartHandler",
    "dragstop": "dragstopHandler",
  },

  // dropHandler: function() {
  //   console.log("you dropped!");
  // },

  // dragstartHandler: function() {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   console.log(event.target);
  //   console.log(event.currentTarget);
  //   this.$("#"+this.model.get("id")).addClass("draggedList");
  //   this.$("#arrow"+this.model.get("id")).css({color:"black"});
  //   console.log(this.model);
  //   console.log("ONE AT A TIME?!!!!");
  // },

  // dragstopHandler: function() {
  //   $("#"+this.model.get("id")).removeClass("draggedList");
  //   $("#arrow"+this.model.get("id")).css({color:"gray"});
  //   console.log("STOPSOTPSOTOPSOPOST");

  // },

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
    event.stopPropagation();
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
        if (event.shiftKey)
          this.moveUp(event);
        else
           this.goUp(event);
        break;
      case 40: //down arrow
        if (event.shiftKey){
          this.moveDown(event);
        } else {
          this.goDown(event);
        }
        break;
      case 39: //right arrow
        if (event.ctrlKey) {
          this.zoomIn(event);
        } else if (event.shiftKey){
          this.tabForward(event);
        }
        break;
      case 37: //left arrow
        if (event.ctrlKey)
          this.zoomOut(event);
        else if (event.shiftKey)
          this.tabBackward(event);
        break;
      case 32:
        if (event.shiftKey)
          this.toggleView(event);
    }
    this.$el.focus();
  },

  // completeEntry: function() {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   console.log("here");
  //   $("#"+this.model.id).toggleClass("completed");
  //   this.model.save({"completed" : true}, {success: function(){
  //     this.render();      
  //   }})

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

  zoomIn:function(event) {
    this.saveEntry(event);
    DeepThought.router.navigate("#/entries/"+this.model.get("id"));    
  },

  zoomOut:function(event) {  
    this.saveEntry(event);
    var grandparent_id = this.findGrandparent(this.model);
    console.log(grandparent_id);
    if(grandparent_id)
      DeepThought.router.navigate("#/entries/"+grandparent_id);
  },

  createEntry: function(event) {
    event.preventDefault();
    //this.saveEntry(event);
    var rank = this.findNewRank(this);
    var that = this;
    console.log(DeepThought.allCollections[this.model.get("parent_id")]);
    DeepThought.allCollections[this.model.get("parent_id")].create({
      title:"", 
      parent_id: this.model.get("parent_id"),
      rank: rank,
      is_new: true},
      {wait: true, success: function() {
        DeepThought.allParents[that.model.get("id")] = that.model.get("parent_id");
        DeepThought.rootCollection.add(that.model, {wait: true});
        DeepThought.rootCollection.fetch();
        that.focusOnTextArea(that.el.nextSibling);
      }}
    );
  },

  findNewRank: function(view){
    var siblings = DeepThought.allCollections[view.model.get("parent_id")];
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
    if ( DeepThought.allCollections[id].models.length === 0 || event.shiftKey){
      this.goUp(event);
      DeepThought.allCollections[this.model.get("parent_id")].models = _.without(DeepThought.allCollections[this.model.get("parent_id")].models, DeepThought.allCollections[id])
      delete DeepThought.allCollections[id];
      delete DeepThought.allParents[id];
      this.model.destroy();
    }
  },
// var id = this.model.get("id");
// var formData = $("#form"+id).serializeJSON();
// this.model.save(formData);
  tabForward: function(event) {
    event.preventDefault();
    var that = this;
    var position = DeepThought.allCollections[this.model.get("parent_id")].models.indexOf(this.model);
    if (position !== 0) {
      var previousSibling = DeepThought.allCollections[this.model.get("parent_id")].models[position - 1];
      if (DeepThought.allCollections[previousSibling.get("id")].length !== 0) {
        var newRank = (_.last(DeepThought.allCollections[previousSibling.get("id")].models).get("rank") + 1);
      } else {
        var newRank = 1;
      }
      if (previousSibling.get("expanded") === false){        
        this.expand(previousSibling);
        // previousSibling.save({"expanded":true},{success: function() {
        //   $("#ul"+previousSibling.get("id")).slideToggle();
        //   $("#bullet"+previousSibling.get("id")).removeClass("bullet-shadow");
        //   $("#button"+previousSibling.get("id")).value = '-';
        // }});
      }
      this.relocate(this.model, previousSibling.get("id"), newRank);
      //DeepThought.allParents[this.model.get("id")] = previousSibling.get("id");
      // this.model.save({parent_id: previousSibling.get("id"), rank:newRank}, {success: function(){
      //   DeepThought.allCollections[old_parent_id].remove(that.model);
      //   if (previousSibling.get("expanded") === false){        
      //     previousSibling.save({"expanded":true},{success: function() {
      //       $("#ul"+previousSibling.get("id")).slideToggle(300);
      //       $("#bullet"+previousSibling.get("id")).removeClass("bullet-shadow");
      //       $("#button"+previousSibling.get("id")).value = '-';
      //     }});
      //   }
      //   DeepThought.allCollections[previousSibling.get("id")].add(that.model, {wait: true});
      //   DeepThought.allParents[that.model.get("id")] = previousSibling.get("id");
      //   $("#ta"+that.model.id).focus();
        //that.focusOnTextArea($("#"+that.model.id)[0]);
      // }}) 
    }
  },

  expand: function(model) {
    var id = model.get("id");
    model.save({"expanded":true},{success: function() {
      $("#ul"+id).slideToggle();
      $("#bullet"+id).removeClass("bullet-shadow");
      $("#button"+id).value = '-';
    }});
  },

  tabBackward: function(event) {
    event.preventDefault();
    var that = this;
    if (this.model.get("parent_id") !== this.root_id) {
      var grandparent_id = this.findGrandparent(this.model);
      if (DeepThought.allCollections[grandparent_id]) {
        var parent = DeepThought.allCollections[grandparent_id].get(this.model.get("parent_id"));
        var parentIdx = DeepThought.allCollections[grandparent_id].indexOf(parent);
        if (parent === _.last(DeepThought.allCollections[grandparent_id].models)) {
          var newRank = parent.get("rank") + 1;
        } else {
          var nextRank = DeepThought.allCollections[grandparent_id].models[parentIdx+1].get("rank");
          var newRank = (parent.get("rank") + nextRank)/2
        }
        this.relocate(this.model, grandparent_id, newRank);
      }
    }
  },

  findGrandparent: function(model) {
    var parent_id = DeepThought.allParents[model.get("id")];
    return DeepThought.allParents[parent_id];
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
    var siblings = DeepThought.allCollections[this.model.get("parent_id")];
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
      if (newParent.get("expanded") === false)
        this.expand(newParent);
      var newParentId = newParent.get("id");
      if (DeepThought.allCollections[newParentId].models.length === 0) {
        var newRank = 1;
      } else {
        var newRank = _.last(DeepThought.allCollections[newParentId].models).get("rank") + 1;
      }
    }
    var that = this; 
    this.relocate(this.model, newParentId, newRank);
  },

  moveUpHelper: function(model_id, tier) {
    if (!DeepThought.allParents[model_id])
      return undefined;
    var siblings = DeepThought.allCollections[DeepThought.allParents[model_id]].where({expanded: true});
    var position = siblings.indexOf(_.findWhere(siblings, {id: model_id}));
    if (position !== 0) {
      var previousSibling = siblings[position - 1];
      return this.digDownHelper(previousSibling, tier);
    } else {
      return this.moveUpHelper(DeepThought.allParents[model_id], tier + 1)
    }
  },

  digDownHelper: function(previousSibling, tier) {
    if (DeepThought.allCollections[previousSibling.get("id")].models.length === 0 || tier === 1) {
      return previousSibling;
    } else {
      return this.digDownHelper(_.last(DeepThought.allCollections[previousSibling.get("id")].models), tier - 1);
    }
  },

  moveDown: function(event){
    var siblings = DeepThought.allCollections[this.model.get("parent_id")];
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
      if (newParent.get("expanded") === false)
        this.expand(newParent);
      var newParentId = newParent.get("id");
      if (DeepThought.allCollections[newParentId].models.length === 0) {
        var newRank = 1;
      } else {
        var newRank = _.first(DeepThought.allCollections[newParentId].models).get("rank") / 2;
      }
    }
    var that = this;
    this.relocate(this.model, newParentId, newRank);
    // DeepThought.allCollections[this.model.get("parent_id")].remove(this.model);
    // this.model.save({rank: newRank, is_new: true, parent_id: newParentId}, {wait: true, success: function(){ 
    //   DeepThought.allCollections[newParentId].add(that.model);
    //   DeepThought.allParents[that.model.get("id")] = newParentId;
    //   $("#ta"+that.model.id).focus();
      //that.focusOnTextArea($("#"+that.model.id)[0]);
    // }});
  },

  relocate: function(model, new_parent_id, new_rank) {
    var formData = $("#form"+ model.get("id")).serializeJSON();

    var old_parent_id = model.get("parent_id");
    model.save({title: formData["entry"]["title"], parent_id: new_parent_id, rank: new_rank, is_new: true}, {success: function(){
      DeepThought.allCollections[old_parent_id].remove(model);
      DeepThought.allCollections[new_parent_id].add(model, {wait: true});
      DeepThought.allParents[model.get("id")] = new_parent_id;
      $("#ta"+model.get("id")).focus();
    }})
  },

  digUpHelper: function(model_id, tier) {
    var parent_id = DeepThought.allParents[model_id]
    var uncles = DeepThought.allCollections[DeepThought.allParents[parent_id]].where({expanded: true});
    var parentPosition = uncles.indexOf(_.findWhere(uncles, {id: parent_id}));
    if (parentPosition === uncles.length - 1) {
      return this.digUpHelper(parent_id, tier + 1);
    } else {
      var nextUncle = uncles[parentPosition + 1];
      return this.moveDownHelper(nextUncle, tier);
    }
  },

  moveDownHelper: function(nextUncle, tier) {
    if (DeepThought.allCollections[nextUncle.get("id")].models.length === 0 || tier === 0) {
      return nextUncle;
    } else {
      return this.moveDownHelper(_.first(DeepThought.allCollections[nextUncle.get("id")].models), tier - 1);
    }
  }

})