#!/bin/bash
#
# Usage:       pdf-concat.sh
#
# Description:
#

# Formatting colors
GREEN='\033[0;32m'
BLUE='\033[0;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

function main
{
  # Each argument
  for d in $1; do
    if [ -d "$d" ]; then
      # For each folder or file
      for f in $d/*; do
        # If folder
        if [ -d "$f" ]; then
          ( main $f $2 )
        fi
        # If .md file
        if [ -f "$f" ] && [ ${f: -3} == ".md" ]; then
          (

            # Only process files with pdfConcat front-matter
            if [[ $(grep -c '^pdfConcat: true' $f) != 1 ]]; then
              return
            fi

            # Remove ./pages from path name
            clean_path=$(echo $d | sed 's/.*\.\/pages\///')
            pdf_root_dir=$2/$clean_path

            if [ -d "$pdf_root_dir" ]; then

              # Root PDF file path
              pdf_file_name="$(echo $clean_path | tr '/' '-')-complete-section.pdf"
              build_dir="$2/$clean_path"
              pdf_root_file_path="$build_dir/$pdf_file_name"

              # Debug print
              printf "${GREEN}Creating PDF from root dir${BLUE}$pdf_root_dir${NC}\n"
              find "$pdf_root_dir" -iname '*.pdf' ! -iname '*-complete-section.pdf' | tac

              # Create PDF
              # Ignores previously concatenated pdf files
              files=$(find "$pdf_root_dir" -iname '*.pdf' ! -iname '*-complete-section.pdf' | tac)
              gs -q -sPAPERSIZE=a4 -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="$pdf_root_file_path" $files

              # Debug
              printf "${GREEN}Created ${BLUE}$pdf_root_file_path${NC}\n"

            fi

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

main $INPUT_FOLDER $OUTPUT_FOLDER