myApp.controller('loginCtrl',function($scope, $http, $q, $location, $rootScope){
  var vm = this;
  vm.error_flag = false;
  vm.msg = null;
  vm.login_flag = false;
  vm.login_msg = null;
  vm.name_msg = "Enter your name (FirstName MiddleName LastName)";
  vm.username_msg = "Enter your username";
  vm.email_msg = "Enter your email id";
  vm.password_msg = "Enter your password";
  vm.phone_msg = "Enter your contact";
  vm.country_msg = "Enter your country";
  vm.login_pass_msg = "Enter your password";
  vm.login_email_msg = "Enter your email id"

  vm.signUp = function(){
    var data = {
      name: vm.in_name,
      username: vm.in_username,
      contact: vm.in_contact,
      country: vm.in_country,
      email: vm.in_email,
      password: vm.in_password
    };
    console.log("Data is: ",data);

    var url = "http://localhost:8080/v1.0/users";
    var post_deferred = $q.defer();

    $http.post(url,JSON.stringify(data))
    .then(function(api_response)
    {
        post_deferred.resolve(api_response);
    },
    function(api_response)
    {
      post_deferred.reject(api_response);
    });

    post_deferred.promise.then(function(api_response){
      console.log(api_response.data);
      if(api_response.data == true){
        vm.error_flag = false;
      }
      else
      {
        vm.error_flag = true;
        vm.msg="Account for this email id/username already exists!";
      }
    });
  };

  vm.login = function(){
    if(vm.login_email == null|| vm.login_password == null)
    {
      if(vm.login_email == null)
        vm.login_email_msg = "Please enter an email address";
      if(vm.login_password == null)
        vm.login_password_msg = "Please enter a password";
    }
    else{
      url = "http://localhost:8080/v1.0/users/"+vm.login_email;
      var get_deferred = $q.defer();
      console.log("Email, password: ",vm.login_email,vm.login_password);

      $http.get(url)
  	  .then(function(api_user_response)
  	  {
  		    get_deferred.resolve(api_user_response);
  	  },
  	  function(api_user_response)
  	  {
  		    get_deferred.reject(api_user_response);
  	  });

      get_deferred.promise.then(function(api_user_response)
  	  {
        console.log("api_user_response:",api_user_response.data);
        if(api_user_response.data.password === vm.login_password)
        {
          $rootScope.userId = api_user_response.data.userid;
          vm.changeView('/home');
        }
        else {
          vm.login_flag = true;
          vm.login_msg = "Please enter valid login details!";
        }
  	  });
    }
  };

  vm.changeView = function(newView){
    $location.path(newView);
  };
});