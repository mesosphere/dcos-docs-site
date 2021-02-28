---
navigationTitle: Release Notes
title: Release Notes
menuWeight: 40
excerpt: New features, updates, and known limitations
---

# DC/OS Monitoring v.1.4.0 was released on 1, September 2020

## New features

* Grafana: custom configuration and LDAP support
* Grafana: plugins installation
* Alertmanager: Add SMTP auth secret support.
* Alertmanager: Add a package option for git ref name.
* Add an option to configure Prometheus remote write and remote read.

## Updates

* Alertmanager to [0.21.0](https://github.com/prometheus/alertmanager/releases/tag/v0.21.0)
* Prometheus to [2.20.0](https://github.com/prometheus/prometheus/releases/tag/v2.20.0)
* Grafana to [7.1.1](https://github.com/grafana/grafana/blob/v7.1.1/CHANGELOG.md)
* Pushgateway to [1.2.0](https://github.com/prometheus/pushgateway/releases/tag/v1.2.0)
* nginx to [1.19.1](http://nginx.org/en/CHANGES)

## Notes

* There were many deprecations and breaking changes in updated components.
* A `pod replace` operation is required if there are existing deployments of older versions on DC/OS 2.0. Please check the [SDK release notes](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3) for details.

# DC/OS Monitoring v.1.3.1  was released on 23, July 2020

## Updates

* Download all assets from D2iQ servers instead of GitHub.

# DC/OS Monitoring v.1.3.0

## New features

* Alertmanager: Add SMTP auth secret support.
* Alertmanager: Add a package option for git ref name.
* Add an option to configure Prometheus remote write and remote read.

## Updates

* Updated SDK to v0.57.3.

## Notes

* A `pod replace` operation is required if there are existing deployments of older versions on DC/OS 2.0. See [the SDK release notes](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3) for details.

# Version v1.2.0

## New features

* Added option to configure the token refresh interval for Prometheus agent discovery task.

## Updates

* Changed default token refresh interval for Prometheus agent discovery task to 1 hour.
* Upgraded version of Go to 1.13.
* Fixed typo in "dcos monitoring describe" CLI command.

# Version v1.1.0

## New features

* Support Prometheus server placement constraints.
* Support scheduler placement constraints.
* Add new CLI commands for Prometheus (`dcos monitoring prometheus`).

## Updates

* Add workaround for a bug in DC/OS versions 1.13.0–1.13.4 that caused permission errors in nginx when running dcos-monitoring as root.
* Update SDK to v0.57.1.

# Version v1.0.2

## Updates

* Fix the "More Detail" column in the Home dashboard in Grafana.

# Version v1.0.1

## Updates

* Increase the default token refresh interval for Prometheus agent discovery task.
* Fix bug in agent discovery task causing leaked connections.

# Version v1.0.0

## New features

* Add a configuration option for the Grafana dashboard theme style (defaults to Light).
* Default DC/OS Grafana dashboards are loaded to a folder called DC/OS Defaults.
* Support setting pre-reserved roles for Prometheus.

## Updates

* Decrease the number of resources in the default package configuration.
* Read in DC/OS CA certs for verification in the Prometheus agent discovery task (Enterprise only).
* Update SDK to v0.56.1.
* Remove configuration option for Grafana to use public node.
* Modify configuration option names for Secrets fields.
* Pushgateway is now optional and off by default.
* Installation is now blocked with helpful errors if extraneous configuration options are included.
* The DC/OS Monitoring CLI command is now `monitoring` instead of `dcos-monitoring`.

## Known limitations

* Upgrading from v0.5 is not possible due to Pushgateway defaulting to off.

# Version v0.5.0

## New features

* Add Marathon LB integration.
* Enable `gzip` compression for Grafana's HTTP server.
* Add a link to the Grafana UI on the Services page.
* Set the Home dashboard in Grafana to the DC/OS Overview dashboard.

## Updates

* Grafana dashboard titles are no longer overwritten by the file path of the dashboard JSON.

## Known limitations

* Service name cannot contain characters that are not allowed in a DNS name (for example `/`) if using Marathon LB integration.

# Version v0.4.3

## Updates

* Fix issues that occur when the service is installed in a folder.
* Fix a regression related to deploy key support.

# Version v0.4.2

## Updates

* Workaround the UI bug for package install.

# Version v0.4.1

## Updates

* Bug fixes (DSS profile support is missing).

# Version v0.4.0

## New features

* Allow accessing Alertmanager UI through Admin Router.
* Allow accessing Prometheus UI through Admin Router.
* Support loading Prometheus alert rules from a Git repository.
* Support reloading Alertmanager configurations after install.
* Support DC/OS Storage Service (DSS) volume profiles.

## Updates

* Support for configuring Prometheus storage retention.
* Support for configuring Alertmanager resource footprint (that is CPU and memory).
* Installable from the Universe.
* Update SDK to 0.55.2.
* New logo.

## Known limitations

* Upgrading from v0.3.0 is not supported now.
* Does not support loading Prometheus alert rules recursively from a directory.

# Version v0.3.0

## New features

* Allow accessing Grafana UI through Admin Router.
* Support configuring Grafana admin user credentials.
* Support Open DC/OS.
* Support [Package Registry](https://docs.mesosphere.com/latest/administering-clusters/repo/package-registry/).

## Updates

* Remove support for Prometheus Mesos Exporter, no longer used to collect Mesos metrics.

# Version v0.2.1

## Updates

* Correct permissions required to run the package.

# Version v0.2.0

## New features

* Support `SSH auth` when fetching from Git repository.
* Add default Grafana dashboards which can be automatically loaded.
* Support Grafana server placement constraints.
* Support fetching from a branch in a Git repository.

## Updates

* Grafana v5.3.4.
* Use local persistent volume for Grafana server.
* Use Docker image for Grafana server.
* Recursively clone Git sub-modules from a Git repository.

# Version v0.1.1

Bug fix release.

## Updates

* Add missing release notes.

# Version v0.1.0

Initial release.

## New features

* Prometheus v2.2.1.
* Grafana v5.0.1.
* Alertmanager v0.15.2.
* Pushgateway v0.5.2.
* Automatically scrape dcos-metrics service endpoints in Prometheus.
* Automatically load Grafana dashboard configurations from a Git repository.
* Automatically load Alertmanager configurations from a Git repository.
* Support strict mode DC/OS cluster.
* Support launching Grafana server on public agents.

## Known limitations

* No persistent storage for Grafana dashboard configurations.
* No external storage for Prometheus data.
* No backup for Prometheus data.
