#!/bin/bash

function pdf
{
  # Formatting colors
  GREEN='\033[0;32m'
  BLUE='\033[0;33m'
  PURPLE='\033[0;35m'
  NC='\033[0m'
  # Each argument
  for d in $1; do
    if [ -d "$d" ]; then
      ( printf "${GREEN}Entering ${BLUE}$d${NC}\n" )
      # For each folder or file
      for f in $d/*; do
        # If folder
        if [ -d "$f" ]; then
          ( printf "${GREEN}Folder ${BLUE}$f${NC}\n" )
          ( pdf $f )
        fi
        # If.html file
        if [ -f "$f" ] && [ ${f: -5} == ".html" ]; then
          (
            # Debug
            printf "${GREEN}File ${BLUE}$f${NC}\n"
            # Remove ./build from path name
            cleaned_path=${d/.\/build\//}
            # Create filename based on cleaned path name
            pdf_file_name=$(echo $cleaned_path | tr '/' '-').pdf
            # Debug
            printf "${GREEN}Creating PDF File ${PURPLE}$d/$pdf_file_name${NC}\n"
            # Create PDF
            HTML_FILES=$f OUTPUT_FILE="$d/$pdf_file_name" docker-compose up
          )
        fi
      done
    fi
  done
}

pdf ./build/docs