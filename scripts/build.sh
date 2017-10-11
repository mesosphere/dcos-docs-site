#!/bin/bash
#
# Usage:       build.sh
#
# Description: Builds docker image
#

docker_image_build_id=$(docker images -q mesosphere/dcos-docs:latest)

if [[ "$docker_image_build_id" != "" ]]; then
  docker rmi mesosphere/dcos-docs:latest
fi

#docker-compose -f ./docker/docker-compose.production.yml build --force-rm --no-cache docs
docker-compose -f ./docker/docker-compose.production.yml build docs
