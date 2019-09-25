---
layout: layout.pug
navigationTitle: Quick start
title: Quick start
menuWeight: 2
excerpt: Get started by installing a cluster with default configuration settings
enterprise: false
---

## Quick Start

Konvoy is a tool for provisioning Kubernetes clusters with a suite of pre-selected [Cloud Native Computing Foundation (CNCF)][cncf] and community-contributed tools.
By combining a native Kubernetes cluster as its foundation with a default set of cluster extensions,
Konvoy provides a complete _out-of-the-box_ solution for organizations that want to deploy production-ready
Kubernetes.

This quick start guide provides simplified instructions to get your Konvoy cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) public cloud instance.

### Before you begin

All Konvoy runtime dependencies are bundled in a Docker container and packaged with a wrapper that executes the container and manages these dependencies.

Before starting the Konvoy installation, you should verify the following:

-   You have a Linux or macOS computer with a supported version of the operating system.
-   You have the [aws][install_aws] command-line utility if you are installing on an AWS cloud instance.
-   You have [Docker Desktop][install_docker] _version 18.09.2 or newer_.
-   You have [kubectl][install_kubectl] _v1.15.3 or newer_ for interacting with the running cluster.
-   You have a valid AWS account with [credentials configured][aws_credentials].
    You need to be authorized to create the following resources in the AWS account:
    - EC2 Instances
    - VPC
    - Subnets
    - Elastic Load Balancer (ELB)
    - Internet Gateway
    - NAT Gateway
    - Elastic Block Storage (EBS) Volumes
    - Security Groups
    - Route Tables
    - IAM Roles

#### Install required packages

In most cases, you can install the required software using your preferred package manager.
For example, on a macOS computer, you can use [Homebrew][brew] to install `kubectl` and the `aws` command-line utility by running the following command:

```bash
brew install kubernetes-cli awscli
```

#### Check the Kubernetes client version

Many important Kubernetes functions _do not work_ if your client is outdated.
You can verify the version of `kubectl` you have installed is supported by running the following command:

