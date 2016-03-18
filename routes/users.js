module.exports = function (app) {

  var User = require('../models/user.js');

//GET - GET All Users By Into DB
  AllUsers = function (req, res) {
      User.find(function (err, users) {
          if (err) res.send(500, err.message);
          console.log('GET /allusers');
          res.status(200).jsonp(users);
        });
    };
//POST - Add User in DB
  addUser = function (req, res) {
    console.log('POST /user');
    console.log(req.body);
    var user = new User({
      nombre:    req.body.nombre,
      ciudad:     req.body.ciudad
    });

    user.save(function(err, user) {
      if(err) return res.status(500).send( err.message);
      res.status(200).jsonp(user);
    });
  };
//GET - TTP saluda a server y server devuelve saludo
  hiserver = function (require, result){
    result.status(200).send("OK");
  };
//endpoints
  app.get('/server/allusers', AllUsers);
  app.post('/server/adduser', addUser);
  app.get('/server/hiserver', hiserver);
};
