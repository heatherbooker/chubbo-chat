var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET dashboard (for logged in users)
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});

module.exports = router;
