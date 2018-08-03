---
layout: layout.pug
navigationTitle: Spinnaker 0.2.0-1.8.1
title: Spinnaker 0.2.0-1.8.1
menuWeight: 50
excerpt: Overview of DC/OS Spinnaker 0.2.0-1.8.1
featureMaturity:
enterprise: false
---

DC/OS Spinnaker Service is an automated service that makes it easy to deploy and manage [Spinnaker](https://www.spinnaker.io/) on Mesosphere [DC/OS](https://mesosphere.com/product/).

## Benefits

DC/OS Spinnaker offers the following benefits :
1. Immutable Infrastructure
2. Multi-Cloud Deployments
3. Management Flexibility
4. Easy Rollbacks
5. Checking Precondition Stage
6. Automated Canary Analysis (ACA) is excellent at catching issues that cannot be tracked by traditional unit or integration test.
7. Traffic Guards
8. Automated Cleanup

## Features

DC/OS Spinnaker's main features are:
Spinnaker ships with two core sets of features:
1. Cluster Management: The cluster management feature is used to view and manage the resources in the cloud. Cluster management deals with cloud resources like:

   a. Clusters

   b. Server Group

   c. Security Group

   d. Load Balancer

2. Deployment Management: The deployment management features is used to construct and manage continuous delivery workflows. The deployment depends upon two things:

   a. Stages

   b. Pipeline

## Components/Services

Spinnaker framework is a collection of sub-services that work together to form the Continuous Deployment platform. Each service follows the single-responsibility principle which allows for faster iteration on each individual component and a more pluggable architecture for custom components.

For Spinnaker [Architecture](https://www.spinnaker.io/reference/architecture/)

The Spinnaker components are:-

* Deck

* Gate

* Orca

* Clouddriver

* Front50

* Rosco

* Igor

* Echo

* Fiat

* Kayenta
