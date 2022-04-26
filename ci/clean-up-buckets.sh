#!/bin/bash

apt-get update
apt install jq -y
buckets=$(docker run -e AWS_ACCESS_KEY_ID -e AWS_DEFAULT_REGION  -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN amazon/aws-cli s3api list-buckets | jq '.Buckets | .[].Name' -r | grep "docs-d2iq-com-pr-")
echo $buckets
open_prs=$(docker run curlimages/curl:7.75.0 "https://api.github.com/repos/mesosphere/dcos-docs-site/pulls?state=open" | jq '.[].number')
echo $open_prs
for bucket in $buckets; do
  found=false
  for pr in $open_prs; do
    if [[ $bucket == *"$pr"* ]]; then
      found=true
      break
    fi
  done
  if [ "$found" = false ] ; then
    echo "removing: $bucket"
    docker run -e AWS_ACCESS_KEY_ID -e AWS_DEFAULT_REGION  -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN amazon/aws-cli s3 rb s3://$bucket --force
  fi
done
