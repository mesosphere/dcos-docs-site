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
  # title:
  sed -i -e 's/post_title:/title:/g' $1

  # navigationTitle:
  sed -i -e 's/nav_title:/navigationTitle:/g' $1

  # menuWeight
  sed -i -e 's/menu_order:/menuWeight:/g' $1

  # excerpt:
  sed -i -e 's/post_excerpt:/excerpt:/g' $1

  # excerpt: ""
  sed -i -e 's/excerpt: ""/excerpt:/g' $1

  # enterprise: 'yes'
  sed -i -e "s/enterprise: 'yes'/enterprise: true/g" $1

  # enterprise: 'no'
  sed -i -e "s/enterprise: 'no'/enterprise: false/g" $1

  # featureMaturity:
  sed -i -e 's/feature_maturity:/featureMaturity:/g' $1

  # featureMaturity: ""
  sed -i -e 's/featureMaturity: ""/featureMaturity:/g' $1

  # layout:
  sed -i -e '1s/---/---\nlayout: layout.pug/' $1

  # title:
  # If no title is found, add
  if ! grep -q "title:" $1; then
    sed -i '/---/i\title: Title' $1
    sed -i 1d $1
  fi

  # navigationTitle:
  # If no navigationTitle is found, add
  if ! grep -q "navigationTitle:" $1; then
    title=`grep -o -P '(?<=title:).*' $1`
    sed -i "/---/i\navigationTitle: $title" $1
    sed -i 1d $1
  fi

  # menuWeight:
  # If no menuWeight is found, add
  if ! grep -q "menuWeight:" $1; then
    sed -i '/---/i\menuWeight: 0' $1
    sed -i 1d $1
  fi

  # excerpt:
  # If no excerpt is found, add
  if ! grep -q "excerpt:" $1; then
    sed -i '/---/i\excerpt:' $1
    sed -i 1d $1
  fi

  # enterprise:
  # If no enterprise is found, add
  if ! grep -q "enterprise:" $1; then
    sed -i '/---/i\enterprise: false' $1
    sed -i 1d $1
  fi

  ## URL
  sed -i -e 's/\/1.10\//\/docs\/1.10\//g' $1
  sed -i -e 's/\/1.9\//\/docs\/1.9\//g' $1
  sed -i -e 's/\/1.8\//\/docs\/1.8\//g' $1
  sed -i -e 's/\/1.7\//\/docs\/1.7\//g' $1
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
          # Skip link
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

# Clean
DOCS_1_10_PATH=./pages/docs/1.10
DOCS_1_9_PATH=./pages/docs/1.9
DOCS_1_8_PATH=./pages/docs/1.8
DOCS_1_7_PATH=./pages/docs/1.7
if [ -d "$DOCS_1_10_PATH" ]; then
  rm -rf "$DOCS_1_10_PATH"
fi
if [ -d "$DOCS_1_9_PATH" ]; then
  rm -rf "$DOCS_1_9_PATH"
fi
if [ -d "$DOCS_1_8_PATH" ]; then
  rm -rf "$DOCS_1_8_PATH"
fi
if [ -d "$DOCS_1_7_PATH" ]; then
  rm -rf "$DOCS_1_7_PATH"
fi
mkdir ./pages/docs/1.10
mkdir ./pages/docs/1.9
mkdir ./pages/docs/1.8
mkdir ./pages/docs/1.7

# Migrate
main ../dcos-docs-enterprise/1.10 ./pages/docs/1.10
main ../dcos-docs-enterprise/1.9 ./pages/docs/1.9
main ../dcos-docs-enterprise/1.8 ./pages/docs/1.8
main ../dcos-docs-enterprise/1.7 ./pages/docs/1.7

# Log
printf "${PURPLE}\nContent Migration finished.${NC}\n"