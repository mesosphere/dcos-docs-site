#!/bin/bash
#
# Usage:       build-pdf-validation.sh
#
# Description: Validates there was a docker image build
#

docker_image_build_id=$(docker images -q mesosphere/dcos-docs-pdf:latest)

if [[ "$docker_image_build_id" == "" ]]; then
  exit 1
fi

exit 0

