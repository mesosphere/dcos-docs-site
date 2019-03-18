---
layout: layout.pug
navigationTitle: Exposing the Kubernetes API via Marathon-LB or Edge-LB
title: Exposing the Kubernetes API via Marathon-LB or Edge-LB
menuWeight: 71
excerpt: Setting up HAProxy to expose the Kubernetes API via Marathon-LB or Edge-LB
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Using HAProxy with Marathon-LB or Edge-LB

If you have existing instances of Marathon-LB in your DC/OS cluster, or if you are using Edge-LB (DC/OS Enterprise), you can expose the Kubernetes API for a given Kubernetes cluster via the existing HAProxy built into Marathon-LB or Edge-LB.

These options (as documented below) are slightly less secure than Option 2 from the [Exposing the Kubernetes API](/services/kubernetes/2.1.1-1.12.5/operations/exposing-the-kubernetes-api/) page, because they use a self-signed TLS certificate to expose the Kubernetes API endpoint.
Exposing the Kubernetes API endpoint with Marathon-LB and/or Edge-LB using a signed certificate is possible but not covered by the scope of this document.
Exposing the Kubernetes API for multiple Kubernetes clusters is also out of the scope of this document. This is explained in detail in [Exposing the Kubernetes API](/services/kubernetes/2.1.1-1.12.5/operations/exposing-the-kubernetes-api/).

Both of these examples will generate a setup similar to the following:

![Exposing the Kubernetes API using HAProxy](/services/kubernetes/2.1.1-1.12.5/img/marathonlb.png "Exposing the Kubernetes API using HAProxy")

Figure 1. Exposing the Kubernetes API using HAProxy

These examples assume that you want to expose the Kubernetes API for a cluster named `kubernetes-cluster`.
If your Kubernetes cluster has a different name, then some changes may need to be made; these are called out below.

<p class="message--note"><strong>NOTE: </strong>If you have Marathon-LB running on a given public agent node, ports 9090, 9091, 80, 443, and 10000-10150 are consumed by Marathon-LB by default; keep this in mind when considering public Kubernetes node placement.</p>

# Example 1: Using an existing Marathon-LB instance

Marathon-LB looks at all running Marathon applications and uses metadata (labels and other properties) on the application definitions to determine what applications and services to expose via HAProxy.
Specifically, a given instance of Marathon-LB will look for applications with a specific `HAPROXY_GROUP` label, and expose those that match the specified `HAPROXY_GROUP`.
The default `HAPROXY_GROUP` label that Marathon-LB looks for is `external`.

While Marathon-LB is primarily used to expose Marathon applications, it can be tricked into exposing non-Marathon endpoints with a dummy application.
Here are two examples on how to achieve this:

* One with no TLS certificate verification.
* One with TLS verification between HAProxy and the Kubernetes API (but not between the user and HAProxy).

Both of these examples assume that Marathon-LB (version 1.12.1 or later) is already properly installed and configured (following the Marathon-LB [installation instructions](/services/marathon-lb/)).

## Marathon-LB without TLS Certificate Verification

For example, if you have a default Marathon-LB instance, you can run a Marathon application with the following definition, and it will expose the Kubernetes API:

```json
{
  "id": "/marathon-lb-kubernetes-cluster",
  "instances": 1,
  "cpus": 0.001,
  "mem": 16,
  "cmd": "tail -F /dev/null",
  "container": {
    "type": "MESOS"
  },
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 0
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_MODE": "http",
    "HAPROXY_0_PORT": "6443",
    "HAPROXY_0_SSL_CERT": "/etc/ssl/cert.pem",
    "HAPROXY_0_BACKEND_SERVER_OPTIONS": "  timeout connect 10s\n  timeout client 86400s\n  timeout server 86400s\n  timeout tunnel 86400s\n  server kubernetescluster apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443 ssl verify none\n"
  }
}
```

If your Kubernetes cluster is called something different from `kubernetes-cluster`, then `apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443` should be modified to match the cluster's name.
For example, if your Kubernetes cluster is called `dev/kubernetes01`, then you must replace

```text
apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443
```

with

```text
apiserver.devkubernetes01.l4lb.thisdcos.directory:6443
```

Notice how the slash in `dev/kubernetes01` has been removed from the cluster's name to form the hostname.

This application could be added to DC/OS either through the DC/OS web interface, the Marathon API, or via the `dcos` command line with this (assuming the JSON is saved as the file `kubectl-proxy.json`)

```shell
dcos marathon app add kubectl-proxy.json
```

Here is how this works:

