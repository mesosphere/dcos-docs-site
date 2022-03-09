.PHONY: build-development clean

clean: ## Remove all build folders
	rm -rf "./build"
	rm -f ".revision"

#
# Build
#

## Build static content
build-development:
	npm run dev

# Docker Live Edit
LIVEEDIT_IMAGE := dcos-docs-liveedit
LIVEEDIT_HOST_PORT ?= 3000
LIVEEDIT_PAGES_SRC_ABS_PATH ?= $(shell pwd)/pages/dkp
LIVEEDIT_PAGES_DST_REL_PATH ?= dkp

docker-liveedit-image: ## Install dependencies and build the site.
	docker build \
		-f docker/Dockerfile \
		-t $(LIVEEDIT_IMAGE) \
		.

docker-liveedit: ## Start a liveediting container
	@test -n "$$(docker image ls --quiet $(LIVEEDIT_IMAGE))" || (echo "Image '$(LIVEEDIT_IMAGE)' not found. Did you already run 'make docker-liveedit-image'?"; exit 1)
	# Note: --mount consistency=delegated for MacOS. See https://docs.docker.com/storage/bind-mounts/#configure-mount-consistency-for-macos.
	docker run -it --rm \
	--mount type=bind,src=$(LIVEEDIT_PAGES_SRC_ABS_PATH),dst=/dcos-docs-site/pages/$(LIVEEDIT_PAGES_DST_REL_PATH),consistency=delegated,readonly \
	--publish 127.0.0.1:$(LIVEEDIT_HOST_PORT):3000 \
	--publish 127.0.0.1:35729:35729 \
	$(LIVEEDIT_IMAGE)

update-cves: ## Pull the current state of CVEs to the docs-site for publishing
	curl "https://konvoy-staging-devx-cac8-cve-reporter.s3-us-west-2.amazonaws.com/vulnerability_report_latest.json" > assets/konvoy_latest.json
	node ./ci/group_cves.js

.PHONY: cves.filter-unmitigated
cves.filter-unmitigated: ## Filters out unmitigated CVEs from assets/cves.json file
	export CVETMP=$$(mktemp /tmp/cve-mitigated.XXXXXX) && \
	cat assets/cves.json | \
		jq -c -r '[ .[] | select((.mitigations | length) > 0) ]' > $$CVETMP && \
		mv $$CVETMP assets/cves.json

.PHONY: update-dkp-cli-docs
update-dkp-cli-docs: ## Update the CLI command documentation
	ci/update-dkp-cli-docs.sh

#
# Help
#

help:
	@grep -E '^[a-zA-Z_\.-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
