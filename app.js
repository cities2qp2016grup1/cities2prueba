var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var io = require('socket.io');
// Iniciando express
var app = express();
var users = require('./routes/users');
var operaciones = require('./routes/operaciones');
var ttp = require('./routes/ttp');

//Middlewares express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//la ruta a los archivos estaticos (HTML, JS, ...
app.use(express.static(path.join(__dirname, 'public')));
// Plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

//servidor
var router = express.Router();
var server = require('http').Server(app);
app.use(router);
app.use('/server', users);
app.use('/operaciones', operaciones);


// Conexión a la base de datos de MongoDB que tenemos en local
require('mongoose-middleware').initialize(mongoose);
mongoose.connect('mongodb://localhost/cities2', function(err, res) {
  if (err) throw err;
  console.log('Conectado con éxito a la Base de Datos');
});

// Start server
server.listen(8000, function() {
  console.log("Servidor Principal http://localhost:8000/");
});

//
//
//
//para el servidor ttp:
var app2 = express();
app2.use(router);
//Middlewares express
app2.use(bodyParser.json());
app2.use(bodyParser.urlencoded({extended: false}));
//la ruta a los archivos estaticos (HTML, JS, ...
app2.use(express.static(path.join(__dirname, 'public')));
// Plantillas jade
app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'jade');
//Pagina en '/' (para ver algo)
/*app2.get('/', function(req, res, next) {
  res.render('index', { title: 'Servidor TTP (Trusted Third Party)' });
});*/
//rutas
app2.use('/ttp', ttp);
var server2 = require('http').Server(app2);
server2.listen(3000, function() {
  console.log("Servidor TTP en http://localhost:3000/");
});
//
//
//