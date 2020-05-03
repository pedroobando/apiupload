# apiupload

## Description
  apirest para guardar datos de images, conexion de base de datos mongo.

## Running the app

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
  $ docker build -t apilogistimg .

# Crear el contenedor
  $ docker run --name apilogist -it -d -p 3001:3001 apilogistimg

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
