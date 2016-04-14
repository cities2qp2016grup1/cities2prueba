#Proyecto de Cities 2
Probando angular, node, mongo y express

#Dependencias
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
- mongoose
- mongoose-middleware
- ngstorage
- node-localstorage
- socket.io

#MongoDB
Crear 2 collections dentro de la base de datos cities2:

Importar los archivos users.json y claves.json como collections de una DB llamada cities2

`users`
Usar el archivo users.json

`mongoimport --db cities2 --collection users --drop < users.json`

----------
`claves`
Usar el archivo claves.json

`mongoimport --db cities2 --collection claves --drop < claves.json`

----------