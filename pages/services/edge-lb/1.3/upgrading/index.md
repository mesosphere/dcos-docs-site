---
layout: layout.pug
navigationTitle:  Upgrading Edge-LB
title: Upgrading Edge-LB
menuWeight: 25
excerpt: Upgrading an Edge-LB installation

enterprise: false
---

Perform an Edge-LB upgrade by following this procedure.

1. Uninstall the `apiserver`.

    ```bash
    dcos package uninstall edgelb --yes
    ```

1. Remove the old package repositories.

    ```bash
    dcos package repo remove edgelb
    dcos package repo remove edgelb-pool
    ```

1. Add the new package repositories.

    ```bash
    dcos package repo add --index=0 edgelb \
      https://<insert download link>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool \
      https://<insert download link>/stub-universe-edgelb-pool.json
    ```

1. Install the new `apiserver`. Use the service account created when installing the previous version; see [Edge-LB Installation Guide](/services/edge-lb/1.3/installing) for more information. The configuration file below matches the one created while following the install instructions.

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

    EdgeLB also needs the following options to be specified. Their values depend on the security mode of the cluster it is running on:

    * `service.mesosProtocol`: `"https"` for Permissive and Strict security modes, `"http"` (default) for Disabled security mode
    * `service.mesosAuthNZ`: `true` (default) for Permissive and Strict security modes, `false` for Disabled security mode. Parameter is available begining version v1.1.

1. Upgrade each pool.

    ```bash
    dcos edgelb update <pool-file>
    ```