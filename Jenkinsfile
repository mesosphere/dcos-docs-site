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
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: creds(env.BRANCH_NAME)]]) {
        sh '''
          docker build -f docker/Dockerfile.production -t docs-builder .
          docker run -v "$PWD/pages":/src/pages -e GIT_BRANCH=master -e NODE_ENV=production docs-builder /src/ci/deploy.sh
          '''
        }
      }
    }
  }
}
