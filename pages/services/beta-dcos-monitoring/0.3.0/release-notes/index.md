---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 30
excerpt: New features, updates, and known limitations
render: mustache
model: ../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Version v0.3.0

## New features

* Allow accessing Grafana UI through Admin Router.
* Support configuring Grafana admin user credentials.
* Support Open DC/OS.
* Support [Package Registry](https://docs.mesosphere.com/latest/administering-clusters/repo/package-registry/).

## Updates

* Remove support for Prometheus Mesos Exporter, which is no longer used to collect Mesos metrics.

# Version v0.2.1

## Updates

* Correct permissions required to run the package.

# Version v0.2.0

## New features

* Grafana v5.3.4.
* Support `SSH auth` when fetching from Git repository.
* Add default Grafana dashboards which can be automatically loaded.
* Support Grafana server placement constraints.
* Support fetching from a branch in a Git repository.

## Updates

* Use local persistent volume for Grafana server.
* Used Docker image for Grafana server.
* Recursively clone git sub-modules from a git repository.

# Version v0.1.1

Bug fix release.

## Updates

* Add missing release notes.

# Version v0.1.0

Initial release.

## New features

* Prometheus v2.2.1.
* Grafana v5.0.1.
* Alert Manager v0.15.2.
* Push Gateway v0.5.2.
* Automatically scrape dcos-metrics service endpoints in Prometheus.
* Automatically load Grafana dashboard configurations from a git repository.
* Automatically load Alert Manager configurations from a git repository.
* Support strict mode DC/OS cluster.
* Support launching Grafana server on public agents.

## Known limitations

* No persistent storage for Grafana dashboard configurations.
* No external storage for Prometheus data.
* No backup for Prometheus data.
