var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

var PORT = process.env.PORT || 3000;
//fetching the route
var route = require("./Routes/apiRoute");

var exphbs = require("express-handlebars");

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
app.use("/api",route);

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scrapedb", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
