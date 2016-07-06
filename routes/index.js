var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'chubbo-chat'});
});

// POST message text
router.post('/reverse', function(req, res) {
  res.send(req.body.message);
});

module.exports = router;
