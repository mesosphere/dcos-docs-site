---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 10
excerpt: Discover the new features, updates, and known limitations in this release of the Percona Server for MongoDB Service 
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/percona-server-mongodb/data.yml
render: mustache
---

# Release Notes for Percona Server for MongoDB Service version 0.4.1-3.6.8

## Breaking Changes

## Improvements
- {{ model.techName }} 3.6.8 [Release Notes](https://www.percona.com/blog/2016/08/11/percona-server-mongodb-3-2-8-2-0-now-available/).

## Bug Fixes
- Fix for scaling-down {{ model.dbName }} Replica Set.
- Fix for slow container exit on {{ model.dbName }} shutdown.
