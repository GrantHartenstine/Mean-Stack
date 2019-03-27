var express = require('express');
var router = express.Router();
//var ctrlIndex = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET home page */
//router.get('/', ctrlIndex.home);

/* GET blog pages */
router.get('/blog', ctrlBlog.blogList);
router.post('/blog', ctrlBlog.blogMake);
router.get('/blog/:blogID', ctrlBlog.blogRead);
router.put('/blog/:blogID', ctrlBlog.blogUpdate);
router.delete('/blog/:blogID', ctrlBlog.blogDelete);

module.exports = router;
