angular
  .module('failedModule')
  .component('failedComponent', {
    controller: function($scope, $http, $state, $rootScope) {
    },
    templateUrl: '/failed/failed.html'
  });
