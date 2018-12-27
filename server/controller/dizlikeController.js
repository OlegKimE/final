var router = require('express').Router();

var Post = require('./../db/model/post');
var User = require('./../db/model/user');
var Dizlike = require('./../db/model/dizlike');
var Like = require('./../db/model/like')

//сохранение дизлайков
router.post('/api/posts/:postId/dizlikes', async function(req, res) {
  if (req.isUnauthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  var userId = req.user._id;
  var postId = req.params.postId;

  try {
    var post = await Post.findById(postId);
    var deletedLike = await Like.findOneAndDelete({post: postId, author: userId});
    if (!post) {
      return res.status(400).send('Post id is not valid');
    }

    var dizlike = new Dizlike({
      author: userId,
      post: postId
    });

    var savedDizlike = await dizlike.save();

    res.status(201).send(savedDizlike);
  } catch (e) {
    console.log('Error ', e);
    res.status(500).send(e);
  }
});

// удаление дизлайков
router.delete('/api/posts/:postId/dizlikes', async function(req, res) {
  if (req.isUnauthenticated()) {
    return res.status(401).send('Unauthorized');
  }

  var userId = req.user._id;
  var postId = req.params.postId;

  try {
    var deletedDizlike = await Dizlike.findOneAndDelete({post: postId, author: userId});

    if (!deletedDizlike) {
      return res.status(400).send('Bad params');
    }

    res.status(204).send(deletedDizlike);
  } catch (e) {
    console.log('error ', e);
    res.status(500).send(e);
  }

  res.status(204).send(deletedDizlike);
});
module.exports = router;
