#!/bin/bash
#
# Usage:       reduce-pages.sh
#
# Description: Removes majority of content pages for quicker development builds
#

shopt -s extglob
rm -rf ./pages/docs/1.10/!(index.md|overview|img)
rm -rf ./pages/docs/1.9/!(index.md)
rm -rf ./pages/docs/1.8/!(index.md)
rm -rf ./pages/docs/1.7/!(index.md)
rm -rf ./pages/service-docs/!(index.md)
