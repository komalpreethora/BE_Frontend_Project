myApp.controller('postQuesCtrl',function($scope, $http, $q, $location, $rootScope){
  var vm =this;
  vm.userid = $rootScope.userId;
  vm.topicsArr = [];
  vm.btnD = [];
  vm.btnP = [];
  vm.quesText = null;
  vm.quesTitle = null;
  vm.tagList = [];
  vm.time = null;
  vm.link="#!/askQues";
  vm.flag = false; //for displaying time
  vm.flag_msg = false;
  vm.commMode = [{
      name: "Offline",
      id: 0
    },
    {
      name: "Online",
      id: 1
    }
  ];

  vm.langArray = [{
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

  vm.hourValues = [];
  for(var i = 0; i < 24; i++)
  {
    vm.hourValues.push(i);
  }

  vm.minValues = [];
  for(var i = 0; i < 60; i++)
  {
    vm.minValues.push(i);
  }

  vm.selected_lang = "English";
  vm.comm_mode = "Online";
  vm.hour = "0";
  vm.min = "0";

  vm.userid = 1;
  var url = "http://localhost:8081/v1.0/topics";
  var deferred = $q.defer();

  //Fetching topics from system
  $http.get(url)
	.then(function(api_topic_response)
	{
		deferred.resolve(api_topic_response);
	},
	function(api_topic_response)
	{
		deferred.reject(api_topic_response);
	});

	deferred.promise.then(function(api_topic_response)
	{
		vm.length = api_topic_response.data.length;
		for(var ind = 0; ind < vm.length; ind++)
		{
			vm.topicsArr.push({
			  id: api_topic_response.data[ind].id,
		    name: api_topic_response.data[ind].name
      });
      vm.btnD[ind] = true;
      vm.btnP[ind] = false;
		}
	});

  vm.buttonClassClick = function(param){
    if(vm.btnD[param] == true){
      vm.btnD[param] = false;
      vm.btnP[param] = true;
    }
    else {
      vm.btnD[param] = true;
      vm.btnP[param] = false;
    }
  };

  vm.changeMode = function(mode){
      if(mode === "Online")
        vm.flag = false;
      else {
        vm.flag = false;
      }
  };

  vm.postQues = function(){
    var j = 0;
    for(var i = 1; i < vm.btnP.length; i++)
    {
      if(vm.btnP[i] == true)
      {
        vm.tagList[j]=""+i;
        j++;
      }
    }
    console.log(vm.tagList);
    if(vm.quesText == null || vm.quesTitle == null || vm.tagList.length == 0)
    {
      //If no data, reset all fields
      vm.msg = "Please enter data in all fields!";
      vm.flag_msg = true;
      vm.link='/askQues';
      vm.changeView(vm.link);
      vm.quesText = null;
      vm.quesTitle = null;
      for(var i = 1; i < vm.topicsArr.length; i++)
      {
        vm.btnD[i] = true;
        vm.btnP[i] = false;
      }
    }
    else {
      var data = {
        question:{
          questionText : vm.quesText,
          title: vm.quesTitle,
          preferredLanguage: vm.selected_lang,
          communicationMode: vm.comm_mode,
          preferredTime: null,
          userid: vm.userid,
          state: 0,
          timestamp: null
        },
        tagid: vm.tagList
      };
      console.log(data);
      var url = "http://localhost:8082/v1.0/question";
      var deferred = $q.defer();

      $http.post(url,JSON.stringify(data))
      .then(function(api_response)
      {
          deferred.resolve(api_response);
          vm.quesId = api_response.data;
          vm.link='/experts/'+vm.quesId;
          vm.changeView(vm.link);
      },
      function(api_response)
      {
        deferred.reject(api_response);
      });
    }
  };

  vm.changeView = function(newView){
  	$location.path(newView);
  };
});
