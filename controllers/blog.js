/* GET home page */
module.exports.blogList = function(req, res){
  res.render('blog', {title: 'Blog List' });
};

/* GET home page */
module.exports.addBlog = function(req, res) {
  res.render('addBlog', {title: 'Add Blog' });
};
