var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'chubbo-chat',
    background: '/javascripts/floatingDots.js'
  });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {
    title: 'chubbo-chat: dashboard',
    message: 'gsdfsdfsdf'
  });
});

module.exports = router;
