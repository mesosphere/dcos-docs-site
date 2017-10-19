#!/bin/bash
#
# Usage:       build-site-validation.sh
#
# Description: Validates there was a docker image build
#

docker_image_build_id=$(docker images -q mesosphere/dcos-docs-site:latest)

if [[ "$docker_image_build_id" == "" ]]; then
  exit 1
fi

exit 0

