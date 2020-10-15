#!/usr/bin/env groovy

/*
  TODO: update algolia!
  # ALGOLIA_UPDATE=true
  # ALGOLIA_PRIVATE_KEY=$algolia_private_key
*/

def bucket(branch) {
    branch == "master"  ? "docs-d2iq-com-production"
  : branch == "staging" ? "docs-d2iq-com-staging"
                        : "docs-d2iq-com-pr-1234"
}

def principal(branch) {
    branch == "master"  ? "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Production"
  : branch == "staging" ? "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Staging"
                        : "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Development"
}

def creds(branch) {
    branch == "master"  ? 's3-production'
  : branch == "staging" ? 's3-staging'
                        : 's3-development'
}

def hostname(branch) {
    branch == "master"  ? 'docs.d2iq.com'
  : branch == "staging" ? 'docs-staging.d2iq.com'
  : ''
}

pipeline {
  agent { label "mesos" }
  stages {
    stage("Build & Deploy") {
      environment {
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = bucket(env.BRANCH_NAME)
        PRINCIPAL = principal(env.BRANCH_NAME) // used in ./s3bucketpolicy
        HOSTNAME = hostname(env.BRANCH_NAME)
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: creds(env.BRANCH_NAME)]]) {
        sh '''
          docker build -f docker/Dockerfile.production -t docs-builder .
          docker run \
            -v "$PWD/pages":/src/pages \
            -e AWS_ACCESS_KEY_ID \
            -e AWS_DEFAULT_REGION \
            -e AWS_SECRET_ACCESS_KEY \
            -e AWS_SESSION_TOKEN \
            -e BUCKET \
            -e HOSTNAME \
            -e PRINCIPAL \
            docs-builder /src/ci/deploy.sh
          '''
        }
      }
    }
  }
}
