#!/bin/bash
#
# Usage:       pdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Converts .md files into .pdf files
#
#
INPUT_FILES=${1}
OUTPUT_PATH=${2}

# Convert the file from .md to .pdf
echo "pandoc --toc ${INPUT_FILES} -o \"${OUTPUT_PATH}.pdf\""
pandoc --toc --resource-path=./pages ./templates/style.yaml ${INPUT_FILES} -o ${OUTPUT_PATH}.pdf --listings -H ./templates/listings-setup.tex --pdf-engine=xelatex --template=./templates/mesosphere.latex