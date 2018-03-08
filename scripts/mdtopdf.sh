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
echo $INPUT_FOLDER
function main
{
   # cd $INPUT_FOLDER
   while IFS= read -r -d '' SOURCE_FILE
   do
     # Strip the input_folder from filepath, not to include it within output folder and Destination filename
     local FILE_PATH=${SOURCE_FILE#$INPUT_FOLDER}
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
     echo $PDF_FILE_NAME "file name"
     # For example if SOURCE_FILE=./build/1.10/cli/dcos-marathon-group-scale-index.html
     # PDF_FILE_NAME will be 1.10-cli-dcos-marathon-group-scale-index.html.p
     # Make the Destination directory
     mkdir -p "${PDF_DEST_DIR}"

     # There is an index.md whithing every file
     FILE_NAME="index.md"
     TEMP_FILE=$(mktemp)

    # echo "find ${INPUT_FOLDER}/${FILE_PATH} -type d -depth"

    # We find the index.md per folder so the final pdf is organised per folder not natively recursive
    while IFS= read -r SOURCE_FOLDERS
      do
        # Target all the folder names
        local d="$SOURCE_FOLDERS"
        # Target all the files whithin the foler by the same name
        NEW_FILE="${d}/${FILE_NAME}"

        if [ -f "${NEW_FILE}" ]
        then
          # Create temporary file with all md content to send to pandoc // this avoids very long urls & long strings (Pandoc has a string limit)
          TEMP_FILES="${TEMP_FILES} ${TEMP_FILE}"
          echo "" >> "${TEMP_FILE}"
          cat "${NEW_FILE}" >> "${TEMP_FILE}"
        fi
      # Find recursively all the directories whithin a folder
      done < <(find "${INPUT_FOLDER}"/"${FILE_PATH}" -type d -depth)

     # Fix for absolute paths images urls
     sed -i 's,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.png\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.jpg\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.jpeg\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.gif\),\1\2,g;s,\([:[:space:](]\)/\([-0-9A-Za-z/_.]*\.svg\),..\1\2,g' "${TEMP_FILE}"
     sed -i 's,@,at,g' "${TEMP_FILE}"

     # Unicode characters to encode into UTF8.
     CHARS=$(python -c 'print u"\u2060\u0080\u0099\u009C\u009d\u0098\u0094\u0082\u00a6\u0089\u00a4\u00a5\u0093\u2019\u2018\u201C\u201D\u25CF".encode("utf8" )')
     sed -i 's/['"$CHARS"']//g' "${TEMP_FILE}"

     # We cut all long strings at 180 characters.
     sed -i -r 's/.{180}/&\n/g' "${TEMP_FILE}"

     sed -i -r 's,\n,\\n,g' "${TEMP_FILE}"
     sed -i -r 's,_,\_,g' "${TEMP_FILE}"

     #Fix for all local links to not mislead Pandoc into grabbing other files when there is nothing to look for
     # issue reported in Pandoc : https://github.com/jgm/pandoc/issues/3619
     sed -i -r 's,]:,]\\:,g' "${TEMP_FILE}"
     sed -i -r 's,\/#,,g' "${TEMP_FILE}"

    # Set name for last folder
    if [ -z "${PDF_FILE_NAME}" ]
    then
      "${PDF_FILE_NAME}"="MesosphereDC/OS"
    fi

    #  scripts/pandocpdf.sh "${TEMP_FILE}" "${PDF_DEST_DIR}"/"${PDF_FILE_NAME}" "${INPUT_FOLDER}"
     # Pandoc gets the string of files and outputs the pdf.
     echo "scripts/pandocpdf.sh ${TEMP_FILE} ${PDF_DEST_DIR}/${PDF_FILE_NAME}" >> "${PARALLEL_TEMPFILE}"


   done <  <(find "${INPUT_FOLDER}" -type f -name "*.md" -print0)

  # Execute theconversion in parallel
  echo "checking pwd"
  pwd
  echo "======="
  echo "Starting pdf build $(date)"
  cat "${PARALLEL_TEMPFILE}" | parallel --halt-on-error 2 --progress --eta --workdir "${PWD}" --jobs "${PARALLEL_JOBS:-4}"
  echo "Finished build $(date)"
}

clean "${OUTPUT_FOLDER}"
main "${INPUT_FOLDER}" "${OUTPUT_FOLDER}"
