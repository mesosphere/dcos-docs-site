start:
	echo "Start"

#
# Util
#

clean:
	./scripts/clean.sh

#
# Migration
#

migration:
	./scripts/migration.sh

#
# Build
#

build: build-pdf-prod build-swagger build-ngindox
	npm run build

build-pdf-prod: build-swagger build-ngindox
	npm run build-pdf
	./scripts/pdf.sh ./build ./build-pdf http://docker_pdf_1:8002/

build-pdf: build-swagger build-ngindox docker-pdf
	npm run build-pdf
	./scripts/pdf.sh ./build ./build-pdf http://0.0.0.0:8002/

build-swagger:
	./scripts/swagger.sh ./pages ./build-swagger

build-ngindox:
	./scripts/ngindox.sh ./pages ./build-ngindox

#
# Docker
#

docker-production:
	docker-compose -f ./docker/docker-compose.production.yml build
	docker-compose -f ./docker/docker-compose.production.yml up -d

docker-pdf:
	docker-compose -f ./docker/docker-compose.pdf.yml up -d

docker-purge:
	./scripts/docker-purge.sh

docker-build:
	docker-compose build