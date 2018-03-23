var fs = require('fs');
var path      = require("path");
var postgresAdapter = require('sails-postgresql');
var mongoAdapter = require('sails-mongo');
var Waterline = require('waterline');
var orm = new Waterline();
var expressLayouts = require('express-ejs-layouts');
var expressJwt = require('express-jwt');
var winston = require('winston');
var util = require('util');
module.exports = {
	register: function () {
		global['extend'] = util._extend
		winston.configure({
			transports: [
			new (winston.transports.Console)(),
			// new (winston.transports.File)({ filename: 'somefile.log' })
			]
		});
		winston.setLevels({
			trace: 9,
			input: 8,
			verbose: 7,
			prompt: 6,
			debug: 5,
			info: 4,
			data: 3,
			help: 2,
			warn: 1,
			error: 0
		});

		winston.addColors({
			trace: 'magenta',
			input: 'grey',
			verbose: 'cyan',
			prompt: 'grey',
			debug: 'blue',
			info: 'green',
			data: 'grey',
			help: 'cyan',
			warn: 'yellow',
			error: 'red'
		});

		winston.remove(winston.transports.Console)
		winston.add(winston.transports.Console, {
			level: 'trace',
			prettyPrint: true,
			colorize: true,
			silent: false,
			timestamp: false
		});
		Game.Logger = winston;
		Game.Logger.info('Initializing server...')
		Game.Logger.info('Adding configs.');
		fs
		.readdirSync(path.join(__dirname, '../', './Config'))
		.filter(function(file) {
			return (file.indexOf(".") !== 0);
		})
		.forEach(function(file) {
			Game.Config[file.split('.')[0]] = require(path.join(__dirname, '../', './Config', file));
		});
		Game.App.use('Shop/:item?', expressJwt({
			secret: Game.Config.App.secret,
			getToken: function (req) {
				if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
					return req.headers.authorization.split(' ')[1];
				} else if (req.query && req.query.token) {
					return rokeq.query.token;
				}
				return null;
			}
		}).unless({ 
			path: [
			'/Auth/User/authenticate', 
			'/Auth/User/register', 
			'/Help/Help/web-view', 
			'/Shop/Avatar/upload',
			'/Shop/Card/upload',
			'/Shop/Chest/upload',
			'/Shop/Landmark/upload',
			'Shop/Avatar/api/upload',
			'/Assets/upload/',
			'/Assets/',
			'/'
			] 
		}));

		Game.App.set('views', [path.join(__dirname,  '../', './AppSource'),path.join(__dirname,  '../', './AppSource/Default/Views')]);
		Game.App.set('view engine', 'ejs');
		Game.App.use(expressLayouts);
		Game['AppSource'] = {};
		fs
		.readdirSync(path.join(__dirname, '../','./AppSource'))
		.filter(function(file) {
			return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
		})
		.forEach(function(dir) {
			Game.AppSource[dir] = {
				Sockets : {},
				Routes : {},
				Controllers : {},
				Models : {}
			};
			fs
			.readdirSync(path.join(__dirname, '../', './AppSource', dir, './Models'))
			.filter(function(file) {
				return (file.indexOf(".") !== 0) && (file !== "index.js");
			})
			.forEach(function(file) {
				var model = require(path.join(__dirname, '../', './AppSource', dir,'./Models', file));
				Game.AppSource[dir].Models[file.split('.')[0]] = model.identity;
				orm.loadCollection(Waterline.Collection.extend(model));
			});

			Game.Logger.info(dir + ' Model registerd!');
			Game.Logger.info('Registering '+dir+' Sockets...');
			fs
			.readdirSync(path.join(__dirname,  '../', './AppSource', dir, './Sockets'))
			.filter(function(file) {
				return (file.indexOf(".") !== 0);
			})
			.forEach(function(file) {
				Game.AppSource[dir].Sockets[file.split('.')[0]] = require(path.join(__dirname,  '../', './AppSource', dir, './Sockets', file));
			}); 
			Game.Logger.info(dir+' Socket registerd !');
			Game.Logger.info('Registering '+dir+' Controllers...');
			fs
			.readdirSync(path.join(__dirname,  '../', './AppSource', dir,  './Controllers'))
			.filter(function(file) {
				return (file.indexOf(".") !== 0) && (file !== "index.js");
			})
			.forEach(function(file) {
				Game.AppSource[dir].Controllers[file.split('.')[0]] = require(path.join(__dirname,  '../', './AppSource', dir, './Controllers', file));
			}); 
			Game.Logger.info(dir+ ' Controllers registerd !');
			Game.Logger.info('Registering '+dir+' Route...');
			fs
			.readdirSync(path.join(__dirname,  '../', './AppSource', dir,  './Routes'))
			.filter(function(file) {
				return (file.indexOf(".") !== 0);
			})
			.forEach(function(file) {
				Game.App.use('/'+dir+'/'+ file.split('.')[0], require(path.join(__dirname, '../', './AppSource', dir,  './Routes', file)));
			});
			Game.App.use('/', require(path.join(__dirname, '../', './AppSource/Default/Routes/home')));
			Game.Logger.info(dir + ' Route registerd!');
			
		});

		Game.Logger.info('Registering Config...');
		// Game.App.set('layout', 'layouts/layout');
		Game.Logger.info('Config registerd!');
	},
	boot: function(){
		Game.Logger.info('Booting server...')
		Game.Logger.info('Booting models.')
		orm.initialize({
			adapters: {
				postgresql: postgresAdapter,
				mongo: mongoAdapter
			},
			connections: Game.Config.Model.connections
		}, function(err, models) {
			if(err) throw err;
			Object.keys(Game.AppSource).forEach(function(dir){
				Object.keys(Game.AppSource[dir].Models).forEach(function(file){
					Game.AppSource[dir].Models[file] = models.collections[Game.AppSource[dir].Models[file]];
				})
			})
			Game.Logger.info('Model booted!');

			/**
			 *  When Server Restart, Remove Waiting state Tables.
			 */		 
			Game.AppSource.Game.Models.Table.destroy({status:'waiting'})
			.exec(function (err, table) {
				if(err) { console.log(err); return; }
				return;
			});		 
			Game.Logger.info('Table Deleted...');
			Game.AppSource.Game.Models.Tournament.destroy({status:'waiting'})
			.exec(function (err, table) {
				if(err) { console.log(err); return; }
				return;
			});		 
			Game.Logger.info('Tournament Deleted...');


			Game.Logger.info('Booting Sockets...');
			Game.Io.on('connection', function(client) {
				Object.keys(Game.AppSource).forEach(function(Module){
					Object.keys(Game.AppSource[Module].Sockets).forEach(function(key){
						Game.AppSource[Module].Sockets[key](client)
					})
				})
			});

			Game.Logger.info('Sockets booted!');
			Game.Logger.info('Starting server.')
			Game.Logger.info('Registoring server game events.')
			Game.addEvents();
			Game.Server.listen(Game.Config.Local.port);

		});

	}
}

