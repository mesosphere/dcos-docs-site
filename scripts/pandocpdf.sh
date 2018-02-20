#!/bin/bash
#
# Usage:       pdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Converts .md files into .pdf files
#
INPUT_FOLDER=${1}
FILE_PATH=${2}
OUTPUT_PATH=${3}

# Convert the file from .md to .pdf
pandoc --toc "${INPUT_FOLDER}/${FILE_PATH}/index.md" -o "${OUTPUT_PATH}.pdf"