angular
  .module('moderatorModule')
  .component('moderatorComponent', {
    controller: function($scope, moderatorService, $http, $state, $rootScope) {
      $scope.showAddModal = false;
      $scope.showEditModal = false;
      $scope.selectedPost = {};
      $scope.selectedPostTitle = "";
      $scope.posts = [];
      $scope.commentText = [];

      $scope.showEditModalEvent = function(post) {
        $scope.selectedPost._id = post._id;
        $scope.selectedPost.title = post.title;
        $scope.selectedPost.author = post.author;
        $scope.selectedPost.content = post.content;

        $scope.showEditModal = true;
        $scope.selectedPostTitle = post.title;
      };

      $scope.closeEditModalEvent = function() {
        $scope.showEditModal = false;
      };
      //Изменение поста
      $scope.editPost = function(id, title, author, content) {
        var data = {
          title: title,
          author: author,
          content: content
        };
        //Отправка данных на сервер
        moderatorService.updatePost(id, data)
          .then((response) => {
            var updatedPost = response.data.post;
            var index = $scope.posts.findIndex(it => id === it._id); //сравнение id
            if (index >= 0) {
              $scope.posts.splice(index, 1, updatedPost); // 1значение найти месторасположение, 2кол-во удаляемых элементов, 3 на что менять
            }
            $scope.closeEditModalEvent();
          })
          .catch((error) => {
            console.log('error ', error);
            $scope.closeEditModalEvent();
          });
      };
          // Получение постов из базы
          var currentPage = 1;
          var perPage = 3;
          $scope.pages = [];

          function fill(currentPage, perPage) {
            moderatorService.getPosts(currentPage, perPage)
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
            fill(currentPage, perPage);
          }
        //Открытие закрытие модальных окон
      $scope.showAddModalEvent = function() {
        $scope.showAddModal = true;
      };
      $scope.closeAddModalEvent = function() {
        $scope.showAddModal = false;
      };
              //Создание поста
      $scope.addNewPost = function(title, author, content, image) {
        var data = new FormData();
        data.append("title",title);
        data.append("author", author);
        data.append("content", content);
        data.append("file", image);
        /* Отправляем запрос на postController.js на PUT /api/posts */
        //запись в базу данных
      moderatorService.createPost(data)
          .then(function(response) {  //обработка успешного кейса
            if (response.status === 200) {
              $scope.posts.push(response.data);
            }
            //Открытие закрытие модальных окон
            $scope.closeAddModalEvent();
          })
          .catch(function(error) {  //обработка ошибки
            console.log('error ', error);
            $scope.closeAddModalEvent();
          });
      };
            //удалить пост
      $scope.deletePost = function(id) {
        moderatorService.deletePost(id)
          .then(function (response) {
            $scope.posts = $scope.posts.filter(post => post._id !== id);
          })
          .catch(function (error) {
            console.log('error ', error);
          });
      }

    },
    templateUrl: '/moderator/moderator.html'
  });
