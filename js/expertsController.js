myApp.controller('expertsCtrl',function($scope, $http, $q, $route, $routeParams, $rootScope){

  var vm = this;
  vm.quesId = $routeParams.quesId;
  vm.userid = $rootScope.userId;

  console.log("Que id rcvd is: ",vm.quesId);
});
