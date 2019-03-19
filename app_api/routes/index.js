var express = require('express');
var router = express.Router();
//var ctrlIndex = require('../controllers/home');
var ctrlBlog = require('../controllers/blogs');

/* GET home page */
//router.get('/', ctrlIndex.home);

/* GET blog pages */
router.get('/blogs', ctrlBlog.blogList);
router.post('/blogs', ctrlBlog.blogMake);
router.get('/blogs/:blogID', ctrlBlog.blogRead);
router.put('/blogs/:blogID', ctrlBlog.blogUpdate);
router.delete('/blogs/:blogID', ctrlBlog.blogDelete);

module.exports = router;
