---
layout: layout.pug
navigationTitle: Configure HTTP Proxy
title: Configure HTTP Proxy
menuWeight: 30
excerpt: Configure HTTP proxy for the Kommander cluster(s)
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Kommander supports environments where access to the Internet is restricted, and must be made through an HTTP/HTTPS proxy.

In these environments, you must configure Kommander to use the HTTP/HTTPS proxy. In turn, Kommander configures all platform services to use the HTTP/HTTPS proxy.

<p class="message--note"><strong>NOTE: </strong>Kommander follows a common convention for using an HTTP proxy server. The convention is based on three environment variables, and is supported by many, though not all, applications.<ul>
  <li><code>HTTP_PROXY</code>: the HTTP proxy server address</li>
  <li><code>HTTPS_PROXY</code>: the HTTPS proxy server address</li>
  <li><code>NO_PROXY</code>: a list of IPs and domain names that are not subject to proxy settings</li>
</ul>
</p>

# Prerequisites

In the examples below:

1. The `curl` command-line tool is available on the host.
1. The proxy server address is `http://proxy.company.com:3128`.
1. The HTTP and HTTPS proxy server addresses use the `http` scheme.
1. The proxy server can reach `www.google.com` using HTTP or HTTPS.

Verify the cluster nodes can access the Internet through the proxy server. On each cluster node, run:

```bash
curl --proxy http://proxy.company.com:3128 --head http://www.google.com
curl --proxy http://proxy.company.com:3128 --head https://www.google.com
```

If the proxy is working for HTTP and HTTPS, respectively, the `curl` command returns a `200 OK` HTTP response.

# Enable Gatekeeper

Gatekeeper acts as a [Kubernetes mutating webhook](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook). You can use this to mutate the Pod resources with `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables.

1. Create (if necessary) or update the Kommander installation configuration file. If one does not already exist, then create it using the following commands:

    ```bash
    ./kommander install --init > install.yaml
    ```

1. Append this `apps` section to the `install.yaml` file with the following values to enable Gatekeeper and configure it to add HTTP proxy settings to the pods.

   <p class="message--note"><strong>NOTE: </strong>Only pods created after applying this setting will be mutated. Also, this will affect impact pods in the namespace with the <code>"gatekeeper.d2iq.com/mutate=pod-proxy"</code> label.</p>

    ```yaml
    apps:
      gatekeeper:
        values: |
          mutations:
            enable: true
            enablePodProxy: true
            podProxySettings:
              noProxy: "127.0.0.1,192.168.0.0/16,10.0.0.0/16,10.96.0.0/12,169.254.169.254,169.254.0.0/24,localhost,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,.svc.cluster.local.,kubecost-prometheus-server.kommander,logging-operator-logging-fluentd.kommander.svc,elb.amazonaws.com"
              httpProxy: "http://proxy.company.com:3128"
              httpsProxy: "http://proxy.company.com:3128"
            excludeNamespacesFromProxy: []
            namespaceSelectorForProxy:
              "gatekeeper.d2iq.com/mutate": "pod-proxy"
    ```

1.  Create the `kommander` and `kommander-flux` namespaces, or the namespace where Kommander will be installed. Label the namespaces to activate the Gatekeeper mutation on them:

    ```bash
    kubectl create namespace kommander
    kubectl label namespace kommander gatekeeper.d2iq.com/mutate=pod-proxy

    kubectl create namespace kommander-flux
    kubectl label namespace kommander-flux gatekeeper.d2iq.com/mutate=pod-proxy
    ```

## Create Gatekeeper ConfigMap in the kommander namespace

To configure Gatekeeper so that these environment variables are mutated in the pods, create the following `gatekeeper-overrides` ConfigMap in the `kommander` Workspace you created in a previous step:

```bash
export NAMESPACE=kommander
```

```yaml
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: gatekeeper-overrides
  namespace: ${NAMESPACE}
data:
  values.yaml: |
    ---
    # enable mutations
    mutations:
      enable: true
      enablePodProxy: true
      podProxySettings:
        noProxy: "127.0.0.1,192.168.0.0/16,10.0.0.0/16,10.96.0.0/12,169.254.169.254,169.254.0.0/24,localhost,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,.svc.cluster.local.,kubecost-prometheus-server.kommander,logging-operator-logging-fluentd.kommander.svc,elb.amazonaws.com"
        httpProxy: "http://proxy.company.com:3128"
        httpsProxy: "http://proxy.company.com:3128"
      excludeNamespacesFromProxy: []
      namespaceSelectorForProxy:
        "gatekeeper.d2iq.com/mutate": "pod-proxy"
