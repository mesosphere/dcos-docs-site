#!/usr/bin/env groovy

Boolean main = env.BRANCH_NAME == "main"
Boolean updateAlgolia = main ? "true" : ""
String bucket = "docs-d2iq-com-${main ? 'production' : env.CHANGE_ID}"
String creds = main ? 's3-production' : 's3-development'
// a trick to have only the main branch retrigger every hour
String hostname = main ? 'docs.d2iq.com' : "docs-d2iq-com-pr-${env.CHANGE_ID}.s3-website-us-west-2.amazonaws.com"
String principal = "arn:aws:iam::139475575661:role/Jenkins/Jenkins-S3-DOCS-${main ? 'Production' : 'Development'}"

pipeline {
  agent { label "mesos" }
  // triggers {
  //   cron("* * * * *")
  // }
  stages {
    stage("Sync") {
      steps {
        sh './ci/pull-upstreams.sh'
      }
    }
  }
}
