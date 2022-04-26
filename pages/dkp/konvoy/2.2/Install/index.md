---
layout: layout.pug
navigationTitle: Install
title: Install
menuWeight: 80
excerpt: Install a DKP cluster
beta: false
enterprise: false
---

When installing DKP for a project, line-of-business, or enterprise, the first step is to determine the infrastructure on which you want to deploy.

For example, you can:

- Install on a public cloud infrastructure, such as Amazon Web Services (AWS) or Azure.
- Install on an internal network on-premises with a physical (bare metal) or virtual infrastructure.
- Install on air-gapped Edge.

<p class="message--important"><strong>IMPORTANT: </strong>The infrastructure you select then determines the specific requirements for a successful installation.</p>


DKP is a tool for provisioning Kubernetes clusters with a suite of pre-selected [Cloud Native Computing Foundation (CNCF)][cncf] and community-contributed tools.
By combining a native Kubernetes cluster as its foundation with a default set of cluster extensions,
DKP provides a complete out-of-the-box solution for organizations that want to deploy production-ready
Kubernetes.

As an example, this Installation guide provides simplified instructions to get your DKP cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) public cloud instance. For information about installing on a different platform, see [Choose Infrastructure](../choose-infrastructure/). 

# Before you begin

Before installing DKP, ensure you have the [following](../prerequisites) items.

# Installing DKP

1.  Install required packages. In most cases, you can install the required software using your preferred package manager. For example, on a macOS computer, you can use [Homebrew][brew] to install `kubectl` and the `aws` command-line utility by running the following command:

    ```bash
    brew install kubernetes-cli awscli
    ```

1.  Check the Kubernetes client version. Many important Kubernetes functions **do not work** if your client is outdated. You can verify that the version of `kubectl` you have installed is supported by running the following command:

    ```bash
    kubectl version --short=true
    ```

1.  To download DKP, see the [Download Konvoy](../download) topic for information. You will need to download and extract the DKP binary package tarball.

1.  Install with default settings.  The Container Network Interface (CNI) which is satisfied by Calico, the Container Storage Interface (CSI) which is satisfied by drivers specific to the cloud provider that's selected, CoreDNS (recursive DNS resolver that serves cluster Service Endpoints), and Cert Manager (for TLS Certificate management).

1.  Verify you have valid **CLOUD PROVIDER security credentials** to deploy the cluster on that platform. This step is not required if you are installing DKP on an on-premises environment. For information about installing in an on-premises environment, see [Install on-premises](../choose-infrastructure/on-prem).

1.  Create a directory for storing state information for your cluster by running the following commands:

    ```bash
    mkdir konvoy-quickstart
    cd konvoy-quickstart
    ```

    This directory for state information is required for performing future operations on your cluster.
    For example, state files stored in this directory are required to tear down a cluster.
    If you were to delete the state information or this directory, destroying the cluster would require you to manually perform clean-up tasks.

1.  Deploy with all of the default settings depending on which infrastructure you have.  Go to the Choose Infrastructure section of the documentation for further steps on creating a cluster on your Cloud platform. [Choose Infrastructure](../choose-infrastructure/)    

# Next steps

Now that you have a basic Konvoy cluster installed and ready to use, you might want to test operations by deploying
a simple, sample application, customizing the cluster configuration, or checking the status of cluster components.

For more details, see the following topics:

- [Deploy a sample application](../deployments/deploy-sample-app/)
- [Platform application deployment](/../../dkp/kommander/2.2/projects/applications/platform-applications/)
- [Troubleshooting](../troubleshooting/)


[cncf]: https://www.cncf.io
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[install_aws]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[calico]: https://www.projectcalico.org/
[coredns]: https://coredns.io/
[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[elasticsearch]: https://www.elastic.co/products/elastic-stack
[elasticsearch_exporter]: https://www.elastic.co/guide/en/elasticsearch/reference/7.2/es-monitoring-exporters.html
[helm]: https://helm.sh/
[kibana]: https://www.elastic.co/products/kibana
[fluentbit]: https://fluentbit.io/
[prometheus_operator]: https://prometheus.io/
[grafana]: https://grafana.com/
[prometheus_adapter]: https://github.com/DirectXMan12/k8s-prometheus-adapter
[traefik]: https://traefik.io/
[osi]: https://en.wikipedia.org/wiki/OSI_model
[kubernetes_dashboard]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
[velero]: https://velero.io/
[dex]: https://github.com/dexidp/dex
[dex_k8s_authenticator]: https://github.com/mesosphere/dex-k8s-authenticator
[traefik_foward_auth]: https://github.com/thomseddon/traefik-forward-auth
[brew]: https://brew.sh/
