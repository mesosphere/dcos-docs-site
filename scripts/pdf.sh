#!/bin/bash
#
# Usage:       pdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Sends html files to Docker container wkhtmltopdf-aas
#              and generates a pdf for each file
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
      ( printf "${GREEN}Entering ${BLUE}$d${NC}\n" )
      # For each folder or file
      for f in $d/*; do
        # If folder
        if [ -d "$f" ]; then
          ( printf "${GREEN}Folder ${BLUE}$f${NC}\n" )
          ( main $f $2 $3 )
        fi
        # If.html file
        if [ -f "$f" ] && [ ${f: -5} == ".html" ]; then
          (

            # Debug
            printf "${GREEN}File ${BLUE}$f${NC}\n"

            # Remove ./build from path name
            clean_path=$(echo $d | sed 's/.*\.\/build\///')

            # Create filename based on cleaned path name
            pdf_file_name=$(echo $clean_path | tr '/' '-').pdf

            # Make build dir
            # Example: ./build/example/index.html -> ./build-pdf/example/example.pdf
            build_dir=$2/$clean_path

            #if [ -d "$build_dir" ]; then
            #  rm -rf "$build_dir"
            #fi
            mkdir -p $build_dir
            printf "${GREEN}Temp Dir${BLUE} $build_dir${NC}\n"

            # Debug
            printf "${GREEN}Creating PDF File ${PURPLE}$d/$pdf_file_name${NC}\n"

            # Create PDF
            options='options={"print-media-type":"","javascript-delay":"3000"}'
            curl -X POST -vv -F "file=@$f" -F $options  $3 -o "$build_dir/$pdf_file_name"

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
DOCKER_HOST_PORT=$3

clean $OUTPUT_FOLDER
docker-compose -f ./docker/docker-compose.pdf.yml up -d
main $INPUT_FOLDER $OUTPUT_FOLDER $DOCKER_HOST_PORT
