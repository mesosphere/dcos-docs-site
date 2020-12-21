---
layout: layout.pug
navigationTitle: Release Notes - v1.1
title: Release Notes - Conductor v1.1
menuWeight: 01
render: mustache
model:  /mesosphere/dcos/2.1/data.yml
beta: false
excerpt: Release notes for Conductor 1.1, including Open Source attribution, and version policy.
---

D2iQ&reg; Conductor&trade; v1.1.0 was released on 10, September 2020.

New customers must contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and/or install Conductor.

# Release Summary
D2iQ’s Conductor is a distributed learning platform that enables you to train your team using interactive cloud-native content - using a mix of traditional documentation, video training, self-guided labs, quizzes and tests - all served in a web-based single-page integrated learning environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility.

# New Features and Capabilities

## Content

- Course: Prometheus Data Exploration **NEW**
  - Unit: Prometheus Data Exploration **NEW**
- Course: Grafana Dashboards **NEW**
  - Unit: Working with Grafana Dashboards **NEW**
- Course: Kubernetes 101 **MINOR FIXES**

## Application Platform

### Kubeaddon support as of Konvoy v1.5+
Starting with Konvoy v1.5, Conductor can be installed natively by Konvoy.

### Better Support for Self-Hosted Application Errors
Now D2iQ Customer Operations Team can better support customer application issues for self-hosted deployments of Conductor by using application error bundles sent from the customer's deployment.

### Backup and Restore with Postgresql (PG)
Backing up and restoring Conductor's PG database is now enabled by downloading the utility package `conductor-tools` via the Support Portal.

### Production-like capability via Konvoy learning clusters on AWS
For teaching our more advanced Kuberntes use-cases, we use various cluster configurations using D2iQ's flagship Kubernetes distribution, Konvoy. Just configure by inputting your AWS credentials for the account where your Konvoy cluster is deployed, and any associated cloud spend can be tracked there.

# Breaking changes

- n/a

# Fixed and Improved Issues

- Improved session stability with connection to shell instance when using Integrated Learning Environment.

# Known Issues

The following are known issues as of Conductor v1.1:

## Traefik Bug

There is a bug in Traefik v1.7.23 that causes Conductor v1.0 to break. Because Konvoy v1.4 depends on this version of Traefik, Conductor v1.1 is not currently compatible with Konvoy v1.4.

## Air Gapped Install
Air gapped installations are not supported in this release of Conductor.
