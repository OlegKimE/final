angular
  .module('postDetailModule')
  .component('postDetailComponent', {
    controller: function($scope, $http, $state, $cookies) {
      $scope.school = "Decode";
      $scope.post = {};
      $scope.commentText = "";
      $scope.liked = false;
      $scope.dizliked = false;

        // Получение комментария
      var id = $state.params.postID;
      var url = '/api/posts/' + id;
      var user = $cookies.getObject('user');
      $scope.user = user;
        // console.log($scope.user._id)
      $http.get(url)
        .then(function(response) {
          if (response.status === 200) {
            $scope.post = response.data.post;
            $scope.likes = response.data.likes;
            $scope.liked = response.data.liked;
            $scope.dizlikes = response.data.dizlikes;
            $scope.dizliked = response.data.dizliked;
            $scope.comments = response.data.post.comments;
            // console.log($scope.post.comments)
          }
        })
        .catch(function(error) {
          console.log('error ', error);
        })
        // Сохранение комментария
      $scope.saveComment = function(comment) {
      if (comment.length == 0) {
        return;
      }
      var url = '/api/posts/' + id + '/comments';
      var data = {
        comment: comment
      };
      $http.post(url, data)
        .then(function(response) {
          console.log('response ', response);
          if (response.status == 200) {
            var createdComment = response.data;
            // createdComment.author = user;
            $scope.post.comments.push(createdComment);
            $scope.commentText = "";
          }
        }).catch(function(error) {
          console.log('error ', error);
        })
    }
        //удаление комментария
      $scope.deleteComment = function(deleteComment) {
        var url = '/api/posts/' + id + '/comments/' + deleteComment._id;

        $http.delete(url).then(function(response) {
          if (response.status == 200) {
            $scope.post.comments = $scope.post.comments.filter(comment => comment._id != deleteComment._id);
          }
        }).catch(function(error) {
          console.log('error ', error);
        })
      }
      //удаление лайка
    $scope.deleteLike = function() {
      if (!$cookies.getObject('user')) {
        return;
      }
      var url = '/api/posts/' + id + '/likes';
      $http.delete(url).then(function(response) {
        if (response.status === 204) {
          $scope.liked = false;
          $scope.likes = $scope.likes - 1;
        }
      }).catch(function(error) {
        console.log('error ', error);
      })
    }
    //удаление дизлайка
  $scope.deleteDizlike = function() {
    if (!$cookies.getObject('user')) {
      return;
    }
    var url = '/api/posts/' + id + '/dizlikes';
    $http.delete(url).then(function(response) {
      if (response.status === 204) {
        $scope.dizliked = false;
        $scope.dizlikes = $scope.dizlikes - 1;
      }
    }).catch(function(error) {
      console.log('error ', error);
    })
  }
    // Добавление лайка
    $scope.addLike = function() {
      if (!$cookies.getObject('user')) {
        return;
      }
      var url = '/api/posts/' + id + '/likes';

      $http.post(url).then(function(response) {
        if (response.status === 201) {
          $scope.liked = true;
          $scope.likes = $scope.likes + 1;

          if($scope.dizliked == true) {
            $scope.dizliked = false;
            $scope.dizlikes = $scope.dizlikes - 1;
          }
        }
      }).catch(function(error) {
        console.log('error ', error);
      })
    }
    // Добавление дизлайка
    $scope.addDizlike = function() {
      if (!$cookies.getObject('user')) {
        return;
      }
      var url = '/api/posts/' + id + '/dizlikes';

      $http.post(url).then(function(response) {
        if (response.status === 201) {
          $scope.dizliked = true;
          $scope.dizlikes = $scope.dizlikes + 1;

          if($scope.liked == true) {
            $scope.liked = false;
            $scope.likes = $scope.likes - 1;
          }
        }
      }).catch(function(error) {
        console.log('error ', error);
      })
    }
    },
    templateUrl: '/post-detail/post-detail.html'
  });
