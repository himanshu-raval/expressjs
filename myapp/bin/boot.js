#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('myapp:server');
var http = require('http');



/**
 * Get port from environment and store in Express.
 */


var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


var io = require('socket.io')(server);

var game1 = io.of('/game1'); // Define Your Custom Namespace.
var game2 = io.of('/game2'); // Define Your Custom Namespace.

game1.on('connection', function (socket) {
  console.log("Socket Connected IN Game1",socket.id);
  game1.myData = {
    id : socket.id,
    name : 'Himanshu Raval Game 1'
  }

  socket.on('updateMyData',function(data){
    try{
      socket.myData.name = 'Jency H Raval Game 1';
      console.log("Data",data);
    }catch(e){
      debug("Error :",e);
    }
    
  });

  socket.on('viedMyData',function(data){
    try{
      console.log(socket.myData);
    }catch(e){
      debug("Error :",e);
    }
  });

});



game2.on('connection', function (socket) {
  console.log("Socket Connected IN Game2",socket.id);
  game2.myData = {
    id : socket.id,
    name : 'Himanshu Raval Game 2'
  }

  socket.on('updateMyData',function(data){
    try{
      socket.myData.name = 'Jency H Raval Game 2';
      console.log("Data",data);
    }catch(e){
      debug("Error :",e);
    }
    
  });

  socket.on('viedMyData',function(data){
    try{
      console.log(socket.myData);
    }catch(e){
      debug("Error :",e);
    }
  });

});




/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
