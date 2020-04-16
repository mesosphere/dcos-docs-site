---
layout: layout.pug
navigationTitle: Configure HTTP Proxy
title: Configure HTTP Proxy
menuWeight: 70
excerpt: Configure HTTP proxy for the Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For some production environments, direct access to the Internet could be blocked.
Those environments typically only allow Internet access through HTTP or HTTPS proxies.

Konvoy can be configured to use HTTP/HTTPS proxy for Internet access.
This applies to all Kubernetes components, as well as workloads running on top of Kubernetes, assuming the workloads understand standard HTTP/HTTPS proxy environment variables:

* `HTTP_PROXY`: the HTTP proxy server address.
* `HTTPS_PROXY`: the HTTPS proxy server address. (Ansible only supports `http:`)
* `NO_PROXY`: a list of IPs and domain names that are not subject to proxy settings.

# Before you start

Make sure the proxy server is running and functional.
You can verify this using the `curl` command from a node in the cluster.
Assume `http://proxy.company.com:3128` is the HTTP proxy server address.

```bash
http_proxy=http://proxy.company.com:3128 curl --head www.google.com
```

If the proxy is working properly, you receive a `200 OK` HTTP response.

# Install Konvoy with HTTP/HTTPS proxies

Edit the cluster configuration file `cluster.yaml` to specify HTTP/HTTPS proxies for the cluster.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    networking:
      httpProxy: "http://proxy.company.com:3128"
      httpsProxy: "http://proxy.company.com:3129"
      noProxy: []
```

This example configures the Kubernetes cluster installed by Konvoy to use proxy server `http://proxy.company.com:3128` for all HTTP traffic and proxy server `http://proxy.company.com:3129` for all HTTPS traffic, except for those HTTP/HTTPS requests to `localhost`, `127.0.0.1`, `company.com` and `mycluster.icp:8500`.

This configuration only applies to the core Kubernetes components. In this case, you must next configure the HTTP_PROXY settings for all other workloads that require access to the Internet.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  addons:
    addonsList:
    - name: kommander
      enabled: true
      values: |
        kommander-cluster-lifecycle:
          webhook:
            env:
              HTTP_PROXY: "http://proxy.company.com:3128"
              NO_PROXY: "http://proxy.company.com:3128"
              HTTPS_PROXY: "10.0.0.0/18,localhost,127.0.0.1,169.254.169.254,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local"
    ...
```

All the proxy-related fields are optional.

Konvoy applies the proxy configuration automatically after you run the following command:

```bash
konvoy up
```

<p class="message--important"><strong>IMPORTANT: </strong>if the machine from which the <tt>konvoy</tt> binary is being run requires the HTTP/HTTPS proxy for Internet access, you must set the same <tt>HTTP_PROXY</tt>, <tt>HTTPS_PROXY</tt>, and <tt>NO_PROXY</tt> as environment variables before running <tt>konvoy</tt>.</p>

These proxy settings will be used by the binary itself (not Kubernetes cluster machines) to download addon configurations over the Internet.
