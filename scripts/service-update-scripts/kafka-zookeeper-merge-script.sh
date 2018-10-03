#!/bin/bash

version=$1
if [ -z "$version" ]; then echo "Enter a version string for this release as the first argument."; exit 1; fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

REPO_NAME="dcos-zookeeper" \
REPO_URL="git@github.com:mesosphere/dcos-zookeeper.git" \
TEMPLATE_BRANCH="sdk-0.40" \
BETA_BRANCH="update-docs" \
STABLE_BRANCH="update-docs" \
  $SCRIPT_DIR/dcos-commons-merge.sh kafka-zookeeper $version "Kafka ZooKeeper"
