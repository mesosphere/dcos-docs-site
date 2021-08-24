#!/usr/bin/env groovy

boolean main = env.BRANCH_NAME == "main"
boolean beta = env.BRANCH_NAME == "private-beta"
def bucket   = main ? "production"
             : beta ? "staging"
             : "pr-${env.CHANGE_ID}"
def creds    = main ? "s3-production"
             : beta ? "s3-staging"
             : "s3-development"
def hostname = main ? "docs.d2iq.com"
             : beta ? "beta-docs.d2iq.com"
             : "docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"


pipeline {
  agent { label "mesos" }
  environment {
    DOCKER = credentials('docker-hub-credentials')
    ALGOLIA_PRIVATE_KEY = credentials('algolia_private_key')
    REDIR_HOSTNAME = "${hostname}"
  }
  stages {
    // This stage needs to be adjusted to build/push the build archive page too
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
      when { branch "main" }
      steps {
        sh '''
          docker login -u ${DOCKER_USR} -p ${DOCKER_PSW}
          docker push mesosphere/docs:latest
        '''
      }
    }

    // We would need to replicate this stage four times for each environment (prod, preview, beta, archive)
    stage("Build & Deploy Docs") {
      environment {
        ALGOLIA_UPDATE = "${main ? 'true' : ''}"
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = "docs-d2iq-com-${bucket}"
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-${main ? 'Production' : 'Development'}"
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
    stage("Deployment URL") {
      steps { echo "http://${hostname}" }
    }
  }
}
