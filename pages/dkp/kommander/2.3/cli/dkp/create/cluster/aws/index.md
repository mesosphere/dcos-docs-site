---
layout: layout.pug
navigationTitle:  dkp create cluster aws
title:  dkp create cluster aws
menuWeight: 10
excerpt: Create a Konvoy cluster in AWS
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create cluster aws

Create a Konvoy cluster in AWS

```
dkp create cluster aws [flags]
```

### Options

```
      --additional-security-group-ids strings       A comma separated list of existing security group IDs to use for machines in addition to those created automatically (default [])
      --additional-tags stringToString              Tags to apply to the provisioned infrastructure (default [])
      --allow-missing-template-keys                 If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
      --ami string                                  AMI ID to use for machines
      --ami-base-os string                          Base OS for Lookup search (ex. 'centos-7', 'ubuntu-18.04', 'ubuntu-20.04') (default "ubuntu-20.04")
      --ami-format string                           Lookup Format string to generate AMI search name from (default "capa-ami-{{.BaseOS}}-?{{.K8sVersion}}-*")
      --ami-owner string                            Owner ID for AMI Lookup search (default "258751437250")
      --aws-service-endpoints string                Custom AWS service endpoints in a semi-colon separated format: ${SigningRegion1}:${ServiceID1}=${URL},${ServiceID2}=${URL};${SigningRegion2}...
      --certificate-renew-interval int              The interval number of days Kubernetes managed PKI certificates are renewed. For example, an Interval value of 30 means the certificates will be refreshed every 30 days. A value of 0 disables the feature. (default 0)
  -c, --cluster-name name                           Name used to prefix the cluster and all the created resources.
      --control-plane-http-proxy string             HTTP proxy for control plane machines
      --control-plane-https-proxy string            HTTPS proxy for control plane machines
      --control-plane-iam-instance-profile string   Name of the IAM instance profile to assign to control plane machines. (default "control-plane.cluster-api-provider-aws.sigs.k8s.io")
      --control-plane-instance-type string          Control Plane machine instance type (default "m5.xlarge")
      --control-plane-no-proxy strings              No Proxy list for control plane machines (default [])
      --control-plane-replicas int                  Number of control plane replicas (default 3)
      --dry-run                                     Only print the objects that would be created, without creating them.
      --etcd-image-repository string                The image repository to use for pulling the etcd image
      --etcd-version string                         The version of etcd to use. Overriding kubeadm's default value as etcd v3.5.x is not recommended for production use. This default value will removed in a future release once etcd is fixed. (default "3.4.13-0")
      --extra-sans strings                          A comma separated list of additional Subject Alternative Names for the API Server signing cert (default [])
  -h, --help                                        help for aws
      --http-proxy string                           HTTP proxy for CAPI controllers
      --https-proxy string                          HTTPS proxy for CAPI controllers
      --internal-load-balancer                      Make the control plane load balancer internal, i.e., reachable only within the VPC.
      --kind-cluster-image string                   Kind node image for the bootstrap cluster (default "mesosphere/konvoy-bootstrap:v0.0.0-dev.0")
      --kubeconfig string                           Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-image-repository string          The image repository to use for pulling kubernetes images
      --kubernetes-version string                   Kubernetes version (default "1.24.4")
  -n, --namespace string                            If present, the namespace scope for this CLI request. (default "default")
      --no-proxy strings                            No Proxy list for CAPI controllers (default [])
  -o, --output string                               Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --region string                               AWS region to deploy cluster to (default "us-west-2")
      --registry-mirror-cacert file                 CA certificate chain to use while communicating with the registry mirror using TLS
      --registry-mirror-password string             Password to authenticate to the registry mirror with
      --registry-mirror-url string                  URL of a container registry to use as a mirror in the cluster
      --registry-mirror-username string             Username to authenticate to the registry mirror with
      --self-managed                                When set to true, the required prerequisites are created before creating the cluster and the resulting cluster has all necessary components deployed onto itself, so it can manage its own cluster lifecycle. When set to false, a management cluster is used.(default false)
      --show-managed-fields                         If true, keep the managedFields when printing objects in JSON or YAML format.
      --ssh-public-key-file string                  Path to the authorized SSH key for the user
      --ssh-username string                         Name of the user to create on the instance (default "konvoy")
      --subnet-ids strings                          A comma separated list of existing subnet IDs to use for the kube-apiserver ELB and all control-plane and worker nodes (default [])
      --template string                             Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
      --timeout duration                            The length of time to wait before giving up. Zero means wait forever. (default 10m0s)
      --vpc-id string                               Existing VPC ID to use for the cluster
      --wait                                        If true, wait for operations to complete before returning. (default true)
      --with-aws-bootstrap-credentials              Set true to use AWS bootstrap credentials from your environment. When false, the instance profile of the EC2 instance where the CAPA controller is scheduled on will be used instead.
      --with-gcp-bootstrap-credentials              Set true to use GCP bootstrap credentials from your environment. When false, the service account of the VM instance where the CAPG controller is scheduled on will be used instead.
      --worker-availability-zone string             The AvailabilityZone in the region to deploy the worker nodes to, if not set a random one will be selected (ex. us-west-2a)
      --worker-http-proxy string                    HTTP proxy for nodes
      --worker-https-proxy string                   HTTPS proxy for nodes
      --worker-iam-instance-profile string          Name of the IAM instance profile to assign to worker machines. (default "nodes.cluster-api-provider-aws.sigs.k8s.io")
      --worker-instance-type string                 Worker machine instance type (default "m5.2xlarge")
      --worker-no-proxy strings                     No Proxy list for nodes (default [])
      --worker-replicas int                         Number of workers (default 4)
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create cluster](/dkp/kommander/2.3/cli/dkp/create/cluster/)	 - Create a Kubernetes cluster, one of [aks, aws, azure, eks, gcp, preprovisioned, vsphere]

