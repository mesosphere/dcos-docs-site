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
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```

1. Add the new package repositories.

    ```bash
    dcos package repo add --index=0 edgelb-aws \
      https://<AWS S3 bucket>/stub-universe-edgelb.json
    dcos package repo add --index=0 edgelb-pool-aws \
      https://<AWS S3 bucket>/stub-universe-edgelb-pool.json
    ```

1. Install the new `apiserver`. Use the service account created when installing the previous version; see [Edge-LB Installation Guide](/services/edge-lb/1.0/installing/) for more information.

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


Upgrade each pool.

    ```bash
    dcos edgelb update <pool-file>
    ```
