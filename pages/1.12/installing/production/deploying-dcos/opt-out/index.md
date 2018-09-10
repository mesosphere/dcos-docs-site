---
layout: layout.pug
navigationTitle:  Opt-Out
excerpt: Disabling authentication and telemetry for your cluster
title: Opt-Out
menuWeight: 20
---

## Authentication

You can opt-out of the provided authentication by disabling it for your cluster. To disable authentication, add this parameter to your [`config.yaml`][2] file during installation (this requires using the [installation][1] method):

```yaml
oauth_enabled: 'false'
```

**Note:** If you have already installed your cluster and would like to disable this in place, you can go through an upgrade with the same [configuration parameter][2] set.

## Telemetry

You can opt-out of providing anonymous data by disabling telemetry for your cluster. To disable telemetry, you can either:

- Add this parameter to your [`config.yaml`][2] file during installation (this requires using the [installation][1] method):

    ```yaml
    telemetry_enabled: 'false'
    ```


**Note:** If you have already installed your cluster and would like to disable this in place, you can go through an upgrade with the same [configuration parameter][2] set.

[1]: /1.11/installing/oss/custom/advanced/
[2]: /1.11/installing/oss/custom/configuration/configuration-parameters/
