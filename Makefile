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
# Redirects
#

build-redirects:
	npm run crawler

#
# Build
#

build-dev: build-swagger build-ngindox
	npm run dev

build-pdf:
	./scripts/pdf.sh ./build ./build-pdf

build-pdf-dev: build-swagger build-ngindox docker-pdf
	npm run build-pdf
	./scripts/pdf.sh ./build/test ./build-pdf http://0.0.0.0:8002/

build-swagger:
	./scripts/swagger.sh ./pages ./build-swagger

build-ngindox:
	./scripts/ngindox.sh ./pages ./build-ngindox

#
# Docker
#

docker-production-build:
	docker-compose -f ./docker/docker-compose.production.yml build --force-rm --no-cache docs

docker-production-up:
	docker-compose -f ./docker/docker-compose.production.yml up -d docs

docker-production-test:
	docker-compose -f ./docker/docker-compose.production.yml up test

docker-development-pdf:
	docker-compose -f ./docker/docker-compose.pdf.yml up -d

docker-purge:
	./scripts/docker-purge.sh