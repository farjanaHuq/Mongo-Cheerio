var express = require('express');
var path = require('path');
var router = express.Router();

// main page
router.get("/", function (req, res) {
   res.render('index');
});

module.exports = router;