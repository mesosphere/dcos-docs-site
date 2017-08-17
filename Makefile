start:
	docker-compose up -d

rmi:
	docker rmi mesospheredocs_docs

HTML_FILES := $(shell find build/docs -type f -name '*.html')
OUTPUT_FILE := ./build/index.pdf
pdf:
	HTML_FILES="$(HTML_FILES)" OUTPUT_FILE="${OUTPUT_FILE}" docker-compose up

reset:
	docker stop mesospheredocs_docs_1
	docker rm -v mesospheredocs_docs_1

build:
	docker-compose build