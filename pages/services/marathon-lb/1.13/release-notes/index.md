---
layout: layout.pug
navigationTitle: Release notes
title: Release notes
menuWeight: 0
excerpt: Discover the new features, updates, and known limitations in this release of the Marathon-LB Service
---

# Release Notes for Marathon-LB Service version 1.13.0

## Noteworthy changes:

- Update to HAProxy 1.9.6
- Fixes HAPROXY_HTTP_BACKEND_REVPROXY_GLUE default template syntax

Shortlist:

```
$ git shortlog v1.12.3..v1.13.0
      add password authentication (#493)
      Update README.md (#617)
      Increase ZDD pids from 1 to 2 (#598)
      Fixed typo on HAPROXY_HTTP_BACKEND_REVPROXY_GLUE template. (#501)
      Fixes #613 - correctly validate global daemon flag. (#615)
      Make sure we remove temp map files only after checking for map config. (#582)
      Introduce "linear-increase" parameter to zdd.py. (#556)
      tests: use raw strings instead of escaping
      config: use raw strings instead of escaping
      make: introduce makefile for testing/building
      Fix tests (#619)
      readme: point to github wiki (#627)
      tests/dockerfile: update base image (#629)
      utils: send auth to any host redirected to (#633)
      use consistent line endings when comparing config (#622)
      disable configuration cleanup on failed validation (#554) (#625)
      Rebase and Flake8 fixes of #584 (#624)
      print marathon master (#626)
      Fallback on next Marathon instance on exception (#630)
      updated to 1.9.6 (#631)
      Bind the backend to the frontend when redirectHttpToHttps is used (#498)
      Add backoff limitation option (#479)
      fix: undefined HAPROXY_DEPLOYMENT_TARGET_INSTANCES (#537)
      bump tini to version 0.18.0 and haproxy to version 1.8.16 (#608)
```

## Known Issues

# Previous Versions

Click [here](https://github.com/mesosphere/marathon-lb/releases) to view the release notes prior to Marathon-LB Service version 1.13.0.