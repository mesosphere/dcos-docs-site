---
layout: layout.pug
navigationTitle:  dkp create cluster eks
title:  dkp create cluster eks
menuWeight: 10
excerpt: Create a Konvoy cluster in EKS
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create cluster eks

Create a Konvoy cluster in EKS

```
dkp create cluster eks [flags]
```

### Options

```
      --additional-security-group-ids strings   A comma separated list of existing security group IDs to use for the worker nodes in addition to those created automatically
      --additional-tags stringToString          Tags to apply to the provisioned infrastructure
      --allow-missing-template-keys             If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
      --ami string                              AMI ID to use for worker nodes
      --ami-base-os string                      Base OS for Lookup search (ex. 'centos-7', 'ubuntu-18.04', 'ubuntu-20.04')
      --ami-format string                       Lookup Format string to generate AMI search name from
      --ami-owner string                        Owner ID for AMI Lookup search (ex. '258751437250')
      --aws-service-endpoints string            Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
  -c, --cluster-name name                       Name used to prefix the cluster and all the created resources.
      --dry-run                                 Only print the objects that would be created, without creating them.
      --etcd-image-repository string            The image repository to use for pulling the etcd image
      --etcd-version string                     The version of etcd to use
  -h, --help                                    help for eks
      --kind-cluster-image string               Kind node image for the bootstrap cluster
      --kind-cluster-name string                Kind cluster name for the bootstrap cluster
      --kubeconfig string                       Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-image-repository string      The image repository to use for pulling kubernetes images
      --kubernetes-version string               Kubernetes version
      --management-plane-http-proxy string      HTTP proxy for management plane
      --management-plane-https-proxy string     HTTPS proxy for management plane
      --management-plane-no-proxy strings       No Proxy list for management plane
  -n, --namespace string                        If present, the namespace scope for this CLI request.
  -o, --output string                           Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --region string                           AWS region to deploy cluster to
      --show-managed-fields                     If true, keep the managedFields when printing objects in JSON or YAML format.
      --subnet-ids strings                      A comma separated list of existing subnet IDs to use for the kube-apiserver ELB and all control-plane and worker nodes
      --template string                         Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --timeout duration                        The length of time to wait before giving up. Zero means wait forever.
      --vpc-id string                           Existing VPC ID to use for the cluster
      --wait                                    If true, wait for operations to complete before returning.
      --with-aws-bootstrap-credentials          Set false to skip deploying AWS bootstrap credentials from your environment. The instance profiles of the node where the CAPA controller is scheduled on will be used instead.
      --worker-iam-instance-profile string      Name of the IAM instance profile to assign to worker machines.
      --worker-instance-type string             Worker machine instance type (ex. 't3.large')
      --worker-replicas int                     Number of workers
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create cluster](/dkp/kommander/2.2/cli/dkp/create/cluster/)	 - Create a Kubernetes cluster, one of [aks, aws, azure, eks, preprovisioned, vsphere]

