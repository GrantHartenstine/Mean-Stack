var app = angular.module('blogApp', ['ngRoute']);

//*** Authentication ***
app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication ($window, $http) {

	var saveToken = function (token) {
		$window.localStorage['blog-token'] = token;
	};

	var getToken = function () {
		return $window.localStorage['blog-token'];
	};

	var register = function(user) {
		console.log('Registering new user ' + user.email + ' ' + user.password);
		return $http.post('/api/register', user).success(function(data){
		  saveToken(data.token);
		});
	};

	var login = function(user) {
        	console.log('Attempting to login user ' + user.email + ' ' + user.password);
        	return $http.post('/api/login', user).success(function(data) {
            	  saveToken(data.token);
       		 });
   	 };

    	var logout = function() {
        	$window.localStorage.removeItem('blog-token');
   	 };

    	var loggedIn = function() {
        	var token = getToken();

		if(token){
            	  var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload.exp > Date.now() / 1000;
        	  } else {
           	    return false;
 		  }
	};

	var currentUser = function() {
		if(loggedIn()){
		  var token = getToken();
            	  var payload = JSON.parse($window.atob(token.split('.')[1]));
            	  return {
                    email : payload.email,
                    name : payload.name
           	  };
       		 }
	};

	return {
	  saveToken : saveToken,
	  getToken : getToken,
          register : register,
          login : login,
          logout : logout,
          loggedIn : loggedIn,
          currentUser : currentUser
    };
}

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

	.when('/register', {
            templateUrl: 'pages/register.html',
           	 controller: 'RegisterController',
           	 controllerAs: 'vm'
       		 })

	.when('/login', {
            templateUrl: 'pages/login.html',
           	controller: 'LoginController',
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


app.controller('BlogController', [ '$http', 'authentication',  function BlogController($http, authentication) {
	var vm = this;
	vm.pageHeader = {
		title: 'Blog List'
	};

	vm.loggedIn = function() {
		return authentication.loggedIn();
	}

	getAllBlogs($http)
		.success(function(data) {
			vm.blogs = data;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get list of blogs";
		});
}]);


app.controller('AddController', [ '$http', '$location', 'authentication',  function AddController($http, $location, authentication) {
	var vm = this;
	vm.blog = {};
	vm.title = "Grant Hartenstine's Blog";
	vm.pageHeader = "Blog Add";

	vm.submit = function() {
		var blogInfo = vm.blog;
		blogInfo.blogTitle = userForm.blogTitle.value;
		blogInfo.blogText = userForm.blogText.value;

		addBlog($http, blogInfo, authentication)
			.success(function(blogInfo) {
				console.log(blogInfo);
				$location.path('/blog').replace();
			})
			.error(function(e) {
				console.log(e);
			});
	};
}]);

app.controller('DeleteController', [ '$http', '$routeParams', '$location', 'authentication', function DeleteController($http, $routeParams, $location, authentication) {
	var vm = this;
	vm.blog = {};
	vm.id = $routeParams.id;
	vm.pageHeader = {
		title: 'Blog Delete'
	};

	vm.loggedIn = function(){
		return authentication.loggedIn();
	}

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

	deleteBlogById($http, vm.id, authentication)
		.success(function(blogInfo) {
			vm.message = "Blog deleted!";
			$location.path('/blog').replace();
		})
		.error(function (e) {
			vm.message = "Could not delete blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
		});
	}
}]);


app.controller('EditController', [ '$http', '$routeParams', '$location', 'authentication', function EditController($http, $routeParams, $location, authentication) {
	var vm = this;
	vm.blog = {};
	vm.title = "Grant Hartenstine's Blog";
	vm.pageHeader = "Blog Edit";
	vm.id = $routeParams.id;

	vm.loggedIn = function() {
		return authentication.loggedIn();
	}

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

		updateBlogById($http, blogInfo, vm.id, authentication)
			.success(function(blogInfo) {
				vm.message = "Blog data updated!";
				$location.path('/blog').replace();
			})
			.error(function (e) {
				vm.message = "Could not update blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
			});
	}
}]);

app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
    var vm = this;

    vm.pageHeader = 'Create a new account';

    vm.credentials = {
        name : "",
        email : "",
        password : ""
    };

    vm.returnPage = $location.search().page || '/blog';

    vm.onSubmit = function () {
        vm.formError = "";
        if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
        } else {
            vm.doRegister();
        }
    };

    vm.doRegister = function() {
        vm.formError = "";
        authentication
            .register(vm.credentials)
            .error(function(err){
                vm.formError = "Error registering. Email already registered. Try again with a different email address."
                //vm.formError = err;
            })
            .then(function(){
                $location.search('page', null);
                $location.path(vm.returnPage);
            });
    };
}]);

app.controller('LoginController', [ '$http', '$location', 'authentication', function LoginController($http, $location, authentication) {
    var vm = this;

    vm.pageHeader = 'Sign in';

    vm.credentials = {
        email : "",
        password : ""
    };

    vm.returnPage = $location.search().page || '/blog';

    vm.onSubmit = function () {
        vm.formError = "";
        if (!vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
        } else {
            vm.doLogin();
        }
    };

    vm.doLogin = function() {
        vm.formError = "";
        authentication
            .login(vm.credentials)
            .error(function(err){
                var obj = err;
                vm.formError = obj.message;
            })
            .then(function(){
                $location.search('page', null);
                $location.path(vm.returnPage);
            });
    };
}]);

function getAllBlogs($http) {
	return $http.get('/api/blog');
}

function addBlog($http, blogInfo, authentication) {
	return $http.post('/api/blog', blogInfo, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function getBlogById($http, blogID) {
	return $http.get('/api/blog/' + blogID);
}

function updateBlogById($http, blogInfo, blogID, authentication) {
	return $http.put('/api/blog/' + blogID , blogInfo, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function deleteBlogById($http, id,  authentication) {
	return $http.delete('/api/blog/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}
