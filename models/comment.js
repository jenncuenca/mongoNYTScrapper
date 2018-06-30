// DEPENDENCIES
var mongoose = require("mongoose");

// SAVE REF TO SCHEMA CONSTRUCTOR
var Schema = mongoose.Schema;

//USING SCHEMA CONSTRUCTOR - CREATE NEW SCHEMA OBJECT
var commentSchema = new Schema({
  title: {
    type: String,
    index:true
  },

  body: String
});

// CREATES MODEL FROM ABOVE SCHEMA USING MONGOOSE MODEL METHOD
var Comment = mongoose.model("Comment", commentSchema);

// Export the Comment model
module.exports = Comment;