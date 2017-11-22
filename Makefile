#
# Util
#

clean: ## Remove all build folders
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

docker-build-site: ## Build site docker image. Required env vars: ALGOLIA_PROJECT_ID, ALGOLIA_PUBLIC_KEY, ALGOLIA_PRIVATE_KEY, ALGOLIA_INDEX
	./scripts/build-site.sh

docker-build-pdf: ## Build pdf docker image.
	./scripts/build-pdf.sh

docker-build-site-test: ## Validate site docker image build.
	./scripts/build-site-validation.sh

docker-build-pdf-test: ## Validate pdf docker image build.
	./scripts/build-pdf-validation.sh

docker-production-up: ## Run site container.
	docker-compose -f ./docker/docker-compose.production.yml up -d docs

docker-production-up-pdf: ## Run pdf container.
	docker-compose -f ./docker/docker-compose.production.yml up -d pdf

docker-development-up-pdf:
	docker-compose -f ./docker/docker-compose.development.yml up -d pdf

docker-test-up: ## Run linkchecker test.
	docker-compose -f ./docker/docker-compose.test.yml up -d docs
	docker-compose -f ./docker/docker-compose.test.yml up -d pdf
	docker-compose -f ./docker/docker-compose.test.yml up test

docker-purge:
	./scripts/docker-purge.sh

#
# Help
#

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help