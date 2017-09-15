#!/bin/bash

if [ -d "./build" ]; then
  rm -rf "./build"
fi

if [ -d "./build-swagger" ]; then
  rm -rf "./build-swagger"
fi

if [ -d "./build-ngindox" ]; then
  rm -rf "./build-ngindox"
fi
