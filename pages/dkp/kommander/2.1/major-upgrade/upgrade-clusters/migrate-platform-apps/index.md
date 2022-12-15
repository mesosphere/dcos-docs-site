---
layout: layout.pug
navigationTitle: Adapt Applications
title: Adapt addons/platform applications to Kommander
menuWeight: 10
excerpt: Adapt Konvoy addons to Kommander
beta: false
---

<!-- markdownlint-disable MD0013 MD030 MD0034 -->

In previous versions of Konvoy, you used _Kubernetes Based Addons (KBAs)_ which are now managed through Kommander and are known as _platform applications_.

This section automatically adapts your Konvoy addons to Kommander platform applications. Certain applications may need [manual configuration changes](./prepare-apps) prior to adapting.

<p class="message--note"><strong>NOTE: </strong>Kubernetes distributions contain their own set of <i>addons</i>. These <i>addons</i> are not part of the adoption process.</p>

## Prerequisites

To successfully adapt your applications, you must have:

- A Konvoy 1.8.3 or 1.8.4 cluster that you have already [upgraded to DKP 2.1](/dkp/konvoy/2.1/major-version-upgrade/), with the `kommander` addon disabled in your cluster.yaml.

- [Download](../../../download) and install the Kommander CLI binary on your computer.

- Sufficient disk and resource capacity to support the following applications that come installed by default with Kommander:

  | Name                      | Minimum Resources Suggested    | Minimum Persistent Storage Required |
  | ------------------------- | ------------------------------ | ----------------------------------- |
  | centralized-grafana       | cpu: 200m<br />memory: 100Mi   |                                     |
  | centralized-kubecost      | cpu: 1200m<br />memory: 4151Mi | # of PVs: 1<br />PV sizes: 32Gi     |
  | dex                       | cpu: 100m<br />memory: 50Mi    |                                     |
  | dex-k8s-authenticator     | cpu: 100m<br />memory: 128Mi   |                                     |
  | gitea                     | cpu: 500m<br />memory: 512Mi   | # of PVs: 2<br />PV sizes: 10Gi     |
  | karma                     |                                |                                     |
  | kommander-flux            | cpu: 4000m<br />memory: 4Gi    |                                     |
  | kubefed                   | cpu: 300m<br />memory: 192Mi   |                                     |
  | thanos                    |                                |                                     |
  | traefik-forward-auth-mgmt | cpu: 100m<br />memory: 128Mi   |                                     |

  Please see [workspace platform application requirements](../../../workspaces/applications/platform-applications/platform-application-requirements) to plan for additional requirements your custom workloads may demand.

## Prepare your cluster

Check for the following in your existing `cluster.yaml`:

- One or more of `spec.kubernetes.networking.noProxy`, `spec.kubernetes.networking.httpProxy` or `spec.kubernetes.networking.httpsProxy` is set in `ClusterConfiguration`.
- Gatekeeper is enabled. Gatekeeper is enabled by default, but if you have manually disabled it, re-enable the application by changing the enabled field from `false` to `true` in the `addons` object of the cluster's `ClusterConfiguration` and perform a `konvoy up` to update the addons.

If none of the conditions apply to your cluster, then you can skip to next section. If they do, follow the below steps.

1.  Because Kommander 2.0+ uses Flux to manage applications, you must configure the Gatekeeper `mutatingwebhookconfigurations` (which is a cluster-scoped resource) to allow `dry-run` calls. They are required by the Flux kustomize controller to calculate the difference of a resource. To do this:

    ```bash
    kubectl get mutatingwebhookconfigurations gatekeeper-mutating-webhook-configuration
    ```

    If there are no `mutatingwebhookconfigurations`, skip to the next step. This is expected if you set `mutations.enable` to `false` in Gatekeeper addon `values`. If you see the `gatekeeper-mutating-webhook-configuration` then execute the following:

    ```bash
    kubectl patch mutatingwebhookconfigurations gatekeeper-mutating-webhook-configuration --type "json" -p '[{"op": "add", "path": "/webhooks/0/sideEffects", "value": "None"}]'
    ```

2.  Update the `metadata.annotations` of these Gatekeeper resources:

    ```bash
    kubectl annotate mutatingwebhookconfigurations gatekeeper-mutating-webhook-configuration --overwrite "meta.helm.sh/release-name"="kommander-gatekeeper" "meta.helm.sh/release-namespace"="kommander"
    kubectl annotate assign pod-mutation-no-proxy --overwrite "meta.helm.sh/release-name"="kommander-gatekeeper" "meta.helm.sh/release-namespace"="kommander"
    ```

    If the patch fails because the above resource do not exist, you can ignore those errors.

