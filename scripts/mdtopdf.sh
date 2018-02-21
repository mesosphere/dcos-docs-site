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
     printf "${GREEN}Creating the INPUT FILES: ${PURPLE}${INPUT_FILES}"
     #echo $INPUT_FILES 'input files before the loop'
     #FINAL_fILEs will enclose all the files we want to convert to docs, single, chapters, versions or whole books depending on the
     #folder we are in
     FINAL_FILES=""
     #We find the index.md per folder so the final pdf is organised per folder not natively recursive
     for d in $INPUT_FILES
      do
        NEW_FILE="${d}/${FILE_NAME}"
        FINAL_FILES="${FINAL_FILES}${NEW_FILE} "
      done
     printf "${GREEN}Creating the final array of files with index.md:  $FINAL_FILES"

     #echo ${PARALLEL_TEMPFILE} 'temp file'
     #echo "phantomjs scripts/pandocpdf.sh '${FILE_PATH}' '${PDF_DEST_DIR}/${PDF_FILE_NAME}'" >> "${PARALLEL_TEMPFILE}"
     # Pandoc gets the string of files and outputs the pdf.
     scripts/pandocpdf.sh "${FINAL_FILES}" ${PDF_DEST_DIR}/${PDF_FILE_NAME}
     #echo "scripts/pandocpdf.sh ${INPUT_FOLDER} ${FILE_PATH} ${PDF_DEST_DIR}/${PDF_FILE_NAME}" >> "${PARALLEL_TEMPFILE}"
     echo "======"
   done <  <(find "${INPUT_FOLDER}" -type f -name "*.md" -print0)

  #Execute theconversion in parallel
  echo "Starting pdf build $(date)"
  cat "${PARALLEL_TEMPFILE}" | parallel --halt-on-error 2 --progress --eta --workdir "${PWD}" --jobs "${PARALLEL_JOBS:-4}"
  echo "Finished build $(date)"

}

clean "${OUTPUT_FOLDER}"
main "${INPUT_FOLDER}" "${OUTPUT_FOLDER}"
