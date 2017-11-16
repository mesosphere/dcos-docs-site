#!/bin/bash
#
# Usage:       swagger.sh input_dir output_dir
#
# Description: Builds SwaggerUI html
#

# Formatting colors
GREEN='\033[0;32m'
BLUE='\033[0;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

function clean
{
  if [ -d $1 ]; then
    rm -rf $1
  fi
}

function main
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
          ( main $f $2 )
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
            build_dir=$2/$clean_path/$file_basename
            if [ -d "$build_dir" ]; then
              rm -rf "$build_dir"
            fi
            mkdir -p $build_dir
            printf "${GREEN}Temp Dir${BLUE} $build_dir${NC}\n"

            # Run bootprint swagger-ui
            #bootprint openapi "$f" "$build_dir"

            # Use npm cmd to avoid npm global packages
            node ./node_modules/bootprint/bin/bootprint.js openapi "$f" "$build_dir"

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

#
#
#

INPUT_FOLDER=$1
OUTPUT_FOLDER=$2

clean $OUTPUT_FOLDER
main $INPUT_FOLDER $OUTPUT_FOLDER
