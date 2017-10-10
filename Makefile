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

build-dev: build-api
	npm run dev

build-pdf:
	./scripts/pdf.sh ./build ./build-pdf

build-pdf-concat:
	./scripts/pdf-concat.sh

build-pdf-dev: build-api docker-pdf
	npm run build-pdf
	./scripts/pdf.sh ./build/test ./build-pdf http://0.0.0.0:8002/

build-pdf-concat-dev: build-pdf-concat-dev
	./scripts/pdf-concat.sh

build-api: build-swagger build-ngindox

build-swagger:
	./scripts/swagger.sh ./pages ./build-swagger

build-ngindox:
	./scripts/ngindox.sh ./pages ./build-ngindox

#
# Docker
#

docker-production-build:
	./scripts/build.sh

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