myApp.controller('homeCtrl',function($scope, $http, $q, $cookies, $location, $uibModal, notifications, searchService, session){

  //*TO-DO: Use constant URLs or use a URL builder
  var vm = this;
  vm.sessionStatus = notifications.sessionStatus;
  vm.notifStatus = notifications.notifStatus;
  vm.userid = $cookies.get('userId');
  vm.page_int = 1;
  vm.page_expert = 1;

  vm.searchtext = null;
  vm.quesIArr=[];
  vm.quesEArr=[];
  vm.pageEActive = [];
  vm.pageIActive = [];
  vm.notifArr = [];
  vm.ques_e_flag = true;
  vm.ques_i_flag = true;
  vm.notif_flag = true;

  var url = "http://localhost:8082/v1.0/pageno/interested/"+vm.userid;
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
    vm.page_int = api_page_response.data;

    vm.pageIArr = [];
    for(var ind = 1; ind <= vm.page_int; ind++)
    {
      vm.pageIArr.push({
        id: ind
      });
      vm.pageIActive[ind] = false;
    }
    vm.pageIActive[1] = true;
  });

  url = "http://localhost:8082/v1.0/pageno/expertise/"+vm.userid;
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
    vm.page_expert = api_page_response.data;
    vm.pageEArr = [];
    for(var ind = 1; ind <= vm.page_expert; ind++)
    {
      vm.pageEArr.push({
        id: ind
      });
      vm.pageEActive[ind] = false;
    }
    vm.pageEActive[1] = true;
  });

  url ="http://localhost:8082/v1.0/user/"+vm.userid+"/interestedquestions/1";
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
		vm.length = api_ques_i_response.data.length;
		if(vm.length === 0)
		{
			vm.ques_i_flag = false;
		}
		else
		{
			vm.ques_i_flag = true;
			for(var ind = 0; ind < vm.length; ind++)
			{
				vm.quesIArr.push({
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


  url ="http://localhost:8082/v1.0/user/"+vm.userid+"/expertisequestions/1";
  var deferred1 = $q.defer();

  //Fetching expertise topic questions for user with userid
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
		vm.length = api_ques_e_response.data.length;
    if(vm.length === 0)
		{
			vm.ques_e_flag = false;
		}
		else
		{
			vm.ques_e_flag = true;
			for(var ind = 0; ind < vm.length; ind++)
			{
				vm.quesEArr.push({
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
      console.log("Received notifArr as: ",vm.notifArr);
    }
  });

  //--For pagination of expert questions
  vm.expertCards = function(page_no){
    //--Get page no clicked
    //--Change active page value to true and rest to false
    for(var i = 0; i < vm.pageEActive.length; i++)
      vm.pageEActive[i] = false;

    vm.pageEActive[page_no] = true;

    url ="http://localhost:8082/v1.0/user/"+vm.userid+"/expertisequestions/"+page_no;
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
  		vm.length = api_ques_e_response.data.length;
      if(vm.length === 0)
  		{
  			vm.ques_e_flag = false;
  		}
  		else
  		{
  			vm.ques_e_flag = true;
        vm.quesEArr = [];
  			for(var ind = 0; ind < vm.length; ind++)
  			{
  				vm.quesEArr.push({
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

  vm.interestCards = function(page_no){
    //--Get page no clicked
    //--Change active page value to true and rest to false
    for(var i = 0; i < vm.pageIActive.length; i++)
      vm.pageIActive[i] = false;

    vm.pageIActive[page_no] = true;

    url ="http://localhost:8082/v1.0/user/"+vm.userid+"/interestedquestions/"+page_no;
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
      vm.length1 = api_interest_response.data.length;
      if(vm.length1 === 0)
      {
        vm.ques_i_flag = false;
      }
      else
      {
        vm.ques_i_flag = true;
        vm.quesIArr = [];
        for(var ind = 0; ind < vm.length1; ind++)
        {
          vm.quesIArr.push({
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

  vm.search = function(){
    searchService.set(vm.searchtext);
    vm.changeView('/search')
  };

  //--Changing status for type 2 & 3 of notifications
  //--for ntypes 2 and 3 mark as read as soon as dropdown is toggled!
  vm.onClickNotif = function(){
    console.log("Reached onClickNotif function");
    console.log(vm.notifArr);
    for(var i = 0; i < vm.notifArr.length; i++){
      if((vm.notifArr[i].ntype === 'requeststatus') && vm.notifArr[i].state === 'unread'){
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

  vm.startModal = function(qid, other_userid){
    //pass qid, userid, other_userid for connecting with websocket
    console.log("in startmodal");
  };

  vm.logoutUser = function(){
    $cookies.remove('userId');
    vm.changeView('/');
  };

  vm.changeView = function(newView){
    $location.path(newView);
  }

  //TESTING modal
  vm.animationsEnabled = true;
  //function to open modal and also create session
  vm.open = function (size, qid, title, otheruserid, otherusername) {
    console.log("Received ",qid,", ",otheruserid," and ",otherusername," for modal!");

    vm.sessionid = 0;
    vm.username = $cookies.get('userName');
    //console.log("Got username: ",vm.username);
    //--Connect this user and other user and also send() to generate sessionid for further messages
    connect(vm.username, vm.userid, otherusername, otheruserid, qid);

    //--Remove when want to make static
    url = "http://localhost:8083/sessionid/"+vm.userid+"/"+otheruserid+"/"+qid;
    var session_deferred = $q.defer();

    $http.get(url)
    .then(function(api_session_response)
    {
      session_deferred.resolve(api_session_response);
    })
    .catch(function(api_session_response){
      session_deferred.reject(api_session_response);
    });

    session_deferred.promise.then(function(api_session_response){
      vm.sessionid = session.getSessionId(api_session_response);
      console.log("Connecting users: ",vm.userid,":",vm.username," and ",otheruserid,":",otherusername," for sessionid: ",vm.sessionid);

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        appendTo: undefined,
        resolve: {
          qid: function(){
            return qid;
          },
          quesTitle: function(){
            return title;
          },
          userid: function(){
            return vm.userid;
          },
          otheruserid: function(){
            return otheruserid;
          },
          sessionid: function(){
            return vm.sessionid; //2;
          }
        }
      });

      //result is resolved when modal is closed and rejected when modal is dismissed
      modalInstance.result.then(function (selectedItem) {
        vm.selected = selectedItem;
      }, function () {
      //  console.log('Modal dismissed at: ' + new Date());
      });
    });
  };

});

var scopeHolder;
myApp.controller('ModalInstanceCtrl', function ($http, $q, $uibModalInstance, qid, quesTitle, userid, otheruserid, sessionid) {
  scopeHolder = this;
  var $ctrl = this;

  $ctrl.messages = []; //for storing all text received in the websocket
  $ctrl.textToSend = "";
  $ctrl.qid = qid;
  $ctrl.quesTitle = quesTitle;
  $ctrl.owneruserid = userid;
  $ctrl.otheruserid = otheruserid;
  $ctrl.sessionid = sessionid;
  $ctrl.sendText = function(){

  //Sessionid for now is 2 only
  console.log("Received so much: ",qid, quesTitle, userid, otheruserid, sessionid);

    //for testing purposes 2,6 userids are considered
    //console.log("-->Text to send is: ",$ctrl.textToSend);
    //console.log("Sending from ",$ctrl.owneruserid," to ",$ctrl.otheruserid);
    sendName($ctrl.sessionid, $ctrl.owneruserid,$ctrl.otheruserid, $ctrl.textToSend);

    //clear textarea after clicking send button
    $ctrl.textToSend="";
  };

  $ctrl.appendMsg = function(sender, message, receiver){

    console.log("Sending ",message," from ",sender," to ",receiver);
    if(sender == $ctrl.owneruserid)
    {
      $ctrl.messages.push({
        text: message,
        type: 1
      });
    }
    else {
      $ctrl.messages.push({
        text:message,
        type: 2
      })
    }
    console.log("Messages: ",$ctrl.messages);
  };

  $ctrl.ok = function () {
    //console.log("Hi I'm okay")
    //Closing session by calling disconnect
    disconnect();
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
