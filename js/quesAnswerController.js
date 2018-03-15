myApp.controller('quesAnswerCtrl',function($scope, $http, $q, $route, $routeParams, $cookies){

  var vm = this;
  vm.userid = $cookies.get('userId');
  vm.quesId = $routeParams.quesId;

  vm.userAnswerText = null;
  vm.ansArray = [];
  vm.q_upClick = 0;
  vm.q_downClick = 0;
  vm.a_upClick = 0;
  vm.a_downClick = 0;
  vm.flag_msg = false;
  vm.ansText_flag = false;
  vm.msg = null;

  var url = "http://localhost:8082/v1.0/question/"+vm.quesId;
  var ques_deferred = $q.defer();
  $http.get(url)
  .then(function(api_ques_response){
    ques_deferred.resolve(api_ques_response);
  },
  function(){
    ques_deferred.reject(api_ques_response);
  });

	ques_deferred.promise.then(function(api_ques_response)
	{
		vm.length = api_ques_response.data.length;

    vm.quesTitle = api_ques_response.data.question.title;
    vm.userName = api_ques_response.data.question.username;
    vm.questionid = api_ques_response.data.question.questionid;
    vm.q_upvote = api_ques_response.data.question.upvote;
    vm.q_downvote = api_ques_response.data.question.downvote;
    vm.state = api_ques_response.data.question.state;
    vm.timestamp = api_ques_response.data.question.timestamp;
    vm.tagnamelist = api_ques_response.data.question.tagnamelist;
    vm.quesText = api_ques_response.data.questiontext;

    if(api_ques_response.data.answers.length == 0)
    {
      vm.ans_flag = false;
    }
    else {
      vm.ans_flag = true;
      for(var i = 0; i < api_ques_response.data.answers.length; i++)
      {
        vm.ansArray.push({
          answerId: api_ques_response.data.answers[i].answerid,
          answerText: api_ques_response.data.answers[i].answertext,
          upvote: api_ques_response.data.answers[i].upvote,
          downvote: api_ques_response.data.answers[i].downvote,
          timestamp: api_ques_response.data.answers[i].timestamp,
          username: api_ques_response.data.answers[i].username
        });
      }
    }
	});

  vm.quesUpvote = function(){
    url = "http://localhost:8082/v1.0/question/vote";
    var quesUp_deferred = $q.defer();
    var data = {
      questionid: vm.questionid,
      vote: 0,
      userid: vm.userid
    };

    vm.q_upClick++;
    if(vm.q_upClick%2 != 0){
      vm.q_upvote++;
    }
    else {
      vm.q_upvote--;
    }

    $http.post(url,JSON.stringify(data))
    .then(function(api_response){
      quesUp_deferred.resolve(api_response);
    },
    function(api_response){
      quesUp_deferred.reject(api_response);
    });
  };

  vm.quesDownvote = function(){
    url = "http://localhost:8082/v1.0/question/vote";
    var quesDown_deferred = $q.defer();
    var data = {
      questionid: vm.questionid,
      vote: 1,
      userid: vm.userid
    };

    vm.q_downClick++;
    if(vm.q_downClick%2 != 0){
      vm.q_downvote++;
    }
    else {
      vm.q_downvote--;
    }

    $http.post(url,JSON.stringify(data))
    .then(function(api_response){
      quesDown_deferred.resolve(api_response);
    },
    function(api_response){
      quesDown_deferred.reject(api_response);
    });
  };

  vm.ansUpvote = function(param){
    url = "http://localhost:8082/v1.0/answer/vote";
    var ansUp_deferred = $q.defer();
    var data = {
      answerid: param.answerId,
      vote: 0,
      userid: vm.userid
    };

    vm.a_upClick++;
    if(vm.a_upClick%2 != 0){
      param.upvote++;
    }
    else {
      param.upvote--;
    }

    $http.post(url,JSON.stringify(data))
    .then(function(api_response){
      ansUp_deferred.resolve(api_response);
    },
    function(api_response){
      ansUp_deferred.reject(api_response);
    });
  };

  vm.ansDownvote = function(param){
    url = "http://localhost:8082/v1.0/answer/vote";
    var ansDown_deferred = $q.defer();
    var data = {
      answerid: param.answerId,
      vote: 1,
      userid: vm.userid
    };

    vm.a_downClick++;
    if(vm.a_downClick%2 != 0){
      param.downvote++;
    }
    else {
      param.downvote--;
    }

    $http.post(url,JSON.stringify(data))
    .then(function(api_response){
      ansDown_deferred.resolve(api_response);
    },
    function(api_response){
      ansDown_deferred.reject(api_response);
    });
  };

  vm.submitAnswer = function(){
    if(vm.userAnswerText == null)
    {
      vm.flag_msg = true;
      vm.msg = "No answer has been submitted!"
    }
    else {
      vm.ansText_flag = true;
      vm.flag_msg = false;
      url = "http://localhost:8082/v1.0/answer";
      var ans_post_deferred = $q.defer();

      var data = {
        answerText: vm.userAnswerText,
        questionid: vm.questionid,
        userid: vm.userid
      };

      $http.post(url,JSON.stringify(data))
      .then(function(api_response){
        ans_post_deferred.resolve(api_response);
      },
      function(api_response){
        ans_post_deferred.reject(api_response);
      });
    }
  };

});
