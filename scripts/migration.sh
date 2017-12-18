#!/bin/bash
#
# Usage:       migration.sh input_folder output_folder
#
# Description: Migrates markdown folder structure from
#              https://github.com/mesosphere/dcos-docs-enterprise
#              to
#              https://github.com/mesosphere/dcos-docs-site
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
  sed -i'' -e 's/post_title:/title:/g' $1

  # navigationTitle:
  sed -i'' -e 's/nav_title:/navigationTitle:/g' $1

  # menuWeight
  sed -i'' -e 's/menu_order:/menuWeight:/g' $1

  # excerpt:
  sed -i'' -e 's/post_excerpt:/excerpt:/g' $1

  # excerpt: ""
  sed -i'' -e 's/excerpt: ""/excerpt:/g' $1

  # enterprise: 'yes'
  sed -i'' -e "s/enterprise: 'yes'/enterprise: true/g" $1

  # enterprise: 'no'
  sed -i'' -e "s/enterprise: 'no'/enterprise: false/g" $1

  # oss: 'yes'
  sed -i'' -e "s/oss: 'yes'/oss: true/g" $1

  # oss: 'no'
  sed -i'' -e "s/oss: 'no'/oss: false/g" $1

  # featureMaturity:
  sed -i'' -e 's/feature_maturity:/featureMaturity:/g' $1

  # featureMaturity: ""
  sed -i'' -e 's/featureMaturity: ""/featureMaturity:/g' $1

  # excerpt:
  # If not found, add
  if ! grep -q "excerpt:" $1; then
    sed -i'' -e '1s/---/---\nexcerpt:/' $1
  fi

  # menuWeight:
  # If not found, add
  if ! grep -q "menuWeight:" $1; then
    sed -i'' -e '1s/---/---\nmenuWeight: 0/' $1
  fi

  # navigationTitle:
  # If not found, add
  if ! grep -q "navigationTitle:" $1; then
    title=`grep -o -P '(?<=title:).*' $1`
    sed -i'' -e "1s/---/---\nnavigationTitle: $title/" $1
  fi

  # title:
  # If not found, add
  if ! grep -q "title:" $1; then
    sed -i'' -e '1s/---/---\ntitle: Title/' $1
  fi

  # layout:
  # If not found, add
  if ! grep -q "layout:" $1; then
    sed -i'' -e '1s/---/---\nlayout: layout.pug/' $1
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
DOCS_1_11_PATH=./pages/1.11
DOCS_1_10_PATH=./pages/1.10
DOCS_1_9_PATH=./pages/1.9
DOCS_1_8_PATH=./pages/1.8
DOCS_1_7_PATH=./pages/1.7
SERVICES_PATH=./pages/services
if [ -d "$DOCS_1_11_PATH" ]; then
  rm -rf "$DOCS_1_11_PATH"
fi
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

if [ -d "$SERVICES_PATH" ]; then
  rm -rf "$SERVICES_PATH"
fi
mkdir ./pages/1.11
mkdir ./pages/1.10
mkdir ./pages/1.9
mkdir ./pages/1.8
mkdir ./pages/1.7
mkdir ./pages/services

# Migrate
main ../dcos-docs-enterprise/1.11 ./pages/1.11
main ../dcos-docs-enterprise/1.10 ./pages/1.10
main ../dcos-docs-enterprise/1.9 ./pages/1.9
main ../dcos-docs-enterprise/1.8 ./pages/1.8
main ../dcos-docs-enterprise/1.7 ./pages/1.7
main ../dcos-docs-enterprise/service-docs ./pages/services

# Log
printf "${PURPLE}\nContent Migration finished.${NC}\n"
