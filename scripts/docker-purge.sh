#!/bin/bash
#
# Usage:       docker-purge.sh
#
# Description: Removes all Docker containers, images, and volumes
#              generated in the project
#

read -p "This will delete all Docker containers, images, and volumes. Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  docker stop `docker ps -a -q`
  docker rm -v `docker ps -a -q`
  docker rmi `docker images -a -q`
  docker volume rm $(docker volume ls -f dangling=true -q)
fi