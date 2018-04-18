#!/bin/bash
#
# Usage:       pdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Sends html files to Docker container wkhtmltopdf-aas
#              and generates a pdf for each file
#
#Set PARALLEL_JOBS Environment Variable for parallel jobs count, should not be more than the number of CPU

set -o errexit -o nounset -o pipefail

OUTPUT_FOLDER=${1}
PARALLEL_TEMPFILE=$(mktemp)

TEMP_FILES=""

GREEN='\033[0;32m'
BLUE='\033[0;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

function clean
{
    rm -rf "${1}"
    rm -f "${PARALLEL_TEMPFILE}"
}

LATEST_MDFILES=${LATEST_MDFILES}
echo ${LATEST_MDFILES}
echo "--------------------------"
# Function to determine what to build
CHANGED_FILES=${LATEST_MDFILES}

PAGES_DIR="pages/"
FINAL_PATH=""
ALL_FOLDERS=""
INPUT_FOLDER=""


DATE_LAST_SUCCESSFUL_COMMIT=${DATE_LAST_SUCCESSFUL_COMMIT}
GIT_HASH_TRIM=${GIT_HASH_TRIM}


function cleanVersion
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


# Function to determine which version need to be built
function selectFolder
{
    # Check if changed files is not empty
    if [[ ! -z "${CHANGED_FILES}" ]]
    then
        # substitute all spaces with a broken line
        # "/path/to/file /path/to/file2 /path/to/file3 /path/to/file4 /path/to/file5"\ | tr " " "\n"
        NEW_PATH=$(echo "${CHANGED_FILES}"\ | tr " " "\\n")
        echo $NEW_PATH
        # loop through each line
        # remove the ./pages directory
        for i in ${NEW_PATH}
        do
            # Remove ./pages from the directories to build
            local path="${i#$PAGES_DIR}"
            echo $path 'this is i'
            # Store and break the resulting folders to build in lines
            FINAL_PATH="$FINAL_PATH $(echo "${path}" \ | tr " " "\\n")"
            # Set up a string of folders to build (Version1.11, Version1.7, Services...)
            ALL_FOLDERS="$ALL_FOLDERS $(echo "$path"  | head -n1 | cut -d "/" -f1)"
            echo "All folders = " $ALL_FOLDERS
        done

        # This is going to output all final paths
        FINAL_PATH=$(echo "${FINAL_PATH}"\ | tr " " "\\n")
        echo "All final paths = " $FINAL_PATH
        # Clean duplicate directories
        ALL_DIRECTORIES=$(echo "$ALL_FOLDERS" | tr ' ' '\n' | sort | uniq)
        echo "ALl directories here" $ALL_DIRECTORIES
        # Make INPUT_FOLDER be one of those at a time
        for d in $ALL_DIRECTORIES
        do
          INPUT_FOLDER=$d
          echo "-------- ${d}"
          # delete d from ALL directories
          # main
          echo main "${INPUT_FOLDER}" "${OUTPUT_FOLDER}"
          main "${INPUT_FOLDER}" "${OUTPUT_FOLDER}"
        done
    else
        # Otherwise, set it to build the entire ./pages directory
        INPUT_FOLDER=""
        main "${INPUT_FOLDER}" "${OUTPUT_FOLDER}"
    fi
}


