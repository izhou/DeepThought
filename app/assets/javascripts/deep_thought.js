window.DeepThought = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    DeepThought.rootCollection = new DeepThought.Collections.EntryTree();
    DeepThought.rootCollection.fetch({
      success: function(data) {
        DeepThought.allCollections = new Object();
        DeepThought.rootCollection.models.forEach(function(model) {
          var children = DeepThought.rootCollection.where({"parent_id": model.get("id")});
          var childrenColl = new DeepThought.Collections.EntryTree(children);
          DeepThought.allCollections[model.get("id")] = childrenColl;
        })

        DeepThought.allParents = new Object();
        DeepThought.rootCollection.models.forEach(function(model) {
          DeepThought.allParents[model.get("id")] = model.get("parent_id");
        })

        DeepThought.router = new DeepThought.Router(data);
        console.log("routergoo");
        Backbone.history.start();
      }
    })
  }
};



// [{"id":1,
//   "title":"Home",
//   "created_at":"2013-11-06T01:50:54Z",
//   "updated_at":"2013-11-06T01:50:54Z",
//   "ancestry":null,
//   "parent_id":0,
//   "children":[
//     {"id":3,
//       "title":"helloa",
//       "created_at":"2013-11-06T01:50:54Z",
//       "updated_at":"2013-11-07T04:17:38Z",
//       "ancestry":"1","parent_id":1},
//     {"id":2,
//       "title":"this can change",
//       "created_at":"2013-11-06T01:50:54Z",
//       "updated_at":"2013-11-07T01:41:12Z",
//       "ancestry":"1",
//       "parent_id":1,
//       "children":[
//         {"id":4,
//         "title":"functionsa",
//         "created_at":"2013-11-06T01:50:54Z",
//         "updated_at":"2013-11-07T04:26:10Z",
//         "ancestry":"1/2","parent_id":2
//       }]
//     }]
//   },
