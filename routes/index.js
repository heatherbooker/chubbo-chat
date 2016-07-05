var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'chubbo-chat',
    incoming: 'none',
    outgoing: 'none'
  });
});


function displayReply(msg) {
  var replyMap = {
    hello: 'hi',
    sup: 'sup eh',
    help: 'how can i help you?',
    hi: 'hello there',
    hey: 'hey friend',
    yo: 'sup'
  };
  if (typeof replyMap[msg] !== 'undefined') {
    return replyMap[msg];
  } else {
    return 'well hello to you too';
  }
}

// POST message text
router.post('/', function(req, res) {
  var message = req.body.msg;
  res.render('index', {
    title: 'chubbo-chat',
    incoming: displayReply(message),
    outgoing: message
  });
});

module.exports = router;
