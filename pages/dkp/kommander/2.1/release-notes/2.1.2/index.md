---
layout: layout.pug
navigationTitle: Kommander 2.1.2 Release Notes
title: Kommander 2.1.2 Release Notes
menuWeight: 30
excerpt: View release-specific information for Kommander 2.1.2
enterprise: false
beta: false
---
**D2iQ&reg; Kommander&reg; version 2.1.2 was released on June 1, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

To get started with Kommander, [download](../../download/) and [install](../../install/) the latest version of Kommander.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Kommander.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

## Fixes and Improvements

### Upgrade Konvoy 1.8.4 to 2.1.1 index out of range error (COPS-7183)

When attempting to upgrade a Konvoy v1.8 deployment that used an existing VPC, the `prepare-to-adopt` command triggered an error. This problem has been corrected.

### Flux proxy configuration results in failure to install applications (COPS-7236)

A Flux configuration problem that resulted in Kommander applications not being able to be pulled and installed in environments with a HTTP[s] Proxy configured was resolved.

<!-- vale Microsoft.HeadingColons = NO -->
### kube-oidc-proxy error: certificate signed by unknown authority (COPS-7217)
<!-- vale Microsoft.HeadingColons = YES -->

A problem that prevented successful configuration of the `kube-oidc-proxy` component when using a custom domain and TLS certificate issued by Let's Encrypt was corrected.

### Konvoy-image-builder 1.7.0 fails in certain situations (COPS-7207)

An issue that resulted in errors like "Failed to connect to the host via ssh" when running konvoy-image-builder v1.7.0 has been corrected. The fix is available in konvoy-image-builder v1.8.0.

### KIB fails to pull images in air-gapped environments  (COPS-7198)
<!-- vale Microsoft.Avoid = NO -->
Running konvoy-image-builder v1.7.0 in air-gapped environments would result in failures to pull docker images if the environment used registry mirrors and/or credentials. The problem is resolved in konvoy-image-builder v1.8.0.
<!-- vale Microsoft.Avoid = YES -->

### Reattaching clusters with the same name could lead to dashboard navigation problems (COPS-7197)

In Kommander, if you attempted to reattach a cluster with the same name as a cluster that had previously been detached, the 'traefik-forward-auth-kommander' configuration was not updated properly leading to the inability to navigate to the newly attached cluster. The problem was resolved.

### Machine stuck in provisioned state after pivot (COPS-7166)

After performing a Pivot operation to migrate cluster resources in DKP 2.1.1, some machines could be stuck in the provisioning state. This issue has been resolved.

### kube-prometheus-stack error during install (COPS-7163)

A problem with Prometheus where the component `kube-prometheus-stack` attempted to upgrade its CRDs to a new version with invalid specifications was resolved.

### HTTP(S)_proxy variables missing from CAPA pods (COPS-7158)

When deploying a 2.1.1 Konvoy cluster, the local environment variables for http_proxy, https_proxy and no_proxy were not propagated to CAPI/CAPI provider pods outside the kube-system namespace, which lead to timeouts in the CAPA pod.

### The Nvidia addon fails to recognize nodes with GPU when GPUs are scarce (COPS-7142)

In DKP 2.x, Nvidia fails to differentiate between nodes with and without a GPU, mistakenly deploying the Nvidia driver and DCGM exporter to every worker node in the cluster.

### Minio CVE-2021-21287 (COPS-7134)

The Minio subchart deployed with Velero has been upgraded to a version that remediates CVE-2021-21287.

### Kommander Install gets stuck if http_proxy injection is enabled in Gatekeeper (COPS-7127)

If http_proxy injection was enabled in Gatekeeper, then a Kommander Install could fail to complete. To resolve the issue, the `mutatingwebhookconfiguration` for Gatekeeper was updated to explicitly set `sideEffects` to `None`.

### DKP CLI cannot add Azure credentials to a bootstrap cluster (COPS-7108)

An option has been added to the DKP CLI that allows you to add Azure credentials to an existing bootstrap cluster without needing to manually create a secret.

### Prometheus/Grafana kubeaddons cronjob spawns excessive pods (COPS-7105)

As a result of a misconfiguration, the`prometheus-kubeaddons-set-grafana-home-dashboard` can get stuck in a pending state. When this happened, the cronjob associated with Grafana would keep spawning a pod every 5 minutes, which resulted in an excessive number of pods. The Grafana cronjob has been modified to avoid spawning excess pods in this situation.

## Component updates

The following services and service components are upgraded to the listed version:

- centralized-grafana: 18.1.3
- centralized-kubecost: 0.20.0
- cert-manager: 0.2.7
- dex: 2.9.10
- external-dns: 2.20.5
- fluent-bit: 0.16.2
- gatekeeper: 0.6.9
- grafana-logging: 6.16.14
- grafana-loki: 0.33.1
- istio: 1.9.2
- jaeger: 2.21.0
- karma: 2.0.0
- kiali: 1.29.1
- knative: 0.18.3
- kube-oidc-proxy: 0.2.5
- kube-prometheus-stack: 18.1.3
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

