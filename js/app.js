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
			}).
			when('/notifications',
			{
				templateUrl: "html/notifications.html",
				controller: "notifCtrl"
			}).
			when('/search',
			{
				templateUrl: "html/search.html",
				controller: "searchCtrl"
			});
	}
]);

//--Factory for handling search
myApp.factory('searchService',function(){
	var searchText = {}

	function set(search_text){
		searchText = search_text;
		console.log("Stored text ",searchText);
	}

	function get(){
		return searchText;
	}

	return{
		set: set,
		get: get
	}
});

//--Service for handling notifications
myApp.factory('notifications',function($http, $q){
	//returns array of notifications (max. 3) belonging to this user
	function getNotifications(userid, api_notif_response){
		console.log("In getNotifications function");
	    if(api_notif_response.data.length != 0)
			{
				console.log(api_notif_response.data);
				var notif_arr = [];
				var notif_len = 0;

				for(var i = 0; i < api_notif_response.data.length; i++){
					if(notif_len == 3)
						break;
					else{
						notif_len++;
						console.log("ith- ",i,":",api_notif_response.data[i]);
						if(api_notif_response.data[i].state === "unread"){
							notif_len++;
							var msg = "";
							var temp_link = "";

							if(api_notif_response.data[i].ntype === "seekerrequest"){
								msg = "User "+api_notif_response.data[i].username+" is requesting a session for question: '"+api_notif_response.data[i].questiontitle+"' at: "+api_notif_response.data[i].prefferedtimestamp+".";
								temp_link = "#!/question/"+api_notif_response.data[i].questionid;
							}
							else if(api_notif_response.data[i].ntype === "answer"){
								msg = "User "+api_notif_response.data[i].username+" has answered your question: '"+api_notif_response.data[i].questiontitle+"'";
								temp_link = "#!/question/"+api_notif_response.data[i].questionid;
							}
							else if(api_notif_response.data[i].ntype === "requeststatus"){
								msg = "Expert "+api_notif_response.data[i].username+" has accepted your session request for question: '"+api_notif_response.data[i].questiontitle+"'";
								temp_link = null;
							}
							else{
								msg = "Your session for question: '"+api_notif_response.data[i].questiontitle+"' is now starting!";
								temp_link = null;
							}

							notif_arr.push({
								ntype: api_notif_response.data[i].ntype,
								nid: api_notif_response.data[i].notificationid,
								qid: api_notif_response.data[i].questionid,
								state: api_notif_response.data[i].state,
								message: msg,
								link: temp_link
							});
						}
					}
				};//end of for
				returnobj = {
					notifArr: notif_arr,
					len: notif_arr.length
				};
			}//end of if
			else {
				returnobj = {
					notifArr: [],
					len: 0
				};
			}
			console.log("Returning object: ",returnobj);
			return returnobj;
	};

	//--Function to return all notifications in the response(read+unread)
	function getAllNotifications(userid, api_notif_response){
		console.log("In getAllNotifications function");
	    if(api_notif_response.data.length != 0)
			{
				console.log(api_notif_response.data);
				var notif_arr = [];

				for(var i = 0; i < api_notif_response.data.length; i++){
					var msg = "";
					var temp_link = "";

					if(api_notif_response.data[i].ntype === "seekerrequest"){
						msg = "User "+api_notif_response.data[i].username+" is requesting a session for question: '"+api_notif_response.data[i].questiontitle+"' at: "+api_notif_response.data[i].prefferedtimestamp+".";
						temp_link = "#!/question/"+api_notif_response.data[i].questionid;
					}
					else if(api_notif_response.data[i].ntype === "answer"){
						msg = "User "+api_notif_response.data[i].username+" has answered your question: '"+api_notif_response.data[i].questiontitle+"'";
						temp_link = "#!/question/"+api_notif_response.data[i].questionid;
					}
					else if(api_notif_response.data[i].ntype === "requeststatus"){
						msg = "Expert "+api_notif_response.data[i].username+" has accepted your session request for question: '"+api_notif_response.data[i].questiontitle+"'";
						temp_link = null;
					}
					else{
						msg = "Your session for question: '"+api_notif_response.data[i].questiontitle+"' is now starting!";
						temp_link = null;
					}

					notif_arr.push({
						ntype: api_notif_response.data[i].ntype,
						nid: api_notif_response.data[i].notificationid,
						qid: api_notif_response.data[i].questionid,
						state: api_notif_response.data[i].state,
						message: msg,
						link: temp_link
					});
				};//end of for
				returnobj = {
					notifArr: notif_arr,
					len: notif_arr.length
				};
			}//end of if
			else {
				returnobj = {
					notifArr: [],
					len: 0
				};
			}
			console.log("Returning object: ",returnobj);
			return returnobj;
	};




	//for changing negotiation message status as accepted or rejected
	//1-accept
	//2-reject
	function sessionStatus(nid, userid, qid, status){
		console.log("Called sessionStatus");
    var url = "http://localhost:8082/v1.0/negotiate/changestatus";
		var ss_deferred = $q.defer();

		var data = {
      messageid: null,
      seekerid: null,
      questionid: qid,
      expertid: userid,
      messagestatus: status
    };
    console.log("For session status: ",status, ", data is: ",data);
    $http.put(url, JSON.stringify(data))
    .then(function(api_status_response)
    {
      ss_deferred.resolve(api_status_response);
    })
    .catch(function(api_status_response)
    {
      ss_deferred.reject(api_status_response);
    });

		url = "http://localhost:8082/v1.0/notification/markread/"+nid;
		var status_deferred = $q.defer();
		$http.get(url)
		.then(function(api_status_response)
		{
			status_deferred.resolve(api_status_response);
			console.log("Marked read for notification:",nid);
		},
		function(api_status_response)
		{
			status_deferred.reject(api_status_response);
		});
	};

	//for marking status as read for notification with id nid
	function notifStatus(nid){
		console.log("Called notifStatus");
		var url = "http://localhost:8082/v1.0/notification/markread/"+nid;
	  var status_deferred = $q.defer();
	  $http.get(url)
	  .then(function(api_status_response)
	  {
	  	status_deferred.resolve(api_status_response);
	    console.log("Marked read for notification:",nid);
	  },
	  function(api_status_response)
	  {
	    status_deferred.reject(api_status_response);
	  });
	};

	return {
		notifStatus: notifStatus,
		getNotifications: getNotifications,
		sessionStatus: sessionStatus,
		getAllNotifications: getAllNotifications
	};

});
