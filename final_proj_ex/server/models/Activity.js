var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	cost: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	vote: {
		type: Number,
		required: true
	},
	bookmarkUsers: [{
		type: String,
		required: false
	}]
});

module.exports = mongoose.model('activity', ActivitySchema);
