---
layout: layout.pug
navigationTitle:  Component Management
title: Component Management
menuWeight: 5
excerpt: Installing and managing DC/OS component services

enterprise: false
---

The component management API controls installation and management of DC/OS component services.

It is used by the DC/OS installer during install, upgrade, and uninstall. It is not designed for interaction by DC/OS users.

## Component Package Manager

The DC/OS Component Package Manager (Pkgpanda) implements the component management API and runs on all DC/OS nodes.

[Pkgpanda](https://github.com/dcos/dcos/tree/master/pkgpanda) consists of two parts: a package builder and a package manager.

- The **package builder** builds and bundles component packages from source code and pre-compiled artifacts as part of the DC/OS release building process.
- The **package manager** is included as part of DC/OS and runs on each node, managing the installed and activated component packages on that node.

Component packages built by the package builder are distributed as part of the DC/OS installer for each release. The installer ships the component packages to each node and orchestrates the component management API to install them. The component packages contain one or more systemd service definitions, binaries, and configuration files.


## Component health

Component health is monitored by the DC/OS Diagnostics component. For more information about component monitoring, see [Monitoring](/1.13/monitoring/).


## Component logs

Component logs are sent to journald and exposed by the DC/OS Log component. For more information about component logs, see [Logging](/1.13/monitoring/logging/).


## Routes

The component management API is exposed through Admin Router and Admin Router Agent under the `/pkgpanda/` path on all nodes.


## Resources

[swagger api='/1.12/api/pkgpanda.yaml']
