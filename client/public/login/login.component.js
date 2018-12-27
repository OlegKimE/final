angular
  .module('loginModule')
  .component('loginComponent', {
    controller: function($scope, $http, $state, $rootScope) {

      var signupButton = document.getElementById('signup-button'),
          loginButton = document.getElementById('login-button'),
          userForms = document.getElementById('user_options-forms')

      // Add event listener to the "Sign Up" button
      signupButton.addEventListener('click', () => {
        userForms.classList.remove('login-click')
        userForms.classList.add('signup-click')
      }, false)

      // Add event listener to the "Login" button
      loginButton.addEventListener('click', () => {
        userForms.classList.remove('signup-click')
        userForms.classList.add('login-click')
      }, false)

      $scope.login = function(email, password) {
        var data = {
          email: email,
          password: password,
        };
        $http.post('/api/auth/sign-in', data)
        .then(function(response) {
          if (response.status === 200) {
            $rootScope.authenticated = true;
            $state.go('profile');
          }
        })
        .catch(function(error) {
          $rootScope.authenticated = false;
          $state.go('failed');
        });
      }
      $scope.registration = function(firstName1, lastName1, email1, password1) {
        var data = {
          lastName: lastName1,
          firstName: firstName1,
          email: email1,
          password: password1,
        };
        $http.post('/api/auth/sign-up', data)
          .then(function(response) {
            // console.log('response ', response);
            if (response.status === 201) {
              $rootScope.authenticated = true;
              $state.go('index');
              console.log('Success. Cookie created');
            }
            if (response.status === 200) {
              $rootScope.authenticated = true;
              $state.go('note')
            }
          })
          .catch(function(error) {
            console.log('error ', error);
          });
      };
      },
    templateUrl: '/login/login.html'
  });
