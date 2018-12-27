angular
  .module('navigationModule')
  .component('navigationComponent', {
    controller: function($scope, $rootScope, $cookies, navigationService, $state) {
      var userCookie = $cookies.getObject('user');
      if (userCookie) {
        $rootScope.authenticated = true;
      }
      $scope.logout = function() {
        navigationService.logout().then(function(response) {
          if (response.status === 200) {
            $rootScope.authenticated = false;
            $state.go('index');
          }
        }).catch(function(error) {
          console.log('error', error);
        })
      }
    $scope.showMenuEvent = function() {
      $('#menu').animate({
        height: 'toggle'
      });
      $scope.showMenuModal = true;
    };
    $scope.closeMenuEvent = function() {
      $scope.showMenuModal = false;
    };
    },
    templateUrl: '/navigation/navigation.html'
  });
