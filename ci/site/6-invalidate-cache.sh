#!/usr/bin/env bash

# Create a CloudFront cache invalidation and wait for it to complete.
# This should only be run for master/production, because staging and develop do not use CloudFront.

set -o errexit -o nounset -o pipefail

# required inputs
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID}" # Ex: EIODIT9862QC5
AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION}"

echo "Invalidating Cache..."
if ! RESULT="$(aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --path '/*')"; then
  echo "${RESULT}"
  echo "Invalidation Failure!"
  exit 1
fi
INVALIDATION_ID="$(echo "${RESULT}" | jq -r '.Invalidation.Id')"
echo "Invalidation ID: ${INVALIDATION_ID}"

while true; do
  echo "Polling Invalidation Status..."
  RESULT="$(aws cloudfront get-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --id ${INVALIDATION_ID})"
  STATUS="$(echo "${RESULT}" | jq -r '.Invalidation.Status')"
  if [[ "${STATUS}" == "Completed" ]]; then
    echo "Invalidation Success!"
    break
  elif [[ "${STATUS}" == "InProgress" ]]; then
    echo "Invalidation In Progress. Sleeping 5 seconds..."
    sleep 5
  else
    echo "${RESULT}"
    echo "Invalidation Failure!"
    exit 1
  fi
done
