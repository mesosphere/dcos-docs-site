---
layout: layout.pug
excerpt: Replaceable Masters on AWS using the Universal Installer
title: Replaceable masters on AWS using the Universal Installer
navigationTitle: AWS Replaceable Masters
menuWeight: 2
---

By default the Universal Installer uses a static master list to form the quorum needed by DC/OS. This adds some problems to dynamic cloud environments. The master IP addresses shouldn't change, and most cases this will not happen as long as you do not destroy or taint a master instance. But in a complete lifecycle of a DC/OS cluster you might face situations where you want to be able to recreate a master instance without deep manual interaction. This feature will enable you simply taint and reinstall a minority of your master nodes without any dataloss as long as the majority of the initial masters is still alive.

# Prerequisites
- Same as in [Guide for DC/OS on AWS using the Universal Installer](/1.13/installing/evaluation/aws/).
- The account you're using is able to create AWS buckets.

# Fully Managed Replaceable Masters

<p class="message--important"><strong>IMPORTANT:</strong> Do not apply this change on an already running cluster.</p>

With Universal Installer `0.2` we offer the ability of fully managed replaceable masters based on an AWS S3 Bucket. To enable this feature set `with_replaceable_masters=true`. Once set this option will lead to the creation of a S3 bucket in the location your cluster will be placed. The bucket name is `cluster_name` + a 16 Byte random hex string. As bucket names are global we have to attach a random string to your cluster name to avoid collisions. Beside creating a bucket we will inject these DC/OS config defaults.

```bash
dcos_s3_prefix                 = "exhibitor"
dcos_exhibitor_explicit_keys   = "false"
dcos_aws_region                = <<the current region>>
dcos_master_discovery          = "master_http_loadbalancer"
dcos_exhibitor_address         = <<master load balancer address>>
dcos_num_masters               = <<the number oh masters set>>
dcos_exhibitor_storage_backend = "aws_s3"
```

## Example
Here is a simply example with enabled `with_replaceable_masters`

```bash
provider "aws" {
  region = "us-east-1"
}

# Used to determine your public IP for firewall rules
data "http" "whatismyip" {
  url = "http://whatismyip.akamai.com/"
}

module "dcos" {
  source  = "dcos-terraform/dcos/aws"
  version = "~> 0.2.0"

  providers = {
    aws = "aws"
  }

  cluster_name        = "replaceablemasters"
  ssh_public_key_file = "~/.ssh/id_rsa.pub"
  admin_ips           = ["${data.http.whatismyip.body}/32"]

  num_masters        = "3"
  num_private_agents = "1"
  num_public_agents  = "1"

  dcos_variant              = "ee"
  dcos_version              = "1.12.3"
  dcos_license_key_contents = "${file("~/license.txt")}"

  with_replaceable_masters = true
}

output "elb.masters_dns_name" {
  description = "This is the load balancer address to access the DC/OS UI"
  value       = "${module.dcos.masters-loadbalancer}"
}
```