```bash
kubectl version --short=true`
```

### Download and extract the Konvoy package

You start the installation process by downloading the Konvoy package tarball.

To download the package, follow these steps:

1.  Download the tarball to your local Downloads directory.

    For example, if you are installing on macOS, download the compressed archive to the default `~/Downloads` directory.

1.  Extract the tarball to your local system by running the following command:

    ```bash
    tar -xf ~/Downloads/konvoy_v1.0.0.tar.bz2
    cd ~/Downloads/konvoy_v1.0.0
    ```

1.  Copy Konvoy package files to a directory in your user PATH to ensure you can invoke the `konvoy` command from any directory.

    For example, copy the package to the `/usr/local/bin/` directory by running the following command:

    ```bash
    sudo cp ~/Downloads/konvoy_v1.0.0/* /usr/local/bin/
    ```

1.  Optionally, add `bash` autocompletion for `konvoy` by running the following command:

    ```bash
    source <(konvoy completion bash)
    ```

### Install with default settings

1.  Verify you have valid **AWS security credentials** to deploy the cluster on AWS.

    This step is not required if you are installing Konvoy on an on-premise environment.
    For information about installing in an on-premise environment, see [Install on-premise](../install/install_onprem/).

1.  Create a directory for storing state information for your cluster by running the following commands:

    ```bash
    mkdir konvoy-quickstart
    cd konvoy-quickstart
    ```

    This directory for state information is required for performing future operations on your cluster.
    For example, state files stored in this directory are required to tear down a cluster.
    If you were to delete the state information or this directory, destroying the cluster would require you to manually perform clean-up tasks.

1.  Deploy with all of the default settings and addons by running the following command:

    ```bash
    konvoy up
    ```

The `konvoy up` command performs the following tasks:

-   Provisions three control plane machines of `t3.large` (a highly-available control-plane API).
-   Provisions four worker machines of `t3.xlarge` on AWS.
-   Deploys all of the following default addons:
    - [Calico][calico] to provide pod network, and policy-driven perimeter network security.
    - [CoreDNS][coredns] for DNS and service discovery.
    - [Helm][helm] to help you manage Kubernetes applications and application lifecycles.
    - [AWS EBS CSI driver][aws_ebs_csi] to support persistent volumes.
    - [Elasticsearch][elasticsearch] (including [Elasticsearch exporter][elasticsearch_exporter]) to enable scalable, high-performance logging pipeline.
    - [Kibana][kibana] to support data visualization for content indexed by Elasticsearch.
    - [Fluent Bit][fluentbit] to collect and collate logs from different sources and send logged messages to multiple destinations.
    - [Prometheus operator][prometheus_operator] (including [Grafana][grafana] AlertManager and [Prometheus Adaptor][promethsus_adapter]) to collect and evaluate metrics for monitoring and alerting.
    - [Traefik][traefik] to route [layer 7][osi] traffic as a reverse proxy and load balancer.
    - [Kubernetes dashboard][kubernetes_dashboard] to provide a general-purpose web-based user interface for the Kubernetes cluster.
    - Operations portal to centralize access to addon dashboards.
    - [Velero][velero] to back up and restore Kubernetes cluster resources and persistent volumes.
    - [Dex identity service][dex] to provide identity service (authentication) to the Kubernetes clusters.
    - [Dex Kubernetes client authenticator][dex_k8s_authenticator] to enable authentication flow to obtain `kubectl` token for accessing the cluster.
    - [Traefik forward authorization proxy][traefik_foward_auth] to provide basic authorization for Traefik ingress.
    - Kommander for multi-cluster management.

### Verify installation

The `konvoy up` command produces output from Terraform and Ansible provisioning operations.
When the deployment is complete, you should see a confirmation message similar to the following:

```text
Kubernetes cluster and addons deployed successfully!

Run `konvoy apply kubeconfig` to update kubectl credentials.

Navigate to the URL below to access various services running in the cluster.
  https://lb_addr-12345.us-west-2.elb.amazonaws.com/ops/landing
And login using the credentials below.
  Username: AUTO_GENERATED_USERNAME
  Password: SOME_AUTO_GENERATED_PASSWORD_12345

The dashboard and services may take a few minutes to be accessible.
```

You should copy the cluster URL and login information and paste it into a text file, then save the file in a secured, shared location on your network.
By default, the login credentials that are automatically-generated by the `konvoy up` command use self-signed SSL/TLS certificates.
For a production cluster, you can modify the cluster configuration to use your own certificates.

You can then use this information to access the operations portal and associated dashboards.

### Explore the cluster and add-ons

Use the URL you copied from the deployment output (for example, `https://lb_addr-12345.us-west-2.elb.amazonaws.com/ops/landing`) to access the cluster's dashboards using the **operations portal**.

The default _operations portal_ provides links to several dashboards of the installed services, including:

- Grafana dashboards for metrics
- Kibana dashboards for logs
- Prometheus AlertManager dashboard for viewing alerts and alert configurations
- Traefik dashboards for inbound HTTP traffic
- Kubernetes dashboard for cluster activity

After you log in to the operations portal, you can view [diagnostics](#generate-cluster-diagnostics)
and [dashboards](../operations/accessing-the-cluster/#ops-portal-dashboards) to see information about
cluster activity performance.

Although these are the most common next steps, you don't need to log in to the operations portal or run basic diagnostics to verify a successful installation.
If there were issues with installing or bringing the Kubernetes cluster online, the addons installation would fail.

### Merge the kubeconfig

Once the cluster is provisioned and functional, you should store its access configuration information in your main `kubeconfig` file before using `kubectl` to interact with the cluster.

The access configuration contains certificate credentials and the API server endpoint for accessing the cluster.
The `konvoy` cluster stores this information internally as `admin.conf`, but you can merge it into your "home" `kubeconfig` file, so you can access the cluster from other working directories on your machine.

To merge the access configuration, use the following command:

```bash
konvoy apply kubeconfig
```

#### Specify the kubeconfig location

By default, the `konvoy apply kubeconfig` command uses the value of the `KUBECONFIG` environment variable to declare the path to the correct configuration file.
If the `KUBECONFIG` environment variable is not defined, the default path of `~/.kube/config` is used.

You can override the default Kubernetes configuration path in one of two ways:

-   By specifying an alternate path before running the `konvoy apply kubeconfig` command. For example:

    ```bash
    export KUBECONFIG="${HOME}/.kube/konvoy.conf"
    konvoy apply kubeconfig
    ```

-   By setting `KUBECONFIG` to the path of the current configuration file created and used within `konvoy`. For example:

    ```bash
    export KUBECONFIG="${PWD}/admin.conf"
    ```

#### Validate a merged configuration

To validate the merged configuration, you should be able to list nodes in the Kubernetes cluster by running the following command:

```bash
kubectl get nodes
```

The command returns output similar to the following:

```text
NAME                                         STATUS   ROLES    AGE   VERSION
ip-10-0-129-3.us-west-2.compute.internal     Ready    <none>   24m   v1.15.3
ip-10-0-131-215.us-west-2.compute.internal   Ready    <none>   24m   v1.15.3
ip-10-0-131-239.us-west-2.compute.internal   Ready    <none>   24m   v1.15.3
ip-10-0-131-24.us-west-2.compute.internal    Ready    <none>   24m   v1.15.3
ip-10-0-192-174.us-west-2.compute.internal   Ready    master   25m   v1.15.3
ip-10-0-194-137.us-west-2.compute.internal   Ready    master   26m   v1.15.3
ip-10-0-195-215.us-west-2.compute.internal   Ready    master   26m   v1.15.3
```

### Next steps

Now that you have a basic Konvoy cluster installed and ready to use, you might want to test operations by deploying
a simple, sample application, customizing the cluster configuration, or checking the status of cluster components.

For more details, see the following topics:

- [Deploy a sample application](../tutorials/deploy-sample-app/)
- [Provision a customized cluster](../tutorials/provision-a-custom-cluster/)
- [Check component integrity](../troubleshooting/check-components/)
- [Troubleshooting](../troubleshooting/)

[cncf]: https://www.cncf.io
[install_docker]: https://www.docker.com/products/docker-desktop
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
[dex_k8s_authenticator]: https://github.com/mintel/dex-k8s-authenticator
[traefik_foward_auth]: https://github.com/thomseddon/traefik-forward-auth
[brew]: https://brew.sh/
