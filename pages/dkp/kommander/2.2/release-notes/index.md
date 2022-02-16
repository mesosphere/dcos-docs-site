---
layout: layout.pug
navigationTitle: Kommander 2.2 Release Notes
title: Kommander 2.2 Release Notes
menuWeight: 10
excerpt: View release-specific information for Kommander 2.2
enterprise: false
beta: false
---

**D2iQ&reg; Kommander&reg; (DKP&reg;) version 2.2 was released on March 16, 2022.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Kommander[/button]

[Download](../../download/) and [install](../../install/) the latest version to get started.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download Kommander. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install this product.</p>

## Release summary

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages used in DKP.

Kommander 2.2 supports Kubernetes versions between 1.21.0 and 1.22.x. Any cluster you want to attach using Kommander 2.1 must be running a Kubernetes version in that range. 

### New features and capabilities

#### DKP major version upgrade

Version 2.2 represents a major upgrade that moves forward D2IQ's architecture to give you access to the next generation of centralized Kubernetes and smart cloud native applications. It incorporates ClusterAPI as a major re-architecture in its management of production Kubernetes clusters. [ClusterAPI](https://cluster-api.sigs.k8s.io/introduction.html), or CAPI, enables declarative creation, configuration, and management of clusters. Declarative mode is a Kubernetes best practice that simplifies lifecycle tasks, making them more consistent and more repeatable. 2.2 enhances your existing clusters to use a new architecture.

For more information on planning your upgrade, see the [DKP Major Version upgrade](/dkp/konvoy/2.2/major-version-upgrade/) guide.

#### Provision Kubernetes Infrastructure from DKP

Version 2.2 allows for provisioning and managing of Kubernetes clusters, making it easier than ever to get your infrastructure up and running quickly.

For more information on provisioning, see [Managing Clusters](../../clusters/).

#### Continuous deployment

Version 2.2 supports continuous delivery/deployment using Flux, which is designed for Kubernetes and supports multi-cluster and multi-tenant use cases. Configure Projects with GitOps-based Continuous Deployments using FluxCD, which enables canary and A/B deployments, as well as roll-back. DKP now uses a completely declarative approach, where what you define for production is what you get, without the need to monitor and manually intervene when something goes wrong.

For more information on setting up continuous deployment using Flux, see [Continuous deployment](../../projects/project-deployments/continuous-delivery).

#### Licensing through Amazon Marketplace

You can purchase a license for DKP through the AWS Marketplace. In the UI, you can see information such as the license status (valid or expired), the license capacity (number of cores or clusters), and expiration date.

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

When you create a new cluster with 2.2 installed, you need to select Deploy on the Foundational Applications section if you want to install applications to the Kommander Host Management Cluster through the UI.

From the UI, click on the Global Workspace nav at the top of the page, and select **Management Cluster Workspace**.

Then select **Applications** in the left sidebar.

Scroll down to the **Foundational** section, and select the "Deploy" button.

After this, you can deploy different applications through the UI.

### Create Custom Catalog GitRepositories on attached clusters

To add custom catalog applications to a Project, a GitRepository pointing to the catalog Git repository **must be also created on each attached cluster in the Project**. Follow the steps on the [Create a Git Repository][project-custom-applications-git-repo] page, but apply the same commands on each attached cluster that is in the Project.

```sh
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

```sh
kubectl apply -f cert_manager_root-ca.yaml
```

Once complete, continue to [attach your cluster][attach-cluster].

You should expect to see that cert-manager will fail to deploy due to your existing `cert-manager` installation. This is expected and can be ignored.

### Additional resources

<!-- Add links to external documentation as needed -->

For more information about working with native Kubernetes, see the [Kubernetes documentation][kubernetes-doc].

[kubernetes-doc]: https://kubernetes.io/docs/home/
[attach-cluster]: ../../clusters/attach-cluster#attaching-a-cluster
[konvoy-self-managed]: /dkp/konvoy/2.2/choose-infrastructure/aws/quick-start-aws#optional-move-controllers-to-the-newly-created-cluster
[project-custom-applications-git-repo]: ../../projects/applications/catalog-applications/custom-applications/add-create-git-repo
