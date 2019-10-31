---
layout: layout.pug
navigationTitle: Configure HTTP Proxy
title: Configure HTTP Proxy
menuWeight: 70
excerpt: Configure HTTP proxy for the Konvoy cluster
 
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

For some production environments, direct access to the Internet could be blocked.
Those environments typically only allow Internet access through HTTP or HTTPS proxies.

Konvoy can be configured to use HTTP/HTTPS proxy for Internet access.
This applies to all Kubernetes components, as well as workloads running on top of Kubernetes, assuming the workloads understand standard HTTP/HTTPS proxy environment variables:

* `HTTP_PROXY`: the HTTP proxy server address.
* `HTTPS_PROXY`: the HTTPS proxy server address. (Ansible only supports `http:`)
* `NO_PROXY`: a list of IPs and domain names that do not subject to proxy settings.

# Before you start

Please make sure the proxy server is running and functional.
This can be verified using a simple `curl` command from a node in the cluster.
Assume `http://proxy.company.com:3128` is the HTTP proxy server address.

```bash
http_proxy=http://proxy.company.com:3128 curl --head www.google.com
```

If the proxy is working properly, a `200 OK` HTTP response should be received.

# Install Konvoy with HTTP/HTTPS proxies

Edit the cluster configuration file `cluster.yaml` to specify HTTP/HTTPS proxies for the cluster.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  kubernetes:
    networking:
      httpProxy: "http://proxy.company.com:3128"
      httpsProxy: "http://proxy.company.com:3129"
      noProxy:
        - "localhost"
        - "127.0.0.1"
        - "company.com"
        - "mycluster.icp:8500"
```

The above example configures the Kubernetes cluster installed by Konvoy to use proxy server `http://proxy.company.com:3128` for all HTTP traffic and proxy server `http://proxy.company.com:3129` for all HTTPS traffic, except for those HTTP/HTTPS requests to `localhost`, `127.0.0.1`, `company.com` and `mycluster.icp:8500`.

Since the above configuration only applies to the core Kubernetes components, you now must configure the HTTP_PROXY settings for all other workloads that require access to the Internet, including some of the addons.
Edit the cluster configuration file `cluster.yaml` addons section.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  addons:
    addonsList:
    - name: awsebscsiprovisioner
      enabled: true
      values: |
        env:
          HTTP_PROXY: "http://proxy.company.com:3128"
          HTTPS_PROXY: "http://proxy.company.com:3128"
    - name: kibana
      enabled: true
      values: |
        env:
          HTTP_PROXY: "http://proxy.company.com:3128"
          HTTPS_PROXY: "http://proxy.company.com:3128"
    - name: prometheus
      enabled: true
      values: |
        grafana:
          env:
            HTTP_PROXY: "http://proxy.company.com:3128"
            HTTPS_PROXY: "http://proxy.company.com:3128"
            NO_PROXY: "prometheus-kubeaddons-prom-prometheus"
    ...
```

All the proxy related fields are optional.

The proxy configuration will be applied automatically by Konvoy after you run

```bash
konvoy up
```

<p class="message--important"><strong>IMPORTANT: </strong> if the machine from which the <tt>konvoy</tt> binary is being run requires the HTTP/HTTPS proxy for Internet access, you must set the same <tt>HTTP_PROXY</tt>, <tt>HTTPS_PROXY</tt>, and <tt>NO_PROXY</tt> as environment variables before running <tt>konvoy</tt>.</p>

These proxy settings will be used by the binary itself (not Kubernetes cluster machines) to download addon configurations over the Internet.
