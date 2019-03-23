#
# Util
#


clean: ## Remove all build folders
	./scripts/clean.sh

reduce-pages:
	./scripts/reduce-pages.sh


nginx-test: ## Test and run Nginx config
	./scripts/nginx-test.sh

#
# Link Management
#

redirects-replace-old:
	./scripts/links/redirects_replace_old.sh

build-redirects:
	npm run crawler

#
# Build
#

## Rebuild nginx, swagger, and static content
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
	./scripts/pdf.sh ./build/1.10 ./build-pdf http://0.0.0.0:8002/

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

docker-site-build: ## Build site docker image. Required env vars: ALGOLIA_PROJECT_ID, ALGOLIA_PUBLIC_KEY, ALGOLIA_PRIVATE_KEY, ALGOLIA_INDEX
	./scripts/build-site.sh

docker-pdf-build: ## Build pdf docker image.
	./scripts/build-pdf.sh

docker-site-run: ## Run site container.
	docker-compose up -d docs

docker-pdf-run: ## Run pdf container.
	docker-compose up -d pdf

docker-site-check-links: ## Run link checker test
	docker-compose up --build test

docker-purge:
	./scripts/docker-purge.sh

#
# Help
#

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
