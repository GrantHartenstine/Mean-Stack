var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content){
	res.status(status);
	res.json(content);
};

// POST a new blog
module.exports.blogsCreate = function (req, res) {
	console.log(req.body);
	Blog.create({
	 blogTitle: req.body.title,
	 blogText: req.body.text,
	 createdOn: req.body.date
	},
	function(err, blog) {
	  if(err) {
		console.log(err);
	   	sendJSONresponse(res, 400, err);
	  }
	  else {
		console.log(blog);
		sendJSONresponse(res, 201, blog);
	  }
	});
};

// GET list of all blogs
module.exports.blogsListAll = function (req, res) {
 console.log('Fetching all blog documents');
 Blog
	.find({}, function(err, results) {
	 if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
	 }
	 console.log(results);
	 sendJSONresponse(res, 200, results);
	 });
};

// GET a blog by ID
module.exports.blogsReadOne = function (req, res) {
 console.log('Finding blog details', req.params);
 if (req.params && req.params.blogID) {
  Blog
	.findById(req.params.blogID)
	.exec(function(err, blog) {
	  if (!blog) {
		sendJSONresponse(res, 404, 
		 {"message": "blogID not found"});
		 return;
	  }
	  else if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
	  }
	  console.log(blog);
	  sendJSONresponse(res, 200, blog);	
	});
 }
 else {
	console.log('No blogID specified');
	sendJSONresponse(res, 404,
	{"message": "No blogID in request"});
 }
};

// PUT: Update the blog that has this ID 
module.exports.blogsUpdateOne = function (req, res) {
 if(!req.params.blogID) {
	sendJSONresponse(res, 404,
	{"message": "Not found, blogID is required"});
	return;
 }
 Blog
	.findById(req.params.blogID)
	.exec(function(err, blog) {
	  if (!blog) {
		sendJSONresponse(res, 404,
		{"message": "blogID not found"});
		return;
	  }
	  else if (err) {
		sendJSONresponse(res, 400, err);
		return;
	  }
	  blog.blogTitle = req.body.title;
	  blog.blogText = req.body.text;
	  blog.createdOn = req.body.date;
	  blog.save(function(err, blog) {
	   if (err) {
		sendJSONresponse(res, 404, err);
	   }
	   else {
		sendJSONresponse(res, 200, blog);
	   }
	   });
	});
};

// DELETE the blog that has this ID
module.exports.blogsDeleteOne = function (req, res) {
 var blogID = req.params.blogID;
 if (blogID) {
  Blog
	.findByIdAndRemove(blogID)
	.exec(function(err, blog) {
	 if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
	 }
	 console.log("Blog ID " + blogID + " deleted");
	 sendJSONresponse(res, 204, null);
	});
 }
 else {
	sendJSONresponse(res, 404, 
	{"message": "No blogID"});
 }
};
