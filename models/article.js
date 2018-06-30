//DEPENDENCIES
var mongoose = require("mongoose");

// SAVE REF TO SCHEMA CONSTRUCTOR
var Schema = mongoose.Schema;

//USING SCHEMA CONSTRUCTOR - CREATE NEW SCHEMA OBJECT
var articleSchema = new Schema({

  title: {
    type: String,
    required: true,
    index: true
  },

  link: {
    type: String,
    required: true
  },

  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// CREATES MODEL FROM ABOVE SCHEMA USING MONGOOSE MODEL METHOD
var Article = mongoose.model("Article", articleSchema);

// EXPORT ARTICLE MODEL
module.exports = Article;