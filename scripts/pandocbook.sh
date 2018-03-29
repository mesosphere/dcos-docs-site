#!/bin/bash
#
# Usage:       pandocpdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Converts .md files into .pdf files by processing them through Pandoc.
#
#

INPUT_FILES=${1}
OUTPUT_PATH=${2}

echo "pandoc --toc --pdf-engine=xelatex --resource-path=./pages ./templates/style.yaml ${INPUT_FILES} -o ${OUTPUT_PATH}.pdf --listings -H ./templates/listings-setup.tex  --biblatex --template=./templates/mesosphere.latex"
pandoc ${INPUT_FILES} --toc -o "${OUTPUT_PATH}".pdf
