---
layout: layout.pug
navigationTitle: Kommander 2.1.0 Release Notes
title: Kommander 2.1.0 Release Notes
menuWeight: 10
excerpt: View release-specific information for Kommander 2.1.0
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; version 2.1.0 was released on November 19, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

To get started with Kommander, [download](../../download/) and [install](../../install/) the latest version of Kommander.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in Kommander.

### New features and capabilities

#### DKP Major Version Upgrade

Konvoy and Kommander 2.1 represent a major version upgrade that moves forward DKP architecture to give you access to D2iQ's next generation centralized Kubernetes and smart cloud native applications. It incorporates ClusterAPI as a major re-architecture in its management of production Kubernetes clusters. [ClusterAPI](https://cluster-api.sigs.k8s.io/introduction.html), or CAPI, enables declarative creation, configuration, and management of clusters. Declarative mode is a Kubernetes best practice that simplifies lifecycle tasks, making them more consistent and more repeatable. 2.1 enhances your existing clusters to use a new architecture.

For more information on planning your upgrade, see the [DKP Major Version upgrade](/dkp/konvoy/2.1/major-version-upgrade/) guide.

#### Provision Kubernetes Infrastructure from Kommander

Kommander 2.1 now allows for provisioning and managing of Kubernetes clusters making it easier than ever to get your infrastructure up and running quickly.

For more information on provisioning from Kommander, see [Managing Clusters](../../clusters/).

#### Kommander Continuous Deployment

Kommander 2.1 now supports continuous delivery/deployment using Flux, which is designed for Kubernetes and supports multi-cluster and multi-tenant use cases. Configure Kommander Projects with GitOps-based Continuous Deployments using FluxCD, which enables canary and A/B deployments, and roll-back. Kommander now uses a completely declarative approach, where what you define for production is what you get, without the need to monitor and manually intervene when something goes wrong.

For more information on setting up continuous deployment using Flux, see [Continuous Deployment](../../projects/project-deployments/continuous-delivery).

#### DKP Licensing through Amazon Marketplace

You can now purchase a license for Konvoy or Kommander through the AWS Marketplace, then add it to Kommander. In the Kommander UI, you can see information such as the license status (valid or expired), the license capacity (number of cores or clusters), and expiration date.

### Component updates

The following services and service components have been upgraded to the listed version:

- centralized-grafana: 17.2.1
- centralized-kubecost: 0.20.0
- cert-manager: 0.2.7
- dex: 2.20.5
- external-dns: 2.20.5
- fluent-bit: 0.16.2
- gatekeeper: 0.6.8
- grafana-logging: 6.13.9
- grafana-loki: 0.33.1
- istio: 1.9.1
- jaeger: 2.21.0
- karma: 2.0.0
- kiali: 1.29.1
- kube-oidc-proxy: 0.2.5
- kube-prometheus-stack: 17.2.1
- kubecost: 0.20.0
- kubefed: 0.8.1
- kubernetes-dashboard: 5.0.2
- kubetunnel: 0.0.7
- logging-operator: 3.13.0
- metallb: 0.12.2
- minio-operator: 4.1.7
- nvidia: 0.4.3
- project-grafana-logging: 6.13.9
- project-grafana-loki: 0.33.1
- project-logging: 1.0.0
- prometheus-adapter: 2.11.1
- reloader: 0.0.99
- thanos: 0.4.5
- traefik: 10.3.0
- traefik-forward-auth: 0.3.2
- velero: 3.1.3

## Known issues

### Extra step to install applications to the Kommander Host Management Cluster

When you create a new Konvoy 2.1 cluster with Kommander 2.1 installed, if you want to install applications to the Kommander Host Management Cluster through the UI, you need to select Deploy on the Foundational Applications section.

From the Kommander UI, click on the Global Workspace nav at the top of the page, and select **Management Cluster Workspace**.

Then select **Applications** in the left sidebar.

Scroll down to the **Foundational** section, and select the "Deploy" button.

After this, you can deploy different applications through the UI.

