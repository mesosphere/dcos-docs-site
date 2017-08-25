#!/bin/bash

#
# Migrates markdown folder structure from
# https://github.com/dcos/dcos-docs
# to
# https://github.com/mesosphere/dc-os-docs
#

#
# Usage
# ./migrate.sh input_folder output_folder
#

#
# For each item in directory
#   If folder, create folder in new dir
#      Enter old folder, call method
#   If index.md file, create file in new dir
#   If file, create folder in new dir
#

# Formatting colors
GREEN='\033[0;32m'
BLUE='\033[0;33m'
PURPLE='\033[0;35m'
RED='\033[0;91m'
NC='\033[0m'

function create_folder_from_folder
{
  printf "${PURPLE}Creating folder from folder: ${BLUE}${1}${NC}\n"
  mkdir $1
}

function create_folder_from_file
{
  printf "${PURPLE}Creating folder from file: ${BLUE}${1}${NC}\n"
  mkdir $1
}

function copy_file
{
  printf "${PURPLE}Copy from: ${BLUE}${1}${NC}\n"
  printf "${PURPLE}Copy to: ${BLUE}${2}${NC}\n"
  cp $1 $2
}

function  reformat_file_frontmatter
{
  sed -i -e 's/post_title:/title:/g' $1
  sed -i -e 's/nav_title:/navigationTitle:/g' $1
  sed -i -e 's/menu_order:/menuWeight:/g' $1
  sed -i -e '1s/---/---\nlayout: layout.pug/' $1
  # If no menuWeight is found, add
  if ! grep -q "menuWeight:" $1; then
    sed -i '/---/i\menuWeight: 0' $1
    sed -i 1d $1
  fi
}

function main
{
  (
    # Debug
    printf "${GREEN}Entering Input CWD ${BLUE}$1${NC}\n"
    printf "${GREEN}Entering Ouput CWD ${BLUE}$2${NC}\n"
    # Files
    for d in $1; do
      if [ -d "$d" ]; then
        for f in $d/*; do
          # Split path
          IFS='/' read -ra fls <<< "$f"
          # Split file name parts
          IFS='.' read -ra fnp <<< "${fls[-1]}"
          file_type=${fnp[-1]^^}
          # If index.md file
          if [ -f "$f" ] && [ ${f: -8} == "index.md" ]; then
            printf "${GREEN}$file_type Index File ${BLUE}$f${NC}\n"
            copy_file $f $2/index.md
            # Reformat frontmatter
            reformat_file_frontmatter $2/index.md
          # If .md file
          elif [ -f "$f" ] && [ ${f: -3} == ".md" ]; then
            # Debug
            printf "${GREEN}$file_type File ${BLUE}$f${NC}\n"
            # Create folder
            create_folder_from_file $2/${fls[-1]::-3}
            # Copy file
            copy_file $f $2/${fls[-1]::-3}/index.md
            # Reformat frontmatter
            reformat_file_frontmatter $2/${fls[-1]::-3}/index.md
          elif [ -f "$f" ]; then
            printf "${GREEN}$file_type  File ${BLUE}$f${NC}\n"
            copy_file $f $2/${fls[-1]}
          fi
        done
      fi
    done
    # Folders
    for d in $1; do
      if [ -d "$d" ]; then
        for f in $d/*; do
          # Split path
          IFS='/' read -ra fls <<< "$f"
          new_dir=$2/${fls[-1]}
          # Skip img
          #if [ -d "$f" ] && [ ${f: -3} == "img" ]; then
          #  printf "${GREEN}Skipping Folder ${BLUE}$new_dir${NC}\n"
          #  continue
          # Skip link
          #elif [ -L "$f" ]; then
          if [ -L "$f" ]; then
            continue
          # If folder
          elif [ -d "$f" ]; then
            # Debug
            printf "\n"
            printf "${GREEN}Folder ${BLUE}$new_dir${NC}\n"
            # Create folder
            create_folder_from_folder $new_dir
            ((num_folders++))
            printf "\n"
            main $f $new_dir
          fi
        done
      fi
    done
  )
}

#
#
#

input_folder=$1
output_folder=$2

main $input_folder $output_folder

printf "${PURPLE}\nContent Migration finished.${NC}\n"