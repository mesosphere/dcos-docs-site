---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 0
excerpt: Discover the new features, updates, and known limitations in this release of the Edge-LB Service
enterprise: false
---

# Release notes for Edge-LB version 1.3.1
Edge-LB Service version 1.3.1 was released April 29, 2019.

# New features and capabilities

- Includes Mesos health checks when generating the list of active backends.
- Provides Edge-LB artifacts as a `.dcos` package bundle.
- Updates the SDK version from 0.55.2 to 0.55.4.
- Updates the HAProxy version to 1.9.4.
- Improves support for dynamically-allocated frontend ports.
- Displays the frontend name in the output for the `dcos edgelb endpoints` command.
- Improves the stability and scalability for the Edge-LB pool `dcos-template` and in the `mesos-listener` program.
- Provides additional test coverage and other improvements in existing Edge-LB integration tests.

# Issues fixed

- DCOS-45719 - Edge-LB waits for load balanced applications to to be running in a healthy state before routing traffic to them. This change prevents Edge-LB from routing traffic to an application before it completes its startup operations and its first health check. 
- DCOS-47839 - Users can specify the Edge-LB pool frontend using either the `name` or `port` setting.
- DCOS-44077 - The `mesos-listener` program that communicates with Edge-LB includes improvements to tests coverage and code refactoring.
- DCOS-51865 - Edge-LB continuous integration has been enhanced through testing and code refactoring.
- DCOS-48059 - Edge-LB can successfully return the task id and task status for both server and sidecar tasks.
- DCOS-46502 - Validates regular expressions from user input.
- DCOS-48132 - The Edge-LB dcos-template monitors and reloads its configuration file to prevent Edge-LB pool updates from generating errors when there are frequent pool changes. 

# Known issues and limitations

- Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.

- The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.3/uninstalling/).

- Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with `ext4` may have connection issues.

- If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.

# Release notes for Edge-LB version 1.3.0
Edge-LB Service version 1.3.0 was released February 6, 2019.

# New features and capabilities

- Simplify and optimize the HAProxy reload loop.
- Improve the update strategy for the Edge-LB pool.
- Bump the SDK version to 0.55.2.
- Add protection against installing a pool while its previous version is still uninstalling.
- Improve sidecars runs.
- Improve integration test coverage.
- Improve error messages with better logging
- Expose task without pre-defined mesos-assigned ports
- Dynamic allocation of the HAProxy STATS port
- Dynamic allocation of the HAProxy Frontend port
- Scale down Edge-LB pool instances

# Issues fixed

- COPS-4272, DCOS-46189 - Edge-LB assets is missing on downloads site
- DCOS-46043 - Fix Edge-LB API Server's file comparison functions
- DCOS-46510 - Edge-LB may create haproxy configuration with duplicate backends
- DCOS-46837 - Framework scheduler can crash after installing
- DCOS-48009 - ENVFILE Certificates written in wrong location
- DCOS-46181 - Integration test does not use artifacts uploaded from its PR

# Known issues and limitations

- Edge-LB currently does not support `Strict` security mode on DC/OS 1.10, but supports `Strict` security mode in DC/OS 1.11.

- Edge-LB currently does not support self-service configuration. All configuration must be handled centrally.

- The steps provided in the DC/OS 1.10 web interface to uninstall Edge-LB are incorrect. In order to correctly uninstall Edge-LB for any given DC/OS version, please follow the steps in the [Edge-LB uninstall documentation](/services/edge-lb/1.3/uninstalling/).

- Edge-LB running on a CentOS/RHEL 7.2 node where `/var/lib/mesos` is formatted with `ext4` may have connection issues.

- If a pool is configured with invalid constraints, that pool will not be properly created and will not respect pool deletion. It must be removed manually.