3.  In the `ClusterConfiguration`, if you have set one or more of `noProxy`, `httpProxy`,or `httpsProxy` in `spec.kubernetes.networking` but these values differ from the `values` section of `gatekeeper` addon, then you need to update the Gatekeeper addon configuration to match these values. Look up this ConfigMap rendered from `spec.kubernetes.networking`:

    ```bash
    kubectl get cm kubeaddons-remap-values -nkubeaddons -o=jsonpath={.data.values}
    ```

    which should print an output more or less similar to the following:

    ```yaml
    gatekeeper:
      mutation:
        enable: true
        enablePodProxy: true
        namespaceSelectorForProxy:
          "gatekeeper.d2iq.com/mutate": "pod-proxy"
        no-proxy: "<YOUR noProxy settings>"
        http-proxy: "<YOUR httpProxy settings>"
        https-proxy: "<YOUR httpsProxy settings>"
    ```

    You need to copy the above configuration into the `Addon` resource of `gatekeeper`. Start by printing the current `values` section:

    ```bash
    kubectl get addon gatekeeper -nkubeaddons -o=jsonpath={.spec.chartReference.values}
    ```

    This will print the following output:

    ```yaml
    ---
    replicas: 2
    webhook:
      certManager:
        enabled: true

    # enable mutations
    mutations:
      enable: false
      enablePodProxy: false

      podProxySettings:
        noProxy:
        httpProxy:
        httpsProxy:

      excludeNamespacesFromProxy: []
      namespaceSelectorForProxy: {}
    ```

    Copy the values from the `ConfigMap` into the Gatekeeper `Addon` resource accordingly:

    | ConfigMap kubeaddons-remap-values `.data.values` | Addon gatekeeper `.spec.chartReference.values` |
    | ------------------------------------------------ | ---------------------------------------------- |
    | gatekeeper.mutation.enable                       | mutations.enable                               |
    | gatekeeper.mutation.enablePodProxy               | mutations.enablePodProxy                       |
    | gatekeeper.mutation.namespaceSelectorForProxy    | mutations.namespaceSelectorForProxy            |
    | gatekeeper.mutation.no-proxy                     | mutations.podProxySettings.noProxy             |
    | gatekeeper.mutation.http-proxy                   | mutations.podProxySettings.httpProxy           |
    | gatekeeper.mutation.https-proxy                  | mutations.podProxySettings.httpsProxy          |

    If the values in the Gatekeeper `Addon` resource already match the values from the `kubeaddons-remap-values` ConfigMap in `kubeaddons` namespace, then there is no need to update anything. If not, edit the Gatekeeper `Addon` to reflect the above value remapping:

    ```bash
    kubectl edit addon -nkubeaddons gatekeeper
    ```

    Then, save the changes before continuing with the migration procedure.

## Move your applications

