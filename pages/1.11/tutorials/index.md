---
layout: layout.pug
navigationTitle:  Tutorials
title: Tutorials
menuWeight: 140
excerpt: Getting started with DC/OS 

enterprise: false
---

This collection of tutorials will teach you how to run and operate services in a production environment using DC/OS.

- [DC/OS 101](/1.11/tutorials/dcos-101/) - This tutorial includes basic recipes for developing and orchestrating applications for a distributed landscape. To provide hands-on experience, you will develop and deploy multiple applications (including stateful, dockerized, and non-dockerized) on an actual cluster during each step of the tutorial. 
- [Creating and Running a Service](/1.11/tutorials/create-service/) - This tutorial shows how to create and deploy a simple one-command service and a containerized service using both the DC/OS web interface and the CLI.

- [Running Stateful Services on DC/OS](/1.11/tutorials/stateful-services/) - This tutorial shows you how to install and run stateful services on DC/OS.
- [Autoscaling with Marathon](/1.11/tutorials/autoscaling/) - These are three tutorials that will take you through the process of autoscaling Marathon services based on CPU and memory, requests per second, or queue length.
- [Deploying a Load-Balanced Data Pipeline](/1.11/tutorials/iot_pipeline/) shows you how to build a load-balanced data pipeline on DC/OS in 15 minutes.
- [Deploying Marathon Apps with Jenkins](/1.11/tutorials/deploy-on-marathon/) - This tutorial shows how to deploy applications on Marathon using Jenkins for DC/OS. It will walk you through creating a new Jenkins job, publishing a Docker container on source code changes, and deploying those changes to Marathon based on the application definition contained in the project’s `marathon.json` file.
- [Labeling Tasks and Jobs](/1.11/tutorials/task-labels/) - This tutorial illustrates how labels can be defined using the DC/OS web interface and the Marathon HTTP API, and how information pertaining to applications and jobs that are running can be queried based on label value criteria. 
- [Debugging Applications on DC/OS](/1.11/tutorials/dcos-debug/) - This set of tutorials provide a top-down introduction to debugging applications during and after their deployment on DC/OS.
