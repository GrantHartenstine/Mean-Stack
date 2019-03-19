var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
        blogTitle: {
	 type: String,
	 required: true
	},
        blogText: {
	 type: String,
	 required: true
	},
        createdOn: {
	 type: Date,
	 required: true
	}
});

mongoose.model('Blog', blogSchema);
