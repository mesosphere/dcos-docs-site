---
layout: layout.pug
navigationTitle:  Upgrading Edge-LB
title: Upgrading Edge-LB
menuWeight: 45
excerpt: Upgrading an Edge-LB installation
enterprise: true
---

In general, you should regularly update or upgrade the Edge-LB package you have installed to the latest version available to ensure you can take advantage of any fixes and new features that are included in the most recent release.

For information about what's new or fixed in any release, see the Edge-LB [release notes](/mesosphere/dcos/services/edge-lb/1.5/related-documentation/release-notes/) and [related documentation](/mesosphere/dcos/services/edge-lb/1.5/related-documentation/).

# Before you begin
You must have:
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster.

# To upgrade Edge-LB packages

1. Uninstall the `apiserver` package:

    ```bash
    dcos package uninstall edgelb --yes
    ```

1. Expose the packages that are already installed on the running DC/OS cluster:

    ```bash
    dcos package repo list
    ```

    The output will be similar to:

    ```
    edgelb-pool-aws: https://downloads.mesosphere.com/edgelb-pool/v1.5.0/assets/stub-universe-edgelb-pool.json
    edgelb-aws: https://downloads.mesosphere.com/edgelb/v1.5.0/assets/stub-universe-edgelb.json
    Universe: https://universe.mesosphere.com/repo
    Bootstrap Registry: https://registry.component.thisdcos.directory/repo
    ```

1. Remove the old package repositories using the names exactly as they are shown:

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```

1. Add the new package repositories:

    ```bash
    dcos package repo add --index=0 edgelb-aws \
      https://<insert download link>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool-aws \
      https://<insert download link>/stub-universe-edgelb-pool.json
    ```

1. Install the new `apiserver`:

    Use the service account you created when you installed the previous version. For more information about creating and configuring permissions for the service account, see [Installing Edge-LB](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing) and [Service account permissions](/mesosphere/dcos/services/edge-lb/1.5/reference/permissions/#service-account-permission).

    The configuration file below matches the one created by following the installation instructions.

    ```bash
    tee edgelb-options.json <<EOF
    {
      "service": {
        "secretName": "dcos-edgelb/edge-lb-secret",
        "principal": "edge-lb-principal",
        "mesosProtocol": "https"
      }
    }
    EOF
    dcos package install --options=edgelb-options.json edgelb
    ```

    EdgeLB requires the following options to be specified based on the security mode of the cluster:
    * `service.mesosProtocol`
        - `"https"` for permissive or strict security
        - `"http"` (default) for disabled security

    * `service.mesosAuthNZ`
        - `true` (default) for permissive or strict security
        - `false` for disabled security mode

1. Upgrade each pool:

    ```bash
    dcos edgelb update <pool-file>
    ```
