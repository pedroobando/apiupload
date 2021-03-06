# apiupload

## Description
  Crear APIREST de un simple servidor de archivos, se puede subir cualquier tipo de archivos, imagenes, pdf, etc, lo trata como un archivo binario.

  Guarda los datos en un base de datos de mongo.

## Estatus actual. - 
  Terminado.


## Rutas del API
```bash
  # ruta principal
  http:...:3002/api/file  <= ruta principal

  # solcitud de todos los archivos existentes en la base de datos
  METODO: GET
  3002:/api/file

  # Solcitud de los datos de un solo archivo
  METODO: GET
  3002:/api/file/:id

  # Subir un archivo al repositorio
  METODO: POST
  3002:/api/file

  # Eliminar o borrar un archivo al repositorio
  METODO: DELETE
  3002:/api/file/:id

  # Mostrar un archivo en el navegador (imagen / pdf / etc) - siempre que lo permita el navegador
  METODO: GET
  3002:/api/file/show/:id

  # Descargar o download un archivo del servidor
  METODO: GET
  3002:/api/file/down/:id
```

## Estructura de la base datos
```bash
  fieldname:    nombre vinculo entre el apirest y el formulario POST
                <input type="file" name="fileups">
  originalname: nombre original del arhivo
  encoding:     tamaño
  mimetype:     tipo de archivo subido
  destination:  ruta fisica donde permanece el archivo
  filename:     nombre actual del archivo
  path:         ruta y nombre del archivo con su extension
  category:     caregoria o 'se crea un direcctorio con su nombre'
  comentary:    algun comentario sobre el archivo
  _id:          campo clave en la base datos mongo
```

## formulario html
```bash
  <form action="/api/file" method="POST" enctype="multipart/form-data">
    <input type="file" name="fileups">
    <input type="hidden" name="category" value="usuarios">
    <input type="text" name="comentary">
    <button type="submit">Enviar</button>
  </form>
```

## Ejecucion de la aplicacion

```bash
# instalacion
$ yarn install

# development
$ yarn dev

# production mode
$ yarn build

# start production mode
$ yarn start
```

## La base de datos

```bash
# mongo
  base de datos es Mongo, la cual se ejecuta desde un contenidor Docker.
  mediante el comando,
  $ docker-compose up

# datos de la base de datos
  nombre: 'shared'
  USERNAME = 'admin'
  USERPASS = 'c9817803#'

# docker-compose.yml
  Contiene la configuracion del contenedor docker y mongo,
  instala de una ves la base de datos y la aplicacion mongo-express,
  permitiendo administrar de forma grafica el servidor de base de datos.

```

## rutas
```bash
  Muestra un html de ejemplo como subir los archivos
  http:/...:xxxx/
```

```bash
  API REST, ruta para subir el archivo 
  http:/...:xxxx/api/file

  Admite: GET / DELETE / POST
```


## Objetos Json 

### Upload 
```bash
{
  "_id": "5ec6d25006493f3e30d5e6b6",
  "fieldname": "fileups",
  "originalname": "pago condominio los roques mes abril 2020 - 2.pdf",
  "encoding": "7bit",
  "mimetype": "application/pdf",
  "destination": "/media/pedro/72dc98d7-136c-45cf-82a0-ce69c8443927/pedro/node/apirest/apiupload/public/uploads/usuarios",
  "filename": "113b2ea79fad41f89d0f6c3006c0444e",
  "path": "/media/pedro/72dc98d7-136c-45cf-82a0-ce69c8443927/pedro/node/apirest/apiupload/public/uploads/usuarios/113b2ea79fad41f89d0f6c3006c0444e.pdf",
  "category": "usuarios",
  "comentary": "Mes de pago condominio los roques"
}
```

## kill process active

```bash
# Primero, querrá saber qué proceso está utilizando el puerto 3000
$ sudo lsof -i :3000

# Esto enumerará todos los PID que escuchan en este puerto, una vez que tenga el PID puede terminarlo:
$ kill -9 {PID}
```

## Guia Docker

```bash
# Crear la imagen
  $ docker build -t apiupl .

# Crear el contenedor
  $ docker run --name apiupl -d --restart always -p 3010:3003 apiupl
  
  - modo interactivo 
  $ docker run --name apiupload -it -p 4010:3003 apiuplimg

# Entrar a un contenedor
  $ docker exec -i -t contenedorId /bin/bash #
  $ docker exec -i -t contenedorId /bin/sh # <= alpine

# Extraer la base datos del contenedor
  $ docker cp contenedorId:/app/logisticadb.sqlite  .

# Copiar archivo al contenedor
  $ docker cp nombredelarchivo  contenedorId:/rutadestino
```

## License

  Pedro Obando (c) is [MIT licensed](LICENSE).
