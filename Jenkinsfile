#!/usr/bin/env groovy

def bucket(branch) {
    branch == "main" ? "docs-d2iq-com-production"
                     : "docs-d2iq-com-pr-${env.CHANGE_ID}"
}

def principal(branch) {
    branch == "main" ? "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Production"
                     : "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-Development"
}

def creds(branch) {
    branch == "main" ? 's3-production'
                     : 's3-development'
}

def hostname(branch) {
    branch == "main"  ? 'docs.d2iq.com'
  : "docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"
}

def updateAlgolia(branch) {
  env.BRANCH_NAME == "main" ? "true" : ""
}

pipeline {
  agent { label "mesos" }
  environment {
    DOCKER = credentials('docker-hub-credentials')
    ALGOLIA_PRIVATE_KEY = credentials('algolia_private_key')
    REDIR_HOSTNAME = hostname(env.BRANCH_NAME)
  }
  stages {
    stage("Update dev-image") {
      when { branch "main" }
      steps {
        sh '''
          docker login -u ${DOCKER_USR} -p ${DOCKER_PSW}
          docker pull mesosphere/docs-dev:latest
          docker build --cache-from mesosphere/docs-dev:latest -f docker/Dockerfile -t mesosphere/docs-dev:latest .
          docker push mesosphere/docs-dev:latest
        '''
      }
    }

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

    stage("Build & Deploy Docs") {
      environment {
        ALGOLIA_UPDATE = updateAlgolia(env.BRANCH_NAME)
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
      steps { echo "http://${hostname(env.BRANCH_NAME)}" }
    }
  }
}
