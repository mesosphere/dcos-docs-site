---
layout: layout.pug
navigationTitle: Kommander 2.1.4 Release Notes
title: Kommander 2.1.4 Release Notes
menuWeight: 50
excerpt: View release-specific information for Kommander 2.1.4
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; version 2.1.4 was released on October, nn 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

To get started with Kommander, [download](../../download/) and [install](../../install/) the latest version of Kommander.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Kommander.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

## Component updates

The following services and service components are upgraded to the listed version:

| Common Application Name | APP ID | Version | Component Versions |
|-------------------------|--------|---------|--------------------|
| Centralized Grafana | centralized-grafana | 18.1.3 | - chart: 18.1.3<br>- prometheus-operator: 0.50.0 |
| Centralized Kubecost | centralized-kubecost | 0.20.0 | - chart: 0.20.0<br>- kubecost: 1.88.0 |
| Cert Manager | cert-manager | 0.2.7 | - chart: 0.2.7<br>- cert-manager: 1.0.3 |
| Dex | dex | 2.9.10 | - chart: 2.9.10<br>- dex: 2.22.0 |
| Dex K8s Authenticator | dex-k8s-authenticator | 1.2.9 | - chart: 1.2.9<br>- dex-k8s-authenticator: 1.2.2 |
| External DNS | external-dns | 2.20.5 | - chart: 2.20.5<br>- external-dns: 0.7.0 |
| Fluent Bit | fluent-bit | 0.16.2 | - chart: 0.16.2<br>- fluent-bit: 1.8.3 |
| Gatekeeper | gatekeeper | 0.6.9 | - chart: 0.6.9<br>- gatekeeper: 3.4.0-rc.1 |
| Gitea | gitea | 4.1.1 | - chart: 4.1.1<br>- gitea: 1.15.3 |
| Grafana Logging | grafana-logging | 6.16.14 | - chart: 6.16.14<br>- grafana: 8.2.1 |
| Grafana Loki | grafana-loki | 0.33.1 | - chart: 0.33.1<br>- loki: 2.2.1 |
| Istio | istio | 1.9.1 | - chart: 1.9.1<br>- istio: 1.9.1 |
| Jaeger | jaeger | 2.21.0 | - chart: 2.21.0<br>- jaeger: 1.22.0 |
| Karma | karma | 2.0.0 | - chart: 2.0.0<br>- karma: 0.70 |
| Kiali | kiali | 1.29.1 | - chart: 1.29.1<br>- kiali: 1.29.1 |
| Knative | knative | 0.3.9 | - chart: 0.3.9<br>- knative: 0.22.3 |
| Kube OIDC Proxy | kube-oidc-proxy | 0.2.5 | - chart: 0.2.5<br>- kube-oidc-proxy: 0.2.0 |
| Kube Prometheus Stack | kube-prometheus-stack | 18.1.3 | - chart: 18.1.3<br>- prometheus-operator: 0.50.0<br>- grafana: 8.2.1<br>- prometheus: 2.28.1<br>- prometheus-alertmanager: 0.22.2 |
| Kubecost | kubecost | 0.20.0 | - chart: 0.20.0<br>- kubecost: 1.88.0 |
| Kubefed | kubefed | 0.9.0 | - chart: 0.9.0<br>- kubefed: 0.9.0 |
| Kubernetes Dashboard | kubernetes-dashboard | 5.0.2 | - chart: 5.0.2<br>- kubernetes-dashboard: 2.3.1 |
| Kubetunnel | kubetunnel | 0.0.8 | - chart: 0.0.8<br>- kubetunnel: 0.0.8 |
| Logging Operator | logging-operator | 3.15.0 | - chart: 3.15.0<br>- logging-operator: 3.15.0 |
| Metallb | metallb | 0.12.2 | - chart: 0.12.2<br>- metallb: 0.8.1 |
| MinIO Operator | minio-operator | 4.1.7 | - chart: 4.1.7<br>- minio-operator: 4.1.3 |
| NFS Server Provisioner | nfs-server-provisioner | 0.6.0 | - chart: 0.6.0<br>- nfs-server-provisioner: 2.3.0 |
| Nvidia | nvidia | 0.4.3 | - chart: 0.4.3<br>- nvidia-device-plugin: 0.2.0 |
| Grafana (project) | project-grafana-logging | 6.16.14 | - chart: 6.16.14<br>- grafana: 8.2.1 |
| Grafana Loki (project) | project-grafana-loki | 0.33.1 | - chart: 0.33.1<br>- loki: 2.2.1 |
| Prometheus Adapter | prometheus-adapter | 2.11.1 | - chart: 2.11.1<br>- prometheus-adapter: 0.8.3 |
| Reloader | reloader | 0.0.99 | - chart: 0.0.99<br>- reloader: 0.0.99 |
| Thanos | thanos | 0.4.5 | - chart: 0.4.5<br>- thanos: 0.17.1 |
| Traefik | traefik | 10.3.0 | - chart: 10.3.0<br>- traefik: 2.5.0 |
| Traefik ForwardAuth | traefik-forward-auth | 0.3.2 | - chart: 0.3.2<br>- traefik-forward-auth: 3.0.2 |
| Velero | velero | 3.1.5 | - chart: 3.1.5<br>- velero: 1.5.2 |

## Known Issues

The following items are known issues with this release.

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
