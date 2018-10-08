#! /bin/bash
#
# Usage:
# nginx-test.sh /full/path/to/config
#
# Example:
# nginx-test.sh /Users/aaronwayne/mesosphere/dcos-docs-site/docker/nginx/default.conf
#
# Description:
# This script will test an nginx config file and run it for testing.
# After testing, use the following command to shut it down:
#
# sudo nginx -s stop
#

# Stop nginx if it's running
# You may receive the following error if you do not have nginx currently
# running, that is okay you can ignore it:
# nginx: [error] open() "/usr/local/var/run/nginx.pid" failed (2: No such file or directory)
sudo nginx -s stop

# Test the config syntax
sudo nginx -t -c $1

# Run nginx with the given config
sudo nginx -c $1

