myApp.controller('notifCtrl',function($scope, $q, $http, $cookies, $location, searchService, notifications){
  var vm = this;
  vm.userid = $cookies.get('userId');
  vm.searchtext = null;
  vm.pageActive = [];

  vm.sessionStatus = notifications.sessionStatus;
  vm.notifStatus = notifications.notifStatus;

  //--To get number of pages for this user's notifications
  var url = "http://localhost:8082/v1.0/pageno/notifications/"+vm.userid;
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
    vm.pageArr = [];
    for(var ind = 1; ind <= api_page_response.data; ind++)
    {
      vm.pageArr.push({
        id: ind
      });
      vm.pageActive[ind] = false;
    }
    vm.pageActive[1] = true;
  });

  console.log("Pagearr is: ",vm.pageArr);

  //--To get notifications for page number 1 only
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
    vm.return_notif = notifications.getAllNotifications(vm.userid, api_notif_response);
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

      //--Mark messages of type 2 and 3 as read if they are unread
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
    }
    console.log("Notif arr found is: ",vm.notifArr);
  });

  vm.notificationsPaging = function(page_no){
    //--Get page no clicked
    //--Change active page value to true and rest to false
    for(var i = 0; i < vm.pageActive.length; i++)
      vm.pageActive[i] = false;

    vm.pageActive[page_no] = true;

    url="http://localhost:8082/v1.0/notification/"+vm.userid+"/"+page_no;
    var notif_page_deferred = $q.defer();

    $http.get(url)
    .then(function(api_notif_response)
    {
      notif_page_deferred.resolve(api_notif_response);
    },
    function(api_notif_response)
    {
      notif_page_deferred.reject(api_notif_response);
    });

    notif_page_deferred.promise.then(function(api_notif_response)
    {
      vm.return_notif = notifications.getAllNotifications(vm.userid, api_notif_response);
      vm.notifArr = [];
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

        //--Mark messages of type 2 and 3 as read if they are unread
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
      }
      console.log("Notif arr found is: ",vm.notifArr);
    });

  };

  vm.startModal = function(qid, other_userid){
    //pass qid, userid, other_userid for connecting with websocket
  };
  
  vm.search = function(){
    searchService.set(vm.searchtext);
    vm.changeView('/search')
  };

  vm.changeView = function(newView){
    $location.path(newView);
  };

});
