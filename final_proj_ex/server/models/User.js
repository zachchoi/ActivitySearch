var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	likes: [{
		type: String,
		required: false
	}]
});

module.exports = mongoose.model('user', UserSchema);
