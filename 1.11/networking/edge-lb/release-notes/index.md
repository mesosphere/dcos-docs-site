---
layout: layout.pug
navigationTitle:  Edge-LB Release Notes
title: Edge-LB Release Notes
menuWeight: 9
excerpt:

enterprise: true
---

# v0.1.9

Noteworthy change(s):

- Fix path routing bug which resulted in adding a "/" to paths in certain configurations.
- Fix `dcos edgelb` cli for clusters with dashboard URLs using `http://` scheme.

Full changelog: [v0.1.8...v0.1.9](https://github.com/mesosphere/dcos-edge-lb/compare/v0.1.8...v0.1.9)

Shortlist:

```
% git shortlog v0.1.8..HEAD
Avinash Sridharan (1):
      Updated `mesosphere/consul-template` repo access to SSH. (#115)

Drew Kerrigan (1):
      Use specified DcosURL scheme (#113)

Michael Ellenburg (1):
      Downgrade instance type (#114)

Nicholas Sun (1):
      apiserver: Fix path routing bug with "toPath: /" (#111)
```

# v0.1.8

Noteworthy change(s):

- Fix scheduler bug for unhandled rescind offers (causes unhealthy in UI)
- Decrease reload wait from 10s to 5s

Full changelog: [v0.1.7...v0.1.8](https://github.com/mesosphere/dcos-edge-lb/compare/v0.1.7...v0.1.8)

Shortlist:

```
% git shortlog v0.1.7..HEAD
Drew Kerrigan (1):
      [Urgent] Bump sdk version (#108)

Nicholas Sun (2):
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
