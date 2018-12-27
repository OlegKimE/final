var app = require('express');
var multer = require('multer');
var base64Img = require('base64-img');
var router = app.Router();
var Post = require('./../db/model/post');

var path = require('path');
var uploadDir = path.join(__dirname, "../uploads");

var upload = multer({ dest: uploadDir});
var Like = require('./../db/model/like');
var Dizlike = require('./../db/model/dizlike');

/* GET ALL POSTS */
router.get('/api/posts', function(req, res) {
  var perPage = parseInt(req.query.perPage); //сколько элементов на странице
  var currentPage = parseInt(req.query.currentPage); //на какой странице мы находимся
  var searchText = req.query.searchText;
  var posts;
  var total;
  if (searchText == null || searchText == 0) {
    posts =  Post.find()
      .skip((currentPage -1) * perPage) //пропустить
      .limit(perPage) //
      .populate('author', ['firstName', 'lastName'])
    var total = Post.count(); // сколько всего постов в базе
  } else {
    var regex = new RegExp(searchText, 'gi');

    posts =  Post.find({
      $or: [
        {title: regex},
        {content: regex}
        // {firstName: regex},
        // {lastName: regex}
      ]
    })
      .skip((currentPage -1) * perPage) //пропустить
      .limit(perPage) //
      .populate('author', ['firstName', 'lastName'])
    var total = Post.count({
      $or: [
        {title: regex},
        {content: regex}
        // {firstName: regex},
        // {lastName: regex}
      ]
    }); // сколько всего постов в базе

  }

  Promise.all([posts, total]).then(function(values) {
    res.send({
      posts: values[0],
      total: values[1]
    });
  }).catch(function(error) {
    console.log(error);
    res.status(500).send(error);
  })
});

//ID: 5bb77bcd2919b41e80b0f4eb
router.get('/api/posts/:id', async function(req, res) {
  var idParam = req.params.id;

  try {
    var post = await Post.findById(idParam).populate({path: 'comments'}). populate({path: 'author'});
    // console.log('post ', post);
    // populate('comments').populate('author');
    if (!post) {
      return res.status(400).send('Bad request');
    }
    var likes = await Like.count({ post: post._id });
    var userLikedAmount = 0;
    var dizlikes = await Dizlike.count({ post: post._id });
    var userDizlikedAmount = 0;

    if (req.isAuthenticated()) {
       userLikedAmount = await Like.count({ post: post._id, author: req.user._id }) //считает кол-во лайков
       userDizlikedAmount = await Dizlike.count({ post: post._id, author: req.user._id }) //считает кол-во лайков
    }
//возврат с севера
    var response = {
      post: post,
      likes: likes,
      dizlikes: dizlikes,
    };
//проверка что человек лайкал или не лайкал
    if (userLikedAmount == 0 || userDizlikedAmount == 0) {
      response.liked = false;
      response.dizliked = false;
    } else {
      response.liked = true;
      response.dizliked = true;
    }
    res.status(200).send(response);
  } catch (e) {
    console.log('error ', e);
    res.status(500).send(e);
  }
});
//DELETE
router.delete('/api/posts/:id', function(req, res) {
  var id = req.params.id;

  Post.findByIdAndRemove(id)
    .then(function(deletedPost) {
      res.send({post: deletedPost});
    })
    .catch(function(error) {
      res.send(error).status(400);
    });
});

module.exports = router;
