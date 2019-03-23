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
ALGOLIA_PROJECT_ID=$ALGOLIA_PROJECT_ID \
ALGOLIA_PUBLIC_KEY=$ALGOLIA_PUBLIC_KEY \
ALGOLIA_PRIVATE_KEY=$ALGOLIA_PRIVATE_KEY \
ALGOLIA_INDEX=$ALGOLIA_INDEX \
ALGOLIA_CLEAR_INDEX=$ALGOLIA_CLEAR_INDEX \
ALGOLIA_SKIP_SECTIONS=$ALGOLIA_SKIP_SECTIONS \
METALSMITH_SKIP_SECTIONS=$METALSMITH_SKIP_SECTIONS \
docker-compose build docs
