start:
	docker-compose up -d

rmi:
	docker rmi mesospheredocs_docs

HTML_FILES := $(shell find build/docs -type f -name '*.html')
OUTPUT_FILE := ./build/index.pdf
pdf:
	HTML_FILES="$(HTML_FILES)" OUTPUT_FILE="${OUTPUT_FILE}" docker-compose up

migration:
	rm -rf ./pages/docs/1.10
	#rm -rf ./pages/docs/1.9
	#rm -rf ./pages/docs/1.8
	#rm -rf ./pages/docs/1.7
	mkdir ./pages/docs/1.10
	#mkdir ./pages/docs/1.9
	#mkdir ./pages/docs/1.8
	#mkdir ./pages/docs/1.7
	./scripts/migration.sh ../../dcos/dcos-docs/1.10 ./pages/docs/1.10
	#./scripts/migration.sh ../../dcos/dcos-docs/1.9 ./pages/docs/1.9
	#./scripts/migration.sh ../../dcos/dcos-docs/1.8 ./pages/docs/1.8
	#./scripts/migration.sh ../../dcos/dcos-docs/1.7 ./pages/docs/1.7

reset:
	docker stop mesospheredocs_docs_1
	docker rm -v mesospheredocs_docs_1

build:
	docker-compose build