If your environment has a HTTP proxy configured, create a [TCP connection](#environments-with-an-http-proxy-server) before running the following command.

To adapt your existing platform applications to Kommander enter the following command:

```bash
kommander migrate -y
```

As the command progresses, your output will look like the following:

```sh
 ✓ Checking if migration from DKP 1.x is necessary
Found the following Konvoy 1.x addons:
cert-manager
dashboard
dex
dex-k8s-authenticator
konvoyconfig
kube-oidc-proxy
metallb
nvidia
opsportal
reloader
traefik
traefik-forward-auth
velero
...
 ✓ Checking if migration from DKP 1.x is necessary
 ✓ Ensuring applications repository fetcher is deployed
 ✓ Ensuring base resources are deployed
 ✓ Ensuring Flux is deployed
 ✓ Ensuring helm repository configuration is deployed
 ✓ Ensuring Kommander Root CA is deployed
 ✓ Ensuring Gitea is deployed
 ✓ Ensuring Application definitions are deployed
 ✓ Ensuring Bootstrap repository is deployed
 ✓ Ensuring Age encryption is deployed
 ✓ Ensuring Flux configuration is deployed
 ✓ Ensuring Kommander App Management is deployed
 ✓ Ensuring Konvoy Config is migrated
 ✓ Ensuring Traefik ingress controller is migrated
 ✓ Ensuring Gatekeeper is migrated
 ✓ Ensuring Reloader is migrated
 ✓ Ensuring External DNS is migrated
 ✓ Ensuring MetalLB is migrated
 ✓ Ensuring Dex is migrated
 ✓ Ensuring Traefik Forward Auth is migrated
 ✓ Ensuring Kubernetes OIDC proxy is migrated
 ✓ Ensuring Dex authenticator is migrated
 ✓ Ensuring Kubernetes Dashboard is migrated
 ✓ Ensuring Nvidia is migrated
 ✓ Ensuring Velero is migrated
 ✓ Ensuring Fluent-Bit is migrated and the DKP 2.x Logging Stack is installed
 ✓ Ensuring deletion of Addon elasticsearch orphaning its Helm release
 ✓ Ensuring deletion of Addon elasticsearch-curator orphaning its Helm release
 ✓ Ensuring deletion of Addon kibana orphaning its Helm release
 ✓ Ensuring deletion of Addon prometheus-elasticsearch-exporter orphaning its Helm release
 ✓ Ensuring KubePrometheusStack (Prometheus and Grafana) is migrated
 ✓ Ensuring Prometheus Adapter is migrated
 ✓ Ensuring Istio is migrated
 ✓ Ensuring Jaeger Operator is migrated
 ✓ Ensuring Kiali is migrated
 ✓ Ensuring deletion of ClusterAddon kommander orphaning its Helm release
 ✓ Ensuring deletion of ClusterAddon awsebscsiprovisioner orphaning its Helm release
 ✓ Ensuring deletion of ClusterAddon cert-manager orphaning its Helm release
 ✓ Ensuring deletion of ClusterAddon defaultstorageclass-protection orphaning its Helm release
 ✓ Ensuring deletion of Addon konvoyconfig orphaning its Helm release
 ✓ Ensuring deletion of Addon opsportal orphaning its Helm release
 ✓ Ensuring deletion of Addon gatekeeper orphaning its Helm release
 ✓ Ensuring check that there remain no addons and deletion of the Kubeaddons controller
```

If there is a timeout error at this step, start `kommander migrate -y` again, and it will eventually continue where this timed out.

If you are upgrading to DKP v2.1.4 or below, [check the release notes][traefik-cm-release-notes] you will need to confirm that the Traefik Middleware ConfigMap was updated correctly. If you are on at least DKP v2.1.5, continue below.

Refer to the [Verify installation][verify-install] topic to ensure successful completion.

### Environments with an HTTP proxy server

The `kommander migrate` command requires a connection from your environment to the Traefik ingress controller in your cluster. If your environment demands the use of an HTTP proxy server, establish an alternative connection to the Traefik ingress controller by running a port-forward into Traefik on a localhost.

1.  Ensure you create or modify the `127.0.0.1` record to include the ingress domain name in your hosts file:

    ```bash
    [root@workstation ~] cat /etc/hosts
    127.0.0.1   localhost localhost.localdomain <ingress_domain_name>
    ```

1.  Open a separate terminal window to create a TCP connection to Traefik on your cluster:

    ```bash
    kubectl --kubeconfig admin.conf -n kommander port-forward svc/kommander-traefik 443:443
    ```

    <p class="message--note"><strong>NOTE: </strong>It is necessary that you open a new terminal window because the <code>kubectl port-forward</code> command does not return, and you need to leave this connection open for the duration of the migration.</p>

1.  From your standard terminal window, continue with the [Move your applications](#move-your-applications) section.

    <p class="message--important"><strong>IMPORTANT: </strong>Once the migration is completed, revert the changes in your hosts <code>/etc/hosts</code> file.</p>

## Post-upgrade cleanup

Depending on what Konvoy addons you had configured, the upgrade may leave Kubernetes objects behind that belonged to Konvoy, but are not used by Kommander. While you can safely disregard these objects, you should not arbitrarily remove or modify them, or use third-party tools (like Helm) that expect these objects to be
in a correct state against these objects.

If you want to clean these objects up, you need to perform
[specific steps](./cleanup) after a successful upgrade.

<p class="message--note"><strong>NOTE: </strong>Error messages may display during the adaptation process. These messages show a temporary state. These processes will eventually succeed.</p>

Refer to the [Verify installation][verify-install] topic to ensure successful completion.

## Related Information

- [Supported applications](./supported-apps)

[download]: ../../../download
[verify-install]: ../../../install/networked#verify-installation
[traefik-cm-release-notes]: ../../../release-notes/2.1.4#updating-override-upon-major-version-upgrade-to-ensure-gitea-functionality
