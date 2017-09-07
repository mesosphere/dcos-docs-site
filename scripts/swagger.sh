#!/bin/bash

# Formatting colors
GREEN='\033[0;32m'
BLUE='\033[0;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

BUILD_DIR=./build-swagger

function swagger
{
  # Each argument
  for d in $1; do
    if [ -d "$d" ]; then
      #( printf "${GREEN}Entering ${BLUE}$d${NC}\n" )
      # For each folder or file
      for f in $d/*; do
        # If folder
        if [ -d "$f" ]; then
          #( printf "${GREEN}Folder ${BLUE}$f${NC}\n" )
          ( swagger $f )
        fi
        # If.yaml file
        if [ -f "$f" ] && [ ${f: -5} == ".yaml" ]; then
          (

            # Only process swagger yaml files
            line=$(head -n 1 $f )
            if [[ $line != *"swagger:"* ]]; then
              return
            fi

            # Debug
            printf "${GREEN}File ${BLUE}$d${NC}\n"
            printf "${GREEN}File ${BLUE}$f${NC}\n"

            # Get filename
            file_basename=$(basename $f .yaml)
            printf "${GREEN}File ${BLUE}$file_basename${NC}\n"

            # Make build dir
            # Example: ./pages/example/api-1-0.yaml -> ./build-swagger/example/api-1-0
            clean_path=$(echo $d | sed 's/.*\.\/pages\///')
            build_dir=$BUILD_DIR/$clean_path/$file_basename
            if [ -d "$build_dir" ]; then
              rm -rf "$build_dir"
            fi
            mkdir -p $build_dir
            printf "${GREEN}Temp Dir${BLUE} $build_dir${NC}\n"

            # Run bootprint swagger-ui
            #node ./scripts/swagger.js "$f" "$build_dir/index.html"
            bootprint openapi "$f" "$build_dir"
            printf "${GREEN}Created html ${BLUE} $build_dir${NC}\n"

          )
        fi
      done
    fi
  done
}

function clean
{
  rm -rf $BUILD_DIR
}

clean
swagger ./pages $1