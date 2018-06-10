<!DOCTYPE html>
<html ng-app="quiz-host">

<head>
<title>Quiz Host</title>
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"></meta>
<meta charset="UTF-8">
<link rel='stylesheet' href='/bower_components/bootstrap/dist/css/bootstrap.min.css' />
</head>

<body>
<script src="https://www.google.com/jsapi"></script>
<script src="/socket.io/socket.io.js"></script>
<script src="/bower_components/angular/angular.min.js"></script>
<script src="/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="/bower_components/angular-google-chart/ng-google-chart.min.js"></script>
<script src="/javascripts/quiz-host.js"></script>
<script>
angular.module("quiz-host")
.constant("channel", "<%- channel %>");
google.load('visualization', '1.0', {'packages':['corechart']});
</script>

<!-- Root Container -->
<div class="container" ng-controller="rootCtl" style="margin: 20px auto;" ng-cloak>
    <!-- Open Channel Form -->
    <div id="openChannelForm" ng-controller="openChannelFormCtl" ng-if="!channel">
        <h3>新的測驗</h3>
        <form class="form">
            <div class="form-group">
                <input type="text" class="form-control" ng-model="form.channel" placeholder="測驗名稱"/>
            </div>
            <div class="form-group" style="text-align: right;">
                <a href="?channel={{form.channel}}" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span>&nbsp;新增</a>
            </div>
        </form>
    </div><!-- Open Channel Form -->

    <!-- Quiz -->
    <div class="col-md-10" id="quiz" ng-controller="quizCtl" ng-if="channel">
        <!-- Quiz URL Notification -->
        <div class="alert alert-info alert-dismissible" role="alert" ng-init="showQuizUrl = true" ng-show="showQuizUrl">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close" ng-click="showQuizUrl = false"><span aria-hidden="true">&times;</span></button>
            參加這個測驗的同學請點選這個連結： <a target="_blank" href="/{{channel}}">{{server.protocol}}://{{server.hostname}}/{{channel}}</a> 就可以進入測驗。
        </div><!-- Quiz URL Notification -->

        <!-- Publish Question Button -->
        <div style="text-align: right;">
            <button type="button" class="btn btn-primary" ng-click="openQuizForm()"><span class="glyphicon glyphicon-cloud-upload"></span>&nbsp;開始出題</button>
        </div><!-- Publish Question Button -->
	
        <!-- Chart -->
        <div style="margin-bottom: 40px;" ng-show="quiz != null">
            <h4>
                {{quiz.question}}
            </h4>
            <div ng-if="answerChart">
                <div google-chart chart="answerChart" style="width:100%;"></div>
            </div>
        </div><!-- Chart -->

        <!-- Give Correct Answer -->
        <div style="margin-bottom: 40px;" ng-show="quiz != null">
            <h4>
                正確答案是？
            </h4>
            <div class="list-group" ng-hide="quiz.isClosed">
                <a href="#" ng-repeat="option in quiz.optionList" ng-click="giveCorrectAnswer(option, $event)" class="list-group-item">&nbsp;{{option.option}}</a>
            </div>
            <ul class="list-group" ng-show="quiz.isClosed">
                <li ng-repeat="option in quiz.optionList" class="list-group-item"><span class="glyphicon glyphicon-ok" ng-show="option.isCorrect"></span>&nbsp;{{option.option}}</li>
            </ul>
        </div><!-- Chart -->
    </div>
    <div class="col-md-2" id="userForm" ng-if="channel">
      <div class="well">
        <h3>Online student</h3>
        <ul class="list-group" id="users"></ul>
      </div>
    </div>
    <!-- Quiz -->


</div><!-- Root Container -->

<script type="text/ng-template" id="quizForm">
    <% include templates/quizForm %>
</script>

<script>
  $(function(){
    var socket = io.connect();
    var $userForm = $('userForm');
    var $userFormArea = $('userFormArea');
    var $users = $('#users');
    var $username = $('username');

    $userForm.submit(function(e){
      e.preventDefault();
      socket.emit('new user', $username.val(), function(data){
        if(data){
          $userForm.hide();
        }
      });
      $username.val('';)
    });
    socket.on("get users", function(data){
      var html = '';
      for(i = 0; i<data.length; i++){
        html += '<li class="list-group-itme">' +data[i]+'</li>';
      }
      $users.html(html);
    });
  });
</script>

</body>
</html>
