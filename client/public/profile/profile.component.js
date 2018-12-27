angular
  .module('profileModule')
  .component('profileComponent', {

    controller: function($scope, $cookies, $filter, profileService, $timeout) {

      $scope.showAddModalFlag = false;
      $scope.posts = [];
      var user = $cookies.getObject("user");
      // console.log('user ', user);
      $scope.user = $cookies.getObject("user");
        if (user.avatarPath) {
        $scope.avatarPath = user.avatarPath;
      } else {
        $scope.avatarPath = "/avas/default.png";
      }

      $scope.currentPage = 0;

      // Получение постов из базы
      profileService.getPosts(user._id)
        .then(response => {
          if (response.status === 200) {
            $scope.posts = response.data.posts;
            console.log($scope.posts)
            // for(var i=0; i<36; i++){
            $scope.currentPage = 0;
            $scope.pageSize = 1;
            // }
          $scope.firstPage = function() {
            return $scope.currentPage == 0;
          }
          $scope.lastPage = function() {
            var lastPageNum = Math.ceil($scope.posts.length / $scope.pageSize - 1);
            return $scope.currentPage == lastPageNum;
          }
          $scope.numberOfPages = function(){
            return Math.ceil($scope.posts.length / $scope.pageSize);
          }
          $scope.startingItem = function() {
            return $scope.currentPage * $scope.pageSize;
          }
          $scope.pageBack = function() {
            $scope.currentPage = $scope.currentPage - 1;
          }
          $scope.pageForward = function() {
            $scope.currentPage = $scope.currentPage + 1;
          }
          }
        }).catch(error => {
          console.log('error ', error);
      });
      $scope.showAddModal = () => {
        $scope.showAddModalFlag = true;
      };

      $scope.removeAddModal = () => {
        $scope.showAddModalFlag = false;
        $scope.postTitle = "";
        $scope.postContent = "";
        $scope.image = null;
      };

      $scope.savePost = (title, content, image) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('file', image);

        profileService.createPost(user._id, formData)
          .then(response => {
            var post = response.data;
            $scope.removeAddModal();
            $scope.posts.push(post);
          })
          .catch(err => console.log('error ', err));
      };

      $scope.deletePost = (post) => {

        profileService.deletePost(user._id, post._id)
          .then(response => {
            var posts = response.data;
            $scope.posts = $scope.posts.filter(it => it._id !== post._id);
            console.log('deleted post', post);
          })
          .catch(err => {
            console.log('error ', err);
          })
      };

      $scope.showEditModalFlag = false;
      $scope.showEditModal = (post) => {
        $scope.showEditModalFlag = true;
        $scope.editTitle = post.title;
        $scope.editContent = post.content;
        $scope.editPostId = post._id;
      };

      $scope.removeEditModal = () => {
        $scope.showEditModalFlag = false;
      };

      $scope.updatePost = (title, content, postId) => {
        const post = {
          title, content
        };
        profileService.updatePost(user._id, postId, post)
          .then(response => {
            var updatedPost = response.data;
            const index = $scope.posts.findIndex(it => it._id === postId);
            if(index !== -1) {
              $scope.posts.splice(index, 1, updatedPost);
            }
          })
          .catch(err => console.log('error ', err));
        $scope.removeEditModal();
      }

      $scope.saveAvatar = function(img) {
        if (img !== null) {
          var formData = new FormData();
          formData.append('img', img);
          profileService.saveAvatar(user._id, formData)
            .then(function(response) {
              if (response.status === 200) {
                var random = (new Date()).toString();
                $scope.avatarPath = response.data.avatarPath + "?cb=" + random;

              }
            }).catch(function(error) {
             console.log('error ', error);
            })
        }
      }
      $(function() {
        //make connection
        var socket = io();
        socket.on('connect', function() {
          console.log('connected');
        })
        //buttons and inputs
        var message = $("#message")
        var username = $("#username")
        var send_message = $("#send_message")
        var send_username = $("#send_username")
        var chatroom = $("#chatroom")
        var feedback = $("#feedback")
        //Emit message
        $scope.sendMessage = function(chatMessage) {
          socket.emit('new_message', {
            message: chatMessage
          });
        };
        //Listen on new_message
        socket.on("new_message", (data) => {
          feedback.html('');
          message.val('');
          chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
        })

        //Emit a username
        // var user = $cookies.getObject('user');
        // $scope.user = user;
        // console.log($scope.user);
        $scope.sendUsername = function(username) {
          socket.emit('change_username', {
            username: username
          });
        };
        //Emit typing
        message.bind("keypress", () => {
          socket.emit('typing')
        })
        //Listen on typing
        socket.on('typing', (data) => {
          feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
        })
      })
    },
    templateUrl: '/profile/profile.html'
  });
