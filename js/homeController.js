myApp.controller('homeCtrl',function($scope, $http, $q, $rootScope){
  //*TO-DO: Bind user id when user logs in to maintain a session
  //        Also bind page number for pagination of questions
  $scope.userid = $rootScope.userId;
  console.log("User id: ",$scope.userid);
  $scope.pageNo = 1;

  $scope.quesIArr=[];
  $scope.quesEArr=[];
  $scope.ques_e_flag = true;
  $scope.ques_i_flag = true;

  //*TO-DO: Use constant URLs
  var url ="http://localhost:8082/v1.0/user/"+$scope.userid+"/interestedquestions/"+$scope.pageNo;
  var deferred = $q.defer();

  //Fetching expertise topic questions for userid 1
  $http.get(url)
	.then(function(api_ques_i_response)
	{
		deferred.resolve(api_ques_i_response);
	},
	function(api_ques_i_response)
	{
		deferred.reject(api_ques_i_response);
	});

	deferred.promise.then(function(api_ques_i_response)
	{
		$scope.length = api_ques_i_response.data.length;
		if($scope.length === 0)
		{
			$scope.ques_i_flag = false;
		}
		else
		{
			$scope.ques_i_flag = true;
			for(var ind = 0; ind < $scope.length; ind++)
			{
				$scope.quesIArr.push({
					questionid: api_ques_i_response.data[ind].questionid,
					title: api_ques_i_response.data[ind].title,
          upvote:  api_ques_i_response.data[ind].upvote,
          downvote:  api_ques_i_response.data[ind].downvote,
          state:  api_ques_i_response.data[ind].state,
          tagnamelist: api_ques_i_response.data[ind].tagnamelist,
          timestamp:  api_ques_i_response.data[ind].timestamp,
          username: api_ques_i_response.data[ind].username
				});
			}
		}
	});


  url ="http://localhost:8082/v1.0/user/"+$scope.userid+"/expertisequestions/"+$scope.pageNo;
  var deferred1 = $q.defer();

  //Fetching expertise topic questions for userid 1
  $http.get(url)
	.then(function(api_expertise_response)
	{
    deferred1.resolve(api_expertise_response);
	},
	function(api_expertise_response)
	{
		deferred1.reject(api_expertise_response);
	});

	deferred1.promise.then(function(api_ques_e_response)
	{
		$scope.length = api_ques_e_response.data.length;
    if($scope.length === 0)
		{
			$scope.ques_e_flag = false;
		}
		else
		{
			$scope.ques_e_flag = true;
			for(var ind = 0; ind < $scope.length; ind++)
			{
				$scope.quesEArr.push({
					questionid: api_ques_e_response.data[ind].questionid,
					title: api_ques_e_response.data[ind].title,
          upvote:  api_ques_e_response.data[ind].upvote,
          downvote:  api_ques_e_response.data[ind].downvote,
          state:  api_ques_e_response.data[ind].state,
          tagnamelist: api_ques_e_response.data[ind].tagnamelist,
          timestamp:  api_ques_e_response.data[ind].timestamp,
          username: api_ques_e_response.data[ind].username
				});
			}
		}
	});

});
