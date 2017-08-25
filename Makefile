start:
	docker-compose up -d

rmi:
	docker rmi mesospheredocs_docs

pdf:
	./scripts/pdf.sh

migration:
	./scripts/migration.sh

reset:
	docker stop mesospheredocs_docs_1
	docker rm -v mesospheredocs_docs_1

build:
	docker-compose build