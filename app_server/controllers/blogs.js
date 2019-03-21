var request = require('request');
var serverURL = process.env.SVR_URL;

var renderBlogList = function (req, res, responseBody) {
 var messageTitle;
 var message;
 if(!(responseBody instanceof Array)) {
	messageTitle = "Error!";
	message = "API lookup error.";
	responseBody = [];
 }
 else {
  if (!responseBody.length) {
	messageTitle = "Empty List!";
	message = "No blogs have been posted yet.";
  }
 }
 res.render('list-blog',
 {
	title: 'Blog List',
	blogs: responseBody,
	messageTitle: messageTitle,
	message: message
 });

 if (messageTitle && message) {
	console.log(messageTitle + " - " + message);
 }
};

var renderEditBlog = function (req, res, blogData) {
 res.render('edit-blog',
 {
	title: 'Edit Blog',
	blogData: blogData,
	blogTitle: blogData.blogTitle,
	blogText: blogData.blogText
 });
};

var renderDeleteBlog = function (req, res, blogData) {
 res.render('delete-blog',
 {
	title: 'Delete Blog',
	blogData: blogData,
	blogTitle: blogData.blogTitle,
	blogText: blogData.blogText
 });
};

/* GET 'list-blog' page */
module.exports.listBlog = function(req, res) {
 var requestOptions;
 var path = '/api/blogs';

 requestOptions = {
	url: serverURL + path,
	method: "GET",
	json: {}
 };

 request(requestOptions, function(err, response, body) {
  if (err) {
	console.log(err);
  }
  else if (response.statusCode === 200) {
	console.log("Documents Found: " + body.length)
	renderlistBlog(req, res, body);
  }
  else {
	console.log(response.statusCode);
  }
 });
};

/* GET 'add-blog' page */
module.exports.addBlog = function(req, res) {
  res.render('add-blog', {title: 'Add Blog' });
};

/* POST blog */
module.exports.doAddBlog = function(req, res) {
 var postData;
 var requestOptions;
 var path = '/api/blogs';

 postData = {
	title: req.body.title,
	text: req.body.text,
	date: Date.now()
 };

 requestOptions = {
	url: serverURL + path,
	method: "POST",
	json: postData
 };
 
 request(requestOptions, function(err, response, body) {
  if(response.statusCode === 201) {
	res.redirect('/list-blog');
  }
  else {
	res.status(response.statusCode);	
  }
 });
};

/* GET 'edit-blog' page */
module.exports.editBlog = function(req, res) {
 var requestOptions;
 var path = '/api/blogs/' + req.params.blogID;

 requestOptions =  {
	url: serverURL + path,
	method: "GET",
	json: {}
 };

 request(requestOptions, function(err, response, body) {
  if (err) {
	console.log(err);
  }
  else if (response.statusCode === 200) {
	console.log(body)
	renderEditBlog(req, res, body);
  }
  else {
	console.log(response.statusCode);
  }
 });
};

/* PUT a blog update */
module.exports.doEditBlog = function(req, res) {
 var putData;
 var requestOptions;
 var path = '/api/blogs/' + req.params.blogID;

 putData = {
	title: req.body.title,
	text: req.body.text,
	date: Date.now()
 };

 requestOptions = {
	url: serverURL + path,
	method: "PUT",
	json: putData
 };
 
 request(requestOptions, function(err, response, body) {
  if(response.statusCode === 200) {
	res.redirect('/list-blog');
  }
  else {
	res.status(response.statusCode);	
  }
 });
};

/* GET 'delete-blog' page */
module.exports.deleteBlog = function(req, res) {
 var requestOptions;
 var path = '/api/blogs/' + req.params.blogID;

 requestOptions =  {
	url: serverURL + path,
	method: "GET",
	json: {}
 };

 request(requestOptions, function(err, response, body) {
  if (err) {
	console.log(err);
  }
  else if (response.statusCode === 200) {
	console.log(body)
	renderDeleteBlog(req, res, body);
  }
  else {
	console.log(response.statusCode);
  }
 });
};

/* DELETE a blog */
module.exports.doDeleteBlog = function(req, res) {
 var putData;
 var requestOptions;
 var path = '/api/blogs/' + req.params.blogID;

 requestOptions = {
	url: serverURL + path,
	method: "DELETE",
	json: {} 
 };
 
 request(requestOptions, function(err, response, body) {
  if(response.statusCode === 204) {
	res.redirect('/blog-list');
  }
  else {
	res.status(response.statusCode);	
  }
 });
};
