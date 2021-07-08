---
layout: layout.pug
navigationTitle: Quick Start
title: Quick Start
excerpt: Get started by installing a cluster with default configuration settings
beta: false
enterprise: false
menuWeight: 60
---

<!-- markdownlint-disable MD025 MD018-->

Konvoy is a tool for provisioning Kubernetes clusters with a suite of pre-selected [Cloud Native Computing Foundation (CNCF)][cncf] and community-contributed tools.
By combining a native Kubernetes cluster as its foundation with a default set of cluster extensions,
Konvoy provides a complete out-of-the-box solution for organizations that want to deploy production-ready
Kubernetes.

This Quick Start guide provides simplified instructions to get your Konvoy cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) public cloud instance.

# Before you begin

Before installing Konvoy, ensure you have the [following][prerequisites] items.

# Installing Konvoy

1.  Install required packages. In most cases, you can install the required software using your preferred package manager. You likely have already installed the below packages after following the instructions on thew [prerequisites][prerequisites] page. For example, on a macOS computer, you can use [Homebrew][brew] to install `kubectl` and the `aws` command-line utility by running the following command:

    ```bash
    brew install kubernetes-cli awscli
    ```

1.  Check the Kubernetes client version. Many important Kubernetes functions **do not work** if your client is outdated. You can verify that the version of `kubectl` you have installed is supported by running the following command:

    ```bash
    kubectl version --short=true
    ```

1.  To download Konvoy, see the [Download Konvoy](../download) topic for information. You will need to download the tarball.

1.  Extract the Konvoy package tarball to see the Konvoy application folder.

1.  Verify you have valid **AWS security credentials** to deploy the cluster on AWS. This step is not required if you are installing Konvoy on an on-premises environment. For information about installing in an on-premises environment, see [Install on-premises](../install/install-onprem).

1.  Create a directory for storing state information for your cluster by running the following commands:

    ```bash
    mkdir konvoy-quickstart
    cd konvoy-quickstart
    ```

    <p class="message--warning"><strong>WARNING: </strong>This directory for state information is required for performing future operations on your cluster.
    For example, state files stored in this directory are required to tear down a cluster.
    If you were to delete the state information or this directory, destroying the cluster would require you to manually perform clean-up tasks.</p>

1.  Move the Konvoy files from extracting the tarball into this `konvoy-quickstart` directory.

    <p class="message--note"><strong>NOTE: </strong>You can use the <code>konvoy_v1.8.1</code> directory that was created when extracting the tarball.
    The important thing is to use whatever working directory has the <code>konvoy</code> application files in it.</p>

1.  Authorize your AWS security credentials so you can deploy to your AWS cloud account.

1.  Deploy with all of the default settings and addons by running the following command:

    ```bash
    konvoy up
    ```

    <p class="message--note"><strong>NOTE: </strong>In order to use <code>konvoy</code> as a command, you have to add the <code>konvoy</code> file to your $PATH and run <code>chmod +x /usr/local/bin/konvoy</code>.</p>

    If you do not add `konvoy` to your path, you can run Konvoy CLI commands by adding `./` in front of any Konvoy command.
    The above command would be this:

    ```bash
    ./konvoy up
    ```

    The `konvoy up` command performs the following tasks:
    -   Provisions three control plane machines of `m5.xlarge` (a highly-available control-plane API).
    -   Provisions four worker machines of `m5.2xlarge` on AWS.
    -   Deploys all of the following default addons:
        - [Calico][calico] to provide pod network, and policy-driven perimeter network security.
        - [CoreDNS][coredns] for DNS and service discovery.
        - [Helm][helm] to help you manage Kubernetes applications and application lifecycles.
        - [AWS EBS CSI driver][aws_ebs_csi] to support persistent volumes.
        - [Elasticsearch][elasticsearch] (including [Elasticsearch exporter][elasticsearch_exporter]) to enable scalable, high-performance logging pipeline.
        - [Kibana][kibana] to support data visualization for content indexed by Elasticsearch.
        - [Fluent Bit][fluentbit] to collect and collate logs from different sources and send logged messages to multiple destinations.
        - [Prometheus operator][prometheus_operator] (including [Grafana][grafana] AlertManager and [Prometheus Adaptor][prometheus_adapter]) to collect and evaluate metrics for monitoring and alerting.
        - [Traefik][traefik] to route [layer 7][osi] traffic as a reverse proxy and load balancer.
        - [Kubernetes dashboard][kubernetes_dashboard] to provide a general-purpose web-based user interface for the Kubernetes cluster.
        - Operations portal to centralize access to addon dashboards.
        - [Velero][velero] to back up and restore Kubernetes cluster resources and persistent volumes.
        - [Dex identity service][dex] to provide identity service (authentication) to the Kubernetes clusters.
        - [Dex Kubernetes client authenticator][dex_k8s_authenticator] to enable authentication flow to obtain `kubectl` token for accessing the cluster.
        - [Traefik forward authorization proxy][traefik_foward_auth] to provide basic authorization for Traefik ingress.
        - Kommander for multi-cluster management.

