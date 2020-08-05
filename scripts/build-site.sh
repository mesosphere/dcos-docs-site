#!/bin/bash
#
# Usage:       build-site.sh
#
# Description: Builds docker image
#

docker_image=mesosphere/dcos-docs-site:latest

docker_image_build_id=$(docker images -q $docker_image)

if [[ "$docker_image_build_id" != "" ]]; then
  echo "Stopping existing containers and unlinking volumes"
  docker-compose down --volumes
  echo "Removing the current image"
  docker rmi $docker_image
fi

GIT_BRANCH=$GIT_BRANCH \
ALGOLIA_PRIVATE_KEY=$ALGOLIA_PRIVATE_KEY \
METALSMITH_SKIP_SECTIONS=$METALSMITH_SKIP_SECTIONS \
docker-compose build docs
