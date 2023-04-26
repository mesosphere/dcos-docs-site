---
layout: layout.pug
navigationTitle: Migration Considerations for MetalLB
title: Migration Considerations for MetalLB
menuWeight: 70
excerpt: Some important considerations for MetalLB when when migrating from DKP 1.8.x to 2.1.x
beta: true
enterprise: false
---

The MetalLB project has moved all Docker images from dockerhub.io to quay.io. This prevents older versions of DKP (up to and including DKP 2.1.x) from installing MetalLB correctly. Attempting to migrate any cluster using MetalLB from Konvoy 1.8 to DKP 2.1 will fail due to this issue. 

Follow these steps to resolve a failed migration:

1.  Retrieve the metallb-overrrides configMap using the following command:

    ``` bash
    kubectl edit configMap metallb-overrides -n kommander
    ```

2.  Replace the repository values for both the metallb controller and speaker with the new quay.io addresses:

    These two values:

    ```bash
    controller:
       image:
       repository: metallb/controller
    ```

    ```bash
    speaker:
      image:
        repository: metallb/speaker
    ```

    ...become these two values:

    ```
    controller:
      image:
        repository: quay.io/metallb/controller
    ```

    ```
    speaker:
      image:
      repository: quay.io/metallb/speaker
  ```

3. Re-run the migration.

## Additional Considerations for Failed Migrations

If you did not edit the configMap to change the repository values for the MetalLB controller and speaker values, and you ran the command `./kommander migrate -y`, the following error appears when you migrate from Konvoy 1.8.x → DKP 2.x.y:

```bash
✓ Checking if migration from DKP 1.x is necessary
Found the following Konvoy 1.x addons:
cert-manager
dashboard
dex
dex-k8s-authenticator
fluentbit
gatekeeper
kibana
konvoyconfig
kube-oidc-proxy
opsportal
prometheus
prometheusadapter
traefik-forward-auth
velero
✓ Ensuring applications repository fetcher is deployed
✓ Ensuring base resources are deployed
✗ Ensuring Flux is deployed
Error: failed to ensure "Flux is deployed": unable to extract value of "httpProxy" from values.yml override:.mutations.podProxySettings.httpProxy accessor error: <nil> is of the type <nil>, expected string
```

As a result, after you begin migration, you cannot switch to a newer version of DKP to continue the migration. In general, we do not recommend using older versions of DKP 2.1.x, since those versions are in End-of-Life status and are no longer supported. However, if you have already initiated the migration process and encountered this error, you can still proceed after completing the following procedure:

Follow these steps to resolve the issue:

1. Retrieve the gatekeeper-overrides configMap using the following command:

  ```bash
  kubectl edit configmap gatekeeper-overrrides -n kommander
  ```

2. Set the blank values in podProxySettings to “”, resulting in the following:
  ```bash
  podProxySettings:
 noProxy: ""
 httpProxy: ""
 httpsProxy: ""
  ```

3. Re-run the migration.
