---
layout: layout.pug
navigationTitle: Verifying the Edge-LB installed version
title: Verifying the Edge-LB installed version
menuWeight: 44
excerpt: How to a verify the version of Edge-LB you have installed
enterprise: true
---

You can use the DC/OS&trade; CLI client to find the Edge-LB version that you have currently deployed on the DC/OS cluster.

# Before you begin
You must have:
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster.

# To verify the Edge-LB version
1. Run the following command to find the Edge-LB version:

    ```bash
    dcos edgelb version
    ```

1. Review the command output. The `version` command displays the current Edge-LB version similar to the following:

    ```bash
    client = v1.5.0
    server = v1.5.0
    ```

    This example output indicates that the current Edge-LB API server version is v1.5.0 and the CLI client that is interacting with the Edge-LB server is also version v1.5.0.

For more specific information about the latest supported Edge-LB version and Edge-LB compatibility with the latest releases of DC/OS, see the Edge-LB [version policy](/mesosphere/dcos/services/edge-lb/1.5/related-documentation/version-support/) summary and the [version compatibility matrix](/mesosphere/dcos/version-policy/#dcos-platform-version-compatibility-matrix).
