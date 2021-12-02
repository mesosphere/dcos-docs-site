---
layout: layout.pug
navigationTitle: Configure HTTP Proxy
title: Configure HTTP Proxy
menuWeight: 70
excerpt: Configure HTTP proxy for the Konvoy cluster
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy supports environments where access to the Internet is restricted, and must be made through an HTTP/HTTPS proxy.

In these environments, configure Konvoy to use the HTTP/HTTPS proxy. In turn, Konvoy configures all core Kubernetes components to use the HTTP/HTTPS proxy.

<p class="message--note"><strong>NOTE: </strong>Konvoy follows a common convention for using an HTTP proxy server. The convention is based on three environment variables, and is supported by many, though not all, applications.<ul>
  <li><tt>HTTP_PROXY</tt>: the HTTP proxy server address</li>
  <li><tt>HTTPS_PROXY</tt>: the HTTPS proxy server address</li>
  <li><tt>NO_PROXY</tt>: a list of IPs and domain names that are not subject to proxy settings</li>
</ul>
</p>

Konvoy downloads addon configurations to the bootstrap host, i.e., the host where the `konvoy` binary runs. If the addon configurations are not available on the bootstrap host, Konvoy accesses the Internet from the host.

Konvoy downloads software packages to cluster nodes. Kubernetes downloads container images to cluster nodes. If the packages or container images are not available on a cluster node, Konvoy or Kubernetes, respectively, access the Internet from that node.

<p class="message--important"><strong>IMPORTANT: </strong> Konvoy requires the <tt>http</tt> scheme to be used for both the HTTP and HTTPS proxy server. This is for two reasons: First, Konvoy uses Ansible to download software packages, and Ansible does not support the <tt>https</tt> scheme. Second, Konvoy does not support verification of the HTTP proxy server certificate. Note that, even when using the `http` scheme, the proxy server cannot read the body or headers of an HTTPS request.</p>

# Before you start

In the examples below:

1. The `curl` command-line tool is available on the host.
1. The proxy server address is `http://proxy.company.com:3128`.
1. The proxy server address uses the `http` scheme.
1. The proxy server can reach `www.google.com` using HTTP or HTTPS.

## Verify that the bootstrap host can access the Internet through the proxy server

On the bootstrap host, run:

```bash
curl --proxy http://proxy.company.com:3128 --head http://www.google.com
curl --proxy http://proxy.company.com:3128 --head https://www.google.com
```

If the proxy is working for HTTP and HTTPS, respectively, the `curl` command returns a `200 OK` HTTP response.

## Verify that cluster nodes can access the Internet through the proxy server

On each cluster node, run:

```bash
curl --proxy http://proxy.company.com:3128 --head http://www.google.com
curl --proxy http://proxy.company.com:3128 --head https://www.google.com
```

If the proxy is working for HTTP and HTTPS, respectively, the `curl` command returns a `200 OK` HTTP response.

# Configure Konvoy

Set the `HTTP_PROXY` and `HTTPS_PROXY` environment variables to the address of the HTTP and HTTPS proxy server, respectively. Set the `NO_PROXY` environment variable to the addresses that should be accessed directly, not through the proxy.

<p class="message--important"><strong>IMPORTANT: </strong>Both the HTTP and HTTPS proxy server address must use the <tt>http</tt> scheme.</p>

This example shows how to configure the HTTP proxy server, then run `konvoy up`:

```bash
export HTTP_PROXY=http://proxy.company.com:3128
export HTTPS_PROXY=http://proxy.company.com:3128
konvoy up
```

# Configure Kubernetes core components and addons

Edit the cluster configuration file, `cluster.yaml`. Set `httpProxy` and `httpsProxy` to the HTTP and HTTPS proxy server address, respectively. Set `noProxy` to the addresses that should be accessed directly, not through the proxy.

<p class="message--important"><strong>IMPORTANT: </strong>Both the HTTP and HTTPS proxy server address must use the <tt>http</tt> scheme.</p>

<p class="message--note"><strong>NOTE: </strong>In order to ensure core components work correctly, Konvoy always adds these addresses to <tt>noProxy</tt>:
<ul>
    <li>Loopback addresses (<tt>127.0.0.1</tt> and <tt>localhost</tt>)</li>
    <li>Kubernetes API Server addresses</li>
    <li>Kubernetes Pod IPs (e.g. <tt>192.168.0.0/16</tt>)</li>
    <li>Kubernetes Service addresses (e.g., <tt>10.0.0.0/18</tt>, <tt>kubernetes</tt>, <tt>kubernetes.default</tt>, <tt>kubernetes.default.svc</tt>, <tt>kubernetes.default.svc.cluster</tt>, <tt>kubernetes.default.svc.cluster.local</tt>, <tt>.svc</tt>, <tt>.svc.cluster</tt>, <tt>.svc.cluster.local</tt>)</li>
</ul>
</p>

In this example, the proxy server is `http://proxy.company.com:3128`, and additional addresses that should be accessed directly are IPs in the `172.0.0.0/16` CIDR, and hosts in the `.intra.net` domain.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    networking:
      httpProxy: "http://proxy.company.com:3128"
      httpsProxy: "http://proxy.company.com:3128"
      noProxy: [ "172.0.0.0/16", ".intra.net" ]
```

In a cluster with the default configuration, the `kommander` and `gatekeeper` addons are installed. Gatekeeper will automatically configure the right proxy settings to `kommander`. If on the other hand, `gatekeeper` is not enabled then you will have to manually configure `kommander`.

To manually configure the addon to use the proxy settings, modify its `values` field as follows:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  addons:
    addonsList:
    - name: kommander
      enabled: true
      values: |
        kommander-federation:
          utilityApiserver:
            env:
              HTTP_PROXY: "http://proxy.company.com:3128"
              HTTPS_PROXY: "http://proxy.company.com:3128"
              NO_PROXY: "10.0.0.0/18,localhost,127.0.0.1,169.254.169.254,169.254.0.0/24,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local"
    ...
```

<p class="message--important"><strong>IMPORTANT: </strong>The <tt>NO_PROXY</tt> variable contains the Kubernetes Services CIDR. This example uses the default CIDR, <tt>10.0.0.0/18</tt>. If your cluster's CIDR is different, update the value in <tt>NO_PROXY</tt>.</p>

After you change the cluster configuration, apply the changes by running `konvoy up`.

# Configure your applications

In a default installation with `gatekeeper` enabled, you can have proxy environment variables applied to all your pods automatically by adding the following label to your namespace:

```yaml
"gatekeeper.d2iq.com/mutate": "pod-proxy"
```

No further manual changes are required.

<p class="message--important"><strong>IMPORTANT:</strong> If Gatekeeper is not installed, and you need to use a http proxy, then you must manually configure your addons as described further in this section. </p>

## Manually configure your application
Many, but not all, applications follow the convention of `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` environment variables.

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
      value: "10.0.0.0/18,localhost,127.0.0.1,169.254.169.254,169.254.0.0/24,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local"
```

See [Define Environment Variables for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-environment-variable-for-a-container) for more details.
