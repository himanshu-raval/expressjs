module.exports = {
	migrate : 'alter', // drop, alter, create, safe
	connection: 'mongo_loc',
	connections : {
		myPostgres: {
	      adapter: 'postgresql',
	      host: 'localhost',
	      user: 'ganeshdatta',
	      database: 'studygroup-express'
	    },
	    // mongo_live: {
	    //    adapter: 'mongo',
	    //   host: '35.165.175.157',
	    //   user: 'yaniv_game',
	    //   database: 'yaniv_game',
	    //   password: "Yan%40%40Game2017"
	    // },
	    mongo_loc: {
	      adapter: 'mongo',
	      host: 'localhost',
	      user: 'root',
	      database: 'yaniv_game'
	    }

	}
}
 