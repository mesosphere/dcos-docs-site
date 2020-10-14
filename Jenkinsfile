#!/usr/bin/env groovy

// production  => docs-d2iq-com-production/CONTENT
// staging     => docs-d2iq-com-staging/CONTENT
// development => docs-d2iq-com-PR-XYZ/CONTENT

/*
  TODO: update algolia!
  # ALGOLIA_UPDATE=true
  # ALGOLIA_PRIVATE_KEY=$algolia_private_key
*/

pipeline {
  agent { label "mesos" }
  stages {
    stage("Deploy") {
      environment {
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = "docs-d2iq-com-production"
        // that's used in ./s3bucketpolicy
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Production"
      }
      steps {
        sh '''
          docker build -f docker/Dockerfile.production -t docs-builder .
          docker run -v "$PWD/pages":/src/pages:delegated -v "$PWD/build":/src/build:delegated -e GIT_BRANCH=master -e NODE_ENV=production docs-builder npm run build
          echo "google-site-verification: google48ddb4a5390a503f.html" > ./build/google48ddb4a5390a503f.html
        '''

        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 's3-production']]) {
          sh '''
          function aws() {
            docker run --rm -v "$PWD":/app -e AWS_DEFAULT_REGION -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN amazon/aws-cli "$@"
          }

          apk add --update-cache gettext
          envsubst < s3bucketpolicy > .policy

          aws s3api create-bucket      --bucket $BUCKET --region $AWS_DEFAULT_REGION || true
          aws s3api put-bucket-policy  --bucket $BUCKET --policy file:///app/.policy
          aws s3api put-bucket-website --bucket $BUCKET --website-configuration file:///app/s3config.json

          aws s3 sync --acl bucket-owner-full-control ./build s3://$BUCKET
          '''
        }
      }
    }
  }
}
