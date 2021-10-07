![plot](https://github.com/bibimchi/whiteplayground.frontend/blob/master/src/asset/favicon.png)

## Development Recipe
* clone repository
* npm install
* npm run start
* open browser to http://localhost:8080

## Docker Recipe
* clone repository
* npm install
* npm build:local
* docker build -t imagename .
* docker run --detach --publish 8282:8282 --name containername imagegname
* open browser to http://localhost:8282

## Demo
* [here](https://kimchistudio.tech/wp/front)

## Docker image
* [here](https://hub.docker.com/repository/docker/kimchiboy/wp_front)
