DeepThought.Views.treeView = Backbone.Marionette.CompositeView.extend({
  template: 'entry_tree/nodeForm',
  templateHelpers: function() {
    return { model:this.model};
  },
  tagName: "li",
  itemView: DeepThought.Views.treeView,
  itemViewOptions: function(){
    siblings: this.collection
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
    this.siblings = this.options.siblings;
    //var children = DeepThought.rootCollection.where({parent_id: this.model.id});
    var sortedChildren = _.sortBy(children, function(child){child.get("rank")});
    this.collection = new DeepThought.Collections.EntryTree(children);

    this.parent_id =  this.model.get("parent_id");
    (this.$el).attr("id",this.model.get("id"));
    this.collection.bind('refresh', this.render);
  },

  saveEntry: function() {
    event.stopPropagation();
    var id = this.model.get("id");
    console.log("saveEntry, id:"+id+" parent:"+this.model.get("parent_id"));
    var formData = $("#form"+id).serializeJSON();
    this.model.save(formData);
    DeepThought.rootCollection.fetch();
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
    console.log(rank);
    var parent_id = this.model.get("parent_id");
    this.collection.create({
      title:"", 
      parent_id: parent_id,
      rank: rank,
      is_new: true},
      {wait: true}
    );
  },

  findNewRank: function(view){
    if (!view.el.nextSibling) {
      return view.model.get("rank") + 1;
    } else {
      var nextRank = DeepThought.rootCollection.get(view.el.nextSibling.id).get("rank");
      console.log(nextRank);
      var prevRank = view.model.get("rank");
      console.log(prevRank);
      return (nextRank + prevRank) / 2;
    }
    // var model_index = model.collection.indexOf(model);
    // if (model_index === model.collection.length - 1) {
    //   return model.get("rank") + 1;
    // } else {
    //   return (model.get("rank") + model.collection.models[model_index + 1].get("rank"))/2;
    // }
  },

  deleteEntry: function(event) {
    event.preventDefault();
    var that = this;
    this.goUp(event);
    this.model.collection.fetch({
      success: function() {
        that.model.destroy();
      }
    });
  },

  changeTab: function(event) {
    event.preventDefault();
    var originalCollection = this.model.collection;
    if (event.shiftKey) {  //tab backwards
      var grandparent_id = this.findGrandparent(this.model);
      if (grandparent_id) {
        var newParentID = grandparent_id;
       this.$el.insertAfter(this.$el.parent().parent());
      }      
    } else {  //tab forward
      previousElement = _.last(this.$el.prev());
      if (previousElement) {
        var newParentID = parseInt(previousElement.id);
      } else {
        var newParentID = this.model.parent_id;
      }
     $("#ul"+newParentID).show();
     this.$el.appendTo($("#ul"+newParentID));
    }
    if (newParentID) {
      var newRank = this.findNewRank(this);
      this.model.save({parent_id: newParentID, rank:newRank});
      this.focusOnTextArea(this.el);

      // var that = this;

      // DeepThought.rootCollection.fetch({success: function() {
      //   DeepThought.rootCollection.get(newParentID).save({expanded: true});
      //   Backbone.history.stop();
      //   Backbone.history.start()

      //   setTimeout(function() {
      //     console.log("iamhere");
      //     that.focusOnTextArea(that.el);
      //   }, 0) 
      // }});
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
    if (prevElement) {
      this.focusOnTextArea(prevElement);
    } else if ($("#ul0")[0]) {
      this.focusOnTextArea($("#ul0")[0]);
    }
  },

  findGrandparent: function(model) {
    var ancestry = model.get("ancestry").split("/");
    return ancestry[ancestry.length-2];
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