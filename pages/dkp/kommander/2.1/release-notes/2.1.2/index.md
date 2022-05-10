---
layout: layout.pug
navigationTitle: Kommander 2.1.2 Release Notes
title: Kommander 2.1.2 Release Notes
menuWeight: 30
excerpt: View release-specific information for Kommander 2.1.2
enterprise: false
beta: false
---
**D2iQ&reg; Kommander&reg; version 2.1.2 was released on May 11, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

To get started with Kommander, [download](../../download/) and [install](../../install/) the latest version of Kommander.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

## Fixes and Improvements

### Flux proxy configuration results in failure to install applications (COPS-7236)

A Flux configuration problem that resulted in Kommander applications not being able to be pulled and installed in environments with a HTTP[s] Proxy configured was resolved.


### kube-oidc-proxy error: certificate signed by unknown authority (COPS-7217)

A problem that prevented successful configuration of the `kube-oidc-proxy` component when using a custom domain and TLS certificate issued by Let's Encrypt was corrected.

### Certificate objects updated but not reloading in Kommander pods (COPS-7212)

When looking at the certificate objects from a bundle, none are expired but the pods in the cluster do not reload with current/new certificates, and also display that the certificates were expired.

### Konvoy-image-builder 1.7.0 fails in certain situatios (COPS-7207)

This issue is resolved.

### KIB fails to pull images in airgapped using ct (COPS-7198)

This lead to a problem in air-gapped environments where the images failed to pull in KIB, when using registry mirrors and/or credentials.

### Dashboards redirecting to wrong URL (COPS-7197)

The `traefik-forward-auth-kommander` helm value was overriding ConfigMap with an incorrect authHost value.

### Kommander fails after a clean reinstall (COPS-7193)

There was an unintended name collision between two separate secrets.

### Upgrade konvoy 1.8.4 to 2.1.1 index out of range error (COPS-7183)

When a 1.8 deployment used an existing VPC, the `prepare-to-adopt` command triggered an error.

### Pulling search path from Bastion host breaks DKP cluster (COPS-7181)

When creating an air-gapped cluster on preprovisioned machines, the first control plane machine is created but subsequent machines are not created.

### CPU requirements are not listed in the documentation (COPS-7168)

This issue is corrected in the documentation.

### machine stuck in provisioned state after pivot (COPS-7166)

After performing a Pivot operation to migrate cluster resources in DKP 2.1.1, some machines could be stuck in the provisioning state.

### kube-prometheus-stack error with fresh on-prem install (COPS-7163)

