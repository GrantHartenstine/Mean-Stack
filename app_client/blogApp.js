var app = angular.module('blogApp', ['ngRoute']);

//*** Router Provider ***
app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
	      templateUrl: 'pages/home.html',
		  controller: 'HomeController',
		  controllerAs: 'vm'
		  })

      .when('/blog', {
	      templateUrl: 'pages/blog.html',
		  controller : 'BlogController',
		  controllerAs: 'vm'
		  })

      .when('/blog-add', {
	      templateUrl: 'pages/blog-add.html',
		  controller: 'AddController',
		  controllerAs: 'vm'
		  })

        .when('/blog-edit/:id', {
	      templateUrl: 'pages/blog-edit.html',
		  controller: 'EditController',
		  controllerAs: 'vm'
		  })

	.when('/blog-delete/:id', {
	      templateUrl: 'pages/blog-delete.html',
		  controller: 'DeleteController',
		  controllerAs: 'vm'
		  })

      .otherwise({redirectTo: '/'});
    });

//*** Controllers ***

app.controller('HomeController', function HomeController() {
     var vm = this;
     vm.pageHeader = {
	title: "Grant Hartenstine's Blog Site"
     };
     vm.message = "Hello and welcome to my blog page. I am a student at Millersville University. I also work there as the Unified Communications Specialist. I am in the second half of my junior year.";
});


app.controller('BlogController', function BlogController($http) {
	var vm = this;
	vm.pageHeader = {
		title: 'Blog List'
	};

	getAllBlogs($http)
		.success(function(data) {
			vm.blogs = data;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get list of blogs";
		});
});


app.controller('AddController', [ '$http', '$location', function AddController($http, $location) {
	var vm = this;
	vm.blog = {};
	vm.title = "Grant Hartenstine's Blog";
	vm.pageHeader = "Blog Add";

	vm.submit = function() {
		var blogInfo = vm.blog;
		blogInfo.blogTitle = userForm.blogTitle.value;
		blogInfo.blogText = userForm.blogText.value;

		addBlog($http, blogInfo)
			.success(function(blogInfo) {
				console.log(blogInfo);
				$location.path('/blog').replace();
			})
			.error(function(e) {
				console.log(e);
			});
	};
}]);

app.controller('DeleteController', [ '$http', '$routeParams', '$location', function DeleteController($http, $routeParams, $location) {
	var vm = this;
	vm.blog = {};
	vm.id = $routeParams.id;
	vm.pageHeader = {
		title: 'Blog Delete'
	};

	getBlogById($http, vm.id)
		.success(function(blogInfo) {
			vm.blog = blogInfo;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get blog given id of " + vm.id;
		})

	vm.submit = function() {
		var blogInfo = vm.blog;

	deleteBlogById($http, vm.id)
		.success(function(blogInfo) {
			vm.message = "Blog deleted!";
			$location.path('/blog').replace();
		})
		.error(function (e) {
			vm.message = "Could not delete blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
		});
	}
}]);


app.controller('EditController', [ '$http', '$routeParams', '$location', function EditController($http, $routeParams, $location) {
	var vm = this;
	vm.blog = {};
	vm.title = "Grant Hartenstine's Blog";
	vm.pageHeader = "Blog Edit";
	vm.id = $routeParams.id;

	getBlogById($http, vm.id)
		.success(function(blogInfo) {
			vm.blog = blogInfo;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get blog given id of " + vm.id;
		})

	vm.submit = function() {
		var blogInfo = {};
		blogInfo.blogTitle = userForm.blogTitle.value;
		blogInfo.blogText = userForm.blogText.value;

		updateBlogById($http, blogInfo, vm.id)
			.success(function(blogInfo) {
				vm.message = "Blog data updated!";
				$location.path('/blog').replace();			})
			.error(function (e) {
				vm.message = "Could not update blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
			});
	}
}]);


function getAllBlogs($http) {
	return $http.get('/api/blog');
}

function addBlog($http, blogInfo, authentication) {
	return $http.post('/api/blog', blogInfo { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function getBlogById($http, blogID) {
	return $http.get('/api/blog/' + blogID);
}

function updateBlogById($http, authentication, blogInfo, blogID) {
	return $http.put('/api/blog/' + blogID , blogInfo, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function deleteBlogById($http, authentication,  id) {
	return $http.delete('/api/blog/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}
