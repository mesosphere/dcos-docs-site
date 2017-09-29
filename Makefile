#
# Util
#

clean:
	./scripts/clean.sh

reduce-pages:
	./scripts/reduce-pages.sh

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
	docker rmi mesosphere/dcos-docs:latest
	docker-compose -f ./docker/docker-compose.production.yml build --force-rm --no-cache docs

docker-production-up:
	docker-compose -f ./docker/docker-compose.production.yml up -d docs

docker-production-build-test:
	./scripts/build-validation.sh

docker-production-link-test:
	docker-compose -f ./docker/docker-compose.production.yml up test

docker-development-build-pdf:
	docker-compose -f ./docker/docker-compose.development.yml up -d pdf

docker-purge:
	./scripts/docker-purge.sh