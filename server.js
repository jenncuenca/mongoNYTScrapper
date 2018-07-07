// === DEPENDENCIES === //
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


// === REQUIRED MODELS ===//
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");

// MONGOOSE ES6 PROMISE HANDLING
mongoose.Promise = Promise;

//=== INITIALIZE EXPRESS APP ===//
var app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

// STATIC PUBLIC DIRECTORY
app.use(express.static(process.cwd() + "/public"));

// === MONGO DATABASE CONFIGURATION USING MONGOOSE ===//

var databaseUri = "mongodb://localhost/mongoosearticles";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function () {
  console.log("Mongoose connection sucessful.");
});

// === HANDLEBARS SET UP === //

// ENGINE VIEW AND DEFAULT
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// ROUTE IMPORTS & SERVER ACCESS
var router = express.Router();

// Require routes file pass router object
require("./config/routes")(router);

// ROUTER MIDDLEWARE REQUEST HANDLING
app.use(router);

//SET SERVER PORT
var port = process.env.PORT || 3000;

//SET LISTENER
app.listen(port, function () {
  console.log("// APP IS RUNNING ON PORT: " + port + "...");
});