function main
{
   #cd $INPUT_FOLDER
   while IFS= read -r -d '' SOURCE_FILE
   do
    echo $SOURCE_FILE
     # Strip the input_folder from filepath, not to include it within output folder and Destination filename
     local FILE_PATH=${SOURCE_FILE}
     # Strip the filename and get only the full directory path for the file
     local FILE_PATH="${FILE_PATH%/*}"
     # Strip the first / or ./ from the beginning of file path
     local FILE_PATH="${FILE_PATH#*/}"
     # Destination directory for pdf file
     local PDF_DEST_DIR="${OUTPUT_FOLDER}"/"${FILE_PATH}"
     # Remove INPUT_FOLDER from filename
     local PDF_FILE_NAME="${SOURCE_FILE#$INPUT_FOLDER}"
     # Remove leading ./ or / from filename, as find will output files with leading ./ or /
     local PDF_FILE_NAME="${PDF_FILE_NAME#*/}"
     # Replace all "/" characters in filename to "-" and append .pdf
     local PDF_FILE_NAME="${FILE_PATH//\//-}"
     # Change file extension from .html to .pdf
     local PDF_FILE_NAME="${PDF_FILE_NAME/%.md/.pdf}"
     # local RESOURCE_PATH="$"
     # echo "$PDF_FILE_NAME" "file name"
     # For example if SOURCE_FILE=./build/1.10/cli/dcos-marathon-group-scale-index.html
     # PDF_FILE_NAME will be 1.10-cli-dcos-marathon-group-scale-index.html.p
     # Make the Destination directory
     mkdir -p "${PDF_DEST_DIR}"

     # There is an index.md whithing every file
     FILE_NAME="index.md"
     # We create a tmpfile to send to Pandoc with the markdown
     TEMP_FILE=$(mktemp)
     echo $FILE_PATH
    # We find the index.md per folder so the final pdf is organised per folder not natively recursive
    while IFS= read -r SOURCE_FOLDERS
      do
        # Target all the folder names
        local d="$SOURCE_FOLDERS"
        # Target all the files whithin the foler by the same name
        NEW_FILE="${d}/${FILE_NAME}"
        echo "new file here " $NEW_FILE
        if [ -f "${NEW_FILE}" ]
        then
          MARKDOWN_FILE=$(mktemp)

          # Target the title in metadata to introduce them as h1 in the documents
          while read -r MARKDOWN_SOURCE;
          do
            if [[ "${MARKDOWN_SOURCE}" =~ title:[[:space:]]([ a-zA-Z0-9]*) ]]; then
              # Find the title in the file and put it in the file
              TITLE="${BASH_REMATCH[1]}"
              echo "" >> ${MARKDOWN_FILE}
              echo "# ${TITLE}" >> ${MARKDOWN_FILE}
              echo "" >> ${MARKDOWN_FILE}
              break
            fi
          done < "${NEW_FILE}"

          cat "${NEW_FILE}" >> "${MARKDOWN_FILE}"

          # Fix for all current H2
          sed -i '4,$s/^#[[:space:]]/## /g' "${MARKDOWN_FILE}"

          # Create temporary file with all md content to send to pandoc
          # this avoids very long urls & long strings (Pandoc has a string limit)
          TEMP_FILES="${TEMP_FILES} ${TEMP_FILE}"
          echo "" >> "${TEMP_FILE}"
          cat "${MARKDOWN_FILE}" >> "${TEMP_FILE}"
          rm -f ${MARKDOWN_FILE}
        fi
      # Find recursively all the directories whithin a folder
      done < <(find "${PAGES_DIR}${FILE_PATH}" )

     # Fix for absolute paths images urls
     sed -i 's,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.png\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.jpg\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.jpeg\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.gif\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.svg\),..\1\2,g' "${TEMP_FILE}"
     sed -i 's,@,at,g' "${TEMP_FILE}"

     # Unicode characters to encode into UTF8.
     CHARS=$(python -c 'print u"\u2060\u0080\u0099\u009C\u009d\u0098\u0094\u0082\u00a6\u0089\u00a4\u00a5\u0093\u2019\u2018\u201C\u201D\u25CF\u00bd".encode("utf8" )')
     sed -i 's/['"$CHARS"']//g' "${TEMP_FILE}"
     # remove spaces and breaks at the end of lines
     sed -i 's,[[:blank:]]*$,,g' "${TEMP_FILE}"

     # Math fractions now supported
     sed -i 's,\xc2\xbd,1/2,g' "${TEMP_FILE}"

     # We cut all long strings at 180 characters.
     sed -i -r 's/.{180}/&\n/g' "${TEMP_FILE}"

     #Fix for issues with Pandoc on new lines and underscores
     sed -i -r 's,\n,\\n,g' "${TEMP_FILE}"
     sed -i -r 's,_,\_,g' "${TEMP_FILE}"

     # Fix for all local links to not mislead Pandoc into grabbing other files when there is nothing to look for
     # issue reported in Pandoc : https://github.com/jgm/pandoc/issues/3619
     sed -i -r 's,]:,]\\:,g' "${TEMP_FILE}"
     sed -i -r 's,\/#,,g' "${TEMP_FILE}"

     # echo file -I "${TEMP_FILE}"

    # Set name for last folder
    if [ -z "${PDF_FILE_NAME}" ]
    then
      PDF_DEST_DIR=''
      PDF_FILE_NAME=${INPUT_FOLDER}
    fi

    # scripts/pandocpdf.sh "${TEMP_FILE}" "${PDF_DEST_DIR}"/"${PDF_FILE_NAME}" "${INPUT_FOLDER}"
    # Pandoc gets the string of files and outputs the pdf.

    echo "scripts/pandocpdf.sh ${TEMP_FILE} ${PDF_DEST_DIR}/${PDF_FILE_NAME}" >> "${PARALLEL_TEMPFILE}"


   done <  <(find "${PAGES_DIR}${INPUT_FOLDER}" -type f -name "*.md" -print0)

  # Execute theconversion in parallel
  echo "checking pwd"
  pwd
  echo "======="
  echo "Starting pdf build $(date)"
  cat "${PARALLEL_TEMPFILE}" | parallel --halt-on-error 2 --progress --eta --workdir "${PWD}" --jobs "${PARALLEL_JOBS:-8}"
  echo "Finished build $(date)"
}


# get url where pdf is hosted in tgz
PREVIOUS_PDF_BUNDLE="https://downloads.mesosphere.com/dcos-docs-site/dcos-docs-pdf-bundle-develop-${DATE_LAST_SUCCESSFUL_COMMIT}-${GIT_HASH_TRIM}.tgz"

curl -o . ${PREVIOUS_PDF_BUNDLE}
tar -xvzf "dcos-docs-pdf-bundle-develop-${DATE_LAST_SUCCESSFUL_COMMIT}-${GIT_HASH_TRIM}.tgz" -C ./build-pdf

# Clean the previous pdf
cleanVersion "${LATEST_MDFILES}"

selectFolder "${CHANGED_FILES}" "${PAGES_DIR}"
clean "${OUTPUT_FOLDER}"


