var express = require('express');
var http = require('http')
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var websocket = socketio(server, { pingTimeout: 30000, timeout: 30000 });
server.listen(3000, () => console.log('listening on *:3000'));

var random_name = require('node-random-name');
var models = require('./models');

var clients = {}
var users = {}
var user_id = 1

websocket.on('connection', socket => {
    clients[socket.id] = socket;
    socket.on('userJoined', userId => onUserJoined(userId, socket));
    socket.on('message', message => onMessageReceived(message, socket));
    socket.on('login', params => login(params[0],params[1], socket));
});

function onUserJoined(userId, socket) {
  try {
    if (!userId) {
      var user = models.user.create({name: random_name()}).then( user => {
        socket.emit('userJoined', `${user.id}` );
        users[socket.id] = user.id;
        _sendExistingMessages(socket)
      });
    } else {
      users[socket.id] = userId
      _sendExistingMessages(socket)
    }
  } catch(err) {
    console.log(err)
  }
}

function onMessageReceived(message, senderSocket) {
  var userId = users[senderSocket.id]
  if (!userId) return;
  _sendAndSaveMessage(message, senderSocket)
}

function _sendExistingMessages(socket) {
  var messages = models.message.findAll({ where: {user_id} }).then( messages => {
    messages = messages.map(m => ({
        _id: m.id,
        content: m.content,
        createdAt: m.createdAt,
        user: {
          _id: m.user_id,
          name: 'React Native'
        }
    }))
    socket.emit('message', messages.reverse());
  })
}

function _sendAndSaveMessage(message, socket, fromServer) {
  var m = {
    content: message.text,
    user_id: message.user._id,
    createdAt: new Date(message.createdAt),
  }
  models.message.create(m).then( message => {
    var emitter = fromServer ? websocket : socket.broadcast;
    emitter.emit('message', [{
      _id: message.id,
      text: m.content,
      createdAt: m.createdAt,
      user: {
        _id: m.user_id,
        name: 'React Native'
      }
  }])
  })
}

function login(email, password, socket){
  models.user.findOne({where: {email}}).then(user => {
    if(password == user.password){
      socket.emit('logado', user);
    }else{
      socket.emit('logado',false);
    }
  });
}

var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  var msg = {
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }
  _sendAndSaveMessage( msg, null, true);
});