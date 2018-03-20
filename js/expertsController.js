myApp.controller('expertsCtrl',function($scope, $http, $q, $route, $routeParams, $cookies, $location, searchService, notifications){

  var vm = this;
  vm.sessionStatus = notifications.sessionStatus;
  vm.notifStatus = notifications.notifStatus;
  vm.quesId = $routeParams.quesId;
  vm.userid = $cookies.get('userId');

  vm.expert_flag = false;
  vm.expertArr = [];
  vm.btnDE = [];
  vm.btnPE = [];
  vm.error_flag = false;
  vm.searchtext = null;
  vm.notifArr = [];
  vm.notif_flag = true;

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

  //--Fetching notifications to display in dropdown menu(max. 3)
  url="http://localhost:8082/v1.0/notification/"+vm.userid+"/1";
  var notif_deferred = $q.defer();

  $http.get(url)
  .then(function(api_notif_response)
  {
    notif_deferred.resolve(api_notif_response);
  },
  function(api_notif_response)
  {
    notif_deferred.reject(api_notif_response);
  });

  notif_deferred.promise.then(function(api_notif_response)
  {
    vm.return_notif = notifications.getNotifications(vm.userid, api_notif_response);
    if(vm.return_notif.len == 0)
    {
      //if no notifications
      vm.notif_flag = false;
      vm.notif_length = "";
      vm.notifArr = vm.return_notif.notifArr;
    }
    else {
      vm.notif_length = vm.return_notif.len;
      vm.notif_flag = true;
      vm.notifArr = vm.return_notif.notifArr;
    }
  });

  //--To toggle between classes of buttons
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
      var url1 = "http://localhost:8082/v1.0/negotiate";
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

    //--Changing status for type 2 & 3 of notifications
    //--for ntypes 2 and 3 mark as read as soon as dropdown is toggled!
    vm.onClickNotif = function(){
      console.log("Reached onClickNotif function");
      console.log(vm.notifArr);
      for(var i = 0; i < vm.notifArr.length; i++){
        if((vm.notifArr[i].ntype === 'requeststatus' || vm.notifArr[i].ntype === 'discussion') && vm.notifArr[i].state === 'unread'){
          console.log("For ",vm.notifArr[i].nid);
          url = "http://localhost:8082/v1.0/notification/markread/"+vm.notifArr[i].nid;
          var status_deferred = $q.defer();
      	  $http.get(url)
      	  .then(function(api_status_response)
      	  {
      	  	status_deferred.resolve(api_status_response);
      	    console.log("Marked read for notification:",vm.notifArr[i].nid);
      	  },
      	  function(api_status_response)
      	  {
      	    status_deferred.reject(api_status_response);
      	  });
        }
      }
    };

  vm.search = function(){
    searchService.set(vm.searchtext);
    vm.changeView('/search')
  };

  vm.changeView = function(newView){
  	$location.path(newView);
  };
});
