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
        withCredentials([string(credentialsId: "d146870f-03b0-4f6a-ab70-1d09757a51fc", variable: "GITHUB_TOKEN")]) {
          sshagent(credentials : ['4ff09dce-407b-41d3-847a-9e6609dd91b8']) {
            sh '''#!/bin/bash
              set -euxo pipefail

              git config user.name "Docs Bot"
              git config user.email "docs-bot@d2iq.com"
              git remote set-url origin git@github.com:mesosphere/dcos-docs-site.git

              apk add curl curl-dev rsync --no-cache

              ./ci/pull-upstream.sh mesosphere/konvoy docs/site release-1.7 pages/dkp/konvoy/1.7
              ./ci/pull-upstream.sh mesosphere/konvoy docs/site release-1.6 pages/dkp/konvoy/1.6
              ./ci/pull-upstream.sh mesosphere/konvoy docs/site release-1.5 pages/dkp/konvoy/1.5
              ./ci/pull-upstream.sh mesosphere/konvoy docs/site release-1.4 pages/dkp/konvoy/1.4
            '''
          }
        }
      }
    }
  }
}
