#!/bin/bash

version=$1
if [ -z "$version" ]; then echo "Enter a version string for this release as the first argument."; exit 1; fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$SCRIPT_DIR/dcos-commons-merge.sh kafka $version "Kafka"
