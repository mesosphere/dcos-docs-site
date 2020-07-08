#!/usr/bin/env groovy

pipeline {
  agent { label "mesos" }
  stages {
    stage("Deploy") {
      environment {
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = "docs-d2iq-com-staging"
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Staging"
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 's3-staging']]) {
          sh '''
          function aws() {
            docker run --rm -v "$PWD":/app -e AWS_DEFAULT_REGION -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN amazon/aws-cli "$@"
          }

          aws s3 mb s3://$BUCKET || true
          apk add --update-cache gettext
          envsubst < s3bucketpolicy > .policy
          aws s3api put-bucket-policy --bucket $BUCKET --policy file:///app/.policy
          aws s3api put-bucket-website --bucket $BUCKET --website-configuration file:///app/s3config.json

          aws s3 sync --acl bucket-owner-full-control ./build s3://$BUCKET
          '''
        }
      }
    }
  }
}
