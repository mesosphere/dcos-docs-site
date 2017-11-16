#!/bin/bash
#
# Usage:       ngindox.sh input_dir output_dir
#
# Description: Builds Ngindox html
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

            # Only process ngindox yaml files
            line=$(head -n 1 $f )
            if [[ $line != *"ngindox:"* ]]; then
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
            touch "$build_dir/bundle.js"
            touch "$build_dir/main.css"
            #ngindox ui -c "" -j "" -f "$f" > "$build_dir/index.html"

            # Use npm cmd to avoid npm global packages
            node ./node_modules/ngindox/bin/cli.js ui -c "" -j "" -f "$f" > "$build_dir/index.html"

            printf "${GREEN}Created html ${BLUE} "$build_dir/index.html"${NC}\n"

          )
        fi
      done
    fi
  done
}

#
#
#

INPUT_FOLDER=$1
OUTPUT_FOLDER=$2

clean $OUTPUT_FOLDER
main $INPUT_FOLDER $OUTPUT_FOLDER
