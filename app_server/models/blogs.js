var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    createdOnDate: String
});

mongoose.model('blogList', blogSchema);
