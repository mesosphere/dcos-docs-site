---
layout: layout.pug
navigationTitle: Load Balancing
title: Load Balancing
menuWeight: 20
beta: false
enterprise: false
---

In a Kubernetes cluster, depending on the flow of traffic direction, there are two kinds of load balancing:

- Load balancing for the traffic within a Kubernetes cluster
- Load balancing for the traffic coming from outside the cluster

## Load balancing for internal traffic

Load balancing within a Kubernetes cluster is accessed through a `ClusterIP` service type.
`ClusterIP` presents a single IP address to the client and load balances the traffic going to this IP to the backend servers.
The actual load balancing happens using `iptables` or IPVS configuration. The `kube-proxy` Kubernetes component programs these.
The `iptables` mode of operation uses [DNAT][dnat] rules to distribute direct traffic to real servers, whereas [IPVS][ipvs] leverages in-kernel transport-layer load-balancing.
Read a [comparison between these two methods][ipvs_iptables_comparison].
By default, `kube-proxy` runs in `iptables` mode.
The kube-proxy configuration can be altered by updating the `kube-proxy` configmap in the `kube-system` namespace.

## Load balancing for external traffic

External traffic destined for the Kubernetes service requires a service of type `LoadBalancer`, through which external clients connect to your internal service.
Under the hood, it uses a load balancer provided by the underlying infrastructure to direct the traffic.

### In the Cloud

In cloud deployments, the load balancer is provided by the cloud provider.
For example, in AWS, the service controller communicates with the AWS API to provision an ELB service which targets the cluster nodes.

### On-premises

For an on-premises deployment, Kommander ships with [MetalLB][metallb], which provides load-balancing services.

<p class="message--note"><strong>NOTE: </strong>Making a configuration change in the <code>ConfigMap</code> for the <code>metallb</code> application might not result in the config change applying. This is <a href="https://github.com/danderson/metallb/issues/348#issuecomment-442218138" target="_blank">intentional behavior</a>. MetalLB refuses to adopt changes to the ConfigMap that breaks existing Services. You can force MetalLB to load those changes by deleting the metallb controller pod:</p>

```bash
kubectl -n kommander delete pod -l app=metallb,component=controller
```

To use MetalLB:

1.  Identify and reserve a virtual IP (VIP) address range in your networking infrastructure.

1.  Configure your networking infrastructure so that the reserved IP addresses is reachable:

    - from all hosts specified in the inventory file.
    - from the computer used to deploy Kubernetes.

<p class="message--note"><strong>NOTE: </strong>Make sure the MetalLB subnet does not overlap with <code>podSubnet</code> and <code>serviceSubnet</code>.</p>

Your configuration is complete if the reserved virtual IP addresses are in the same subnet as the rest of the cluster nodes.
If it is in a different subnet you may need to configure appropriate routes to ensure connectivity with the virtual IP address.
If the virtual IP addresses share an interface with the primary IP address of the interface, you must disable any IP or MAC spoofing from the infrastructure firewall.

MetalLB can be configured in two modes: Layer2 and BGP.

First, set the `WORKSPACE_NAMESPACE` environment variable using the following command to get the name of the workspace's namespace that you would like to deploy MetalLB to.
MetalLB is deployed to all attached clusters within this workspace.

```bash
export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
```

<p class="message--note"><strong>NOTE:</strong> To deploy MetalLB to the Kommander host cluster, this will be the <code>kommander</code> namespace.</p>

Next, create the following resources to deploy MetalLB with custom configuration:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: metallb-overrides
  namespace: ${WORKSPACE_NAMESPACE}
data:
  values.yaml: |
    configInline:
      address-pools:
      - name: default
        protocol: layer2
        addresses:
        - 10.0.50.25-10.0.50.50
---
apiVersion: apps.kommander.d2iq.io/v1alpha2
kind: AppDeployment
metadata:
  name: metallb
  namespace: ${WORKSPACE_NAMESPACE}
spec:
  appRef:
    name: metallb-0.12.3
    kind: ClusterApp
  configOverrides:
    name: metallb-overrides
```

The number of virtual IP addresses in the reserved range determines the maximum number of `LoadBalancer` service types you can create in the cluster.

MetalLB in `bgp` mode implements only a subset of the BGP protocol. In particular, it only advertises the virtual IP to peer BGP agent.

The following example illustrates the BGP configuration in the overrides `ConfigMap`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: metallb-overrides
  namespace: ${WORKSPACE_NAMESPACE}
data:
  values.yaml: |
    configInline:
      peers:
      - my-asn: 64500
        peer-asn: 64500
        peer-address: 172.17.0.4
      address-pools:
      - name: my-ip-space
        protocol: bgp
        addresses:
        - 172.40.100.0/24
```

In the above configuration, `peers` defines the configuration of the BGP peer, such as peer IP address and `autonomous system number` (`asn`).
The `address-pools` section is similar to `layer2`, except for the protocol.

MetalLB also supports [advanced BGP configuration][metallb_config].

[dnat]: https://www.linuxtopia.org/Linux_Firewall_iptables/x4013.html
[ipvs]: https://en.wikipedia.org/wiki/IP_Virtual_Server
[ipvs_iptables_comparison]: https://www.projectcalico.org/comparing-kube-proxy-modes-iptables-or-ipvs/
[metallb]: https://metallb.universe.tf/concepts/
[metallb_config]: https://metallb.universe.tf/configuration/
[metallb_intentional_behavior]: https://github.com/danderson/metallb/issues/348#issuecomment-442218138
