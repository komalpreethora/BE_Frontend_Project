myApp.controller('expertsCtrl',function($scope, $http, $q, $route, $routeParams, $cookies, $location){

  var vm = this;
  vm.quesId = $routeParams.quesId;
  vm.userid = $cookies.get('userId');

  vm.expert_flag = false;
  vm.expertArr = [];
  vm.btnDE = [];
  vm.btnPE = [];
  vm.error_flag = false;

  var url = "http://localhost:8080/v1.0/experts/"+vm.quesId;
  var deferred = $q.defer();

  $http.get(url)
	.then(function(api_ques_i_response)
	{
		deferred.resolve(api_ques_i_response);
  },
	function(api_ques_i_response)
	{
		deferred.reject(api_ques_i_response);
	});

	deferred.promise.then(function(api_expert_response)
	{
		if(api_expert_response.length === 0)
		{
			vm.expert_flag = false;
		}
		else
		{
			vm.expert_flag = true;
      console.log("api_expert_response: ",api_expert_response.data);
			for(var ind = 0; ind < api_expert_response.data.length; ind++)
			{
        vm.btnDE[ind] = true;
        vm.btnPE[ind] = false;
        console.log("For this iteration: ",api_expert_response.data[ind].preference);
        if(api_expert_response.data[ind].preference.startTime == null)
        {
          vm.expertArr.push({
            e_ind: ind,
            userid: api_expert_response.data[ind].id,
            username: api_expert_response.data[ind].username,
            start_time: "---",
            lang: api_expert_response.data[ind].preference.communicationLang,
            answer_count: api_expert_response.data[ind].answercount
          });
        }
        else {
				  vm.expertArr.push({
            e_ind: ind,
            userid: api_expert_response.data[ind].id,
            username: api_expert_response.data[ind].username,
            start_time: api_expert_response.data[ind].preference.startTime,
            lang: api_expert_response.data[ind].preference.communicationLang,
            answer_count: api_expert_response.data[ind].answercount
				  });
        }
			}
      console.log("Expert arr: ",vm.expertArr);
		}
	});

  vm.buttonEClick = function(param_ind){
    if(vm.btnDE[param_ind] == true){
      vm.btnDE[param_ind] = false;
      vm.btnPE[param_ind] = true;
    }
    else {
      vm.btnDE[param_ind] = true;
      vm.btnPE[param_ind] = false;
    }
  };

  vm.submitExperts = function(param_ind){
    var count = 0;
    for(var ind = 0; ind < vm.btnPE.length; ind++)
    {
      if(vm.btnPE[ind] == false)
        count++;
    }
    if(count == vm.btnPE.length)
    {
      //If no experts selected then show error message
      vm.error_msg = "Please select atleast one expert.";
      vm.error_flag = true;
    }
    else {
      //If experts selected post the user's choice and change link to question page
      var url1 = "http://localhost:8080/v1.0/negotiate";
      for(var ind = 0; ind < vm.btnPE.length; ind++)
      {
        if(vm.btnPE[ind] == true)
        {
          var data = {};
          var negotiate_deferred = $q.defer();
          var data = {
            seekerid: vm.userid,
            expertid: vm.expertArr[ind].userid,
            questionid: vm.quesId,
            messagestatus: 0
          };
          $http.post(url1,JSON.stringify(data))
          .then(function(api_response)
          {
            deferred.resolve(api_response);
            console.log(api_response.status, api_response.data);
          },
          function(api_response)
          {
            deferred.reject(api_response);
          });
        }
      }
      vm.changeView('/question/'+vm.quesId);
    }
  };

  vm.changeView = function(newView){
  	$location.path(newView);
  };
});
