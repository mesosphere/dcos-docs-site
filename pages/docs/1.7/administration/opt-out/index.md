---
post_title: Opt-Out
menu_order: 6
---

## Authentication

You can opt-out of the provided authentication by disabling it for your cluster. To disable authentication, add this parameter to your [`config.yaml`][4] file during installation (note this requires using the [CLI][1] or [advanced][2] installers):

```yaml
oauth_enabled: 'false'
```

If you’ve already installed your cluster and want to disable authentication in-place, you can go through an upgrade with the `oauth_enabled: 'false'` set.

## Telemetry

You can opt-out of providing anonymous data by disabling telemetry for your cluster. To disable telemetry, add this parameter to your [`config.yaml`][4] file during installation (note this requires using the [CLI][1] or [advanced][2] installers):

```yaml
telemetry_enabled: 'false'
```

If you’ve already installed your cluster and want to disable telemetry in-place, you can go through an upgrade with the `telemetry_enabled: 'false'` set.

[1]: ../installing/custom/cli/
[2]: ../installing/custom/advanced/
[3]: ../installing/custom/configuration-parameters/
[4]: /docs/1.7/administration/installing/custom/configuration-parameters/

