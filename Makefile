start:
	docker-compose up -d

rmi:
	docker rmi mesospheredocs_docs

pdf: swagger ngindox
	./scripts/pdf.sh

migration:
	./scripts/migration.sh

swagger:
	./scripts/swagger.sh

ngindox:
	./scripts/ngindox.sh

docker-rm:
	#docker stop mesospheredocs_docs_1
	#docker rm -v mesospheredocs_docs_1
	docker stop dcosdocs_pdf_1
	docker rm -v dcosdocs_pdf_1

build:
	docker-compose build