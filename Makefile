start:
	docker-compose up -d

rmi:
	docker rmi mesospheredocs_docs

reset:
	docker stop mesospheredocs_docs_1
	docker rm -v mesospheredocs_docs_1

build:
	docker-compose build