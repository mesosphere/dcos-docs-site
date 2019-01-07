---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 90
excerpt: Discover the new features, updates, and known limitations in this release of the Beta DC/OS Monitoring Service.
---

# Version v0.1.1

Bug fix release.

## Updates

* Add missing release notes.
* Fix documentation.

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

## Limitations

* No persistent storage for Grafana dashboard configurations.
* No external storage for Prometheus data.
* No backup for Prometheus data.
