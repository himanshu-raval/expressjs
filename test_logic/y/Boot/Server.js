var game = require('../Events/Game');
var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
Game = new game();
Game.App = express();
Game.Server = require('http').Server(Game.App);
Game.Io = require('socket.io')(Game.Server,{'pingTimeout':10000,'pingInterval':5000});

Game.Io.set('origins', '*:*');

Game.App.use(cors({
  origin: 'http://192.168.1.86:8000',
  credentials:true
}));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Game.App.use(logger('dev')); // Print File Access Path.
Game.App.use(bodyParser.json());
Game.App.use(bodyParser.urlencoded({ extended: false }));
Game.App.use(cookieParser());
Game.App.use(express.static(path.join(__dirname, '../public')));
Game.App.use('/Assets', express.static(path.join(__dirname, '../Assets')))
Game.App.use(path.join(__dirname, '../public'), express.static('../public'))

require('./App').register();
require('./App').boot();

// catch 404 and forward to error handler
Game.App.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  return res.redirect('/')
  // next(err);
});

// error handler
Game.App.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });


module.exports = {app: Game.App, server: Game.Server};