# Verifying your installation

The `konvoy up` command produces output from Terraform and Ansible provisioning operations.
When deployment is complete, you should see a confirmation message similar to the following:

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

## Explore the cluster and addons

Use the URL you copied from the deployment output (for example, `https://lb_addr-12345.us-west-2.elb.amazonaws.com/ops/landing`) to access the cluster's dashboards using the **operations portal**.

The default **operations portal** provides links to several dashboards of the installed services, including:

- Grafana dashboards for metrics
- Kibana dashboards for logs
- Prometheus AlertManager dashboard for viewing alerts and alert configurations
- Traefik dashboards for inbound HTTP traffic
- Kubernetes dashboard for cluster activity

After you log in to the operations portal, you can view the [dashboards](../access-authentication/access-konvoy#using-the-operations-portal) to see information about
cluster activity performance.

Although these are the most common next steps, you do not need to log in to the operations portal or run basic diagnostics to verify a successful installation.
If there were issues with installing or bringing the Kubernetes cluster online, the addons installation would fail.

# Merge the kubeconfig

Once the cluster is provisioned and functional, you should store its access configuration information in your main `kubeconfig` file before using `kubectl` to interact with the cluster.

The access configuration contains certificate credentials and the API server endpoint for accessing the cluster.
The `konvoy` cluster stores this information internally as `admin.conf`, but you can merge it into your "home" `kubeconfig` file, so you can access the cluster from other working directories on your machine.

To merge the access configuration, use the following command:

```bash
konvoy apply kubeconfig
```

Or, you can use this command if you haven't added `konvoy` to your $PATH:

```bash
./konvoy apply kubeconfig
```

1.  Specify the kubeconfig location.

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

1.  Validate a merged configuration.

    To validate the merged configuration, you should be able to list nodes in the Kubernetes cluster by running the following command:

    ```bash
    kubectl get nodes
    ```

    The command returns output similar to the following:

    ```text
    NAME                                         STATUS   ROLES    AGE   VERSION
    ip-10-0-129-3.us-west-2.compute.internal     Ready    <none>   24m   v1.20.6
    ip-10-0-131-215.us-west-2.compute.internal   Ready    <none>   24m   v1.20.6
    ip-10-0-131-239.us-west-2.compute.internal   Ready    <none>   24m   v1.20.6
    ip-10-0-131-24.us-west-2.compute.internal    Ready    <none>   24m   v1.20.6
    ip-10-0-192-174.us-west-2.compute.internal   Ready    master   25m   v1.20.6
    ip-10-0-194-137.us-west-2.compute.internal   Ready    master   26m   v1.20.6
    ip-10-0-195-215.us-west-2.compute.internal   Ready    master   26m   v1.20.6
    ```

# Next steps

Now that you have a basic Konvoy cluster installed and ready to use, you might want to test operations by deploying
a simple, sample application, customizing the cluster configuration, or checking the status of cluster components.

For more details, see the following topics:

- [Deploy a sample application](../deployments/deploy-sample-app/)
- [Provision a customized cluster](../install/provision-a-custom-cluster/)
- [Check component integrity](../install/tips-tricks/check-components/)
- [Troubleshooting](../troubleshooting/)

[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[brew]: https://brew.sh/
[calico]: https://www.projectcalico.org/
[cncf]: https://www.cncf.io
[coredns]: https://coredns.io/
[dex]: https://github.com/dexidp/dex
[dex_k8s_authenticator]: https://github.com/mesosphere/dex-k8s-authenticator
[elasticsearch]: https://www.elastic.co/products/elastic-stack
[elasticsearch_exporter]: https://www.elastic.co/guide/en/elasticsearch/reference/7.2/es-monitoring-exporters.html
[fluentbit]: https://fluentbit.io/
[grafana]: https://grafana.com/
[helm]: https://helm.sh/
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[install_aws]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[kibana]: https://www.elastic.co/products/kibana
[kubernetes_dashboard]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
[osi]: https://en.wikipedia.org/wiki/OSI_model
[prerequisites]: ../prerequisites
[prometheus_adapter]: https://github.com/DirectXMan12/k8s-prometheus-adapter
[prometheus_operator]: https://prometheus.io/
[traefik]: https://traefik.io/
[traefik_foward_auth]: https://github.com/thomseddon/traefik-forward-auth
[velero]: https://velero.io/
