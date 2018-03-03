var myApp = angular.module("myApp",['ngRoute','ui.bootstrap']);

myApp.config(['$routeProvider',
	function($routeProvider)
	{
		//*TO-DO: Change route for / to login and /home to home template
		$routeProvider.
			when('/',
			{
				templateUrl: "html/home.html",
				controller: "home"
			});
	}
]);
