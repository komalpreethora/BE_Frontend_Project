myApp.controller('searchCtrl',function($http, $q,$location, searchService, notifications, $cookies){
  var vm = this;
  vm.userid = $cookies.get('userId');

  vm.search_flag = true;
  vm.searchtext = null;
  vm.quesArr = [];
  vm.text = searchService.get();
  vm.sessionStatus = notifications.sessionStatus;
  vm.notifStatus = notifications.notifStatus;
  vm.notifArr = [];
  vm.notif_flag = true;

  var url = "http://localhost:8082/v1.0/search/"+vm.text;
  var search_deferred = $q.defer();

  $http.get(url)
  .then(function(api_search_response)
  {
    search_deferred.resolve(api_search_response);
  },
  function(api_search_response)
  {
    search_deferred.reject(api_search_response);
  });

  search_deferred.promise.then(function(api_search_response){
    if(api_search_response.data.length == 0)
      vm.search_flag = false;
    else {
      //--Form quesArr for the result of the search given
      vm.search_flag = true;
      console.log("data is: ",api_search_response.data);
      for(var ind = 0; ind < api_search_response.data.length; ind++){

        vm.quesArr.push({
          questionid: api_search_response.data[ind].questionid,
          upvote:  api_search_response.data[ind].upvote,
          downvote:  api_search_response.data[ind].downvote,
          tagnamelist: api_search_response.data[ind].tagnamelist,
          title: api_search_response.data[ind].title,
          timestamp:  api_search_response.data[ind].timestamp,
          username: api_search_response.data[ind].username
        });
      }
      console.log("Quesarr is : ",vm.quesArr);
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

  vm.search = function(){
    searchService.set(vm.searchtext);
    vm.text = searchService.get();
    vm.quesArr = [];
    url = "http://localhost:8082/v1.0/search/"+vm.text;
    var search_deferred = $q.defer();

    $http.get(url)
    .then(function(api_search_response)
    {
      search_deferred.resolve(api_search_response);
    },
    function(api_search_response)
    {
      search_deferred.reject(api_search_response);
    });

    search_deferred.promise.then(function(api_search_response){
      if(api_search_response.data.length == 0)
        vm.search_flag = false;
      else {
        //--Form quesArr for the result of the search given
        vm.search_flag = true;
        console.log("data is: ",api_search_response.data);
        for(var ind = 0; ind < api_search_response.data.length; ind++){

          vm.quesArr.push({
            questionid: api_search_response.data[ind].questionid,
            upvote:  api_search_response.data[ind].upvote,
            downvote:  api_search_response.data[ind].downvote,
            tagnamelist: api_search_response.data[ind].tagnamelist,
            title: api_search_response.data[ind].title,
            timestamp:  api_search_response.data[ind].timestamp,
            username: api_search_response.data[ind].username
          });
        }
        console.log("Quesarr is : ",vm.quesArr);
      }
    });
  };

  vm.changeView = function(newView){
    $location.path(newView);
  }
});
