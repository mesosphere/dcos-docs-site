---
layout: layout.pug
navigationTitle:  dkp create cluster preprovisioned
title:  dkp create cluster preprovisioned
menuWeight: 10
excerpt: Create a Konvoy cluster on pre-provisioned infrastructure
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create cluster preprovisioned

Create a Konvoy cluster on pre-provisioned infrastructure

```
dkp create cluster preprovisioned [flags]
```

### Options

```
      --additional-tags stringToString          Tags to apply to the provisioned infrastructure
      --allow-missing-template-keys             If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
      --aws-service-endpoints string            Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
      --certificate-renew-interval int          The interval number of days Kubernetes managed PKI certificates are renewed. For example, an Interval value of 30 means the certificates will be refreshed every 30 days. A value of 0 disables the feature. (default 0)
  -c, --cluster-name name                       Name used to prefix the cluster and all the created resources.
      --control-plane-endpoint-host string      The control plane endpoint address. To use an external load balancer, set to its IP or hostname. To use the built-in virtual IP, set to a static IPv4 address in the Layer 2 network of the control plane machines. [Not for production use: To use a single-machine control plane, set to the IP or hostname of the machine.]
      --control-plane-endpoint-port int         The control plane endpoint port. To use an external load balancer, set to its listening port.
      --control-plane-http-proxy string         HTTP proxy for control plane machines
      --control-plane-https-proxy string        HTTPS proxy for control plane machines
      --control-plane-no-proxy strings          No Proxy list for control plane machines
      --control-plane-replicas int              Number of control plane replicas
      --dry-run                                 Only print the objects that would be created, without creating them.
      --etcd-image-repository string            The image repository to use for pulling the etcd image
      --etcd-version string                     The version of etcd to use
      --extra-sans strings                      A comma separated list of additional Subject Alternative Names for the API Server signing cert
  -h, --help                                    help for preprovisioned
      --kind-cluster-image string               Kind node image for the bootstrap cluster
      --kind-cluster-name string                Kind cluster name for the bootstrap cluster
      --kubeconfig string                       Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-image-repository string      The image repository to use for pulling kubernetes images
      --kubernetes-version string               Kubernetes version
      --management-plane-http-proxy string      HTTP proxy for management plane
      --management-plane-https-proxy string     HTTPS proxy for management plane
      --management-plane-no-proxy strings       No Proxy list for management plane
  -n, --namespace string                        If present, the namespace scope for this CLI request.
      --os-hint flatcar                         A hint which will allow the installer to generate appropriate configurations for a target OS. Presently, only the hint for flatcar is supported.
  -o, --output string                           Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --override-secret-name string             Name of the secret for any provided overrides on a preprovisioned cluster.All overrides defined at provisioning should be present in this secret.
      --pre-provisioned-inventory-file string   Path to PreprovisionedInventory inventory file
      --registry-mirror-cacert file             CA certificate chain to use while communicating with the registry mirror using TLS
      --registry-mirror-password string         Password to authenticate to the registry mirror with
      --registry-mirror-url string              URL of a container registry to use as a mirror in the cluster
      --registry-mirror-username string         Username to authenticate to the registry mirror with
      --self-managed                            When set to true, the required prerequisites are created before creating the cluster and the resulting cluster has all necessary components deployed onto itself, so it can manage its own cluster lifecycle. When set to false, a management cluster is used.(default false)
      --show-managed-fields                     If true, keep the managedFields when printing objects in JSON or YAML format.
      --ssh-private-key-file string             Path to the private SSH key file used by Konvoy to access the pre-provisioned hosts
      --ssh-public-key-file string              Path to the authorized SSH key for the user
      --ssh-username string                     Name of the user to create on the instance
      --template string                         Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --timeout duration                        The length of time to wait before giving up. Zero means wait forever.
      --virtual-ip-interface string             The network interface, e.g, 'eth0' or 'ens5', to use for the built-in virtual IP control plane endpoint. This interface must be available on every control plane machine. If the value is empty, the flag does nothing. If the value is not empty, the built-in virtual IP control plane endpoint is created, using values from --control-plane-endpoint-host and --control-plane-endpoint-port.
      --wait                                    If true, wait for operations to complete before returning.
      --with-aws-bootstrap-credentials          Set false to skip deploying AWS bootstrap credentials from your environment. The instance profiles of the node where the CAPA controller is scheduled on will be used instead.
      --worker-http-proxy string                HTTP proxy for worker machines
      --worker-https-proxy string               HTTPS proxy for worker machines
      --worker-no-proxy strings                 No Proxy list for worker machines
      --worker-replicas int                     Number of workers
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create cluster](/dkp/kommander/2.2/cli/dkp/create/cluster/)	 - Create a Kubernetes cluster, one of [aks, aws, azure, eks, preprovisioned]
