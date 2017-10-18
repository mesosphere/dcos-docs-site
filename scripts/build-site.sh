#!/bin/bash
#
# Usage:       build-site.sh
#
# Description: Builds docker image
#

docker_image=mesosphere/dcos-docs-site:latest

docker_image_build_id=$(docker images -q $docker_image)

if [[ "$docker_image_build_id" != "" ]]; then
  docker rmi $docker_image
fi

#docker-compose -f ./docker/docker-compose.production.yml build --force-rm --no-cache docs
docker-compose -f ./docker/docker-compose.production.yml build docs
