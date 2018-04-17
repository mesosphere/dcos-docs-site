#!/bin/bash
#
# Usage:       build-pdf.sh
#
# Description: Builds docker image
#

docker_image=mesosphere/dcos-docs-pdf:latest

docker_image_build_id=$(docker images -q $docker_image)

if [[ "$docker_image_build_id" != "" ]]; then
  docker rmi $docker_image
fi

#LOG="THIS IS DEBUG MESSAGE AND ITS VERY IMPORTANT" \
LOG=$(git diff "${GIT_PREVIOUS_SUCCESSFUL_COMMIT}"..HEAD --name-only | grep .md) \
GIT_BRANCH=$GIT_BRANCH \
docker-compose -f ./docker/docker-compose.production.yml build --no-cache pdf
