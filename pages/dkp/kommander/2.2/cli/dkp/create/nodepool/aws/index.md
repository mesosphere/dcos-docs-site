---
layout: layout.pug
navigationTitle:  dkp create nodepool aws
title:  dkp create nodepool aws
menuWeight: 10
excerpt: Create a nodepool in AWS
notes: Automatically generated, DO NOT EDIT
enterprise: false
beta: false
---
<!-- vale off -->
<!-- markdownlint-disable -->

## dkp create nodepool aws

Create a nodepool in AWS

```
dkp create nodepool aws [flags]
```

### Options

```
      --additional-security-group-ids strings   A comma separated list of existing security group IDs to use for the nodes in addition to those created automatically (default [])
      --additional-tags stringToString          Tags to apply to the provisioned infrastructure (default [])
      --allow-missing-template-keys             If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats. (default true)
      --ami string                              AMI ID to use for nodepool nodes
      --ami-base-os string                      Base OS for Lookup search (ex. 'centos-7', 'ubuntu-18.04', 'ubuntu-20.04') (default "centos-7")
      --ami-format string                       Lookup Format string to generate AMI search name from (ex. 'capa-ami-{{.BaseOS}}-?{{.K8sVersion}}-*') (default "capa-ami-{{.BaseOS}}-?{{.K8sVersion}}-*")
      --ami-owner string                        Owner ID for AMI Lookup search (ex. '258751437250') (default "258751437250")
  -c, --cluster-name name                       Name used to prefix the cluster and all the created resources.
      --dry-run                                 Only print the objects that would be created, without creating them.
  -h, --help                                    help for aws
      --http-proxy string                       HTTP proxy for nodes
      --https-proxy string                      HTTPS proxy for nodes
      --iam-instance-profile string             Name of the IAM instance profile to assign to the machines. (default "nodes.cluster-api-provider-aws.sigs.k8s.io")
      --instance-type string                    Machine instance type (ex. 't3.large') (default "m5.2xlarge")
      --kubeconfig string                       Path to the kubeconfig for the management cluster. If unspecified, default discovery rules apply.
      --kubernetes-version string               Kubernetes version (default "1.21.6")
  -n, --namespace string                        If present, the namespace scope for this CLI request. (default "default")
      --no-proxy strings                        No Proxy list for nodes (default [])
  -o, --output string                           Output format. One of: json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
      --registry-mirror-cacert file             CA certificate chain to use while communicating with the registry mirror using TLS
      --registry-mirror-password string         Password to authenticate to the registry mirror with
      --registry-mirror-url string              URL of a container registry to use as a mirror in the cluster
      --registry-mirror-username string         Username to authenticate to the registry mirror with
      --replicas int                            Number of replicas (default 1)
      --show-managed-fields                     If true, keep the managedFields when printing objects in JSON or YAML format.
      --ssh-public-key-file string              Path to the authorized SSH key for the user
      --ssh-username string                     Name of the user to create on the instance (default "konvoy")
      --template string                         Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
```

### Options inherited from parent commands

```
  -v, --verbose int   Output verbosity
```

### SEE ALSO

* [dkp create nodepool](/dkp/kommander/2.2/cli/dkp/create/nodepool/)	 - Create a nodepool, one of [aks, aws, azure]

