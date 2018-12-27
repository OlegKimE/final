var mongoose = require('./../mongoose.connect').mongooseConnection;
var Schema = mongoose.Schema;

var Dizlike = mongoose.model('dizlike', {
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
});


module.exports = Dizlike;
