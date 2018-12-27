angular
  .module('feedModule')
  .component('feedComponent', {
    controller: function($scope, feedService, $http, $state, $rootScope, $cookies) {
      $scope.posts = [];
      $scope.post = {};
      $scope.commentText = "";
      $scope.liked = false;
      $scope.dizliked = false;
      // Получение постов из базы
      var currentPage = 1;
      var perPage = 3;
      $scope.pages = [];

      function fill(currentPage, perPage, searchText) {
        feedService.getPosts(currentPage, perPage, searchText)
          .then(function(success) {
            $scope.posts = success.data.posts;
            $scope.total = success.data.total;
            var totalPages = parseInt(Math.ceil($scope.total / perPage));

            for (var i = 1; i <= totalPages; i++) {
              if (currentPage == i) {
                $scope.pages.push({
                  name: currentPage,
                  active: true
                })
              } else if (i == 1 || i == totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                $scope.pages.push({
                  name: i,
                  active: false
                });
              }
            }
          }).catch(function(error) {
          console.log('error ', error);
        });
      }

      fill(currentPage, perPage);

      $scope.changePage = function(page) {
        currentPage = page;
        $scope.posts = [];
        $scope.pages = [];
        fill(currentPage, perPage, $scope.searchText);
      };
      $rootScope.$on('searchText', function(event, data) {
        $scope.post_id = {};
        $scope.posts = [];
        $scope.pages = [];
        $scope.searchText = data ;
        if (data == null || data.length == 0) {
          currentPage = 1;
          fill(currentPage, perPage);
        } else {
          currentPage = 1;
          fill(currentPage, perPage, data);
        }
      });
      $scope.search = function(searchText) {
        $rootScope.$broadcast('searchText', searchText);
      };

      $scope.addPost_id = function(post_id) {
        // Получение комментариев
      var id = post_id;
      $scope.currentPost = post_id;
      // console.log(id)
      var url = '/api/posts/' + id;
      var user = $cookies.getObject('user');
      // console.log(user._id);
      $http.get(url)
        .then(function(response) {
          if (response.status === 200) {
            // console.log('response ', response);
            $scope.author= response.data.post.author;
            $scope.post = response.data.post;
            $scope.likes = response.data.likes;

            $scope.liked = response.data.liked;
            $scope.dizlikes = response.data.dizlikes;
            $scope.dizliked = response.data.dizliked;
            $scope.comments = response.data.post.comments;

            console.log($scope.comments);
          }
        })
        .catch(function(error) {
          console.log('error ', error);
        })
      }
      // Сохранение комментария
      $scope.saveComment = function(comment) {
        console.log('comment', comment);
      if (comment.length == 0) {
      return;
      }
      var url = '/api/posts/' + $scope.currentPost+ '/comments';
      var data = {
      comment: comment
      };
      $http.post(url, data)
      .then(function(response) {
        console.log('response ', response);
        if (response.status == 200) {
          var createdComment = response.data;
          var user = $cookies.getObject('user');
          createdComment.author = user;
          $scope.post.comments.push(createdComment);
          $scope.commentText = "";
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
      var url = '/api/posts/' + $scope.currentPost + '/likes';
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
    var url = '/api/posts/' + $scope.currentPost + '/dizlikes';
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
      var url = '/api/posts/' + $scope.currentPost + '/likes';

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

      var url = '/api/posts/' + $scope.currentPost + '/dizlikes';

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
    templateUrl: '/feed/feed.html'
  });
