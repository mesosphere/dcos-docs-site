#!/usr/bin/env groovy

boolean isProduction = env.BRANCH_NAME == "production"
boolean isBeta = env.BRANCH_NAME == "beta"
boolean isPreview = env.BRANCH_NAME == "develop"

def bucket   = isProduction ? "production"
             : isBeta ? "staging"
             : isPreview ? "preview" // TODO: Create this bucket
             : "pr-${env.CHANGE_ID}"

def creds    = isProduction ? "s3-production"
             : isBeta ? "s3-staging"
             : "s3-development" // TODO: Can we use these credentials for develop branch and PRs?
def hostname = isProduction ? "docs.d2iq.com"
             : isBeta ? "beta-docs.d2iq.com"
             : isPreview ? "dev-docs.d2iq.com" // TODO: Where to get this url from?
             : "docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"

pipeline {
  agent { label "mesos" }
  environment {
    DOCKER = credentials('docker-hub-credentials')
    ALGOLIA_PRIVATE_KEY = credentials('algolia_private_key')
    REDIR_HOSTNAME = "${hostname}"
  }
  stages {
    stage("Build image") {
      steps {
        sh '''
          docker login -u ${DOCKER_USR} -p ${DOCKER_PSW}
          docker pull mesosphere/docs:latest
          cp docker/Dockerfile.production.dockerignore .dockerignore
          docker build --cache-from mesosphere/docs:latest -f docker/Dockerfile.production -t mesosphere/docs:latest .
        '''
      }
    }

    stage("Push image") {
      when { branch "production" }
      steps {
        sh '''
          docker login -u ${DOCKER_USR} -p ${DOCKER_PSW}
          docker push mesosphere/docs:latest
        '''
      }
    }

    stage("Build & Deploy Docs") {
      environment {
        ALGOLIA_UPDATE = "${isProduction ? 'true' : ''}"
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = "docs-d2iq-com-${bucket}"
        // TODO: What does that mean?
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-${isProduction ? 'Production' : 'Development'}"
        REDIR_HOSTNAME = "${hostname}"
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: creds]]) {
        sh '''
          docker run \
            -v "$PWD/pages":/src/pages \
            -e ALGOLIA_PRIVATE_KEY \
            -e ALGOLIA_UPDATE \
            -e AWS_ACCESS_KEY_ID \
            -e AWS_DEFAULT_REGION \
            -e AWS_SECRET_ACCESS_KEY \
            -e AWS_SESSION_TOKEN \
            -e BUCKET \
            -e PRINCIPAL \
            -e REDIR_HOSTNAME \
            mesosphere/docs /src/ci/deploy.sh
          '''
        }
      }
    }

    stage("Restart dev deployment") {
      agent { label 'docs-site-kubectl' }
      when { branch "develop" }
      steps {
        sh '''
          kubectl -n docs-site rollout restart deployment docs-site-dev
          kubectl -n docs-site rollout status deploy/docs-site-dev -w --timeout=10m
        '''
      }
    }

    stage("Deployment URL") {
      steps { echo "http://${hostname}" }
    }
  }
}
