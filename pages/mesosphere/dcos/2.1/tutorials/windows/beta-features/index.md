---
layout: layout.pug
navigationTitle: Windows Usage examples 
title: Windows Usage examples 
menuWeight: 40
excerpt: Windows Usage examples
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Windows Usage examples

This short tutorial will help you to install and configure a mixed DC/OS cluster that includes a Windows node.

## Demo Running Windows Docker Containers

Install [Marathon-LB](/mesosphere/dcos/services/marathon-lb/1.14/mlb-install/) from the DC/OS service catalogue and you will have the ability to access the app using http://<linuxpublicagentipaddress>

Use the Marathon template to configure and start a [Windows workload app](https://github.com/dcos/windows-test-workload/blob/master/windows-docker-container/windows-docker-app.json).

There will be a link to Demo video.

## Jenkins Demo building a .Net application

### Install Jenkins

#### Prerequisites

A DC/OS 2.1 cluster with at least one Windows agent and one private Linux agent must be running. The Linux agent is required to host the Jenkins master.
You must have the DC/OS CLI [installed](mesosphere/dcos-docs-site/blob/staging/pages/mesosphere/dcos/2.0/cli/install/).

Add the Jenkins stub universe to get access to the Jenkins beta release:
```dcos package repo add --index=0 jenkins-aws "https://universe-converter.mesosphere.com/transform?url=https://infinity-artifacts.s3.amazonaws.com/permanent/jenkins/assets/4.0.0-2.204.2-beta5/stub-universe-jenkins.json"```

Create a [key pair](https://github.com/mesosphere/dcos-docs-site/blob/2cb078520bc90dcdfec3adebc1b0536c16f9f422/pages/mesosphere/dcos/services/beta-jenkins/4.0.0-2.204.2-beta/jenkins-auth/index.md#create-a-key-pair) and [service account](https://github.com/mesosphere/dcos-docs-site/blob/2cb078520bc90dcdfec3adebc1b0536c16f9f422/pages/mesosphere/dcos/services/beta-jenkins/4.0.0-2.204.2-beta/jenkins-auth/index.md#create-a-service-account) for Jenkins.
Provision the Jenkins service account with the [permissions](https://github.com/mesosphere/dcos-docs-site/blob/2cb078520bc90dcdfec3adebc1b0536c16f9f422/pages/mesosphere/dcos/services/beta-jenkins/4.0.0-2.204.2-beta/jenkins-auth/index.md#provision-the-service-account-with-permissions).

#### Install Jenkins

Install Jenkins package from the Catalog

![jenkins package](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/jenkins-package.png)

Edit the configuration with the fallow parameters:
**Service Account**: jenkins
**Secret Name** jenkins/private_key
Make sure that checkbox "Strict Mode" is selected.

![jenkins config](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/jenkins-config.png)

#### Configure Jenkins

Follow these steps to configure the Jenkins automation server.
- From the pop-up screen, log in to Jenkins or go to <http://<cluster-LB>/service/jenkins/>
- Select **Manage Jenkins > Configure System**
- Select **Mesos Cloud > Advanced**
- Make sure the Agent Command Style field is set to “Windows” and Fault Domain Filter: “Any domain”

![jenkins server config](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/jenkins-server-config.png)

#### Configure the Jenkins Job

Follow these steps to configure the Jenkins job. You can watch this video demonstration for additional information.

[Jenkins Configuration Demonstration](there will be a link to the video)

Create a new job -> type = MultiPipeline Branch ->Specify “Branch Sources” -> “Git” -> put under “Project Repository” https://github.com/dcos/windows-test-workload.git. “Build Configuration” -> Script Path “hello-world-fsharp/Jenkinsfile”

![jenkins job config](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/jenkins-job-config.png)

![build config](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/build-config.png)

Start the Jenkins job. The first time you run this job, it will take about 7  minutes to pull the heavy Docker image to your Windows machine and spin up a Slave. A second run will complete in much less time.
