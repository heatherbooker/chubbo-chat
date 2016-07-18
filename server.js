var express = require('express');
var path = require('path');
var autoprefixer = require('express-autoprefixer');


var server = express();
var port = process.env.PORT || 3000;

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');
server.use(express.static(path.join(__dirname, 'public')));

//add vendor prefixes to css
server.use(autoprefixer({
  browsers: 'last 2 versions',
  remove: false
}));

server.get('/', function(req, res, next) {
  res.render('index');
});

server.listen(port);
