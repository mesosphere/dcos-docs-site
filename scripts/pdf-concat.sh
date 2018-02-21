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
  for d in $1; do  #$1 = ./pages
    if [ -d "$d" ]; then #-d is cd in $1 then subfolder is $d
      # For each folder or file
      for f in $d/*; do  #once in $d subfolder of ./pages
        # If folder
        if [ -d "$f" ]; then  #if it's a folder, cd in it
          ( main $f $2 )  # and go back to the initial function with it as a directory (recursively)
        fi
        # If .md file
        if [ -f "$f" ] && [ ${f: -3} == ".md" ]; then
          (
            # Add those md into an array
            #FILE_PATHS_MD=${}
            # Remove ./pages from path name
            CLEAN_PATH=$(echo $d | sed 's/.*\.\/pages\///')
            # Create new pdf root directory with the clean path under ./build-pdf
            pdf_root_dir=$2/$clean_path
            mkdir -p $pdf_root_dir
            echo $CLEAN_PATH 'clean path'

            #Variable that saves the files I want to concat to make a chapter
            INPUT_FILES="${INPUT_FILES} $CLEAN_PATH"
            echo $INPUT_FILES 'input files'
            # if there is a created pdf root directory then go in and
            if [ -d "$pdf_root_dir" ]; then

              # Root PDF file path // this creates the pdf file name
              pdf_file_name="$(echo $CLEAN_PATH | tr '/' '-')-complete-section.pdf" #new pdf name
              build_dir="$2/$CLEAN_PATH" #creates another directory under build directory
              pdf_root_file_path="$build_dir/$pdf_file_name"

              # Debug print
              printf "${GREEN}Creating PDF from root dir${BLUE}$pdf_root_dir${NC}\n"
              #find "$pdf_root_dir" -iname '*.pdf' ! -iname '*-complete-section.pdf' | tac
              find "$pdf_root_dir" -iname '*.md' ! -iname '*-complete-section.pdf' | cat

              # Create PDF
              # Ignores previously concatenated pdf files
              #files=$(find "$pdf_root_dir" -iname '*.pdf' ! -iname '*-complete-section.pdf' | cat)
              #pandoc would concat the .md files
              #pandoc
              #gs -q -sPAPERSIZE=a4 -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="$pdf_root_file_path" $files

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