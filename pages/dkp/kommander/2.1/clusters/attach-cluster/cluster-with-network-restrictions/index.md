---
layout: layout.pug
navigationTitle: Attach a cluster with networking restrictions
title: Attach a cluster with networking restrictions
menuWeight: 10
excerpt: How to attach an existing cluster that has additional networking restrictions
beta: false
---

<!-- markdownlint-disable MD030 -->

Use this option when you want to attach a cluster that is in a DMZ, behind a NAT gateway, behind a proxy server or a firewall, or that requires additional access information. This procedure gathers the information required to create a kubeconfig file for the network tunnel between Kommander and the cluster you want to attach.

<p class="message--note"><strong>NOTE: </strong>If your cluster blocks public access, you may need to make the additional step of allowing certain authorized networks where Docker images are hosted for Konvoy to use your cluster, specifically <code>https://registry-1.docker.io/</code>.</p>

1. In the selected workspace Dashboard, select the **Add Cluster** option in the **Actions** dropdown menu at the top right.

1. On the **Add Cluster** page, select **Attach Cluster**.

1. Select the **Cluster has networking restrictions** card to display the configuration page.

    <!--- ![Add Cluster Networking Options](/dkp/kommander/1.4/img/cluster-has-networking-restrictions.png) --->

1. Enter the **Cluster Name** of the cluster you're attaching and select a **Workspace** from the dropdown list (if entering the **Add Cluster** menu from the Global workspace).

1. Create additional new Labels as needed.

1. Select the **Load Balancer Hostname** which is the Ingress for the cluster from the dropdown menu. You will want the hostname to match the Kommander Host cluster that you are attaching your existing cluster with network restrictions to.

1. Specify the **URL Path Prefix** for your Load Balancer Hostname. This URL path will serve as the prefix for the specific tunnel services you want to expose on the Kommander management cluster. If no value is specified, the value defaults to `/dkp/tunnel`.

   <p class="message--note"><strong>NOTE: </strong>Kommander uses Traefik 2 ingress, which requires explicit definition of strip prefix middleware as a Kubernetes API object, opposed to a simple annotation. Kommander provides default middleware that supports creating tunnels only on the <code>/dkp/tunnel URL</code> prefix. This is indicated by using the extra annotation, <code>traefik.ingress.kubernetes.io/router.middlewares: kommander-stripprefixes-kubetunnel@kubernetescrd</code> as shown in the code sample that follows. If you want to expose a tunnel on a different URL prefix, you must manage your own middleware configuration.</p>

1. (Optional) Enter a value for the **Hostname** field.

1. If you have not attached this cluster before, you must create a new secret in the **Root CA Certificate** drop down menu. To do this in your Konvoy management cluster, view your base64 encoded Kubernetes secret values to copy and paste into the **Root CA Certificate** field:

    ```shell
    echo $(kubectl get secret -n kommander kommander-bootstrap-root-ca -o=go-template='{{index .data "tls.crt"}}')
    ```

    Otherwise, select from the list of available Secrets.

   <!--- ![Network Cluster Configuration](/dkp/kommander/1.4/img/attach-network-restrict-cluster-tunnel-config.png) --->

1. Add any **Extra Annotations** as needed.

1. Select the **Save & Generate kubeconfig** button to generate the kubeconfig file for the network tunnel.

After the above is complete, [finish attaching the cluster to Kommander](../finish-attaching-cluster).

As an alternative procedure, you can follow these instructions to [Use CLI to Add Managed Clusters to Kommander][tunnel-cli].

For information on TunnelGateway, review the [API documentation][tunnel-gateway-api-docs].

[tunnel-cli]: ../../tunnel-cli/
[tunnel-gateway-api-docs]: ../../tunnel-cli/api-reference
