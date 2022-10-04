---
layout: layout.pug
navigationTitle:  dkp create nodepool vsphere
title:  dkp create nodepool vsphere
menuWeight: 10
excerpt: Create a nodepool in vSphere
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create nodepool vsphere

Create a nodepool in vSphere

```
dkp create nodepool vsphere name [flags]
```

### Options

```
      --additional-tags stringToString    Tags to apply to the provisioned infrastructure (default [])
      --allow-missing-template-keys       If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
  -c, --cluster-name name                 Name used to prefix the cluster and all the created resources.
      --cpus int                          The number of virtual processors in a worker machine (default 8)
      --data-center string                The vSphere datacenter to deploy the workload cluster on.
      --data-store string                 The vSphere datastore to deploy the workload cluster on.
      --disk-size int                     The size of a worker machine's disk, in GB (default 80)
      --dry-run                           Only print the objects that would be created, without creating them.
      --folder string                     The vSphere folder for your VMs. Set to "" to use the root vSphere folder.
  -h, --help                              help for vsphere
      --http-proxy string                 HTTP proxy for nodes
      --https-proxy string                HTTPS proxy for nodes
      --kubeconfig string                 Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-version string         Kubernetes version (default "1.24.4")
      --memory int                        The size of a worker machine's memory, in GB (default 32)
  -n, --namespace string                  If present, the namespace scope for this CLI request. (default "default")
      --network string                    The vSphere network to deploy the workload cluster on.
      --no-proxy strings                  No Proxy list for nodes (default [])
  -o, --output string                     Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --registry-mirror-cacert file       CA certificate chain to use while communicating with the registry mirror using TLS
      --registry-mirror-password string   Password to authenticate to the registry mirror with
      --registry-mirror-url string        URL of a container registry to use as a mirror in the cluster
      --registry-mirror-username string   Username to authenticate to the registry mirror with
      --replicas int                      Number of replicas (default 1)
      --resource-pool string              The vSphere resource pool for the workload cluster's virtual machines.
      --server string                     The vCenter server IP or FQDN.
      --show-managed-fields               If true, keep the managedFields when printing objects in JSON or YAML format.
      --ssh-public-key-file string        Path to the authorized SSH key for the user
      --ssh-username string               Name of the user to create on the instance (default "konvoy")
      --storage-policy string             This is the vSphere storage policy. Set it to "" if you don't want to use a storage policy.
      --template string                   Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --timeout duration                  The length of time to wait before giving up. Zero means wait forever (e.g. 1s, 2m, 3h). (default 30m0s)
      --tls-thumb-print string            sha1 thumbprint of the vcenter certificate: openssl x509 -sha1 -fingerprint -in ca.crt -noout
      --vm-template string                The virtual machine template to use for the workload cluster's virtual machines.
      --wait                              If true, wait for operations to complete before returning.
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create nodepool](/dkp/kommander/2.3/cli/dkp/create/nodepool/)	 - Create a nodepool, one of [aks, aws, azure, eks, gcp, preprovisioned, vsphere]

