#!/bin/bash
#
# Usage:       clean.sh
#
# Description: Removes all build folders generated in the project
#

if [ -d "./build" ]; then
  rm -rf "./build"
fi

if [ -d "./build-swagger" ]; then
  rm -rf "./build-swagger"
fi

if [ -d "./build-ngindox" ]; then
  rm -rf "./build-ngindox"
fi

if [ -d "./build-pdf" ]; then
  rm -rf "./build-pdf"
fi
