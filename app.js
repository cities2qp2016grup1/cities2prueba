var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // Mongoose: Libreria para conectar con MongoDB
var io = require('socket.io');
var request = require("request");
var EventEmitter = require("events").EventEmitter;
// Iniciando express
var app = express();
var users = require('./routes/users');
var operaciones = require('./routes/operaciones');
var ttp = require('./routes/ttp');
var key = require('./routes/claves');
var body = new EventEmitter();


//Middlewares express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//la ruta a los archivos estaticos (HTML, JS, ...
app.use(express.static(path.join(__dirname, 'public')));
// Plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);

////////////////////////////////////////////////////////////////////


request({
  url: 'http://localhost:8000/key', //URL to hit
  //qs: {from: 'blog example', time: +new Date()}, //Query string data
  method: 'GET', //Specify the method
/*headers: { //We can define headers too
    'Content-Type': 'MyContentType',
    'Custom-Header': 'Custom Value'
  }*/
}, function(error, response, body){
  if(error) {
    console.log(error);
  } else {
    console.log(response.statusCode, body);
  }
});



//Guardar la clave en Local Storage al inicializarse NO FUNCIONA
/*window.onload = function() {

  // Check for LocalStorage support.
  if (localStorage) {

    // Add an event listener for form submissions

    document.getElementById('contactForm').addEventListener('submit', function() {
      // Get the value of the name field.
      var clave = document.getElementById('name').value;

      // Save the name in localStorage.
      localStorage.setItem('name', name);
    });

  }

}

Cogemos la clave de local storage y la mostramos por pantalla
var name = localStorage.getItem('name');
console.log('name');*/
///////////////////////////////////////////////////////////////////


//servidor
var router = express.Router();
var server = require('http').Server(app);
app.use(router);
app.use('/server', users);
app.use('/operaciones', operaciones);
app.use('/key', key);

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