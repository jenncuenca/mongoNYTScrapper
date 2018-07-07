// == REQUIRE == //
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var articleSchema = new Schema({
  
  // title - string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link - string
  link: {
    type: String,
    required: true
  },
  date: String,
  saved: {
    type: Boolean,
    default: false
  },
  // This only saves one comments's ObjectId
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", articleSchema);

// Export the model
module.exports = Article;