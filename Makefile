start:
	docker-compose up -d

rmi:
	docker rmi mesospheredocs_docs

HTML_FILES := $(shell find build/docs -type f -name '*.html')
pdf:
	HTML_FILES="$(HTML_FILES)" docker-compose up

reset:
	docker stop mesospheredocs_docs_1
	docker rm -v mesospheredocs_docs_1

build:
	docker-compose build