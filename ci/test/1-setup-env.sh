#!/usr/bin/env bash

# FROM jenkins-dind:0.6.0-alpine
# Source: https://github.com/mesosphere/dcos-jenkins-dind-agent
# Image: https://hub.docker.com/r/mesosphere/jenkins-dind/
# TODO: replace this setup script with a custom docker image that has these built-in

set -o errexit -o nounset -o pipefail

echo "Installing docker-compose..."
pip install docker-compose

echo "Setup Success!"
