#!/usr/bin/env groovy

/*
  TODO: update algolia!
  # ALGOLIA_UPDATE=true
  # ALGOLIA_PRIVATE_KEY=$algolia_private_key
*/

def bucket(branch) {
    branch == "master"  ? "docs-d2iq-com-production"
  : branch == "staging" ? "docs-d2iq-com-staging"
                        : "docs-d2iq-com-pr-${env.CHANGE_ID}"
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
  : "docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"
}

pipeline {
  agent { label "mesos" }
  environment {
    DOCKER = credentials('docker-hub-credentials')
    REDIR_HOSTNAME = hostname(env.BRANCH_NAME)
  }
  stages {
    stage("Build image") {
      steps {
        sh '''
          docker pull mesosphere/docs:latest
          cp docker/Dockerfile.production.dockerignore .dockerignore
          docker build -f docker/Dockerfile.production -t mesosphere/docs:latest .
        '''
      }
    }
    stage("Push image") {
      when { branch "master" }
      steps {
        sh '''
          docker login -u ${DOCKER_USR} -p ${DOCKER_PSW}
          docker push mesosphere/docs:latest
        '''
      }
    }
    stage("Build & Deploy Docs") {
      environment {
        AWS_DEFAULT_REGION = "us-west-2"
        BUCKET = bucket(env.BRANCH_NAME)
        PRINCIPAL = principal(env.BRANCH_NAME)
        REDIR_HOSTNAME = hostname(env.BRANCH_NAME)
      }
      steps {
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: creds(env.BRANCH_NAME)]]) {
        sh '''
          docker run \
            -v "$PWD/pages":/src/pages \
            -e AWS_ACCESS_KEY_ID \
            -e AWS_DEFAULT_REGION \
            -e AWS_SECRET_ACCESS_KEY \
            -e AWS_SESSION_TOKEN \
            -e BUCKET \
            -e REDIR_HOSTNAME \
            -e PRINCIPAL \
            mesosphere/docs /src/ci/deploy.sh
          '''
        }
      }
    }
    stage("Deployment URL") {
      steps { echo "http://${hostname(env.BRANCH_NAME)}" }
    }
  }
}
