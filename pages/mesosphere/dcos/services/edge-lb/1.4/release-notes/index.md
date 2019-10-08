---
layout: layout.pug
navigationTitle: Release notes
title: Release notes
menuWeight: 1
excerpt: Discover the new features, updates, and known limitations in this release of the Edge-LB service
enterprise: true
---
# Release notes for Edge-LB version 1.4.0
Edge-LB Service version 1.4.0 was released July 24, 2019.

# New features and capabilities
- Introduces automatic provisioning and lifecycle management for AWS Network Load Balancers (NLB).
- Adds a new command-line program for removing AWS load balancer instances created for Edge-LB if you uninstall Edge-LB.
- Provides a new command-line program for collecting logs and creating diagnostic bundles for Edge-LB operations.
- Updates the HAProxy version to 2.0.1
- Updates the Golang version to 1.12.7
- Removes the use of sidecar
- Adds haproxy exporter for HAProxy metrics
