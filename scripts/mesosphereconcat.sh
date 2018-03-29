#!/bin/bash
#Usage: will concat the version pdf's to create a final Mesosphere book
#Description: calls Pandoc, finds the Version pdf's and concats them in a new pdf

INPUT_PATH=${1}
OUTPUT_PATH=${2}

PDF_REGEX='.pdf$'

function clean
{
    rm -rf "${1}"
    rm -f "${PARALLEL_TEMPFILE}"
}
function main
{
    # Read the directory of built pdf's
    while read -r F; do
        # Find all the top level pdf's
        if [[ $F =~ $PDF_REGEX ]]
        then
            #echo "$F"
            # Find pdf file names
            PDF_NAME="${F}"
            # Create a string with them, to send to Pandoc
            PDF_FILES+="${PDF_NAME} "
        fi
    done < <(find "${INPUT_PATH}" -type f -maxdepth 2)
    #echo ${PDF_FILES}
    FINAL_PDF="MesosphereDCOS"
    # We send the pdf files to Pandoc for concatenation.
    echo "scripts/pandocbook.sh ${PDF_FILES} ${INPUT_PATH}/${FINAL_PDF}"
    #echo "Finished building $(date)"
}

main "${INPUT_PATH}"