1. Marathon-LB identifies that the application `marathon-lb-kubernetes-cluster` has the `HAPROXY_GROUP` label set to `external` (change this if you're using a different `HAPROXY_GROUP` for your Marathon-LB configuration).
2. The `instances`, `cpus`, `mem`, `cmd`, and `container` fields create a dummy container that takes up minimal space and performs no operation.
3. The single port indicates that this application has one "port" (this information is used by Marathon-LB).
4. `"HAPROXY_0_MODE": "http"` indicates to Marathon-LB that the frontend and backend configuration for this particular service should be configured with `http`.
5. `"HAPROXY_0_PORT": "6443"` tells Marathon-LB to expose the service on port 6443 (rather than the randomly-generated service port, which is ignored).
6. `"HAPROXY_0_SSL_CERT": "/etc/ssl/cert.pem"` tells Marathon-LB to expose the service with the self-signed Marathon-LB certificate (which has **no CN**).
7. The last label `HAPROXY_0_BACKEND_SERVER_OPTIONS` indicates that Marathon-LB should forward traffic to the endpoint `apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443` rather than to the dummy application, and that the connection should be made using TLS without verification.
   Also, large timeout values are used so that calls such as `kubectl logs -f` and `kubectl exec -i -t` don't terminate abruptly after a short period.

## Marathon-LB with TLS Certificate Verification between HAProxy and the Kubernetes API

Alternatively, if you are using DC/OS Enterprise, you can modify the dummy application with this so that it will verify the connection between HAProxy and the target Kubernetes API; this will still have an invalid, self-signed certificate for external clients:

```json
{
  "id": "/marathon-lb-kubernetes-cluster",
  "instances": 1,
  "cpus": 0.001,
  "mem": 16,
  "cmd": "tail -F /dev/null",
  "container": {
    "type": "MESOS"
  },
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 0
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_MODE": "http",
    "HAPROXY_0_PORT": "6443",
    "HAPROXY_0_SSL_CERT": "/etc/ssl/cert.pem",
    "HAPROXY_0_BACKEND_SERVER_OPTIONS": "  timeout connect 10s\n  timeout client 86400s\n  timeout server 86400s\n  timeout tunnel 86400s\n  server kubernetescluster apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443 ssl verify required ca-file /mnt/mesos/sandbox/.ssl/ca-bundle.crt\n"  
  }
}
```

If your Kubernetes cluster is called something different from `kubernetes-cluster`, then `apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443` should be modified to match the cluster's name.
For example, if your Kubernetes cluster is called `dev/kubernetes01`, then you must replace

```text
apiserver.kubernetes-cluster.l4lb.thisdcos.directory:6443
```

with

```text
apiserver.devkubernetes01.l4lb.thisdcos.directory:6443
```

Notice how the slash in `dev/kubernetes01` has been removed from the cluster's name to form the hostname.

Again, this application could be added to DC/OS either through the DC/OS web interface, the Marathon API, or via the `dcos` command line with this (assuming the JSON is saved as the file `kubectl-proxy.json`)

```shell
dcos marathon app add kubectl-proxy.json
```

# Example 2: Creating an Edge-LB Pool

If, instead of using Marathon-LB, you are using Edge-LB in your DC/OS cluster, you can create an Edge-LB pool to expose the target Kubernetes API to clients.

This example does not validate certificates either between Kubernetes clients and HAProxy or between HAProxy and the Kubernetes API.
These validations are achievable but are outside the scope of this document.

```json
{
  "apiVersion": "V2",
  "name": "edgelb-kubernetes-cluster",
  "count": 1,
  "autoCertificate": true,
  "haproxy": {
    "frontends": [{
      "bindPort": 6443,
      "protocol": "HTTPS",
      "certificates": [
        "$AUTOCERT"
      ],
      "linkBackend": {
        "defaultBackend": "kubernetes-cluster"
      }
    }],
    "backends": [{
      "name": "kubernetes-cluster",
      "protocol": "HTTPS",
      "services": [{
        "mesos": {
          "frameworkName": "kubernetes-cluster",
          "taskNamePattern": "kube-control-plane"
        },
        "endpoint": {
          "portName": "apiserver"
        }
      }]
    }],
    "stats": {
      "bindPort": 6090
    }
  }
}
```

If your Kubernetes cluster is called something different from `kubernetes-cluster`, then the `frameworkName` should be modified to match the cluster's name.
For example, if your Kubernetes service is located at `dev/kubernetes01`, then replace `"frameworkName": "kubernetes-cluster"` with `"frameworkName": "dev/kubernetes01"`.

This example assumes that Edge-LB (version 1.0.3 or later) is already properly installed and configured (following the Edge-LB [installation instructions](/services/edge-lb/)):

1. Create a `edgelb-kubernetes-cluster-pool.json` file with the above contents.
1. Create the Edge-LB pool with the following command:

    ```shell
    dcos edgelb create edgelb-kubernetes-cluster-pool.json
    ```

This creates an Edge-LB pool with the following configuration:

* One (1) instance of HAProxy, running on a public DC/OS agent node.
* Exposes port 6443 with TLS and a self-signed certificate.
* Forwards connections on port 6443 to the Mesos task matching framework name `kubernetes-cluster` and task name matching regex `kube-control-plane`, on the port labeled `apiserver`.
* Listens on port 6090 for the HAProxy stats endpoint.
       Note that this will, by default, expose this port externally;
       if you do not want this exposed externally, you could add a `"bindAddress":"127.0.0.1"` within the `stats` block.
