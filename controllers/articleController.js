// === REQUIRED === //
var scrape = require("../scripts/scrape");
var Article = require("../models/article");

module.exports = {
  fetch: function (callback) {

    scrape(function (data) {

      var articleData = data;
      // Save article object with a date
      for (var i = 0; i < articleData.length; i++) {
        articleData[i].date = new Date();
        articleData[i].saved = false;
        articleData[i].note = [];
      }

      console.log("ARTICLE DATA: " + articleData)

      //filters duplicate articles
      Article.collection.insertMany(articleData, {
        ordered: false
      }, function (err, docs) {
        callback(err, docs);
      });
    });
  },
  get: function (query, callback) {
    //query is currently hardcoded to {saved: true}
    Article.find(query)
      .sort({
        _id: -1
      })
      .exec(function (err, doc) {
        //send saved articles back to routes to be rendered
        callback(doc);
      });
  },
  update: function (query, callback) {
    // saves or unsaves an article depending on the user query
    Article.update({
      _id: query.id
    }, {
      $set: {
        saved: query.saved
      }
    }, {}, callback);
  },
  addNote: function (query, callback) {
    Article.findOneAndUpdate({
      _id: query.id
    }, {
      $push: {
        comment: query.note
      }
    }, {}, callback);
  }
};