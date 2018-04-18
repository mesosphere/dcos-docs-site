#!/bin/bash
#
# Usage:       clean.sh
#
# Description: Removes all build folders generated in the project
#

if [ -d "./build" ]; then
  rm -rf "./build"
fi

if [ -d "./build-swagger" ]; then
  rm -rf "./build-swagger"
fi

if [ -d "./build-ngindox" ]; then
  rm -rf "./build-ngindox"
fi

LATEST_MDFILES=${LATEST_MDFILES}

function selectFolder
{
    # Check if changed files is not empty
    if [[ ! -z "${CHANGED_FILES}" ]]
    then
        # substitute all spaces with a broken line
        # "/path/to/file /path/to/file2 /path/to/file3 /path/to/file4 /path/to/file5"\ | tr " " "\n"
        NEW_PATH=$(echo "${CHANGED_FILES}"\ | tr " " "\\n")
        # loop through each line
        # remove the ./pages directory
        for i in ${NEW_PATH}
        do
            # Remove ./pages from the directories to build
            local path="${i#$PAGES_DIR}"
            # Store and break the resulting folders to build in lines
            FINAL_PATH="$FINAL_PATH $(echo "${path}" \ | tr " " "\\n")"
            # Set up a string of folders to build (Version1.11, Version1.7, Services...)
            ALL_FOLDERS="$ALL_FOLDERS $(echo "$path"  | head -n1 | cut -d "/" -f1)"
        done

        # Clean duplicate directories
        ALL_DIRECTORIES=$(echo "$ALL_FOLDERS" | tr ' ' '\n' | sort | uniq)
        # Make INPUT_FOLDER be one of those at a time
        for d in $ALL_DIRECTORIES
        do
          INPUT_FOLDER=$d
          # delete d from ALL directories
          if [ -d "./build-pdf/${INPUT_FOLDER}" ]; then
            rm -rf "./build-pdf/${INPUT_FOLDER}"
          fi
        done
    else
        # Otherwise, set it to build the entire ./pages directory
        if [ -d "./build-pdf" ]; then
          rm -rf "./build-pdf"
        fi
    fi
}

selector "${LATEST_MDFILES}"