var myApp = angular.module("myApp",['ngRoute','ui.bootstrap','ngCookies']);

myApp.config(['$routeProvider',
	function($routeProvider)
	{
		//*TO-DO: Change route for / to login and /home to home template
		$routeProvider.
			when('/',
			{
				templateUrl: "html/login.html",
				controller: "loginCtrl"
			}).
			when('/home',
			{
				templateUrl: "html/home.html",
				controller: "homeCtrl"
			}).
			when('/settings',
			{
				templateUrl: "html/settings.html",
				controller: "settingsCtrl"
			}).
			when('/askQues',{
				templateUrl: "html/askQues.html",
				controller: "postQuesCtrl"
			}).
			when('/question/:quesId',
			{
				templateUrl: "html/question.html",
				controller: "quesAnswerCtrl"
			}).
			when('/experts/:quesId',
			{
				templateUrl: "html/experts.html",
				controller: "expertsCtrl"
			});
	}
]);
