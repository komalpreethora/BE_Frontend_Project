myApp.controller('settingsCtrl',function($scope,$q,$http,$rootScope){

  //TO-DO: Bind userid to login

  $scope.userid = $rootScope.userId;
  $scope.isEditable = true; //for enabling editing of personal details+preferences
  $scope.isEditableE = true; //for enabling editing of expertise tab info
  $scope.isEditableI = true; //for enabling editing of interest tab info
  $scope.buttonText = "Enable Editing";
  $scope.buttonTextE = "Enable Editing";
  $scope.buttonTextI = "Enable Editing";
  $scope.btnDE = [];
  $scope.btnPE = [];
  $scope.btnDI = [];
  $scope.btnPI = [];
  $scope.topicArr = []; //for storing name,id of all topics in system
  $scope.topicIdE = []; //for storing user expertise topic id
  $scope.topicE = []; //for storing name,id of user's expertise topics
  $scope.topicIdI = []; //for storing user interest topic id
  $scope.topicI = []; //for storing name,id of user's topics of interest
  $scope.timeArr = []; //for storing hh,mm,ss
  $scope.selectedTopicE = []; //for storing values of expertise topics selected from ui
  $scope.selectedTopicI = [];  //for storing values of interested topics selected from ui
  $scope.ans_flag = false;
  $scope.ques_flag = false;
  $scope.ansArr = [];
  $scope.quesArr = [];

  //--For generating hours and mins values for time
  $scope.hourValues = [];
  for(var i = 0; i < 24; i++)
  {
    $scope.hourValues.push(i);
  }
  $scope.minValues = [];
  for(var i = 0; i < 60; i++)
  {
    $scope.minValues.push(i);
  }
  $scope.langArray = [{
      name: "English",
      id: 0
    },
    {
      name: "French",
      id: 1
    },
    {
      name: "German",
      id: 2
    }
  ];

  $scope.commMode = [{
      name: "Offline",
      id: 0
    },
    {
      name: "Online",
      id: 1
    }
  ];

  //--USER PERSONAL DETAILS
  //--For obtaining user profile fetched from API
  var url = "http://localhost:8080/v1.0/users/id/"+$scope.userid;
  var prof_deferred = $q.defer();
  $http.get(url)
  .then(function(api_get_response)
   {
		 prof_deferred.resolve(api_get_response);
   },
	 function(api_get_response)
	 {
     prof_deferred.reject(api_get_response);
	 });

  prof_deferred.promise.then(function(api_user_info_response){
    $scope.in_userName = api_user_info_response.data.username;
    $scope.in_name = api_user_info_response.data.name;
    $scope.in_contact = api_user_info_response.data.contact;
    $scope.in_password = api_user_info_response.data.password;
    $scope.in_email = api_user_info_response.data.email;
    $scope.in_country = api_user_info_response.data.country;
  });

  //--For fetching user preferences for profile
  url = "http://localhost:8080/v1.0/userpreference/"+$scope.userid;
  var pref_deferred = $q.defer();
  $http.get(url)
  .then(function(api_pref_response)
  {
    pref_deferred.resolve(api_pref_response);
  },
  function(api_pref_response)
  {
    pref_deferred.reject(api_pref_response);
  });

  pref_deferred.promise.then(function(api_pref_response){
    console.log("Preferences are: ",api_pref_response.data);
    if(api_pref_response.data.length == 0)
    {
      $scope.in_comm_lang = "English";
      $scope.in_comm_mode = "Offline";
      $scope.timeArr = ['14','0'];
    }
    else{
      $scope.in_prefId = api_pref_response.data.preferenceid;
      $scope.in_comm_lang = api_pref_response.data.communicationLang;
      $scope.in_comm_mode = api_pref_response.data.communicationMode;
      $scope.in_startTime = api_pref_response.data.startTime;
      $scope.in_endTime = api_pref_response.data.endTime;
      //--Splitting in_startTime to get HH and MM
      $scope.timeArr = $scope.in_startTime.split(':');
    }
  });

  //--EXPERT TAB
  //--For fetching expertise topics and questions answered
  //----1.Fetch topics from db and match user preference to fetched list to display topic names
  //----2.Fetch user preferences for topics i.e. list of topic ids

   //--For getting all topics in system
   url = "http://localhost:8081/v1.0/topics";
   var topics_deferred = $q.defer();
   $http.get(url)
   .then(function(api_topics_response)
   {
     topics_deferred.resolve(api_topics_response);
   },
   function(api_topics_response)
   {
     topics_deferred.reject(api_topics_response);
   });

   topics_deferred.promise.then(function(api_topics_response){
     //--Storing name and id of all topics in system
     for(var i = 0; i < api_topics_response.data.length; i++){
       $scope.topicArr.push({
         id: api_topics_response.data[i].id,
         name: api_topics_response.data[i].name
       });
     }
     for(var i = 0; i < $scope.topicArr.length; i++)
     {
       $scope.selectedTopicE[i] = false;
       $scope.btnPE[i] = false;
       $scope.btnDE[i] = false;
     }
   });

   //--For fetching ids of topics selected by experts
   url="http://localhost:8080/v1.0/expertisetags/"+$scope.userid;
   var topicE_id_deferred = $q.defer();
   $http.get(url)
   .then(function(api_get_response)
    {
 		 topicE_id_deferred.resolve(api_get_response);
    },
 	 function(api_get_response)
 	 {
      topicE_id_deferred.reject(api_get_response);
 	 });

   topicE_id_deferred.promise.then(function(api_expert_topics_response){
     //--Storing ids in topicIdE
     for(var i = 0; i < api_expert_topics_response.data.length; i++){
       $scope.topicIdE[i] = api_expert_topics_response.data[i];
       $scope.selectedTopicE[$scope.topicIdE[i]] = true;
     }

     //--If user has selected that topic then push id and name into final topicE array
     for(var i = 0; i < $scope.topicIdE.length; i++){
       for(var j = 0; j < $scope.topicArr.length; j++){
         //--Storing name and id of expertise topics of this user
         if($scope.topicIdE[i] == $scope.topicArr[j].id)
         {
           $scope.topicE.push({
             id: $scope.topicIdE[i],
             name: $scope.topicArr[j].name
           });
         }
       }
     }

     //--Change class of button according to whether it's selected or not
     for(var i = 0; i < $scope.topicArr.length; i++)
     {
       if($scope.selectedTopicE[$scope.topicArr[i].id] == true){
         $scope.btnDE[$scope.topicArr[i].id] = false;
         $scope.btnPE[$scope.topicArr[i].id] = true;
       }
       else {
         $scope.btnDE[$scope.topicArr[i].id] = true;
         $scope.btnPE[$scope.topicArr[i].id] = false;
       }
     }
   });

   //--Fetch questions answered by this user as an expert
   $scope.pageno = 1;
   url = "http://localhost:8082/v1.0/user/"+$scope.userid+"/answers/"+$scope.pageno;
   var ans_deferred = $q.defer();

   $http.get(url)
 	.then(function(api_ans_response)
 	{
     ans_deferred.resolve(api_ans_response);
 	},
 	function(api_ans_response)
 	{
 		ans_deferred.reject(api_ans_response);
 	});

 	ans_deferred.promise.then(function(api_ans_response)
 	{
 		$scope.length = api_ans_response.data.length;
     if($scope.length === 0)
 		{
 			$scope.ans_flag = false;
 		}
 		else
 		{
 			$scope.ans_flag = true;
 			for(var ind = 0; ind < $scope.length; ind++)
 			{
 				$scope.ansArr.push({
 					answerid: api_ans_response.data[ind].answerid,
 					questionid: api_ans_response.data[ind].questionid,
          upvote:  api_ans_response.data[ind].upvote,
          downvote:  api_ans_response.data[ind].downvote,
          answertext:  api_ans_response.data[ind].answertext,
          questiontitle: api_ans_response.data[ind].questionTitle,
          timestamp:  api_ans_response.data[ind].timestamp,
          username: api_ans_response.data[ind].username
 				});
 			}
 		}
 	});


   //--INTEREST TAB
   //--For fetching interest topics and questions answered
   for(var i = 0; i < $scope.topicArr.length; i++)
   {
     $scope.selectedTopicI[i] = false;
     $scope.btnPI[i] = false;
     $scope.btnDI[i] = false;
   }

    //--For fetching ids of topics selected by novice
    url="http://localhost:8080/v1.0/interestedtags/"+$scope.userid;
    var topicI_id_deferred = $q.defer();
    $http.get(url)
    .then(function(api_get_response)
     {
       topicI_id_deferred.resolve(api_get_response);
     },
     function(api_get_response)
     {
       topicI_id_deferred.reject(api_get_response);
     });

    topicI_id_deferred.promise.then(function(api_interest_topics_response){
      //--Storing ids in topicIdI
      for(var i = 0; i < api_interest_topics_response.data.length; i++){
        $scope.topicIdI[i] = api_interest_topics_response.data[i];
        $scope.selectedTopicI[$scope.topicIdI[i]] = true;
      }

      //--If user has selected that topic then push id and name into final topicI array
      for(var i = 0; i < $scope.topicIdI.length; i++){
        for(var j = 0; j < $scope.topicArr.length; j++){
          //--Storing name and id of expertise topics of this user
          if($scope.topicIdI[i] == $scope.topicArr[j].id)
          {
            $scope.topicE.push({
              id: $scope.topicIdI[i],
              name: $scope.topicArr[j].name
            });
          }
        }
      }

      //--Change class of button according to whether it's selected or not
      for(var i = 0; i < $scope.topicArr.length; i++)
      {
        if($scope.selectedTopicI[$scope.topicArr[i].id] == true){
          $scope.btnDI[$scope.topicArr[i].id] = false;
          $scope.btnPI[$scope.topicArr[i].id] = true;
        }
        else {
          $scope.btnDI[$scope.topicArr[i].id] = true;
          $scope.btnPI[$scope.topicArr[i].id] = false;
        }
      }
    });


  //--Function to fetch questions asked by user
  $scope.pageno = 1;
  url="http://localhost:8082/v1.0/user/"+$scope.userid+"/askedquestions/"+$scope.pageno;
  var ques_deferred = $q.defer();

  $http.get(url)
  .then(function(api_ques_response)
  {
    ques_deferred.resolve(api_ques_response);
  },
  function(api_ques_response)
  {
   ques_deferred.reject(api_ques_response);
  });

  ques_deferred.promise.then(function(api_ques_response)
  {
    $scope.length = api_ques_response.data.length;
    if($scope.length === 0)
    {
      $scope.ques_flag = false;
    }
    else
    {
      $scope.ques_flag = true;
      for(var ind = 0; ind < $scope.length; ind++)
      {
        $scope.quesArr.push({
          questionid: api_ques_response.data[ind].questionid,
          upvote:  api_ques_response.data[ind].upvote,
          downvote:  api_ques_response.data[ind].downvote,
          tagnamelist: api_ques_response.data[ind].tagnamelist,
          title: api_ques_response.data[ind].title,
          timestamp:  api_ques_response.data[ind].timestamp,
          username: api_ques_response.data[ind].username
        });
      }
    }
  });


  //--Function to change password type to text type
  $scope.displayPassword = function(){
    var password_box = angular.element(document.getElementById('password'));
    if(password_box[0].type === "password") {
      password_box[0].type = "text";
    }
    else {
      password_box[0].type = "password";
    }
  };

  //--Function to enable editing of personal information
  $scope.editProfile = function(){
    if($scope.isEditable){
      $scope.isEditable = false;
      $scope.buttonText = "Submit Changes";
    }
    else {

      //--2 APIs to be called:
      //----1. Personal details to be submitted
      //----2. Preferences to be submitted

      url = "http://localhost:8080/v1.0/users";
      var post_pref_deferred = $q.defer();
      var data = {
        userid: $scope.userid,
        contact: $scope.in_contact,
        country: $scope.in_country,
        email: $scope.in_email,
        password: $scope.in_password,
        username: $scope.in_userName,
        name: $scope.in_name
      };

      $http.post(url,JSON.stringify(data))
      .then(function(api_response)
      {
          post_pref_deferred.resolve(api_response);
      },
      function(api_response)
      {
        post_pref_deferred.reject(api_response);
      });

      url = "http://localhost:8080/v1.0/userpreference/"+$scope.userid;
      var put_pref_deferred =  $q.defer();
      var data = {
        communicationMode: $scope.in_comm_mode,
        communicationLang: $scope.in_comm_lang,
        startTime: $scope.in_startTime,
        endTime: $scope.in_endTime,
        userid: $scope.userid
      };

      console.log("Data: ",data);
      $http.put(url,JSON.stringify(data))
      .then(function(api_response){
        put_pref_deferred.resolve(api_response);
        console.log(api_response);
      },
      function(api_response){
        put_pref_deferred.reject(api_response);
      });

      $scope.isEditable = true;
      $scope.buttonText = "Enable Editing";
    }
  };

  $scope.editExpert = function(){
    if($scope.isEditableE){
      $scope.isEditableE = false;
      $scope.buttonTextE = "Submit Changes";
    }
    else {
      console.log("TopicIdE is: ",$scope.topicIdE);
      console.log("Current selection is: ",$scope.btnPE);
      //--If currently, topic is not selected and previously was, then unsubscribe
      //--If currently, topic is selected and previously was, do nothing
      //--If currently, topic is selected and previously wasn't, then subscribe
      for(var i = 1; i < $scope.btnPE.length; i++){
        if($scope.btnPE[i] == true)
        {
          var flag = false;
          for(var j = 0; j < $scope.topicIdE.length; j++)
          {
            if(i == $scope.topicIdE[j])
            {
              flag = true;
              break;
            }
          }
          if(flag == false)
          {
            //Subscribe to this topic
            url = "http://localhost:8080/v1.0/subscribe";
            var post_topicE_deferred = $q.defer();

            var data = {
              userid: $scope.userid,
              topicid: i,
              status: 1
            };

            $http.post(url,JSON.stringify(data))
            .then(function(api_response)
            {
                post_topicE_deferred.resolve(api_response);
            },
            function(api_response)
            {
              post_topicE_deferred.reject(api_response);
            });
          }
        }
        else {
          var flag = false;
          for(var j = 0; j < $scope.topicIdE.length; j++)
          {
            if(i == $scope.topicIdE[j])
            {
              flag = true;
              break;
            }
          }
          if(flag == true)
          {
            //Subscribe to this topic
            url = "http://localhost:8080/v1.0/"+$scope.userid+"/unsubscribe/"+i;
            var post_topicE_deferred = $q.defer();

            $http.get(url)
            .then(function(api_response)
            {
                post_topicE_deferred.resolve(api_response);
            },
            function(api_response)
            {
              post_topicE_deferred.reject(api_response);
            });
          }
        }
      }

      $scope.isEditableE = true;
      $scope.buttonTextE = "Enable Editing";
    }
  };

  $scope.buttonEClick = function(){
    if($scope.btnDE[this.topic.id] == true){
      $scope.btnDE[this.topic.id] = false;
      $scope.btnPE[this.topic.id] = true;
    }
    else {
      $scope.btnDE[this.topic.id] = true;
      $scope.btnPE[this.topic.id] = false;
    }
  };

  $scope.editInterest = function(){
    if($scope.isEditableI){
      $scope.isEditableI = false;
      $scope.buttonTextI = "Submit Changes";
    }
    else {
      console.log("TopicIdI is: ",$scope.topicIdI);
      console.log("Current selection is: ",$scope.btnPI);
      //--If currently, topic is not selected and previously was, then unsubscribe
      //--If currently, topic is selected and previously was, do nothing
      //--If currently, topic is selected and previously wasn't, then subscribe
      for(var i = 1; i < $scope.btnPI.length; i++){
        if($scope.btnPI[i] == true)
        {
          var flag = false;
          for(var j = 0; j < $scope.topicIdI.length; j++)
          {
            if(i == $scope.topicIdI[j])
            {
              flag = true;
              break;
            }
          }
          if(flag == false)
          {
            //Subscribe to this topic
            url = "http://localhost:8080/v1.0/subscribe";
            var post_topicI_deferred = $q.defer();

            var data = {
              userid: $scope.userid,
              topicid: i,
              status: 0
            };

            $http.post(url,JSON.stringify(data))
            .then(function(api_response)
            {
                post_topicI_deferred.resolve(api_response);
            },
            function(api_response)
            {
              post_topicI_deferred.reject(api_response);
            });
          }
        }
        else {
          var flag = false;
          for(var j = 0; j < $scope.topicIdI.length; j++)
          {
            if(i == $scope.topicIdI[j])
            {
              flag = true;
              break;
            }
          }
          if(flag == true)
          {
            //Unubscribe to this topic
            url = "http://localhost:8080/v1.0/"+$scope.userid+"/unsubscribe/"+i;
            var post_topicI_deferred = $q.defer();

            $http.get(url)
            .then(function(api_response)
            {
                post_topicI_deferred.resolve(api_response);
            },
            function(api_response)
            {
              post_topicI_deferred.reject(api_response);
            });
          }
        }
      }

      $scope.isEditableI = true;
      $scope.buttonTextI = "Enable Editing";
    }
  };

  $scope.buttonIClick = function(){
    if($scope.btnDI[this.topic.id] == true){
      $scope.btnDI[this.topic.id] = false;
      $scope.btnPI[this.topic.id] = true;
    }
    else {
      $scope.btnDI[this.topic.id] = true;
      $scope.btnPI[this.topic.id] = false;
    }
  };

});
