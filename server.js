// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// SCRAPING TOOLS
var axios = require("axios");
var cheerio = require("cheerio");

//REQUIRED MODELS
var db = require("./models");
var PORT = 3000;

// EXPRESS INITIALIZATION
var app = express();

//MORGAN LOGGER
app.use(logger("dev"));

//BODY-PARSER FOR HANDLING FORM SUBMISSIONS
app.use(bodyParser.urlencoded({ extended: true }));

//EXPRESS.STATIC FOR PUBLIC FOLDER AS STATIC DIRECTORY
app.use(express.static("public"));

//CONNECT TO MONGO DB
mongoose.connect("mongodb://localhost/mongoNYT");

//ROUTES

//GET FOR NYT WEBSITE
app.get("/scrape", function(req, res) {
    axios.get("http://www.nytimes.com/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("h1").each(function(i, element) {
        // SAVE EMPTY RESULT FROM GET REQUEST ABOVE
        var result = {};
  
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
    
        db.Article.create(result)
          .then(function(dbArticle) {
         
            console.log(dbArticle);
          })
          .catch(function(err) {
            // SEND ANY ERRORS TO CLIENT
            return res.json(err);
          });
      });
  
      // SEND MESSAGE TO CLIENT IF ABLE TO SUCCESSFUL SCRAPE AND SAVE ARTICLE
      res.send("Scraping Complete");
    });
  });
  
  // GET ALL ARTICLES FROM DB
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        // SEND ARTICLES BACK TO CLIENT IF SUCCESSFUL
        res.json(dbArticle);
      })
      .catch(function(err) {
        // SEND ANY ERRORS TO CLIENT
        res.json(err);
      });
  });
  
  // ROUTE FOR SPECIFIC ARTICLE IDS - POPULATE WITH COMMENT
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(function(dbArticle) {
        // IF SUCCESSFUL - SEND ARTICLE BACK TO CLIENT WITH ID
        res.json(dbArticle);
      })
      .catch(function(err) {
        // 
        res.json(err);
      });
  });
  
  // ROUTE FOR SAVING/UPDATING ARITLCE'S COMMENTS
  app.post("/articles/:id", function(req, res) {
    // CREATE NEW COMMENT
    db.Comment.create(req.body)
      .then(function(dbComment) {
        //IF NEW COMMENT SUCCESSFULLY CREATED - FIND ARTICLE WITH ID EQUAL TO REQURED PARAMETERS THEN UPDATE THE ARTICLE ASSOCIATED WITH NEW COMMENT.
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
      })
      .then(function(dbArticle) {
        // IF ARTICLE UPDATE SUCCESSFUL - SEND BACK TO CLIENT
        res.json(dbArticle);
      })
      .catch(function(err) {
        // SEND ANY ERRORS TO CLIENT
        res.json(err);
      });
  });
  
  // START SERVER
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  