var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});
//var ctrlIndex = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');
var ctrlAuth = require('../controllers/authentication');

/* GET home page */
//router.get('/', ctrlIndex.home);

/* GET blog pages */
router.get('/blog', ctrlBlog.blogList);
router.post('/blog', auth, ctrlBlog.blogMake);
router.get('/blog/:blogID', ctrlBlog.blogRead);
router.put('/blog/:blogID', auth, ctrlBlog.blogUpdate);
router.delete('/blog/:blogID', auth, ctrlBlog.blogDelete);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
