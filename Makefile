.PHONY: build-development clean reduce-pages

clean: ## Remove all build folders
	./scripts/clean.sh

#
# Link Management
#

redirects-replace-old:
	./scripts/links/redirects_replace_old.sh

#
# Build
#

## Build static content
build-development:
	npm run dev

#
# Docker
#
docker-site-build: ## Build site docker image. Required env vars: ALGOLIA_PRIVATE_KEY
	./scripts/build-site.sh

docker-site-run: ## Run site container.
	docker-compose up -d docs

docker-site-check-links: ## Run link checker test
	docker-compose up test

# Docker Live Edit

LIVEEDIT_IMAGE := dcos-docs-liveedit
LIVEEDIT_HOST_PORT ?= 3000
LIVEEDIT_PAGES_SRC_ABS_PATH ?= $(shell pwd)/pages/mesosphere/dcos/2.1
LIVEEDIT_PAGES_DST_REL_PATH ?= mesosphere/dcos/2.1
LIVEEDIT_RENDER_PATH_PATTERN ?= $(LIVEEDIT_PAGES_DST_REL_PATH)/**

docker-liveedit-image: ## Install dependencies and build the site. Takes approximately 15 minutes.
	docker build \
		-f docker/Dockerfile.liveedit \
		-t $(LIVEEDIT_IMAGE) \
		.

docker-liveedit: ## Start a liveediting container
	@test -n "$$(docker image ls --quiet $(LIVEEDIT_IMAGE))" || (echo "Image '$(LIVEEDIT_IMAGE)' not found. Did you already run 'make docker-liveedit-image'?"; exit 1)
	# Note: --mount consistency=delegated for MacOS. See https://docs.docker.com/storage/bind-mounts/#configure-mount-consistency-for-macos.
	docker run -it --rm \
	--env RENDER_PATH_PATTERN=$(LIVEEDIT_RENDER_PATH_PATTERN) \
	--mount type=bind,src=$(LIVEEDIT_PAGES_SRC_ABS_PATH),dst=/dcos-docs-site/pages/$(LIVEEDIT_PAGES_DST_REL_PATH),consistency=delegated,readonly \
	--publish 127.0.0.1:$(LIVEEDIT_HOST_PORT):3000 \
	--publish 127.0.0.1:35729:35729 \
	$(LIVEEDIT_IMAGE)

#
# Help
#

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
