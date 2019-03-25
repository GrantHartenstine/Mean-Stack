var request = require('request');
var apiOptions = { server: 'http://18.224.67.53'};

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
 res.render('blog',
 {
	title: 'Blog',
	blogs: responseBody,
	messageTitle: messageTitle,
	message: message
 });

 if (messageTitle && message) {
	console.log(messageTitle + " - " + message);
 }
};

var renderBlogEdit = function (req, res, blogData) {
 res.render('blog-edit',
 {
	title: 'Edit Blog',
	blogData: blogData,
	blogTitle: blogData.blogTitle,
	blogText: blogData.blogText
 });
};

var renderBlogDelete = function (req, res, blogData) {
 res.render('blog-delete',
 {
	title: 'Delete Blog',
	blogData: blogData,
	blogTitle: blogData.blogTitle,
	blogText: blogData.blogText
 });
};

/* GET 'blog' page */
module.exports.blogList = function(req, res) {
 var requestOptions;
 var path = '/api/blog';

 requestOptions = {
	url:apiOptions.server + path,
	method: "GET",
	json: {}
 };

 request(requestOptions, function(err, response, body) {
  if (err) {
	console.log(err);
  }
  else if (response.statusCode === 200) {
	console.log("Documents Found: " + body.length)
	renderBlogList(req, res, body);
  }
  else {
	console.log(response.statusCode);
  }
 });
};

/* GET 'blog-add' page */
module.exports.addBlog = function(req, res) {
  res.render('blog-add', {title: 'Add Blog' });
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
	res.redirect('/blog');
  }
  else {
	res.status(response.statusCode);	
  }
 });
};

/* GET 'blog-edit' page */
module.exports.blogEdit = function(req, res) {
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
	renderBlogEdit(req, res, body);
  }
  else {
	console.log(response.statusCode);
  }
 });
};

/* PUT a blog update */
module.exports.doBlogEdit = function(req, res) {
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
	res.redirect('/blog');
  }
  else {
	res.status(response.statusCode);	
  }
 });
};

/* GET 'blog-delete' page */
module.exports.blogDelete = function(req, res) {
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
	renderBlogDelete(req, res, body);
  }
  else {
	console.log(response.statusCode);
  }
 });
};

/* DELETE a blog */
module.exports.doBlogDelete = function(req, res) {
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
	res.redirect('/blog');
  }
  else {
	res.status(response.statusCode);	
  }
 });
};
