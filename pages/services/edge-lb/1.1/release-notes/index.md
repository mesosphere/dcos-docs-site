---
layout: layout.pug
navigationTitle:  Edge-LB Release Notes
title: Edge-LB Release Notes
menuWeight: 0
excerpt: Release notes for Edge-LB 1.1

enterprise: false
---

These are the release notes for Edge-LB 1.1.

# v1.1.0

Released on 9 August 2018.

## Noteworthy changes:

- Updates HAProxy used by the pool servers to 1.8.12 from 1.7.6. Please check the [HAProxy CHANGELOG](http://git.haproxy.org/?p=haproxy-1.8.git;a=blob;f=CHANGELOG;hb=8a200c71bd0848752b71a1aed5727563962b3a1a) for details.
- Pool server reloads are no longer blocked by persistent connections.
- Stability, debuggability and reliability improvements in the pool server code.
- The size of the pool container was reduced to 100MB from ~250MB
- Transition to Master/Worker mode in HAProxy running on the pool server. If custom configuration templates are used, then they must be updated. Namely:
  - template must not specify the `daemon` option
  - template must specify the `expose-fd listeners` parameter in the `stats socket` option
- Edge-LB now uses the default CLI packages from the DC/OS SDK `edgelb-pool` CLI subcommand. Compared to `edge-lb` native packages, they do not support the `version` subcommand.
- Provided `mesosAuthNZ` package install option, which when set to `false` enables Edge-LB to run on DC/OS 1.10 clusters in `disabled` security mode.

Shortlist:

```
$ git shortlog v1.0.3..HEAD
      sdk: Update SDK buildchain to 0.42.1
      sdk: replace stub cli for edgelb-pool with a default one
      sdk: Use SDK version in build.gradle from the env, localize it to `framework/` dir
      Bump pip requirements
      Force rebuilding of all the deps while checking if cli binary has changed
      Permit specifying custom linker flags to build_go_exe.sh
      Move dcos-commons tooling into git subrepo
      Extra debugging in ci-setup.sh script
      Add pytest cache to gitignore
      Makefile and Dockerfile should not be sent as context during lbmgr cont. build
      Update haproxy to 1.8.12
      Be more verbose with logging in order to boost debugging
      Use instance with more IOPS when running integration tests
      Do not wait for haproxy to finish reloading/for long-running connections
      Disable gosec linter
      Permit for disabling of Mesos Authorization via package-install option
```

## Known Limitations

* Edge-LB does not currently support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.
* Edge-LB does not currently support self-service configuration; all configuration must be handled centrally.

## Known Issues

* The steps presented in the UI to uninstall Edge-LB are incorrect. Follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.1/uninstalling/).
* Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with ext4 may have connection issues.
* If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion.  It must be removed manually.
