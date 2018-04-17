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

# LATEST_MDFILES="Vanessa is working on this ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
# export LATEST_MDFILES

GIT_BRANCH=$GIT_BRANCH \
docker-compose -f ./docker/docker-compose.test.yml build --no-cache pdf
