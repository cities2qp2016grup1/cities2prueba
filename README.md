#Proyecto de Cities 2
Probando angular, node, mongo y express

#Dependencias
- angular
- bignum
- body-parser
- consolidate
- ejs
- express
- http
- jade
- jquery
- mongoose
- socket.io

#MongoDB
Crear 2 collections dentro de la base de datos cities2:

Importar los archivos users.json y claves.json como collections de una DB llamada cities2

`users`
Usar el archivo users.json

`mongoimport --db cities2 --collection users < users.json`

----------
`claves`
Usar el archivo claves.json

`mongoimport --db cities2 --collection claves < claves.json`

----------