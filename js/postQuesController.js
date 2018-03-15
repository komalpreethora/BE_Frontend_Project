myApp.controller('postQuesCtrl',function($scope, $http, $q, $location, $cookies){
  var vm =this;
  vm.userid = $cookies.get('userId');
  vm.topicsArr = [];
  vm.btnD = [];
  vm.btnP = [];
  vm.quesText = null;
  vm.quesTitle = null;
  vm.tagList = [];
  vm.time = null;
  vm.link="#!/askQues";
  vm.flag = true; //for displaying time
  vm.flag_msg = false; //for displaying error msg when all fields aren't filled
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

  vm.monthValues = [];
  for(var i = 1; i <= 12; i++)
  {
    vm.monthValues.push(i);
  }

  vm.dayValues = [];
  for(var i = 1; i <= 31; i++)
  {
    vm.dayValues.push(i);
  }

  vm.selected_lang = "English";
  vm.comm_mode = "Online";
  vm.hour = "0";
  vm.min = "0";
  vm.year = "2018";
  vm.month = "1";
  vm.day = "1";

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
    console.log(mode);
    if(mode === "Online")
      vm.flag = true;
    else {
      vm.flag = false;
    }
  };

  vm.changeInMonth = function(month_val){
    vm.dayValues = [];
    if(month_val == 2)
    {
      max_day = 27;
      if((vm.year%4 == 0 && vm.year%100 == 0 && vm.year%400 == 0)||(vm.year%4==0 && vm.year%100 != 0))
      {
        max_day = 28;
      }
      for(var i = 1; i <= max_day; i++)
      {
        vm.dayValues.push(i);
      }
    }
    else if(month_val == 1||month_val == 3||month_val == 5||month_val == 7||month_val == 8||month_val == 10||month_val == 12)
    {
      for(var i = 1; i <= 31; i++)
      {
        vm.dayValues.push(i);
      }
    }
    else {
      for(var i = 1; i <= 30; i++)
      {
        vm.dayValues.push(i);
      }
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
      if(vm.flag == true)
      {
        if(vm.month.length == 1)
          vm.month = "0"+vm.month;
        if(vm.day.length == 1)
          vm.day = "0"+vm.day;
        if(vm.hour.length == 1)
          vm.hour = "0"+vm.hour;
        if(vm.min.length == 1)
          vm.min = "0"+vm.min;

        var data = {
          question:{
            questionText : vm.quesText,
            title: vm.quesTitle,
            preferredLanguage: vm.selected_lang,
            communicationMode: vm.comm_mode,
            preferredTime: ""+vm.year+"-"+vm.month+"-"+vm.day+" "+vm.hour+":"+vm.min+":00",
            userid: vm.userid,
            state: 0,
            timestamp: null
          },
          tagid: vm.tagList
        };
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
      }
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
