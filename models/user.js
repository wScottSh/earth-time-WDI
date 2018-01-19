var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	google: {
	    id: String,
	    access_token: String,
	    email: String
  	},
	location: {
		lat: Number,
		lng: Number
	}
});

module.exports = mongoose.model('User', userSchema);
