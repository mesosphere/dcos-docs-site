#!/bin/bash
#
# Usage:       pdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Sends html files to Docker container wkhtmltopdf-aas
#              and generates a pdf for each file
#
#Set PARALLEL_JOBS Environment Variable for parallel jobs count, should not be more than the number of CPU

set -o errexit -o nounset -o pipefail

INPUT_FOLDER=${1}
OUTPUT_FOLDER=${2}
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

function main
{
   #cd $INPUT_FOLDER
   while IFS= read -r -d '' SOURCE_FILE
   do
     #Strip the input_folder from filepath, not to include it within output folder and Destination filename
     local FILE_PATH=${SOURCE_FILE#$INPUT_FOLDER}
     #Strip the filename and get only the full directory path for the file
     local FILE_PATH="${FILE_PATH%/*}"
     #Strip the first / or ./ from the beginning of file path
     local FILE_PATH="${FILE_PATH#*/}"
     #Destination directory for pdf file
     local PDF_DEST_DIR="${OUTPUT_FOLDER}"/"${FILE_PATH}"
     #Remove INPUT_FOLDER from filename
     local PDF_FILE_NAME="${SOURCE_FILE#$INPUT_FOLDER}"
     #Remove leading ./ or / from filename, as find will output files with leading ./ or /
     local PDF_FILE_NAME="${PDF_FILE_NAME#*/}"
     #Replace all "/" characters in filename to "-" and append .pdf
     local PDF_FILE_NAME="${FILE_PATH//\//-}"
     #Change file extension from .html to .pdf
     local PDF_FILE_NAME="${PDF_FILE_NAME/%.md/.pdf}"
     #For example if SOURCE_FILE=./build/1.10/cli/dcos-marathon-group-scale-index.html
     #PDF_FILE_NAME will be 1.10-cli-dcos-marathon-group-scale-index.html.p
     #Make the Destination directory
     mkdir -p "${PDF_DEST_DIR}"

     #Find recursively all the directories whithin a folder
     INPUT_FILES="$(find ${INPUT_FOLDER}/${FILE_PATH} -type d)"
     # There is a index.md whithing every file
     FILE_NAME="index.md"
     #We find the index.md per folder so the final pdf is organised per folder not natively recursive
     for d in $INPUT_FILES
      do
        NEW_FILE="${d}/${FILE_NAME}"
        if [ -f $NEW_FILE ]
        then
          TEMP_FILE=$(mktemp)
          TEMP_FILES="${TEMP_FILES} ${TEMP_FILE}"
          cat ${NEW_FILE} >> ${TEMP_FILE}
        fi
      done

     # Pandoc gets the string of files and outputs the pdf.
     scripts/pandocpdf.sh "${TEMP_FILES}" ${PDF_DEST_DIR}/${PDF_FILE_NAME}

     #echo "scripts/pandocpdf.sh ${TEMP_FILE} ${PDF_DEST_DIR}/${PDF_FILE_NAME}" >> "${PARALLEL_TEMPFILE}"

   done <  <(find "${INPUT_FOLDER}" -type f -name "*.md" -print0)

  # Execute theconversion in parallel
  echo "Starting pdf build $(date)"
  cat "${PARALLEL_TEMPFILE}" | parallel --halt-on-error 2 --progress --eta --workdir "${PWD}" --jobs "${PARALLEL_JOBS:-4}"
  echo "Finished build $(date)"
  echo $TEMP_FILES
  rm -f "${TEMP_FILES}"
}

clean "${OUTPUT_FOLDER}"
main "${INPUT_FOLDER}" "${OUTPUT_FOLDER}"
