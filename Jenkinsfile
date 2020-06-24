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
          docker run -v "$PWD":/app -w /app node:12-alpine sh -c 'npm i && npx mdspell -x -n -a "pages/**/*.md" | grep "free from spelling errors"'
        '''
      }
    }
  }
}