Verify that your cluster has `cert-manager` installed by:

```bash
export KUBECONFIG="<kubeconfig-path>"
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
export WORKSPACE_NAMESPACE="<workspace-name-abcd>"
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

### cert-manager expiration workaround

Due to an oversight, some Kommander versions do not properly handle certificate renewal for the Cluster CA and certificates that are created for Kommander applications. The `cert-manager` component renews all certificates 60 days after you install Kommander on your cluster. When this occurs, some Kommander applications and pods fail to receive the renewed certificate information, causing them to stop working upon expiration. This occurs 60-90 days after Kommander was installed, which normally would coincide with the date you created the cluster. While the effects can vary, the most common failure is the inability to log in to the UI due to an expired certificate in the `dex-k8s-authenticator pod`. You may also see issues with flux no longer being able to access the internal gitea repository.

A permanent fix for the issue requires upgrading to Kommander 2.2.1 or higher. In the meantime, a docker container is available that contains a script that extends the validity of the Cluster CA to 10 years, fixes the certificate reload issue, and restarts the affected pods once the new certificates are issued.

The Docker container can be applied to the management cluster in any environment (networked, air-gapped, on-prem, etc.) and remediates the issue regardless of your CA issuer type ([SelfSigned][selfsigned] for air-gapped environments, [ACME][acme], or your own certificate issuer configured separately for your institution).

If there are any workload clusters attached to the management cluster, they will also be remediated.

Note that this container does not affect or change in any way certificates associated with a custom domain you may have created for the cluster.

To fix the issue on an impacted cluster,  run this command:

<p class="message--important"><strong>IMPORTANT: </strong>Before running this command, you must replace <code>&lt;path/to/my_kubeconfig&gt;</code> with an absolute path of the location that contains the kubeconfig for the cluster you wish to update. It will not work properly with a relative file path. For example, use <code>/home/example/my-kubeconfig.yaml</code>, or <code>`pwd`/my-kubeconfig.yaml</code>.</p>

```bash
docker run -v <path/to/my_kubeconfig>:/kubeconfig -e KUBECONFIG=/kubeconfig mesosphere/rotate-certificate-hotfix:2.1.1
```

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

You may need to trigger a reconciliation of the flux controller on the managed cluster if you do not want to wait for its regular interval to occur. Use the [CLI utility][flux-cli]:

```bash
flux reconcile -n kommander-flux source git management --kubeconfig MANAGED_KUBECONFIG
```

```sh
► annotating GitRepository management in kommander-flux namespace
✔ GitRepository annotated
◎ waiting for GitRepository reconciliation
✔ fetched revision main/GIT_HASH
```

### Updating override upon major version upgrade to ensure Gitea functionality

When running the `kommander migrate -y` function is complete, you will have to edit a Traefik Middleware object in order for Gitea to correctly perform.

To do this, edit the ConfigMap that contains the Middleware object:

```bash
kubectl edit configmap traefik-10.3.0-migration-overrides -nkommander
```

Search for the yaml snippet that contains the `Middleware` with the name `stripprefixes`. This will look something like this:

```yaml
              apiVersion: traefik.containo.us/v1alpha1
              kind: Middleware
              metadata:
                name: stripprefixes
                ...
              spec:
                stripPrefix:
                  prefixes:
                    - /dkp/alertmanager
                    - /dkp/api-server
                    - /dkp/kommander/dashboard
                    - /dkp/kommander/gitserver
                    ...
```

You will then need to add `/dkp/kommander/git` to the `spec.stripPrefix.prefixes` list:

```yaml
              apiVersion: traefik.containo.us/v1alpha1
              kind: Middleware
              metadata:
                name: stripprefixes
                ...
              spec:
                stripPrefix:
                  prefixes:
                    - /dkp/alertmanager
                    - /dkp/api-server
                    - /dkp/kommander/dashboard
                    - /dkp/kommander/gitserver
                    - /dkp/kommander/git
```

Then, save this file.

## Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

For a full list of attributed 3rd party software, see [d2iq.com/legal/3rd](http://d2iq.com/legal/3rd).

[kubernetes-doc]: https://kubernetes.io/docs/home/
[attach-cluster]: ../../clusters/attach-cluster#attaching-a-cluster
[konvoy-self-managed]: /dkp/konvoy/2.1/choose-infrastructure/aws/advanced/self-managed
[project-custom-applications-git-repo]: ../../projects/applications/catalog-applications/custom-applications/add-create-git-repo
[flux-cli]: https://fluxcd.io/docs/installation/
[acme]: https://cert-manager.io/docs/configuration/acme/
[config_kub]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[selfsigned]: https://cert-manager.io/docs/configuration/selfsigned/
