---
layout: layout.pug
navigationTitle: Exposing the Kubernetes API
title: Exposing the Kubernetes API
menuWeight: 70
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


## Exposing the Kubernetes API

DC/OS Kubernetes doesn't automatically expose the Kubernetes API outside of the
DC/OS cluster. Hence, in order to access the Kubernetes API from outside the
DC/OS cluster, the user needs to setup a proxy that can reach the DC/OS VIP
exposing the Kubernetes API inside the DC/OS cluster.

This VIP is `apiserver.<SERVICE_NAME>.l4lb.thisdcos.directory:6443`, where
`<SERVICE_NAME>` is the service name the user has provided when installing the
package. By default the `<SERVICE_NAME>` is `kubernetes`, so, by default, the
VIP is `apiserver.kubernetes.l4lb.thisdcos.directory:6443`.

In the next sections we present two examples a user can follow in order to
expose the Kubernetes API to outside the DC/OS cluster. The first example
provides a way for quickly trying out DC/OS Kubernetes without being concerned
about establishing trust. The second example expands on the first in order to
build a fully-secured setup.

Alternately, if you are running Marathon-LB and/or Edge-LB in your DC/OS cluster, you may be able to expose the Kubernetes API via one of them.  Details to do this are on documented [here](../exposing-the-kubernetes-api-marathonlb).

