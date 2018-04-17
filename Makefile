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

check-markdown: #scan through all the markdown and show the warnings
	node ./scripts/mdlinter.js ./pages

compress-images: #script to compress images
	node ./scripts/compressimages.js ./pages

build-pdf-production:
	./scripts/mdtopdf.sh  ./build-pdf

concat-mesosphere-pdf: #script to concat the final mesosphere book
	./scripts/mesosphereconcat.sh ./build-pdf ./build-pdf

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
	docker-compose -f ./docker/docker-compose.test.yml up -d pdf

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
