---
layout: layout.pug
navigationTitle: Install on AWS
title: Install on AWS
menuWeight: 20
excerpt: Prepare for and install Konvoy on AWS
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section guides you through the basic steps to prepare your environment and install Konvoy on AWS.

## Prerequisites

* The [aws][install_aws] command line utility
* [Docker Desktop][install_docker] _version 18.09.2 or newer_
* [kubectl][install_kubectl] _v1.16.4 or newer_ (for interacting with the running cluster)
* A valid AWS account with [credentials configured][aws_credentials].
  You must be authorized to create the following resources in the AWS account:
  * EC2 Instances
  * VPC
  * VPC Endpoints
  * Subnets
  * Elastic Load Balancer (ELB)
  * Internet Gateway
  * NAT Gateway
  * Elastic Block Storage (EBS) Volumes
  * Security Groups
  * Route Tables
  * IAM Roles

Below is the minimal IAM policy required:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Konvoy",
            "Effect": "Allow",
            "Action": [
                "ec2:AttachInternetGateway",
                "ec2:AttachVolume",
                "ec2:AuthorizeSecurityGroupEgress",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateInternetGateway",
                "ec2:CreateRoute",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSubnet",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:CreateVpc",
                "ec2:CreateVpcEndpoint",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteKeyPair",
                "ec2:DeleteRoute",
                "ec2:DeleteTags",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSubnet",
                "ec2:DeleteVolume",
                "ec2:DeleteVpc",
                "ec2:DeleteVpcEndpoint",
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeImages",
                "ec2:DescribeInstanceAttribute",
                "ec2:DescribeInstanceCreditSpecifications",
                "ec2:DescribeInstances",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeKeyPairs",
                "ec2:DescribeNetworkAcls",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribePrefixLists",
                "ec2:DescribeRouteTables",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeTags",
                "ec2:DescribeVolumes",
                "ec2:DescribeVpcAttribute",
                "ec2:DescribeVpcClassicLink",
                "ec2:DescribeVpcClassicLinkDnsSupport",
                "ec2:DescribeVpcs",
                "ec2:DetachInternetGateway",
                "ec2:DetachNetworkInterface",
                "ec2:DetachVolume",
                "ec2:ImportKeyPair",
                "ec2:ModifyInstanceAttribute",
                "ec2:ModifySubnetAttribute",
                "ec2:ModifyVpcAttribute",
                "ec2:RevokeSecurityGroupEgress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:RunInstances",
                "ec2:TerminateInstances",
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
                "elasticloadbalancing:AttachLoadBalancerToSubnets",
                "elasticloadbalancing:ConfigureHealthCheck",
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateLoadBalancerListeners",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeTags",
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                "iam:AddRoleToInstanceProfile",
                "iam:CreateInstanceProfile",
                "iam:CreateRole",
                "iam:DeleteInstanceProfile",
                "iam:DeleteRole",
                "iam:DeleteRolePolicy",
                "iam:GetInstanceProfile",
                "iam:GetRole",
                "iam:GetRolePolicy",
                "iam:ListInstanceProfilesForRole",
                "iam:PassRole",
                "iam:PutRolePolicy",
                "iam:RemoveRoleFromInstanceProfile",
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

## Installation

After verifying your prerequisites, you can create an AWS Kubernetes cluster by running `konvoy up`.
This command creates your [Amazon EC2][ec2] instances, installs Kubernetes, and installs default addons to support your Kubernetes cluster.

Specifically, the `konvoy up` command does the following:

* Provisions three `m5.xlarge` EC2 instances as Kubernetes master nodes
* Provisions four `m5.2xlarge` EC2 instances as Kubernetes worker nodes
* Deploys all of the following default addons:
  * Calico
  * CoreDNS
  * Helm
  * AWS EBS CSI driver
  * Elasticsearch (including Elasticsearch Exporter)
  * Fluent Bit
  * Kibana
  * Prometheus operator (including Grafana, AlertManager and Prometheus Adapter)
  * Traefik
  * Kubernetes dashboard
  * Operations portal
  * Velero
  * Dex identity service
  * Dex Kubernetes client authenticator
  * Traefik forward authorization proxy
  * Kommander

The default configuration options are recommended for a small cluster (about 10 worker nodes).

## Modifying the cluster name

By default, the cluster name is the name of the folder where your run the `konvoy` command.
The cluster name will be used to tag the provisioned infrastructure and the context when applying the kubeconfig file.
To customize the cluster name, run the following command:

```bash
konvoy up --cluster-name <YOUR_SPECIFIED_NAME>
```

**NOTE:** The cluster name may only contain the following characters: `a-z, 0-9, . - and _`.

## Show planned infrastructure changes

Before running `konvoy up` or `konvoy provision` it is also possible to show the calculated changes that would be performed on the infrastructure by [Terraform][terraform].

Running the following command should result in a similar output:

```text
$ konvoy provision --plan-only
...
Plan: 41 to add, 0 to change, 0 to destroy.
```  

**NOTE:** This command can be run before the initial provisionioning or at any point after modifications are made to the `cluster.yaml` file.

## Control plane and worker nodes

Control plane nodes are the nodes where the Kubernetes Control Plane components will be installed.
The Control Plane contains [various components][control_plane], including `etcd`, `kube-apiserver` (that [you will interact with through `kubectl`][kubectl]), `kube-scheduler` and `kube-controller-manager`. Please also refer to the [Concepts section][concepts].
Having three control plane nodes makes the cluster "highly available" to protect against failures.
Worker nodes run your containers in [Kubernetes pods][pods].

## Default addons

The default addons help you manage your Kubernetes cluster by providing monitoring (Prometheus), logging (Elasticsearch), dashboards (Kubernetes Dashboard), storage (AWS CSI Driver), ingress (Traefik) and other services.

## Viewing installation operations

As noted above, you start the cluster installation by running the `konvoy up` command.
As the `konvoy up` command runs, you will see output about the operations performed.
The first set of messages you see is the output generated by [Terraform][terraform] as it provisions your nodes.

After the nodes are provisioned, [Ansible][ansible] connects to the EC2 instances and installs Kubernetes in steps called tasks and playbooks.
Near the end of the output, addons are installed.

## Viewing cluster operations

You can access user interfaces to monitor your cluster through the [Operations Portal][ops_portal].
After you run the `konvoy up` command, if the installation is successful, the command output displays the information you need to access the Operations Portal.

For example, you should see information similar to this:

```text
Kubernetes cluster and addons deployed successfully!

Run `konvoy apply kubeconfig` to update kubectl credentials.

Navigate to the URL below to access various services running in the cluster.
  https://lb_addr-12345.us-west-2.elb.amazonaws.com/ops/landing
And login using the credentials below.
  Username: AUTO_GENERATED_USERNAME
  Password: SOME_AUTO_GENERATED_PASSWORD_12345

The dashboard and services may take a few minutes to be accessible.
```

## Checking the files installed

When the `konvoy up` completes its setup operations, the following files are generated:

* `cluster.yaml` - defines the Konvoy configuration for the cluster, where you customize [your cluster configuration][cluster_configuration].
* `admin.conf` - is a [kubeconfig file][kubeconfig], which contains credentials to [connect to the `kube-apiserver` of your cluster through `kubectl`][kubectl].
* `inventory.yaml` - is an [Ansible Inventory file][inventory].
* `state` folder - contains Terraform files, including a [state file][state].
* `cluster-name-ssh.pem`/`cluster-name-ssh.pub` - stores the SSH keys used to connect to the EC2 instances.
* `runs` folder - which contains logging information.

[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[install_aws]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[prerequisites]: #prerequisites
[cluster_configuration]: ../../reference/cluster-configuration
[kubectl]: ../../operations/accessing-the-cluster#using-kubectl
[ops_portal]: ../../operations/accessing-the-cluster#using-the-operations-portal
[ec2]: https://aws.amazon.com/ec2/
[control_plane]: https://kubernetes.io/docs/concepts/overview/components/
[pods]: https://kubernetes.io/docs/concepts/workloads/pods/pod/
[terraform]: https://www.terraform.io
[ansible]: https://www.ansible.com
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[state]: https://www.terraform.io/docs/state/
[concepts]: ../../concepts
