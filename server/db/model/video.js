var mongoose = require('./../mongoose.connect').mongooseConnection;
var Schema = mongoose.Schema;

var Video = mongoose.model('video', {
  filename: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createDate: {
    type: Date,
    default: new Date()
  }
});

module.exports = Video;
