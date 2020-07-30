#
# Util
#

.PHONY: build-swagger build-ngindox build-api build-development clean reduce-pages

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

#
# Build
#

## Rebuild nginx, swagger, and static content
build-development: build-api
	npm run dev

#
# Build API
#
build-api: build-swagger build-ngindox

SWAGGER_FILES := $(shell find ./pages -name '*.yaml' | xargs grep -l "swagger:")
build-swagger: $(addprefix ./build-swagger,$(basename $(SWAGGER_FILES:./pages%=%)))
build-swagger/%:
	@node ./node_modules/bootprint/bin/bootprint.js openapi "pages/$*.yaml" "$@"

NGINDOX_FILES := $(shell find ./pages -name '*.yaml' | xargs grep -l "ngindox:")
build-ngindox: $(addprefix ./build-ngindox,$(basename $(NGINDOX_FILES:./pages%=%)))
build-ngindox/%:
	@mkdir -p $@
	@node ./node_modules/ngindox/bin/cli.js ui -c "" -j "" -f "pages/$*.yaml" > "$@/index.html"

#
# Docker
#
docker-site-build: ## Build site docker image. Required env vars: ALGOLIA_PROJECT_ID, ALGOLIA_PUBLIC_KEY, ALGOLIA_PRIVATE_KEY, ALGOLIA_INDEX
	./scripts/build-site.sh

docker-site-run: ## Run site container.
	docker-compose up -d docs

docker-site-check-links: ## Run link checker test
	docker-compose up test

docker-purge:
	./scripts/docker-purge.sh

#
# Help
#

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
