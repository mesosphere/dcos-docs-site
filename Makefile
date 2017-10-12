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

build-development: build-api
	npm run dev

#
# Build PDF
#

build-pdf-production:
	./scripts/pdf.sh ./build ./build-pdf

build-pdf-concat-production:
	./scripts/pdf-concat.sh ./pages ./build-pdf

build-pdf-development: build-api docker-development-up-pdf
	npm run build-pdf
	./scripts/pdf.sh ./build/test ./build-pdf http://0.0.0.0:8002/

build-pdf-concat-development:
	./scripts/pdf-concat.sh ./pages ./build-pdf

#
# Build API
#

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

docker-production-build-pdf:
	./scripts/build-pdf.sh

docker-production-build-test:
	./scripts/build-validation.sh

docker-production-up:
	docker-compose -f ./docker/docker-compose.production.yml up -d docs

docker-production-up-pdf:
	docker-compose -f ./docker/docker-compose.production.yml up -d pdf

docker-production-up-link-test:
	docker-compose -f ./docker/docker-compose.production.yml up test

docker-development-up-pdf:
	docker-compose -f ./docker/docker-compose.development.yml up -d pdf

docker-purge:
	./scripts/docker-purge.sh