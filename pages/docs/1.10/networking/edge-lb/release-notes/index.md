---
layout: layout.pug
navigationTitle:  Edge-LB Release Notes
title: Edge-LB Release Notes
menuWeight: 9
excerpt:
featureMaturity:
enterprise: true
---

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
