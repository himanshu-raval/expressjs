var bcrypt = require('bcryptjs');

var User = {
  	identity: 'user',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,
  	
  	attributes: {
	    username: 'string',
	    email: {
	      	type: 'string',
	      	required: true,
	      	unique: true
	  	},
	  	is_admin: {
	   		type:'boolean',
	   		defaultsTo:0
	 	},
	  	firstname: {
	      	type:'string',
	      	defaultsTo:''
	  	},
	  	lastname: {
	      	type:'string',
	      	defaultsTo:''
	  	},
	 	country :{
	      	type: 'string',
	      	defaultsTo: ''
	   	},
	  	gender: {
	      	type: 'string',
	      	enum: ['male','female'],
	      	defaultsTo: 'male'
	  	},

	  	status: {
	      	type: 'string',
	      	enum: ['online','offline'],
	      	defaultsTo: 'offline',
	  	},
	   	verifyPassword: function (password) {
	      	return bcrypt.compareSync(password, this.password);
	    },
  	},
  	beforeCreate: function(values, next){

	    bcrypt.genSalt(10, function(err, salt) {
	      if (err) return next(err);

	      bcrypt.hash(values.password, salt, function(err, hash) {
	        if (err) return next(err);

	        values.password = hash;
	        next();
	      });
	    });
  	},
	   	
};

module.exports = User;
