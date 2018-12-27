var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

//Chat
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('пользователь подключен');
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
    //default username
    socket.username = "Anonymous"
    //listen on change_username
    socket.on('change_username', (data) => {
    socket.username = data.username
    console.log(socket.username);
    });
    //listen on new_message
    socket.on('new_message', function(data) {
      io.sockets.emit('new_message', {message: data.message, username: socket.username});
      console.log('data ', data);
    });
    //listen on typing
    socket.on('typing', (data) =>{
       {username: socket.username}
  });
});


/* path = Блиблиотека, помогающая работать с путями */
var mongooseConnection = require('./db/mongoose.connect').mongooseConnection;

var postRouter = require('./controller/postController');
var authController = require('./controller/authController');
var profileController = require('./controller/profileController');
var commentController = require('./controller/commentController');
var likeController = require('./controller/likeController');
var dizlikeController = require('./controller/dizlikeController');
// var chatController = require('./controller/chatController');
// var videoController = require('./controller/videoController');


var passport = require('./service/auth');
/* Указываем папку статических файлов */
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'../client/public/index')));

app.use(session({
  secret: 'some key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongooseConnection.connection })
  // name: 'sessionID'
}));

app.use(passport.initialize());
app.use(passport.session());

// //Видео
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// mongoose.connect('mongodb://127.0.0.1/test');
// var conn = mongoose.connection;
// var fs = require('fs');
// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
// conn.once('open', function () {
//     console.log('open');
//     var gfs = Grid(conn.db);
//
//     // streaming to gridfs
//     //filename to store in mongodb
//     var writestream = gfs.createWriteStream({
//         filename: 'ugolek.mp3'
//     });
//     fs.createReadStream('./ugolek.mp3').pipe(writestream);
//
//     writestream.on('close', function (file) {
//         // do something with `file`
//         console.log(file.filename + 'Written To DB');
//     });
// });
// //write content to file system
// var fs_write_stream = fs.createWriteStream('write.txt');
//
// //read from mongodb
// var readstream = gfs.createReadStream({
//      filename: 'mongo_file.txt'
// });
// readstream.pipe(fs_write_stream);
// fs_write_stream.on('close', function () {
//      console.log('file has been written fully!');
// });

app.use('/', postRouter);
app.use('/', authController);
app.use('/', profileController);
app.use('/', commentController);
app.use('/', likeController);
app.use('/', dizlikeController);
// app.use('/', chatController)
// app.use('/', videoController);
/*Отображаем index.html файл при запросе GET /* */
app.get('*', function(req, res) {
  var currentUrl = req.originalUrl;
  if (currentUrl.endsWith('/')) {
    currentUrl = currentUrl.substring(0, currentUrl.length-1);
    console.log('currentUrl ', currentUrl);
  }
  res.redirect('/#!' + currentUrl);
});

var port = 3000;
server.listen(port, function() {
  console.log('server started on port: ' + port);
});
