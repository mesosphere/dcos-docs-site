#!/usr/bin/env groovy

/*
  TODO: update algolia!
  # ALGOLIA_UPDATE=true
  # ALGOLIA_PRIVATE_KEY=$algolia_private_key
*/

def bucket(branch) {
  branch == "master"    ? "docs-d2iq-com-production"
  : branch == "staging" ? "docs-d2iq-com-staging"
                        : "docs-d2iq-com-pr-1234"
}

def principal(branch) {
  branch == "master"    ? "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Production"
  : branch == "staging" ? "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Staging"
                        : "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Development"
}

def creds(branch) {
    branch == "master"  ? 's3-production'
  : branch == "staging" ? 's3-staging'
                        : 's3-development'
}

pipeline {
  agent { label "mesos" }
  stages {
    stage("Build & Deploy") {
      environment {
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = bucket(env.BRANCH_NAME)
        PRINCIPAL = principal(env.BRANCH_NAME) // used in ./s3bucketpolicy
      }
      steps {
        sh '''
          docker build -f docker/Dockerfile.production -t docs-builder .
          docker run -v "$PWD/pages":/src/pages -v "$PWD/build":/src/build -e GIT_BRANCH=master -e NODE_ENV=production docs-builder npm run build
          echo "google-site-verification: google48ddb4a5390a503f.html" > ./build/google48ddb4a5390a503f.html

          echo "TODO: totally not updating algolia yet"
        '''

        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: creds(env.BRANCH_NAME)]]) {
          sh '''
          function aws() {
            docker run --rm -v "$PWD":/app -e AWS_DEFAULT_REGION -e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN amazon/aws-cli "$@"
          }

          apk add --update-cache gettext
          envsubst < s3bucketpolicy > .policy

          # prepare and set up bucket. if it's present we'll just do it all over for now.
          aws s3api create-bucket           --bucket $BUCKET --region $AWS_DEFAULT_REGION --create-bucket-configuration LocationConstraint=$AWS_DEFAULT_REGION || true
          aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          aws s3api put-bucket-policy       --bucket $BUCKET --policy file:///app/.policy
          aws s3api put-bucket-website      --bucket $BUCKET --website-configuration file:///app/s3config.json

          aws s3 sync --delete --acl bucket-owner-full-control /app/build s3://$BUCKET
          '''
        }
      }
    }
  }
}
