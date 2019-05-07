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

GIT_BRANCH=$GIT_BRANCH \
docker-compose build --no-cache pdf
