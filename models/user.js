var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	google: {
	    id: String,
	    access_token: String,
	    email: String
  	},
	location: {
    // hard code in the location of Austin
		// lat: 30.2672,
		// lng: 97.7431
		lat: Number,
		lng: Number
	}
});

module.exports = mongoose.model('User', userSchema);
