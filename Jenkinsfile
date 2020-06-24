#!/usr/bin/env groovy

@Library("sec_ci_libs@v2-latest") _

pipeline {
  agent {
    label "mesos"
  }

  stages {
    stage("Spellcheck") {
      steps {
        sh '''
          docker run -t -v "$PWD":/app -w /app node:12-alpine sh -c 'npm i &>/dev/null && npm run spellcheck'
        '''
      }
      post {
        failure {
          echo 'It looks like some typos have been introduced. Please run the following command locally to interactively correct those: \n\nnpm run fixtypos \n'
        }
      }
    }
  }
}
