var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'chubbo-chat',
    //pass src for page bkground only needed on landing
    background: '/javascripts/floatingDots.js'
  });
});

// GET dashboard (for logged in users)
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {title: 'chubbo-chat: dashboard'});
});

module.exports = router;
