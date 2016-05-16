var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB

// Iniciando express
var app = express();
var users = require('./routes/users');
var operaciones = require('./routes/operaciones');
var ttp = require('./routes/ttp');
var key = require('./routes/claves');
var chats = require('./routes/chats');
var mensajes = require('./routes/mensajes');

//permitir CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Middlewares express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//la ruta a los archivos estaticos (HTML, JS, ...
app.use(express.static(path.join(__dirname, 'public')));
// Plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);


//servidor
var router = express.Router();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(router);
app.use('/server', users);
app.use('/operaciones', operaciones);
app.use('/key', key);
app.use('/chats', chats);
app.use('/mensajes', mensajes);

// Conexión a la base de datos de MongoDB que tenemos en local
require('mongoose-middleware').initialize(mongoose);
mongoose.connect('mongodb://localhost/cities2', function(err, res) {
  if (err) throw err;
  console.log('Conectado con éxito a la Base de Datos');
});

//chat
var nicknames = [];
io.on('connection', function(socket){
  //entra nuevo usuario
  socket.on('newUser', function(data){
    var user_exists = false;
    for (var i=0; i<nicknames.length; i++) {
      if (nicknames[i].user == data.user) {
        user_exists = true;
        break;
      }
    }
    if (!user_exists){
      console.log ("\nHa entrado al chat: "+data);
      socket.user = data.user;
      nicknames.push (data);
      io.sockets.emit('usernames', nicknames);
    }
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Start server
server.listen(8000, function() {
  console.log("Servidor en http://localhost:8000/");
});

//
//
//
//para el servidor ttp:
var app2 = express();
app2.use(router);

//permitir CORS
app2.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//Middlewares express
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended: true}));
//la ruta a los archivos estaticos (HTML, JS, ...
app2.use(express.static(path.join(__dirname, 'public')));
// Plantillas jade
app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'jade');
app2.engine('html', require('ejs').renderFile);
//Pagina en '/' (para ver algo)
/*app2.get('/', function(req, res, next) {
  res.render('index', { title: 'Servidor TTP (Trusted Third Party)' });
});*/
//rutas
app2.use('/ttp', ttp);
var server2 = require('http').Server(app2);
server2.listen(3000, function() {
  //console.log("Servidor TTP en http://localhost:3000/");
});
//
//
//