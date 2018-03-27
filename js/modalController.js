var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

//1.connect() and pass this user
function connect(username, userid, otherusername, otheruserid, qid) {
    var socket = new SockJS('http://127.0.0.1:8083/discussionchat');
    console.log('socket object ' );
    stompClient = Stomp.over(socket);
    console.log('going to connect ');
    stompClient.connect({"user" : username}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/user/queue/reply', function(greeting) {
            showGreeting(otherusername,JSON.parse(greeting.body).answerText,"Me");
        });
        stompClient.send("/chatsession/"+userid, {}, JSON.stringify({'chatsessionid':null,'seekerid':userid,'expertid':otheruserid,'questionid':qid,'seekerstatus':null,'expertstatus':null}));
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected session");
}

function sendName(sessionid, owneruser, otheruser, text) {
	//need userid which will be stored in session attribute.
  console.log("I have to send data for: ",sessionid, owneruser, otheruser, text);
  stompClient.send("/chatanswer", {}, JSON.stringify({'chatanswerid': null, 'userid':owneruser, 'chatsessionid': sessionid,'answerText':text,'timestamp':null}));
  showGreeting(owneruser,text, otheruser);
}

function showGreeting(sender,message,receiver) {
  console.log("sender: ",sender);
  //console.log("Finding: ",angular.element(document.getElementById('modal-title')).scope());
  /*var scope = angular.element(document.getElementById('modal-title')).scope();
  scope.$apply(function(){
    scope.testFunc();
  });*/
  scopeHolder.appendMsg(sender,message,receiver);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});