In order for a user to follow the examples successfully, their DC/OS cluster
**MUST** have at least one
[public agent](/1.11/overview/architecture/node-types/#public-agent-nodes)
(i.e. an agent that is on a network that allows ingress from outside the
cluster). In the examples, `<ip-of-public-agent>` represents the IP address at
which this public agent can be reached. The user  **MUST** also have access to
this DC/OS public agent over SSH from their workstation. In the end, the user
will end up with a setup similar to the following:

![Exposing the Kubernetes API using HAProxy](/services/kubernetes/1.2.2-1.10.7/img/haproxy.png "Exposing the Kubernetes API using HAProxy")

<a name="example-1"></a>
## Example 1: Using HAProxy and a self-signed certificate

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>This example is meant to provide a quick and easy way to expose the
Kubernetes API to outside the DC/OS cluster that works out-of-the-box. It is not
meant to be a fully-secure solution for the problem of exposing the Kubernetes
API and <b>MUST NOT</b> be taken to production.</p>
</div>

This example focuses on exposing the Kubernetes API to outside the DC/OS cluster
using HAProxy as an intermediate proxy and a self-signed wildcard certificate
meant to secure the communication between the user and HAProxy.

### Step 1: Creating a self-signed wildcard certificate

In order for HAProxy to secure connections between itself and the user, it must
be given a TLS certificate and private key. Since this example is meant only for
exposing the Kubernetes API without any additional security concerns, a
self-signed wildcard certificate will be generated and used. In order to achieve
this, the user can use `openssl`:

```
# openssl genrsa 2048 > haproxy-key.pem
# openssl req -new -x509 -nodes -sha1 -days 3650 -key haproxy-key.pem \
    -subj "/C=US/ST=CA/L=SF/O=Mesosphere/OU=dcos-kubernetes/CN=*" > haproxy-crt.pem
# cat haproxy-crt.pem haproxy-key.pem > haproxy.pem
```

Running these commands will create an `haproxy.pem` file in the user's current
directory which will be needed later on.

### Step 2: Creating the HAProxy configuration

The user may now run the following command (replacing the `<SERVICE_NAME>`
placeholder as appropriate) in order to create a working HAProxy configuration:

```
# cat <<EOF > haproxy.conf
global
    log 127.0.0.1 local0
    # Sets the maximum size of the Diffie-Hellman parameters used for generating
    # the ephemeral/temporary Diffie-Hellman key in case of DHE key exchange.
    tune.ssl.default-dh-param 2048
    # Enables debug mode which dumps to stdout all exchanges.
    # This should be disabled in production, as tokens will also be logged.
    debug

defaults
    log global
    mode http
    option httplog
    option dontlognull
    # Set appropriate values for timeouts. This is important so that calls such
    # as "kubectl exec" or "kubectl logs -f" do not exit prematurely due to
    # inactivity in the connection.
    timeout connect 10s
    timeout client 86400s
    timeout server 86400s
    timeout tunnel 86400s

frontend frontend_all
    bind :6443 ssl crt /haproxy/haproxy.pem
    mode http
    default_backend backend_kube_apiserver

backend backend_kube_apiserver
    mode http
    balance leastconn
    server kube-apiserver apiserver.<SERVICE_NAME>.l4lb.thisdcos.directory:6443 check ssl verify none
EOF
```

Running this command will create an `haproxy.conf` file in the user's current
directory which will be needed later on.

### Step 3: Copying the certificate and the HAProxy configuration to the public agent

HAProxy will read it's configuration and the required TLS material from a
directory on the DC/OS public agent's filesystem. This can be any directory that
the HAProxy process can later access (represented as
`<path-to-haproxy-config-directory>` in the steps below). To copy the
required TLS material over SSH to the DC/OS public agent, the user may run the
following commands (replacing the placeholders as appropriate):

```
# ssh <user>@<ip-of-public-agent> \
    mkdir <path-to-haproxy-config-directory>
# scp haproxy.pem \
    haproxy.conf \
    <user>@<ip-of-public-agent>:<path-to-haproxy-config-directory>
haproxy.pem     100%    2985    16.9KB/s    00:00
haproxy.conf    100%    1041     5.9KB/s    00:00
```

### Step 4: Running HAProxy

In this step, HAProxy is configured to run as a Marathon application on the
DC/OS public agent. In order to do so, the following commands may be used (replacing `<path-to-haproxy-config-directory>` as appropriate):

```
# cat <<EOF > marathon.json
{
  "id": "/kubernetes-haproxy",
  "acceptedResourceRoles": [
    "slave_public"
  ],
  "cmd": "/usr/local/sbin/haproxy -f /haproxy/haproxy.conf",
  "constraints": [
    [
      "hostname",
      "UNIQUE"
    ]
  ],
  "container": {
    "type": "MESOS",
    "volumes": [
      {
        "containerPath": "/haproxy",
        "hostPath": "<path-to-haproxy-config-directory>",
        "mode": "RO"
      }
    ],
    "docker": {
      "image": "haproxy:1.7",
      "forcePullImage": false,
      "parameters": []
    }
  },
  "cpus": 0.1,
  "instances": 1,
  "mem": 128,
  "networks": [
    {
      "mode": "host"
    }
  ],
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 6443
    }
  ],
  "requirePorts": true
}
EOF
```

```
# dcos marathon app add marathon.json
```

When HAProxy is deployed, the user should be able see the following:

```
# dcos task
NAME                HOST        USER    STATE  ID                                                       MESOS ID                                 REGION    ZONE
(...)
kubernetes-haproxy  10.138.0.7  root    R      kubernetes-haproxy.beaca041-5e7c-11e8-8c11-ce5fc4b24b83  cc965893-270f-4809-9617-e190904dae27-S0  us-west1  us-west1-b
```

Also at this point, it should be possible to reach the Kubernetes API:

```
# curl -k https://<ip-of-public-agent>:6443
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {

  },
  "status": "Failure",
  "message": "forbidden: User \"system:anonymous\" cannot get path \"/\"",
  "reason": "Forbidden",
  "details": {

  },
  "code": 403
}
```

To configure `kubectl` in order to access the Kubernetes API using this setup,
the user should now follow the steps described in the "Without TLS
verification" subsection of the [Connecting Clients](../connecting-clients)
page.

## Example 2: Using HAProxy and establishing trust

The solution presented in [Example 1](#example-1) has a few shortcomings:

1. The certificate presented by the Kubernetes API to HAProxy is not validated.
1. The certificate presented by HAProxy to the user is too broad (and also not
   validated).
1. It is also assumed that the Kubernetes API will be accessed at the
   DC/OS public agent's IP address.
1. It is assumed that HAProxy will route _all_ incoming traffic to the
   Kubernetes API VIP.

In a production scenario the user will likely want to address all these
shortcomings, both in order to increase the overall security of the solution,
and to be able to expose multiple services/endpoints using the same HAProxy
instance. This example builds on the previous one and focuses on addressing all
these shortcomings.

### Step 1: Validating the Kubernetes API certificate

In order for HAProxy to fully secure connections between itself and the
Kubernetes API, it must be told how to trust the TLS certificate presented by
the Kubernetes API. This is done by letting HAProxy know that the certificate
authority that signs the mentioned certificate is thrustworthy. In order to do
this, the user must get hold of the mentioned certificate authority:

```
# dcos task exec kube-apiserver-0-instance cat ca-crt.pem > dcos-kubernetes-ca.pem
```

Running this command will create a `dcos-kubernetes-ca.pem` file in the user's
current directory which must now be copied to the
`<path-to-haproxy-config-directory>` directory in the DC/OS public agent.
The user must also update the HAProxy configuration according to the following
example and copy the updated configuration to the DC/OS public agent:

```
backend backend_kube_apiserver
    (...)
    server kube-apiserver apiserver.<SERVICE_NAME>.l4lb.thisdcos.directory:6443 check ssl verify required ca-file /haproxy/dcos-kubernetes-ca.pem
```

### Step 2: Validating the HAProxy certificate

In [Example 1](#example-1) a self-signed, wildcard certificate was used. In a
production scenario, the user will want to use a valid certificate signed by a
well-known, trusted certificate authority. They will also want to access the
Kubernetes API using a domain name such as `kube-apiserver.example.com` rather
than an IP address. As such, in order to complete this step the user must make
sure that...

* they have a certificate (and matching private key) valid for the
  `kube-apiserver.example.com` domain;
* DNS at `example.com` is configured in such a way that
  `kube-apiserver.example.com` resolves to the IP address(es) of the DC/OS
  agent(s) where HAProxy will be running;
* they optionally have the certificate(s) of the certificate authority that
  signed the abovementioned certificate (in case it is not already trusted by
  the operating system);

How these three items are addressed is highly dependent on the user's setup. As
such, for the remaining of this example it is assumed that these items have
been addressed.

Once the user is in possession of the certificate and private key for the domain
that is going to be used (in this case, `kube-apiserver.example.com`), they
must replace the `haproxy.pem` file created in [Example 1](#example-1) with a
new file containing **BOTH** the new certificate and private key (in this
particular order), and copy that file over SSH to the DC/OS agent. They must
also copy the file containing the certificate(s) of the certificate authority as
`ca.pem` over SSH to the DC/OS agent. Finally, they must update the HAProxy
configuration according to the following example:

```
frontend frontend_all
    # /haproxy/haproxy.pem contains the certificate and key for kube-apiserver.example.com
    # /haproxy/ca.pem contains the certificate(s) of the certificate authority that signed
    # haproxy.pem. This is only required if the CA is not already trusted by the operating
    # system.
    bind :6443 ssl crt /haproxy/haproxy.pem ca-file /haproxy/ca.pem
    (...)
```

At this point, the user should follow the steps described in the "With TLS
verification" subsection of the [Connecting Clients](../connecting-clients)
page.

### Step 3: Serving multiple services/endpoints using HAProxy

As mentioned above, the user may want to expose other services or endpoints
using the same HAProxy instance that is being deployed. In order to achieve that
the user may use
[Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication).
Then, when receiving a request, HAProxy will decide what backend to use based on
the domain name being requested.

To forward requests to `kube-apiserver.example.com` to the Kubernetes API VIP
being used thus far, the user must update the HAProxy configuration according to
the following example:

```
frontend frontend_all
    (...)
    # Inspect the SNI field from incoming TLS connections so we can forward to
    # the appropriate backend based on the server name.
    use_backend backend_kube_apiserver if { ssl_fc_sni kube-apiserver.example.com }

```

Additional forwarding rules can be setup for other domains as required. For
further information, the user should refer to the
[HAProxy documentation](https://cbonte.github.io/haproxy-dconv/1.7/configuration.html).
