#!/bin/bash

eval $(docker-machine env markdown-notes)

export | grep DOCKER

export API_PEM=$(cat certs/api-key.pem certs/api-cert.pem | tr -d '\015' | awk 1 ORS='\\n')
export REACT_APP_PEM=$(cat certs/react-app-key.pem certs/react-app-cert.pem | tr -d '\015' | awk 1 ORS='\\n')

docker-compose pull
docker-compose build
docker-compose up --force-recreate -d
