---
layout: layout.pug
navigationTitle:  Edge-LB Release Notes
title: Edge-LB Release Notes
menuWeight: 0
excerpt:

enterprise: false
---

Release notes for Edge-LB.

# v1.0.2

## Noteworthy changes:

- Fixed a bug causing all V2 API `backend.service` selector fields ending in "Pattern" to not function properly

Shortlist:

```
% git shortlog v1.0.1..HEAD
      Fix regex bug affecting all V2 api pattern selectors (#132)
```

## Known Limitations

* Edge-LB does not currently support `Disabled` security mode.
* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but does work in DC/OS 1.11 strict mode.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.
* The number of instances of load balancers cannot be scaled down.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are currently incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.0/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where /var/lib/mesos is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.

# v1.0.1

## Noteworthy changes:

- Bump SDK dependency version to 0.40.5. Addresses a bug which could cause a pool scheduler to erroneously destroy one or more Marathon persistent volumes, potentially leading to data loss.

Shortlist:

```
% git shortlog v1.0.0..HEAD
      Bump SDK to 0.40.5 (#131)
```

## Known Limitations

* Edge-LB does not currently support `Disabled` security mode.
* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but does work in DC/OS 1.11 strict mode.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.
* The number of instances of load balancers cannot be scaled down.

## Known Issues

* V2 API backend.service regex selectors do not work properly
* The steps presented in the UI to uninstall Edge-LB are currently incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.0/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where /var/lib/mesos is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.
* Marathon-LB and Edge-LB pool servers cannot run on the same agent without changing the default ports because they both require 80 and 443 by default.
 An example is listed on [pool configuration with non-default ports](/services/edge-lb/1.0/pool-configuration/v2-examples/#internal-east-west-load-balancing/).

# v1.0.0

## Noteworthy changes:

- Introducing V2 API with new more intuitive model for service / app backend selection model
- New CLI command layout, ability to create, modify, and delete individual pools
- Dockerized build and other CI improvements
- Strict Mode Support for DC/OS Enterprise version 1.11 or higher
- Security fix in logging
- Curl with -k within same container
- Update healthchecks to MESOS_HTTP
- Load-balancer manager now connects to apiserver via https adminrouter with service account
- Pool scheduler now uses mesos V1 API and requires additional service account permissions
- Improve security in CLI -> apiserver communication
- Added logging to mesos-listener and requests created by apiserver
- Added Edge-LB package install option: logLevel to make apiserver logLevel configurable

Shortlist:

```
% git shortlog v0.1.9..HEAD
      Fix response check in edgelb cli (#116)
      CLI, API, Schema, and UX Improvements (API V2) (#120)
      Support Strict Mode (#122)
      Run apiserver in UCR with host volume (#123)
      1.0 rc fixes (#124)
      Change healthchecks from HTTP to MESOS_HTTP (#125)
      Update releases to downloads.mesosphere.com (#127)
      Update SDK to 0.40.2 (#128)
      HTTPS internal communication (#126)
      [DCOS-19242] Ensure edge-lb is readily built on various platforms (#117)
      [DCOS-19242] Dockerize build (#119)
```

## Known Limitations

* Edge-LB does not currently support `Disabled` security mode.
* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but does work in DC/OS 1.11 strict mode.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.
* The number of instances of load balancers cannot be scaled down.

## Known Issues

* A potentially serious situation exists in DC/OS 1.10 or 1.11 clusters for any Marathon application deployed using persistent volumes in conjunction with Edge-LB.  If Edge-LB is deployed on a public agent node, the schedulers may erroneously destroy one or more Marathon persistent volumes, potentially leading to data loss. This bug has been resolved in Edge-LB v1.0.1
* The steps presented in the UI to uninstall Edge-LB are currently incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.0/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where /var/lib/mesos is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.

# v0.1.9

## Noteworthy changes:

- Fix path routing bug which resulted in adding a "/" to paths in certain configurations.
- Fix `dcos edgelb` cli for clusters with dashboard URLs using `http://` scheme.

Shortlist:

```
% git shortlog v0.1.8..HEAD
      Updated `mesosphere/consul-template` repo access to SSH. (#115)
      Use specified DcosURL scheme (#113)
      Downgrade instance type (#114)
      apiserver: Fix path routing bug with "toPath: /" (#111)
```

## Known Limitations

* The Edge-LB v0.1.9 CLI requires that all pool definitions are contained within a single YAML or JSON file. Pools cannot be configured independently because of this limitation.
* Edge-LB does not currently support `Disabled` security mode.
* Edge-LB does not currently support `Strict` security mode.
* Edge-LB does not currently support upgrades between versions.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.
* There is no way to create an individual Edge-LB pool without submitting a full Edge-LB configuration.
* The number of instances of load balancers cannot be scaled down.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are currently incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/0.1/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where /var/lib/mesos is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.

# v0.1.8

Noteworthy change(s):

- Fix scheduler bug for unhandled rescind offers (causes unhealthy in UI)
- Decrease reload wait from 10s to 5s

Shortlist:

```
% git shortlog v0.1.7..HEAD
      [Urgent] Bump sdk version (#108)
      lbmgr: Decrease reload wait from 10s to 5s
      itests: Add zero downtime reload test
```

# v0.1.7

* Minimum DC/OS version 1.10 in universe package
* Fix static VIP parsing in template
* Fix bug with stale API server template artifacts

# v0.1.6

* Fix Mesos Role `*` in config

# v0.1.5

* Fix HTTP healthchecks
* Upgrade to HAProxy 1.7.6
    * HAProxy 1.7.3 had a bug that caused timeouts to occur upon each reload
* Make Virtual Networks configurable
* Fix bug with multiple Secrets
* Add dcos edgelb config --reference
