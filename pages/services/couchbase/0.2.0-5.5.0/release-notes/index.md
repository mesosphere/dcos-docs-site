---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 130
excerpt: Discover the new features, updates, and known limitations in this release of the Couchbase Service
featureMaturity:
enterprise: false
model: /services/couchbase/data.yml
render: mustache
---

# Release Notes for {{ model.techName }} Service version 0.2.0-5.5.0

## New Features
* Based on {{ model.techName }} v5.5.0, {{ model.syncGatewayName }} v2.0.0
* Supports new {{ model.techName }} service types - Eventing and Analytics
* Multiple deployment modes
* Virtual Networking support for high density deployments
* TLS support for {{ model.techName }} and {{ model.syncGatewayName }}
* Secrets option for password configurations
* Strict mode support
* Backup and Restore support with sync to S3 compatible store
* {{ model.syncGatewayName }} configuration now via DC/OS CLI and UI
* Automatic rebalance after adding new nodes