[This fix](https://github.com/prometheus-operator/prometheus-operator/pull/4221) from Prometheus resolves the issue.

### http(s)_proxy variables missing from capa pods (COPS-7158)

When deploying a 2.1.1 Konvoy cluster, the local environment variables for http_proxy, https_proxy and no_proxy were not propagated to CAPI/CAPI provider pods outside the kube-system namespace, which lead to timeouts in the capa pod.

### Nvidia addon works poorly if gpus are scarce (COPS-7142)

In DKP 2.x, Nvidia had no notion of which nodes have gpus and which nodes dont, resulting in it deploying the nvidia driver and dcgm reporter to every worker node in the cluster.

### Document how to add multiple node pools in DKP 2.X (COPS-7140)

This process was not fully documented in the 2.1 documentation.

### Minio CVE-2021-21287 (COPS-7134)

The Minio subchart deployed with Velero was running an old version.

### Kommander Install gets stuck if http_proxy injection is enabled in Gatekeeper (COPS-7127)

Kommander Install was getting stuck if http_proxy injection was enabled in Gatekeeper. The `mutatingwebhookconfiguration` for Gatekeeper is updated to explicitly set `sideEffects` to `None`.

### DKP cli cannot add Azure credentials to a bootstrap cluster (COPS-7108)

There is no option in the DKP CLI to add Azure credentials to an existing bootstrap cluster. The only option was to manually create the secret.

### Prometheus/Grafana kubeaddons cronjob spawns excessive pods (COPS-7105)

The `prometheus-kubeaddons-set-grafana-home-dashboard` was stuck in a pending state due to a stale DNS entry for the private Docker repo. The cronjob associated with Grafana kept spawning a pod every 5 minutes, which resulted in an excessive number of pods to spawn.

### The oneliner DKP 2.1 installer ignoring --region flag	(COPS-7101)

Regardless the `--region` flag, the target AWS cluster was deploying in the default AWS region.

## Component updates

The following services and service components have been upgraded to the listed version:

- centralized-grafana: 18.1.1
- centralized-kubecost: 0.20.0
- cert-manager: 0.2.7
- dex: 2.9.10
- external-dns: 2.20.5
- fluent-bit: 0.16.2
- gatekeeper: 0.6.9
- grafana-logging: 6.16.14
- grafana-loki: 0.33.1
- istio: 1.9.1
- jaeger: 2.21.0
- karma: 2.0.0
- kiali: 1.29.1
- knative: 0.18.3
- kube-oidc-proxy: 0.2.5
- kube-prometheus-stack: 18.1.2
- kubecost: 0.20.0
- kubefed: 0.9.0
- kubernetes-dashboard: 5.0.2
- kubetunnel: 0.0.8
- logging-operator: 3.15.0
- metallb: 0.12.2
- minio-operator: 4.1.7
- nfs-server-provisioner: 0.6.0
- nvidia: 0.4.3
- project-grafana-logging: 6.16.14
- project-grafana-loki: 0.33.1
- project-logging: 1.0.0
- prometheus-adapter: 2.11.1
- reloader: 0.0.99
- thanos: 0.4.5
- traefik: 10.3.0
- traefik-forward-auth: 0.3.2
- velero: 3.1.5

## Known Issues

The following items are known issues with this release.

### Create cert-manager resources on attached clusters with cert-manager pre-installed

If you attach a cluster that already has `cert-manager` installed, you need to manually create the three cert-manager resources, in the yaml file, after attaching your cluster.

For example, [Konvoy-created clusters that are self-managed][konvoy-self-managed] have `cert-manager` already installed to the `cert-manager` namespace.

Verify that your cluster have `cert-manager` installed by:

```bash
export KUBECONFIG=<kubeconfig-path>
kubectl get pod -A | grep "cert-manager"
```

If your cluster does not have `cert-manager` installed, the output will be empty.

If your cluster has `cert-manager` installed, the output resembles this example:

```sh
cert-manager                        cert-manager-848f547974-crl47                                        1/1     Running   0          5m5s
cert-manager                        cert-manager-cainjector-54f4cc6b5-wbzvr                              1/1     Running   0          5m5s
cert-manager                        cert-manager-webhook-7c9588c76-pdxrb                                 1/1     Running   0          5m4s
```

If your cluster has `cert-manager` installed, set the namespace for the workspace you attached the cluster in:

```bash
export WORKSPACE_NAMESPACE=<workspace-name-abcd>
```

Then, create the following yaml file:

```yaml
cat << EOF > cert_manager_root-ca.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: kommander-bootstrap-ca-issuer
  namespace: $WORKSPACE_NAMESPACE
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kommander-bootstrap-root-certificate
  namespace: $WORKSPACE_NAMESPACE
spec:
  commonName: ca.kommander-bootstrap
  dnsNames:
    - ca.kommander-bootstrap
  duration: 8760h
  isCA: true
  issuerRef:
    name: kommander-bootstrap-ca-issuer
  secretName: kommander-bootstrap-root-ca
  subject:
    organizations:
      - cert-manager
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: kommander-bootstrap-issuer
  namespace: $WORKSPACE_NAMESPACE
spec:
  ca:
    secretName: kommander-bootstrap-root-ca
EOF
```

Next, apply this file to your cluster you are attaching to Kommander:

```bash
kubectl apply -f cert_manager_root-ca.yaml
```

Finally, fix the broken certificates for the attached cluster:

```bash
kubectl patch certificate -n $WORKSPACE_NAMESPACE kube-oidc-proxy --type='merge' -p '{"spec": {"issuerRef": {"kind": "Issuer", "name": "kommander-bootstrap-issuer"}}}'
kubectl patch certificate -n $WORKSPACE_NAMESPACE kommander-traefik --type='merge' -p '{"spec": {"issuerRef": {"kind": "Issuer", "name": "kommander-bootstrap-issuer"}}}'
```

`cert-manager` HelmRelease will fail to deploy due to your existing `cert-manager` installation. This is expected and can be ignored.

### Kommander Cluster with custom SSL certificate

After attaching a cluster, the management cluster should deploy apps to managed clusters.
If the management cluster was initialized using a custom SSL certificate, the managed cluster will fail cloning the manager's service repository. Check the status of the federated git repository resource to see the error:

```bash
kubectl get gitrepo -n kommander-flux management --kubeconfig MANAGED-KUBECONFIG
[..]
unable to clone 'https://MANAGER_INGRESS_ADDRESS/dkp/kommander/git/kommander/kommander': Get "https://MANAGER_INGRESS_ADDRESS/dkp/kommander/git/kommander/kommander/info/refs?service=git-upload-pack": x509: certificate signed by unknown authority
[..]
```

The deployment fails, because the managed cluster uses the wrong CA certificate to verify access to the management cluster's git repository. Solve this issue by patching the `gitserver-ca` secret within the `kommander-flux` namespace on the managed cluster with the CA certificate stored in the `kommander-traefik-certificate` secret within the `kommander` namespace on the management cluster.

```bash
kubectl --kubeconfig=MANAGED_KUBECONFIG patch secret -n kommander-flux gitserver-ca -p '{"data":{"caFile":"'$(kubectl --kubeconfig=MANAGER_KUBECONFIG get secret -n kommander kommander-traefik-certificate -o go-template='{{index .data "ca.crt"}}')'"}}'
```

You may need to trigger a reconciliation of the flux controller on the managed cluster if you do not want to wait for its regular interval to occur. Use the [ CLI utility][flux-cli]:

```bash
flux reconcile -n kommander-flux source git management --kubeconfig MANAGED_KUBECONFIG
```

```sh
► annotating GitRepository management in kommander-flux namespace
✔ GitRepository annotated
◎ waiting for GitRepository reconciliation
✔ fetched revision main/GIT_HASH
```

## Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
[attach-cluster]: ../../clusters/attach-cluster#attaching-a-cluster
[konvoy-self-managed]: /dkp/konvoy/2.1/choose-infrastructure/aws/advanced/self-managed
[project-custom-applications-git-repo]: ../../projects/applications/catalog-applications/custom-applications/add-create-git-repo
[flux-cli]: https://fluxcd.io/docs/installation/