### Create Custom Catalog GitRepositories on attached clusters

To add custom catalog applications to a Project, a GitRepository pointing to the catalog Git repository **must be also created on each attached cluster in the Project**. Follow the steps on the [Create a Git Repository][project-custom-applications-git-repo] page, but apply the same commands on each attached cluster that is in the Project.

```yaml
kubectl apply -f - <<EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: example-repo
  namespace: <project-namespace>
spec:
  interval: 1m0s
  ref:
    branch: <your-target-branch-name> # e.g., main
  timeout: 20s
  url: https://github.com/<example-org>/<example-repo>
EOF
```

### Create cert-manager resources on clusters with cert-manager pre-installed prior to attaching them

If you are attaching a cluster that already has `cert-manager` installed, you need to manually create some cert-manager resources prior to attaching your cluster.

For example, [Konvoy-created clusters that are self-managed][konvoy-self-managed] have `cert-manager` already installed to the `cert-manager` namespace.

Create the following yaml file:

```yaml
cat << EOF > cert_manager_root-ca.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: kommander-bootstrap-ca-issuer
  namespace: cert-manager
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kommander-bootstrap-root-certificate
  namespace: cert-manager
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
  namespace: cert-manager
spec:
  ca:
    secretName: kommander-bootstrap-root-ca
EOF
```

Then, apply this file to your cluster:

```bash
kubectl apply -f cert_manager_root-ca.yaml
```

Once complete, continue to [attach your cluster][attach-cluster] to Kommander.

Your cert-manager will fail to deploy due to your existing `cert-manager` installation. This behavior is expected and can be ignored.

### Kommander Cluster with custom SSL certificate

If the management cluster was initialized using a custom SSL certificate, the managed cluster will fail cloning the manager's service repository. Check the status of the federated git repository resource to see the error:

```bash
kubectl get gitrepo -n kommander-flux management --kubeconfig MANAGED-KUBECONFIG
[..]
unable to clone 'https://MANAGER_INGRESS_ADDRESS/dkp/kommander/git/kommander/kommander': Get "https://MANAGER_INGRESS_ADDRESS/dkp/kommander/git/kommander/kommander/info/refs?service=git-upload-pack": x509: certificate signed by unknown authority
[..]
```

The deployment fails because the managed cluster uses the wrong CA certificate to verify access to the management cluster's git repository. Solve this issue by patching the `gitserver-ca` secret within the `kommander-flux` namespace on the managed cluster with the CA certificate stored in the `kommander-traefik-certificate` secret within the `kommander` namespace on the management cluster.

```bash
kubectl --kubeconfig=MANAGED_KUBECONFIG patch secret -n kommander-flux gitserver-ca -p '{"data":{"caFile":"'$(kubectl --kubeconfig=MANAGER_KUBECONFIG get secret -n kommander kommander-traefik-certificate -o go-template='{{index .data "ca.crt"}}')'"}}'
```

You may need to trigger a reconciliation of the flux controller on the managed cluster if you do not want to wait for its regular interval to occur. Use the [`flux` CLI utility][flux-cli]:

```bash
flux reconcile -n kommander-flux source git management --kubeconfig MANAGED_KUBECONFIG
```

```sh
► annotating GitRepository management in kommander-flux namespace
✔ GitRepository annotated
◎ waiting for GitRepository reconciliation
✔ fetched revision main/GIT_HASH
```

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

### Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
[attach-cluster]: ../../clusters/attach-cluster#attaching-a-cluster
[konvoy-self-managed]: ../../../../konvoy/2.1/choose-infrastructure/aws/quick-start-aws#create-a-new-aws-kubernetes-cluster
[project-custom-applications-git-repo]: ../../projects/applications/catalog-applications/custom-applications/add-create-git-repo
[flux-cli]: https://fluxcd.io/docs/installation/
[acme]: https://cert-manager.io/docs/configuration/acme/
[config_kub]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[selfsigned]: https://cert-manager.io/docs/configuration/selfsigned/
