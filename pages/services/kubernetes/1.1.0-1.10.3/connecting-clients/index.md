---
layout: layout.pug
navigationTitle: Connecting Clients
title: Connecting Clients
menuWeight: 70
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Connecting Clients

DC/OS Kubernetes doesn't automatically expose the Kubernetes API outside of the
DC/OS cluster. Hence, in order to access the Kubernetes API from outside the
DC/OS cluster, the user needs to setup a proxy that can reach the DC/OS VIP
exposing the Kubernetes API inside the DC/OS cluster.

This VIP is `apiserver.<SERVICE_NAME>.l4lb.thisdcos.directory:6443`, where
`<SERVICE_NAME>` is the service name the user has provided when installing the
package. By default the `<SERVICE_NAME>` is `kubernetes`, so, by default, the
VIP is `apiserver.kubernetes.l4lb.thisdcos.directory:6443`.

Below, we detail how the user can use Marathon and HAProxy to expose the
Kubernetes API to the outside world, through a public DC/OS agent.

## Using Marathon and HAProxy to expose the Kubernetes API to the outside world

Let's start with the HAProxy configuration:

```
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

    # Set appropriate values for timeouts. Setting 'timeout tunnel' to a small
    # value is important to prevent misbehaving clients from hanging forever
    # when, for example, making 'exec' requests.
    timeout connect 5s
    timeout client 15m
    timeout server 15m
    timeout tunnel 5s

frontend frontend_all
    bind :6443 ssl crt /path/to/cert-and-key.pem
    mode http

    # Inspect the SNI field from incoming TLS connections so we can route to the
    # appropriate backend based on the server name.
    use_backend backend_kube_apiserver if { ssl_fc_sni kube-apiserver.example.com }

backend backend_kube_apiserver
    mode http
    balance leastconn
    server kube-apiserver apiserver.kubernetes.l4lb.thisdcos.directory:6443 check ssl verify required ca-file /path/to/kube-apiserver-ca-crt.pem
```

There are a few things worth noticing in the above configuration:

* This configuration exposes a single frontend that accepts HTTPS requests at
  port `6443` of the agent it is running on.
* HAProxy will terminate TLS using the certificate and private key provided in
  `/path/to/cert-and-key.pem`.
* The `kube-apiserver.example.com` hostname must resolve to the DC/OS agent
  where the proxy is deployed.
* `/path/to/cert-and-key.pem` must contain a TLS certificate and private key
  that are valid for serving `kube-apiserver.example.com`.
* HTTPS requests made to `kube-apiserver.example.com` will be proxied to the
  `apiserver.kubernetes.l4lb.thisdcos.directory:6443` VIP. The user is to make
  sure that the service name provided when installing the package is reflected
  in the VIP, as pointed out above.
* `/path/to/kube-apiserver-ca-crt.pem` must contain the necessary root and
  intermediate certificates to validate the certificate presented by the
  Kubernetes API.

The path to the configuration detailed above, as well all the paths described in it, e.g. `/path/to/cert-and-key.pem` must be available in the DC/OS agent
filesystem. Otherwise, the HAProxy setup described here will fail.

Moving on, let's launch HAProxy as a Marathon application:

```json
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
        "hostPath": "/path/to/my/haproxy/config/folder",
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
```

Please, adapt `/path/to/my/haproxy/config/folder` above accordingly.

Now, save the contents of the application descriptor and run the Marathon application:

```
$ dcos marathon app add </path/to/marathon/app/descriptor>
```

When HAProxy is deployed, the user should be able see the following:

```
# dcos task
NAME                HOST        USER    STATE  ID                                                       MESOS ID                                 REGION    ZONE
(...)
kubernetes-haproxy  10.138.0.7  root    R      kubernetes-haproxy.beaca041-5e7c-11e8-8c11-ce5fc4b24b83  cc965893-270f-4809-9617-e190904dae27-S0  us-west1  us-west1-b
```

```
# curl -k https://kube-apiserver.example.com:6443
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

And that's it!

## Configuring `kubectl`

The user should ensure that [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) is installed and
available to their terminal session.

If the user has installed the Kubernetes package through the DC/OS UI, then the
user needs to install the `dcos kubernetes` command:

```
dcos package install kubernetes --cli
```

The user should ensure that `dcos` is adequately configured to access the
desired DC/OS cluster, before running:

```
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca /path/to/ca.pem
```

where `/path/to/ca.pem` is the path to the CA certificate that validates
the TLS certificate served by `https://kube-apiserver.example.com:6443`.

If the user is not concerned about validating the presented TLS certificate, the
user can alternatively specify the `--insecure-skip-tls-verify` flag:

```
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --insecure-skip-tls-verify
```

From this point on, any `kubectl` calls, should simply work, depending on the
Kubernetes API authorization mode configured, and the permissions given to the
user's Kubernetes service account.

## Managing multiple clusters

As this is written, DC/OS Kubernetes supports only one Kubernetes cluster
deployment. However, users may want to use multiple Kubernetes clusters, say
clusters running on other Kubernetes providers.

`kubectl` supports multiple contexts that the user can then switch to as
desired.

To create the DC/OS Kubernetes config without switching the context, run:

```bash
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca /path/to/ca.pem \
    --no-activate-context
kubeconfig context 'kube-apiserver-example-com6443' created successfully
```

Whenever the user wants to switch to the DC/OS Kubernetes cluster context,
the user is to run:

```bash
$ kubectl config use-context kube-apiserver-example-com6443
Switched to context "kube-apiserver-example-com6443".
```

Or specify the context when running commands:

```bash
$ kubectl get nodes --context=kube-apiserver-example-com6443
NAME                                   STATUS    AGE        VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     10m        v1.10.3
```

By default, the kubeconfig context name is derived from the value of the
`--apiserver-url` flag. To make the context name easier to remember and switch
between, you can specify a name by using the `--context-name` flag:

```bash
$ dcos kubernetes kubeconfig \
    --apiserver-url https://kube-apiserver.example.com:6443 \
    --path-to-custom-ca /path/to/ca.pem \
    --context-name=my-context
```
