#!/usr/bin/env node

/**
 * Module dependencies.
 */

require('./Boot/Server');
var debug = require('debug')('Server:www');

/**
 * Get port from environment and store in Express.
 */

Game.Config.Local.port = normalizePort(process.env.PORT || Game.Config.Local.port);
Game.App.set('port', Game.Config.Local.port);


Game.Server.on('error', onError);
Game.Server.on('listening', onListening);

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

  var bind = typeof Game.Config.Local.port === 'string'
    ? 'Pipe ' + Game.Config.Local.port
    : 'Port ' + Game.Config.Local.port;

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
  var addr = Game.Server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
