#!/bin/bash
#
# Usage:       reduce-pages.sh
#
# Description: Removes majority of content pages for quicker development builds
#

shopt -s extglob
rm -rf ./pages/1.11/!(index.md|overview|img)
rm -rf ./pages/1.10/!(index.md)
rm -rf ./pages/1.9/!(index.md)
rm -rf ./pages/1.8/!(index.md)
rm -rf ./pages/1.7/!(index.md)
rm -rf ./pages/services/!(index.md|cassandra|jenkins)
