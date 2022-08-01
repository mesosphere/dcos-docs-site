---
layout: layout.pug
navigationTitle:  dkp create cluster vsphere
title:  dkp create cluster vsphere
menuWeight: 10
excerpt: Create a Konvoy cluster in vSphere
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create cluster vsphere

Create a Konvoy cluster in vSphere

```
dkp create cluster vsphere [flags]
```

### Options

```
      --additional-tags stringToString       Tags to apply to the provisioned infrastructure (default [])
      --allow-missing-template-keys          If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
      --aws-service-endpoints string         Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
      --certificate-renew-interval int       The interval number of days Kubernetes managed PKI certificates are renewed. For example, an Interval value of 30 means the certificates will be refreshed every 30 days. A value of 0 disables the feature. (default 0)
  -c, --cluster-name name                    Name used to prefix the cluster and all the created resources.
      --control-plane-cpus int               The number of virtual processors in a control plane machine (default 4)
      --control-plane-disk-size int          The size of a control plane machine's disk, in GB (default 80)
      --control-plane-endpoint-host string   The control plane endpoint address. To use an external load balancer, set to its IP or hostname. To use the built-in virtual IP, set to a static IPv4 address in the Layer 2 network of the control plane machines. [Not for production use: To use a single-machine control plane, set to the IP or hostname of the machine.]
      --control-plane-endpoint-port int      The control plane endpoint port. To use an external load balancer, set to its listening port. (default 6443)
      --control-plane-http-proxy string      HTTP proxy for control plane machines
      --control-plane-https-proxy string     HTTPS proxy for control plane machines
      --control-plane-memory int             The size of a control plane machine's memory, in GB (default 16)
      --control-plane-no-proxy strings       No Proxy list for control plane machines (default [])
      --control-plane-replicas int           Number of control plane replicas (default 3)
      --data-center string                   The vSphere datacenter to deploy the workload cluster on.
      --data-store string                    The vSphere datastore to deploy the workload cluster on.
      --dry-run                              Only print the objects that would be created, without creating them.
      --etcd-image-repository string         The image repository to use for pulling the etcd image
      --etcd-version string                  The version of etcd to use. Overriding kubeadm's default value as etcd v3.5.x is not recommended for production use. This default value will removed in a future release once etcd is fixed. (default "3.4.13-0")
      --extra-sans strings                   A comma separated list of additional Subject Alternative Names for the API Server signing cert (default [])
      --folder string                        The vSphere folder for your VMs. Set to "" to use the root vSphere folder.
  -h, --help                                 help for vsphere
      --http-proxy string                    HTTP proxy for CAPI controllers
      --https-proxy string                   HTTPS proxy for CAPI controllers
      --kind-cluster-image string            Kind node image for the bootstrap cluster (default "mesosphere/konvoy-bootstrap:v0.0.0-dev.0")
      --kubeconfig string                    Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-image-repository string   The image repository to use for pulling kubernetes images
      --kubernetes-version string            Kubernetes version (default "1.23.7")
  -n, --namespace string                     If present, the namespace scope for this CLI request. (default "default")
      --network string                       The vSphere network to deploy the workload cluster on.
      --no-proxy strings                     No Proxy list for CAPI controllers (default [])
  -o, --output string                        Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --registry-mirror-cacert file          CA certificate chain to use while communicating with the registry mirror using TLS
      --registry-mirror-password string      Password to authenticate to the registry mirror with
      --registry-mirror-url string           URL of a container registry to use as a mirror in the cluster
      --registry-mirror-username string      Username to authenticate to the registry mirror with
      --resource-pool string                 The vSphere resource pool for the workload cluster's virtual machines.
      --self-managed                         When set to true, the required prerequisites are created before creating the cluster and the resulting cluster has all necessary components deployed onto itself, so it can manage its own cluster lifecycle. When set to false, a management cluster is used.(default false)
      --server string                        The vCenter server IP or FQDN.
      --show-managed-fields                  If true, keep the managedFields when printing objects in JSON or YAML format.
      --ssh-public-key-file string           Path to the authorized SSH key for the user
      --ssh-username string                  Name of the user to create on the instance (default "konvoy")
      --storage-policy string                This is the vSphere storage policy. Set it to "" if you don't want to use a storage policy.
      --template string                      Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --timeout duration                     The length of time to wait before giving up. Zero means wait forever. (default 10m0s)
      --tls-thumb-print string               sha1 thumbprint of the vcenter certificate: openssl x509 -sha1 -fingerprint -in ca.crt -noout
      --virtual-ip-interface string          The network interface, e.g, 'eth0' or 'ens5', to use for the built-in virtual IP control plane endpoint. This interface must be available on every control plane machine. If the value is empty, the flag does nothing. If the value is not empty, the built-in virtual IP control plane endpoint is created, using values from --control-plane-endpoint-host and --control-plane-endpoint-port.
      --vm-template string                   The virtual machine template to use for the workload cluster's virtual machines.
      --wait                                 If true, wait for operations to complete before returning. (default true)
      --with-aws-bootstrap-credentials       Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.
      --with-gcp-bootstrap-credentials       Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.
      --worker-cpus int                      The number of virtual processors in a worker machine (default 8)
      --worker-disk-size int                 The size of a worker machine's disk, in GB (default 80)
      --worker-http-proxy string             HTTP proxy for nodes
      --worker-https-proxy string            HTTPS proxy for nodes
      --worker-memory int                    The size of a worker machine's memory, in GB (default 32)
      --worker-no-proxy strings              No Proxy list for nodes (default [])
      --worker-replicas int                  Number of workers (default 4)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create cluster](/dkp/kommander/2.3/cli/dkp/create/cluster/)	 - Create a Kubernetes cluster, one of [aks, aws, azure, eks, gcp, preprovisioned, vsphere]

