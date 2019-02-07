---
layout: layout.pug
navigationTitle: Release notes
title: Release notes
menuWeight: 80
excerpt: Release notes for Marathon-LB
---

# v1.12.0

## Noteworthy changes:

- Update to HAProxy 1.8.4
- Change reload mechanism away from iptables hack, use HAProxy 1.8 features instead

Shortlist:

```
$ git shortlog v1.11.3..HEAD
      Check for MESOS_TCP (#509)
      Add long backend proxypass path test (#499)
      Fix bug in config validation and reduce marathon calls (#563)
      Add missing parameter to regenerate_config call (#573)
      Merge beta features into master (bump to HAProxy 1.8.4) (#569)
      Fixed broken links (#568)
      Fix build status link (#548)
      Use multiple keyservers for gpg verify of tini during Docker build (#549)
      Work around python3 > dh-python > dkpg-dev > make dependency (#564)
      Https frontend grouping by vhost (#524)
      Fix ordering of acls that include paths when using haproxy map with https (#447)
      Adding MLB Integration Tests to CI (#570)
```

## Known Issues

* Existing custom `HAPROXY_HEAD` templates will cause v1.12.0 to not start up properly. Please remove `daemon` and add `stats socket /var/run/haproxy/socket expose-fd listeners` in the global section of your custom `HAPROXY_HEAD` to resolve the issue. More can info be found here: [https://docs.mesosphere.com/services/marathon-lb/advanced/#global-template](https://docs.mesosphere.com/services/marathon-lb/advanced/#global-template)

# Previous Versions

Please check [https://github.com/mesosphere/marathon-lb/releases](https://github.com/mesosphere/marathon-lb/releases) for release notes prior to v1.12.0.
