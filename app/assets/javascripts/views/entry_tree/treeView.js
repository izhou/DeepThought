DeepThought.Views.treeView = Backbone.Marionette.CompositeView.extend({
  template: 'entry_tree/nodeForm',
  tagName: "li",
  itemView: DeepThought.Views.treeView,
  
  events: {
    "change": "saveEntry",
    "keydown :input" : "keyHandler"
  },

  initialize: function(options) {
    var children = DeepThought.rootCollection.where({parent_id: this.model.id})
    this.collection = new DeepThought.Collections.EntryTree(children);
    this.parent_id =  this.model.get("parent_id");
    (this.$el).attr("id",this.model.get("id"));

  },

  appendHtml: function(collectionView,itemView) {
    collectionView.$("ul:first").append(itemView.el);
  },

  saveEntry: function() {
    event.stopPropagation();
    console.log("here, bitch");
    console.log(this.model);
    var id = this.model.get("id");
    var formData = $("#form"+id).serializeJSON();
    this.model.save(formData);
  },

  keyHandler:function() {
    var that = this;
    event.stopPropagation();
    switch(event.keyCode) {
      //create new entry with enter key
      case 13:
        event.preventDefault();
        var parent_id = this.model.get("parent_id")
        this.model.collection.create({title:"", parent_id:parent_id});
        var newModelForm = JST['entry_tree/nodeForm']({
          id: DeepThought.rootCollection.length - 1,
          title:"",
          parent_id: parent_id
        })
        $("#ul"+parent_id).append("<li>"+newModelForm+"</li>");

      break;
      //destroy model on backspace, if title is empty
      case 8:
        var title = $("#form"+this.model.get("id")).serializeJSON().entry.title;
        if (title.length === 0) {
          event.preventDefault();
          console.log("dieeee");
          this.model.destroy();
          this.$el.prev().focus();
        }
        break;
      case 9:
        event.preventDefault();
      //change nesting based on tabbing
        if (event.shiftKey) {
          //tab forward
          var parent = DeepThought.rootCollection.findWhere({id: this.model.get("parent_id")});
          var newParentID = parent.get("parent_id") || this.model.get("parent_id");
        } else {
          //tab backwards
          previousElement = this.$el.prev()[0];
          if (previousElement) {   
            var newParentID = parseInt(previousElement.id);
          } else {
            var newParentID = this.model.parent_id;
          }
        }
        this.$el.appendTo($("#ul"+newParentID));
        this.model.save({parent_id: newParentID});
        console.log(this.$el)
        this.$el.focus();
        break;

      default:
    }
  },

})