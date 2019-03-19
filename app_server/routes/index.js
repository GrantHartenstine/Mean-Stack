var express = require('express');
var router = express.Router();
var ctrlIndex = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET home page */
router.get('/', ctrlIndex.home);

/* GET blog pages */
router.get('/blog-list', ctrlBlog.blogList);

router.get('/blog-add', ctrlBlog.addBlog);
router.post('/blog-add', ctrlBlog.doAddBlog);

router.get('/blog-edit/:blogID', ctrlBlog.blogEdit);
router.post('/blog-edit/:blogID', ctrlBlog.doBlogEdit);

router.get('/blog-delete/:blogID', ctrlBlog.blogDelete);
router.post('/blog-delete/:blogID', ctrlBlog.doBlogDelete);

module.exports = router;
