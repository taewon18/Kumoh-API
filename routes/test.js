var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Test Router Call!");
});

router.get('/asynchronousTest', function(req, res, next) {
    for(var i = 0; i < 10; i++) {
        console.log(i + " : iterator");
    }
    console.log("1 call");
    console.log("2 call");
    console.log("3 call");
    console.log("4 call");
    console.log("5 call");
    console.log("6 call");
    console.log("7 call");
    console.log("8 call");
    console.log("9 call");
    console.log("10 call");
    res.send("Test Router Call!");
});

router.get('/synchronousTest', function(req, res, next) {
    res.send("Test Router Call!");
});

module.exports = router;
