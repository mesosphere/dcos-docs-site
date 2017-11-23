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

ALGOLIA_PROJECT_ID=$ALGOLIA_PROJECT_ID \
ALGOLIA_PUBLIC_KEY=$ALGOLIA_PUBLIC_KEY \
ALGOLIA_PRIVATE_KEY=$ALGOLIA_PRIVATE_KEY \
ALGOLIA_INDEX=$ALGOLIA_INDEX \
ALGOLIA_CLEAR_INDEX=$ALGOLIA_CLEAR_INDEX \
docker-compose -f ./docker/docker-compose.production.yml build --no-cache docs
