var bcrypt = require('bcryptjs');

var User = {
	identity: 'user',
	connection: Game.Config.Model.connection,
	migrate: Game.Config.Model.migrate,

	attributes: {
		username : {
			type: 'string', 
			defaultsTo: null,
			unique: true,
			required: true
		},
		password : {
			type: 'string', 
			required: true
		},
		firstname : {
			type: 'string', 
			defaultsTo: null,
		},
		lastname : {
			type: 'string', 
			defaultsTo: null,
		},
		status : {
			type: 'string', 
			defaultsTo: 'Active'       
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
