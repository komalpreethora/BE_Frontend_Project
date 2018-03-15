myApp.controller('homeCtrl',function($scope, $http, $q, $cookies, $location){
  //*TO-DO: Use constant URLs

  $scope.userid = $cookies.get('userId');
  console.log("User id: ",$scope.userid);
  $scope.page_int = 1;
  $scope.page_expert = 1;

  $scope.quesIArr=[];
  $scope.quesEArr=[];
  $scope.pageEActive = [];
  $scope.pageIActive = [];
  $scope.ques_e_flag = true;
  $scope.ques_i_flag = true;

  var url = "http://localhost:8082/v1.0/pageno/interested/"+$scope.userid;
  var page_int_deferred = $q.defer();
  $http.get(url)
  .then(function(api_page_response)
  {
    page_int_deferred.resolve(api_page_response);
  },
  function(api_page_response)
  {
    page_int_deferred.reject(api_page_response);
  });

  page_int_deferred.promise.then(function(api_page_response)
  {
    console.log("Int: "+api_page_response.data);
    $scope.page_int = api_page_response.data;

    $scope.pageIArr = [];
    for(var ind = 1; ind <= $scope.page_int; ind++)
    {
      $scope.pageIArr.push({
        id: ind
      });
      $scope.pageIActive[ind] = false;
    }
    $scope.pageIActive[1] = true;
    console.log("pageIArr: ",$scope.pageIArr);
  });

  url = "http://localhost:8082/v1.0/pageno/expertise/"+$scope.userid;
  var page_exp_deferred = $q.defer();
  $http.get(url)
  .then(function(api_page_response)
  {
    page_exp_deferred.resolve(api_page_response);
  },
  function(api_page_response)
  {
    page_exp_deferred.reject(api_page_response);
  });

  page_exp_deferred.promise.then(function(api_page_response)
  {
    console.log("Exp: "+api_page_response.data);
    $scope.page_expert = api_page_response.data;
    $scope.pageEArr = [];
    for(var ind = 1; ind <= $scope.page_expert; ind++)
    {
      $scope.pageEArr.push({
        id: ind
      });
      $scope.pageEActive[ind] = false;
    }
    $scope.pageEActive[1] = true;
    console.log("pageEArr: ",$scope.pageEArr);
  });

  url ="http://localhost:8082/v1.0/user/"+$scope.userid+"/interestedquestions/1";
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


  url ="http://localhost:8082/v1.0/user/"+$scope.userid+"/expertisequestions/1";
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

  $scope.expertCards = function(page_no){
    //--Get page no clicked
    //--Change active page value to true and rest to false
    console.log("Clicked: ",page_no);
    for(var i = 0; i < $scope.pageEActive.length; i++)
      $scope.pageEActive[i] = false;

    $scope.pageEActive[page_no] = true;
    console.log("Array is : ",$scope.pageEActive);

    url ="http://localhost:8082/v1.0/user/"+$scope.userid+"/expertisequestions/"+page_no;
    var expert_ques_deferred = $q.defer();

    //Fetching expertise topic questions for userid 1
    $http.get(url)
  	.then(function(api_expertise_response)
  	{
      expert_ques_deferred.resolve(api_expertise_response);
  	},
  	function(api_expertise_response)
  	{
  		expert_ques_deferred.reject(api_expertise_response);
  	});

  	expert_ques_deferred.promise.then(function(api_ques_e_response)
  	{
  		$scope.length = api_ques_e_response.data.length;
      if($scope.length === 0)
  		{
  			$scope.ques_e_flag = false;
  		}
  		else
  		{
  			$scope.ques_e_flag = true;
        $scope.quesEArr = [];
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

  };

  $scope.interestCards = function(page_no){
    //--Get page no clicked
    //--Change active page value to true and rest to false
    console.log("Clicked I: ",page_no);
    for(var i = 0; i < $scope.pageIActive.length; i++)
      $scope.pageIActive[i] = false;

    $scope.pageIActive[page_no] = true;
    console.log("Array I is : ",$scope.pageIActive);

    url ="http://localhost:8082/v1.0/user/"+$scope.userid+"/interestedquestions/"+page_no;
    var interest_ques_deferred = $q.defer();

    //Fetching expertise topic questions for userid 1
    $http.get(url)
    .then(function(api_interest_response)
    {
      interest_ques_deferred.resolve(api_interest_response);
    },
    function(api_interest_response)
    {
      interest_ques_deferred.reject(api_interest_response);
    });

    interest_ques_deferred.promise.then(function(api_interest_response)
    {
      $scope.length1 = api_interest_response.data.length;
      if($scope.length1 === 0)
      {
        $scope.ques_i_flag = false;
      }
      else
      {
        $scope.ques_i_flag = true;
        $scope.quesIArr = [];
        for(var ind = 0; ind < $scope.length1; ind++)
        {
          $scope.quesIArr.push({
            questionid: api_interest_response.data[ind].questionid,
            title: api_interest_response.data[ind].title,
            upvote:  api_interest_response.data[ind].upvote,
            downvote:  api_interest_response.data[ind].downvote,
            state:  api_interest_response.data[ind].state,
            tagnamelist: api_interest_response.data[ind].tagnamelist,
            timestamp:  api_interest_response.data[ind].timestamp,
            username: api_interest_response.data[ind].username
          });
        }
      }
    });

  };

  $scope.logoutUser = function(){
    $cookies.remove('userId');
    $scope.changeView('/');
  };

  $scope.changeView = function(newView){
    $location.path(newView);
  }

});