EOF
```

Set the `httpProxy` and `httpsProxy` environment variables to the address of the HTTP and HTTPS proxy server, respectively. Set the `noProxy` environment variable to the addresses that should be accessed directly, not through the proxy.

Performing this step before installing Kommander allows the Flux components to respect the proxy configuration in this ConfigMap.

## HTTP Proxy Configuration Considerations

To ensure that core components work correctly, always add these addresses to the <code>noProxy</code>:
  <ul>
      <li>Loopback addresses (<code>127.0.0.1</code> and <code>localhost</code>)</li>
      <li>Kubernetes API Server addresses</li>
      <li> Kubernetes Pod IPs (for example, <code>192.168.0.0/16</code>). This comes from two places:
        <ul>
        <li>Calico pod CIDR - Defaults to <code>192.168.0.0/16</code></li>
        <li>The <code>podSubnet</code> is configured in CAPI objects and needs to match above Calico's - Defaults to <code>192.168.0.0/16</code> (same as above)</li>
        </ul>
      </li>
      <li>Kubernetes Service addresses (for example, <code>10.96.0.0/12</code>, <code>kubernetes</code>, <code>kubernetes.default</code>, <code>kubernetes.default.svc</code>, <code>kubernetes.default.svc.cluster</code>, <code>kubernetes.default.svc.cluster.local</code>, <code>.svc</code>, <code>.svc.cluster</code>, <code>.svc.cluster.local</code>, <code>.svc.cluster.local.</code>)</li>
      <li>Auto-IP addresses <code>169.254.169.254,169.254.0.0/24</code></li>
  </ul>
  In addition to the values above, the following settings are needed when installing on AWS:
  <ul>
    <li>The default VPC CIDR range of <code>10.0.0.0/16</code> </li>
    <li><code>kube-apiserver</code> internal/external ELB address</li>
  </ul>
</p>

<p class="message--important"><strong>IMPORTANT: </strong>The <code>NO_PROXY</code> variable contains the Kubernetes Services CIDR. This example uses the default CIDR, <code>10.96.0.0/12</code>. If your cluster's CIDR is different, update the value in <code>NO_PROXY</code>.
<br /><br />Based on the order in which the Gatekeeper Deployment is Ready (in relation to other Deployments), not all the core services are guaranteed to be mutated with the proxy environment variables. Only the user deployed workloads are guaranteed to be mutated with the proxy environment variables. If you need a core service to be mutated with your proxy environment variables, you can restart the AppDeployment for that core service.</p>

## Install Kommander

Kommander installs with a dedicated CLI.

**NOTE:** To ensure Kommander is installed on the workload cluster, use the `--kubeconfig=<cluster_name>.conf` flag.

1. Install Kommander using the configuration files and ConfigMap from previous steps:

    ```bash
    ./kommander install --installer-config ./install.yaml
    ```

# Configure Workspace or Project

Configure the Workspace or Project in which you want to use the proxy. To have Gatekeeper mutate the manifests, create the `Workspace` (or `Project`) with the following label:

```yaml
labels:
  gatekeeper.d2iq.com/mutate: "pod-proxy"
```

This can be done when creating the Workspace (or Project) from the UI, or by running the following command from the CLI after the namespace is created:

```bash
kubectl label namespace <NAMESPACE> "gatekeeper.d2iq.com/mutate=pod-proxy"
```

## Configure HTTP Proxy in Attached Clusters

To ensure that Gatekeeper is deployed before everything else in the attached clusters, you must manually create the exact Namespace of the Workspace in which the cluster is going to be attached, _before_ attaching the cluster:

Execute the following command in the attached cluster before attaching it to the host cluster:

```bash
kubectl create namespace <NAMESPACE>
```

Then, to configure the pods in this namespace to use proxy configuration, you must label the Workspace with `gatekeeper.d2iq.com/mutate=pod-proxy` when creating it so that Gatekeeper deploys a `ValidatingWebhook` to mutate the pods with proxy configuration.

## Create Gatekeeper ConfigMap in the Workspace Namespace

To configure Gatekeeper so that these environment variables are mutated in the pods, create the following `gatekeeper-overrides` ConfigMap in the Workspace Namespace:

```bash
export NAMESPACE=<workspace-namespace>
```

```yaml
cat << EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: gatekeeper-overrides
  namespace: ${NAMESPACE}
data:
  values.yaml: |
    ---
    # enable mutations
    mutations:
      enable: true
      enablePodProxy: true
      podProxySettings:
        noProxy: "127.0.0.1,192.168.0.0/16,10.0.0.0/16,10.96.0.0/12,169.254.169.254,169.254.0.0/24,localhost,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,.svc.cluster.local.,kubecost-prometheus-server.kommander,logging-operator-logging-fluentd.kommander.svc,elb.amazonaws.com"
        httpProxy: "http://proxy.company.com:3128"
        httpsProxy: "http://proxy.company.com:3128"
      excludeNamespacesFromProxy: []
      namespaceSelectorForProxy:
        "gatekeeper.d2iq.com/mutate": "pod-proxy"
EOF
```

Set the `httpProxy` and `httpsProxy` environment variables to the address of the HTTP and HTTPS proxy server, respectively. Set the `noProxy` environment variable to the addresses that should be accessed directly, not through the proxy. The list of the recommended settings is in the section, [_HTTP Proxy Configuration Considerations_](#http-proxy-configuration-considerations) above.

# Configure your applications

In a default installation with `gatekeeper` enabled, you can have proxy environment variables applied to all your pods automatically by adding the following label to your namespace:

```yaml
"gatekeeper.d2iq.com/mutate": "pod-proxy"
```

No further manual changes are required.

## Manually configure your application

<p class="message--important"><strong>IMPORTANT:</strong> If Gatekeeper is not installed, and you need to use an HTTP proxy, you must manually configure your applications.</p>

Some applications follow the convention of `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables.

In this example, the environment variables are set for a container in a Pod:

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: example-container
    env:
    - name: HTTP_PROXY
      value: "http://proxy.company.com:3128"
    - name: HTTPS_PROXY
      value: "http://proxy.company.com:3128"
    - name: NO_PROXY
      value: "10.0.0.0/18,localhost,127.0.0.1,169.254.169.254,169.254.0.0/24,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,.svc.cluster.local."
```

See [Define Environment Variables for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-environment-variable-for-a-container) for more details.
