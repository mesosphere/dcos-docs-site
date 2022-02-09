#!/usr/bin/env groovy

boolean isMain = env.BRANCH_NAME == "main"
boolean isBeta = env.BRANCH_NAME == "beta"

def bucket   = isMain ? "preview"
             : isBeta ? "staging"
             : "pr-${env.CHANGE_ID}"

def hostname = isMain ? "dev-docs.d2iq.com"
             : "docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"

pipeline {
  agent { label "mesos" }
  environment {
    DOCKER = credentials('docker-hub-credentials')
    ALGOLIA_PRIVATE_KEY = credentials('algolia_private_key')
    AWS_DEFAULT_REGION = "us-west-2"
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

    stage("Build & Deploy Preview Docs") {
      environment {
        ALGOLIA_UPDATE = ""
        BUCKET = "docs-d2iq-com-${bucket}"
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Development"
        REDIR_HOSTNAME = "${prevhostname}"
        DOCS_ENV = "preview"
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "s3-development"]]) {
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
            -e DOCS_ENV \
            mesosphere/docs /src/ci/deploy.sh
          '''
        }
      }
    }

    stage("Preview Deployment URL") {
      steps { echo "http://${hostname}" }
    }

    stage("Build & Deploy Beta Docs") {
      when { branch "beta" }
      environment {
        ALGOLIA_UPDATE = ""
        BUCKET = "docs-d2iq-com-staging"
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Development"
        REDIR_HOSTNAME = "beta-docs.d2iq.com"
        DOCS_ENV = "beta"
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "s3-staging"]]) {
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
            -e DOCS_ENV \
            mesosphere/docs /src/ci/deploy.sh
          '''
        }
      }
    }

    stage("Build & Deploy Production Docs") {
      when { branch "main" }
      environment {
        ALGOLIA_UPDATE = "true"
        BUCKET = "docs-d2iq-com-production"
        PRINCIPAL = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Production"
        REDIR_HOSTNAME = "docs.d2iq.com"
        DOCS_ENV = "production"
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "s3-production"]]) {
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
            -e DOCS_ENV \
            mesosphere/docs /src/ci/deploy.sh
          '''
        }
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

    stage("Restart dev deployment") {
      agent { label 'docs-site-kubectl' }
      when { branch "main" }
      steps {
        sh '''
          kubectl -n docs-site rollout restart deployment docs-site-dev
          kubectl -n docs-site rollout status deploy/docs-site-dev -w --timeout=10m
        '''
      }
    }


  }
}
