var express = require('express');
var path = require('path');


var server = express();
var port = process.env.PORT || 3000;

// view engine setup
server.set('src/views', path.join(__dirname, 'src/views'));
server.set('view engine', 'pug');
server.use(express.static(path.join(__dirname, 'build')));


server.get('/', function(req, res, next) {
  res.render('index');
});

server.listen(port);
