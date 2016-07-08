var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'chubbo-chat',
    //pass src for page bkground only needed on landing
    script: '/javascripts/floatingDots.js'
  });
});

// GET dashboard (for logged in users)
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {
    title: 'chubbo-chat: dashboard',
    script: '/javascripts/dashboard.js'
  });
});

module.exports = router;
