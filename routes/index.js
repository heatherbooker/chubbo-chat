var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'chubbo-chat'});
});

// POST message text
router.post('/reverse', function(req, res) {
  res.send(reverse(req.body.message));
});

function reverse(message) {
  var reverseMessage = '';
  var messageMax = message.length;
  for (var i = 0; i < messageMax; i++) {
    reverseMessage = message.charAt(i) + reverseMessage;
  }
  return reverseMessage;
}

module.exports = router;
