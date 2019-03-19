/* GET blog page */
module.exports.blogList = function(req, res) {
    res.render('blog', {
        title: 'Blog List',
        blogList: [{
          blogTitle: 'My First Attempt.',
          blogText: 'If you can read this I was successful.',
          createdOnDate: '02-24-2019, 9:00PM'
        }, {
          blogTitle: 'A Second Attempt.',
          blogText: 'Blogging is bad, making blog sites is not.',
          createdOnDate: '02-24-2019, 9:07PM'
	    }, {
          blogTitle: 'A Third Attempt.',
          blogText: 'Orange Man Bad.',
          createdOnDate: '02-24-2019, 9:15 PM'
	    }]
    });
};

/* GET blog add page */
module.exports.blogAdd = function(req, res) {
  res.render('blog-add', {title: 'Add Blog' });
};

/* GET blog delete page */
module.exports.blogDelete = function(req, res) {
  res.render ('blog-delete', {title: 'Delete Blog' });
};
/* GET blog edit page */
module.exports.blogEdit = function(req, res) {
  res.render ('blog-edit', {title: 'Edit Blog' });
};
