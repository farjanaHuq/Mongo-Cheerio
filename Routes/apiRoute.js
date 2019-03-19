var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


// A GET route for scraping the echoJS website
router.get("/scrapeData", function(req, res) {

    //Grabs the body of the html with axios 
    axios.get("https://www.cnn.com/opinions").then(function(response) {
  
      // Load the HTML into cheerio
      var $ = cheerio.load(response.data);
    
      // Makes an empty array for saving our scraped info
      var results = {};
      
          $("h3.cd__headline").each(function(i, element) {
            
            results.title = $(element).find("span.cd__headline-text").text();
            results.link = "https://www.cnn.com/opinions" + $(element).children("a").attr("href");
            //results.img =  $(element).find('img').attr('src');
            
            console.log("Title",results.title);
            console.log("Link",results.link);
            // If this found element had both a title and a link
           
              // Insert the data in the Article db
              db.Article.create(results)
                .then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err){
                  console.error(err);
                });
  
              // After looping through each element found, log the results to the console
              console.log(results);
          });
          res.end()
      });  
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        // return db.Article.update(
        //   {
        //      _id: req.params.id
        //   },
        //   {
        //      $push: { note: dbNote._id }
        //   });
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
 
  //Route for deleting a note from an article
  router.delete('/notes/:id', function (req, res) {
    
    //deletes notes from database
    db.Note.remove({
      _id: req.params.id
    })
    .then(function (data) {
          res.json(data);
    })
    .catch(function (err) {
          res.json(err);
    });
  });


module.exports = router;