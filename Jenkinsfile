#!/usr/bin/env groovy

// production  => docs-d2iq-com-production/CONTENT
// staging     => docs-d2iq-com-staging/CONTENT
// development => docs-d2iq-com-PR-XYZ/CONTENT

pipeline {
  agent { label "mesos" }
  stages {
    stage("Deploy") {
      environment {
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = "docs-d2iq-com-PR-test1"
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Development"
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 's3-development']]) {
          sh '''
          function aws() {
            docker run --rm -v "$PWD":/app -e AWS_DEFAULT_REGION -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN amazon/aws-cli "$@"
          }

          apk add --update-cache gettext
          envsubst < s3bucketpolicy > .policy

          aws s3api create-bucket      --bucket $BUCKET --grant-full-control "$PRINCIPAL" || true
          aws s3api put-bucket-policy  --bucket $BUCKET --policy file:///app/.policy
          aws s3api put-bucket-website --bucket $BUCKET --website-configuration file:///app/s3config.json

          aws s3 sync --acl bucket-owner-full-control ./build s3://$BUCKET
          '''
        }
      }
    }
  }
}
