var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');

var sendJSONresponse = function(res, status, content){
	res.status(status);
	res.json(content);
};

// POST a new blog
module.exports.blogMake = function (req, res) {
	console.log(req.body);
	Blog.
	 create({
	 blogTitle: req.body.blogTitle,
	 blogText: req.body.blogText,
	 userName: req.body.userName,
	 userEmail: req.body.userEmail,
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
module.exports.blogList = function (req, res) {
 console.log('Fetching all blog documents');
 Blog
	.find() 
	.exec(function(err, results)	{
	 if (!results) {
		sendJSONresponse(res, 404, {
			"message" : "No blogs found!"
		});
		return;
	 }else if(err) {
	 console.log(err);
	 sendJSONresponse(res, 404, err);
	 return;
	 }
	 console.log(results);
	 sendJSONresponse(res, 200, buildBlogList(req, res, results));
			});
};
 var buildBlogList = function(req, res, results) {
	var blog = [ ];
	results.forEach(function (obj) {
	  blog.push({
		blogID : obj._id,
		blogTitle : obj.blogTitle,
		blogText : obj.blogText,
		userName : obj.userName,
		userEmail : obj.userEmail,
		createdOn : obj.createdOn
	 });
        });
	return blog;
    };

// GET a blog by ID
module.exports.blogRead = function (req, res) {
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
module.exports.blogUpdate = function (req, res) {
 console.log("Updating Blog Entry : " + req.params.blogID);
 console.log(req.body);
 Blog
	.findByIdAndUpdate(
	   { _id: req.params.blogID },
	   { $set: {"blogTitle" : req.body.blogTitle ,"blogText" : req.body.blogText}},

	function(err, response) {
	   if(err)  {
		sendJSONresponse(res, 400, err);
	   } else {
		sendJSONresponse(res, 201, response);
	   }
	}
)};

// DELETE the blog that has this ID
module.exports.blogDelete = function (req, res) {
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
