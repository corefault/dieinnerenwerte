angular.module("watchApp", [])
        .controller("userController", function ($scope, $http) {
           $scope.update = function(delay) {
              setTimeout(function () {
                  var now = new Date().getTime();
                  var bgImage = new Image();
                  bgImage.src = "/backend/still.jpg?_=" + now;
                  bgImage.onload = function(e) {
                     var obj = document.getElementById("still");
                     obj.setAttribute("style", "background-image: url("+bgImage.src+")");
                  };
                  $scope.update(4000);
            }, delay);
           };
           
           $http.get('/assets/media/userdata.json').then(function (response) {
              $scope.user = response.data;
              $scope.update(4000);
           });
        })
        .controller("valueController", function($scope, $http) {
           
           $scope.last = false;
           
           $scope.update = function(delay) {
              setTimeout(function () {
               $http.get("/backend/getdata.php")
                  .success(function(data, status, headers, config) {
                     if ($scope.last === false) {
                        data.otrend = "default";
                        data.ptrend = "default";
                        $scope.last = data;
                     } else {
                        data.otrend = (data.oxygen < $scope.last.oxygen) ? "down" : (data.oxygen > $scope.last.oxygen) ? "up" : "default";
                        data.ptrend = (data.pulse < $scope.last.pulse) ? "down" : (data.pulse > $scope.last.pulse) ? "up" : "default";
                     }
                     $scope.value = data;
                     $scope.update(4000);
               })
               .error(function(data, status, headers, config) {
                  $scope.update(10000); // start over after waiting time
               });
            }, delay);
           };
           $scope.update(10);
        });