---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for version 0.4.1-3.6.8
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

## Version 0.4.1-3.6.8

### Breaking Changes

### Improvements
- {{ model.techName }} 3.6.8 [Release Notes](https://www.percona.com/blog/2016/08/11/percona-server-mongodb-3-2-8-2-0-now-available/).

### Bug Fixes
- Fix for scaling-down {{ model.dbName }} Replica Set.
- Fix for slow container exit on {{ model.dbName }} shutdown.
