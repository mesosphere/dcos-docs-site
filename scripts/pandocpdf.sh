#!/bin/bash
#
# Usage:       pdf.sh input_folder ouput_folder docker_wkhtmltopdf_aas_host
#
# Description: Sends converts .md files into .pdf files
#
INPUT_FILE="${1}"
OUTPUT_FILE="${2}"

RUN echo INPUT_FILE OUTPUT_FILE
RUN pandoc '${INPUT_FILE}' -o '${OUTPUT_FILE}'