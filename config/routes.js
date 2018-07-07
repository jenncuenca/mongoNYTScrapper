// === REQUIRED === //
var scrape = require("../scripts/scrape");
var Article = require("../models/article");
var Comment = require("../models/comment");
var articleController = require("../controllers/articleController");
var commentController = require("../controllers/commentsController");


// === ROUTES === //
module.exports = function(router) {

    // Find articles to scrape
  router.get("/", function(req, res) {
      Article.find({saved: false}, function(error, found) {
          if (error) {
              console.log(error);
          } else if (found.length === 0) {
              res.render("empty")
          } else {

            var hbsObject = {
                articles: found
            };
            res.render("index", hbsObject);

          }
      });
  });

  router.get("/api/fetch", function(req, res) {

      // scrapes for articles and saves unique ones to the database
      articleController.fetch(function(err, data) {
          //Alerts user if new articles were found or not
          if (!data || data.insertedCount === 0) {
              res.json({message: "No new articles found. Try again later!"});
          }
          else {
              res.json({message: "Added " + data.insertedCount + " new articles!"});

          }
      });
  });

  //Gets saved articles from database
  router.get("/saved", function(req, res) {

      articleController.get({saved: true}, function(data) {
          var hbsObject = {
            articles: data
          };
          res.render("saved", hbsObject);
      });
  });

  //handles being able to save or delete articles
  router.patch("/api/articles", function(req, res) {
      articleController.update(req.body, function(err, data) {
          res.json(data);
      });
  });

  //get comments for saved articles to be displayed in modal
  router.get('/comments/:id', function (req, res) {
      //Finds article with matching ID
      Article.findOne({_id: req.params.id})
          .populate("comment") //Populate all comments associated with article
          .exec(function (error, data) { //query
              if (error) console.log(error);
              else {
                  res.json(data);
              }
          });
  });

  // Add comment to a saved article
  router.post('/comments/:id', function (req, res) {
      //create a new note with req.body
      var newComment = new Comment(req.body);
      console.log("New Comment:" + newComment)
      
      //save newNote to the db
      newComment.save(function (err, data) {
          // Log any errors
          if (err) console.log(err);
          //find and update the comment
          Article.findOneAndUpdate(
              {_id: req.params.id}, // find the _id
              {$push: {comment: data._id}}, //push to comment array
              {new: true},
              function(err, newdata){
                  if (err) console.log(err);
                  res.send(newdata);
          });
      });
  });

  //Delete article comment
  router.get('/deleteComment/:id', function(req, res){
      Comment.remove({"_id": req.params.id}, function(err, newdata){
          if(err) console.log(err);
          res.redirect('/saved');
      });
  });

};
