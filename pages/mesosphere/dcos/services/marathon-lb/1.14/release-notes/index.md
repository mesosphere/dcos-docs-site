---
layout: layout.pug
navigationTitle: Release notes
title: Release notes
menuWeight: 0
excerpt: Discover the new features, updates, and known limitations in this release of the Marathon-LB Service
---

# Release Notes for Marathon-LB Service version 1.14.0

## The release highlight:

- HAProxy v2.0.3

## The bug fixes

- Check if `healthChecks` is a key of app before checking its length
- Use `self.host` property once in `get_event_stream`
- Fix Marathon event stream subscription parameters
- Make the list of excluded Mesos task states complete
- Fix the usage of condition variable

## Known Issues

# Previous Versions

Click [here](https://github.com/mesosphere/marathon-lb/releases) to view the release notes prior to Marathon-LB Service version 1.14.0.
