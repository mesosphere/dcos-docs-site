#!/usr/bin/env bash
set -o errexit
set -o pipefail

# Helper to gracefully exit
function die() {
  local MESSAGE="$1"
  echo "ERROR: $MESSAGE"
  exit 1
}

[ -z "$1" ] && die "Please use $0 <dcos-version> <dcos-docs-version>"
DCOS_VERSION=$1
shift

[ -z "$1" ] && die "Please use $0 <dcos-version> <dcos-docs-version>"
DOCS_VERSION=$1
shift

echo "Generate marathon.yaml for DC/OS documentation ${DOCS_VERSION} from ${DCOS_VERSION}"

XTMP_DIR="$(mktemp -d temp-XXX)"
cd "${XTMP_DIR}"

DCOS_BUILDINFO_URL="https://raw.githubusercontent.com/dcos/dcos/${DCOS_VERSION}/packages/marathon/buildinfo.json"

echo "Marathon buildinfo URL: $DCOS_BUILDINFO_URL"

DOCS_URL=`curl --fail --location --silent --show-error "$DCOS_BUILDINFO_URL" | jq --raw-output '.single_source.url' | sed -E "s/marathon-([0-9]+\.[0-9]+\.[0-9]+-.*.tgz)/marathon-docs-\1/"`
echo "Marathon API URL: $DOCS_URL"

curl --fail --location --silent --show-error ${DOCS_URL} | tar -zx --strip-components=5 */docs/rest-api/public/api

# Make sure you have oas-raml-converter and json2yaml installed
# npm i -g oas-raml-converter
# npm i -g json2yaml

echo "Converting RAML to YAML"
oas-raml-converter --from RAML --to OAS20 ./api.raml > marathon.json
json2yaml ./marathon.json > marathon.yaml

MARATHON_YAML_FILE="../pages/${DOCS_VERSION}/api/marathon.yaml"

echo "# DO NOT EDIT THIS FILE, GENERATED BY ./scripts/swagger-marathon.sh" > ${MARATHON_YAML_FILE}

# We skip the first line, it contains "---" for whatever reason
tail -n +2 marathon.yaml >> ${MARATHON_YAML_FILE}

cd ..
rm -rf "${XTMP_DIR}"

echo "Finished generating marathon.yaml"