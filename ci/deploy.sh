#!/bin/bash

export GIT_BRANCH=master
export NODE_ENV=production
npm run build
echo "google-site-verification: google48ddb4a5390a503f.html" > ./build/google48ddb4a5390a503f.html

echo "TODO: totally not updating algolia yet"

apk add --update-cache gettext
envsubst < s3bucketpolicy > .policy
envsubst < s3config.json > .s3config.json

# prepare and set up bucket. if it's present we'll just do it all over for now.
aws s3api create-bucket           --bucket $BUCKET --region $AWS_DEFAULT_REGION --create-bucket-configuration LocationConstraint=$AWS_DEFAULT_REGION || true
aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
aws s3api put-bucket-policy       --bucket $BUCKET --policy file://$PWD/.policy
aws s3api put-bucket-website      --bucket $BUCKET --website-configuration file://$PWD/.s3config.json


aws s3 sync --delete --acl bucket-owner-full-control $PWD/build s3://$BUCKET
