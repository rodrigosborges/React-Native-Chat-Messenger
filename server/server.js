var express = require('express');
var http = require('http')
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var websocket = socketio(server, { pingTimeout: 30000, timeout: 30000 });
server.listen(3000, () => console.log('listening on *:3000'));

var random_name = require('node-random-name');
var models = require('./models');
var bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var clients = {}
var users = {}
var user_id = null
var receiver_id = null

websocket.on('connection', socket => {
    clients[socket.id] = socket;
    socket.on('userJoined', params => onUserJoined(params[0],params[1], socket));
    socket.on('message', params => onMessageReceived(params, socket));
    socket.on('login', params => login(params[0],params[1], socket));
    socket.on('cadastrar', params => cadastrar(params.name, params.email, params.password, params.passwordConfirm, socket));
    socket.on('contatos', id => contatos(id, socket));
});

function onUserJoined(userId, receiver_id, socket) {
  users[socket.id] = userId
  this.user_id = userId
  this.receiver_id = receiver_id
  _sendExistingMessages(socket, userId, receiver_id)
}

function onMessageReceived(message, senderSocket) {
  var userId = users[senderSocket.id]
  if (!userId) return;
  _sendAndSaveMessage(message, senderSocket)
}

function _sendExistingMessages(socket, user_id, receiver_id) {
  var messages = models.message.findAll({ 
    where: {
      [Op.or]: [{user_id}, {user_id: receiver_id}],
      [Op.or]: [{receiver_id: user_id}, {receiver_id}]  
    }
  }).then( messages => {
    messages = messages.map(m => ({
      _id: m.id,
      text: m.content,
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
    receiver_id: this.receiver_id,
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

function contatos(id, socket){
  models.user.findAll({
    where: {
      id: {
        [Op.ne]: id,
      } 
    }
  }).then(contatos => {
    socket.emit('contatos',contatos);
  });
}

function cadastrar(name, email, password, passwordConfirm, socket){
  if(name == '' || email == '' || password == '' || passwordConfirm == '' || password != passwordConfirm){
    socket.emit('cadastrar',false);
  }else{
    models.user.findOne({where: {email}}).then(user => {
      if(user == null){
        password = bcrypt.hashSync(password);
        models.user.create({name, email, password, status: "kk eae men"}).then( user => {
          socket.emit('cadastrar',{id: user.id, remember_token: user.remember_token});
        });
      }else{
        socket.emit('cadastrar',false);
      }
    });
  }
}

function login(email, password, socket){
  if(email == '' || password == '')
    socket.emit('logado',false);
  else{
    models.user.findOne({where: {email}}).then(user => {
      if(bcrypt.compareSync(password, user.password)){
        socket.emit('logado', user);
      }else{
        socket.emit('logado',false);
      }
    });
  }
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