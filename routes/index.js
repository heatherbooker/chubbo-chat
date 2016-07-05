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


function reverse(msg) {
  var reverseMsg = '';
  var msgMax = msg.length;
  for (var i = 0; i < msgMax; i++) {
    reverseMsg = msg.charAt(i) + reverseMsg;
  }
  return reverseMsg;
}

var incomingMsgs = [];
var outgoingMsgs = [];

// POST message text
router.post('/', function(req, res) { 
  var msg = req.body.msg;
  outgoingMsgs.push(msg);
  incomingMsgs.push(reverse(msg));
  res.render('index', {
    title: 'chubbo-chat',
    incoming: incomingMsgs,
    outgoing: outgoingMsgs
  });
});

module.exports = router;
