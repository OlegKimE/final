var router = require('express').Router();
var multer = require('multer');
var Grid = require('gridfs-stream');
var gridfs = require('mongoose-gridfs');


var Video = require('./../db/model/video');
var Post = require('./../db/model/post');
var User = require('./../db/model/user');

var path = require('path');
var fs = require('fs');
var mongodb = require('mongodb');
var mongoDriver = ('mongoose-gridfs');

/* SAVE video */
  router.put('/api/videos', function(req, res) {
  // var bucket = new mongodb.GridFSBucket(res);
  var gfs = new Grid("myDatabase", mongoDriver);
  // var userId = req.user._id;
  var content = req.body.content;
  var filePath = "";
  try {
    filePath = req.file.path;
  } catch (e) {
    console.log('error ', e);
  }
  var writestream = gfs.createWriteStream({
        // author: userId,
        filename: file,
        content: content
    });

  fs.createReadStream(filePath).pipe(writestream);
  writestream.on('close', function (file) {
      console.log(file.filename + 'Written To DB');
    }) .catch(function(error) {
      res.send(error);
    });
});
//Delete
router.delete('/api/posts/:postId/videos/:videoId', async function(req, res) {
  if (req.isUnauthenticated()) {
    return res.status(401).send('Unauthorized'); //Unauthorized
  }
  var postId = req.params.postId;
  var videoId = req.params.videoId;
  try {
    const deletedVideo = await Video.findByIdAndRemove(videoId);
    if (deletedVideo) {
      var video = await Post.findById(postId);
      post.videos = post.videos.filter(video => video._id.equals(deletedVideo._id));
      await post.save();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
