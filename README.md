#Proyecto de Cities 2
Probando angular, node, mongo y express

#Dependencias servidor (en la raiz: "npm install")
- angular
- big-integer
- bignum
- body-parser
- consolidate
- ejs
- express
- http
- jade
- jquery
- jsbn
- mongoose
- mongoose-middleware
- ngstorage
- node-localstorage
- socket.io

#Dependencias cliente ("cd public" + "bower install")
- angular
- angular-md5
- angular-route
- angular-ui-router
- bootstrap
- jquery
- animate.css
- font-awesome
- sweetalert2

#MongoDB
Crear 3 collections dentro de la base de datos cities2:

Importar los archivos users.json, claves.json y chats.json como collections de una DB llamada cities2

`users`
Usar el archivo users.json

`mongoimport --db cities2 --collection users --drop < users.json`

----------
`claves`
Usar el archivo claves.json

`mongoimport --db cities2 --collection claves --drop < claves.json`

----------
`chats`
Usar el archivo chats.json

`mongoimport --db cities2 --collection chats --drop < chats.json`

----------