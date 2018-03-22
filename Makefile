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
check-images: # scan through markdown to validate Github flavoured markdown
	node ./scripts/linkchecker.js ./pages

check-markdown:
	node ./scripts/mdlinter.js ./pages/1.10

check-nonutf:
	./scripts/charcheck.sh ./pages

build-pdf-production:
	./scripts/mdtopdf.sh ./pages/1.11 ./build-pdf

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

docker-site-build: ## Build site docker image. Required env vars: ALGOLIA_PROJECT_ID, ALGOLIA_PUBLIC_KEY, ALGOLIA_PRIVATE_KEY, ALGOLIA_INDEX
	./scripts/build-site.sh

docker-pdf-build: ## Build pdf docker image.
	./scripts/build-pdf.sh

docker-site-run: ## Run site container.
	docker-compose -f ./docker/docker-compose.production.yml up -d docs

docker-pdf-run: ## Run pdf container.
	docker-compose -f ./docker/docker-compose.production.yml up -d pdf

docker-site-check-links: ## Run link checker test
	docker-compose -f ./docker/docker-compose.production.yml up test

docker-purge:
	./scripts/docker-purge.sh

#
# Help
#

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
