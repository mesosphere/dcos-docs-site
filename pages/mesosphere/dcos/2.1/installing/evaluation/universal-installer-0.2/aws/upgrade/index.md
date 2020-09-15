---
layout: layout.pug
navigationTitle: Upgrade
title: Upgrade to Universal Installer 0.3
menuWeight: 10
excerpt: Guide to Upgrade Mesosphere Universal Installer to version 0.3
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Upgrade Universal Installer 0.2 to 0.3
This guide documents how to upgrade a Universal Installer installation from version 0.2 to 0.3 to support Terraform v0.12. The guide assumes that the DC/OS cluster to be upgraded is similar to the examples we provide. If you have customized your installation or have a more complex setup then the provided examples than you may need to perform additional steps beyond those listed below.

You should test this procedure on a test cluster before applying it any production cluster to ensure you understand the procedure and it does not break anything.

## Preparation
Ideally you should use tfenv to switch between terraform versions but you can also do it by yourself. so `tfenv use 0.12.25` means you need to replace your 0.11 terraform version with 0.12.25
We assume you're using a clusters main.tf similar to this:

```hcl
provider "aws" {}
# Used to determine your public IP for forwarding rules
data "http" "whatismyip" {
  url = "http://whatismyip.akamai.com/"
}
locals {
  cluster_name = "generic-dcos-ee-demo"
}
module "dcos" {
  source  = "dcos-terraform/dcos/aws"
  version = "~> 0.2.0"
  providers = {
    aws = "aws"
  }
  cluster_name        = "${local.cluster_name}"
  ssh_public_key_file = "~/.ssh/id_rsa.pub"
  admin_ips           = ["${data.http.whatismyip.body}/32"]
  num_masters        = 1
  num_private_agents = 2
  num_public_agents  = 1
  dcos_instance_os        = "centos_7.5"
  bootstrap_instance_type = "m4.xlarge"
  dcos_variant              = "ee"
  dcos_version              = "{{ model.version }}"
  dcos_license_key_contents = "${file("~/license.txt")}"
  # provide a SHA512 hashed password, here "deleteme"
  dcos_superuser_password_hash = "$6$rounds=656000$YSvuFmasQDXheddh$TpYlCxNHF6PbsGkjlK99Pwxg7D0mgWJ.y0hE2JKoa61wHx.1wtxTAHVRHfsJU9zzHWDoE08wpdtToHimNR9FJ/"
  dcos_superuser_username      = "demo-super"
}
output "masters_dns_name" {
  description = "This is the load balancer address to access the DC/OS UI"
  value       = "${module.dcos.masters-loadbalancer}"
}
```

Make sure you're using the latest modules and your state is properly updated:

```
terraform init -upgrade
terraform apply
```

## Translate terraform 0.11 `main.tf` into 0.12
Now we switch to terraform 0.12.25 which offers us an option to translate terraform 0.11 code into terraform 0.12 code

```
tfenv install 0.12.25
tfenv use 0.12.25
```

Translate into 0.12 code
```
terraform 0.12upgrade
```

You must change the module version to 0.3.0:

change:
```hcl
version = "~> 0.2.0"
```

to:
```hcl
version = "~> 0.3.0"
```

First we upgrade our modules to Universal Installer 0.3 ( version change from above)
```
terraform init -upgrade
```
not every option might be properly translated. Lets check if our main.tf is valid.
```
terraform validate
```
A known issue is the providers part:
```
providers = {
  aws = "aws"
}
```
it should look like this:
```
providers = {
  aws = aws
}
```
the important part is that the provider reference must be without quotes (`""`)
You can find more information about tf 0.11 to 0.12 upgrade here: https://www.terraform.io/upgrade-guides/0-12.html

## Start the upgrade procedure
Now we apply the new modules to our previous terraform state.

### We need to let terraform run on everything except load balancers
Due to a needed change in the way the load balancer module is being used we must exclude it from the first apply:
```
terraform apply $(terraform state list | grep -v module.dcos-lb | xargs printf -- '-target %s ')
```

We expect changes to `module.dcos.module.dcos-install.module.dcos-install.null_resource.run_ansible_from_bootstrap_node_to_install_dcos` which is just running dcos-ansible again. and `module.dcos.module.dcos-infrastructure.module.dcos-security-groups.aws_security_group.admin` due to some minor changes. Further changes are not expected but could possible happen please review.
After this was successful most of the infrastructure is updated

### Import load balancers in the new format.
The load balancer module had quite some changes about its addressing. Therefore we now need to create import statements from the current state, drop the old state for load balancers and reimport them into terraform.
```
terraform state pull | jq -r '.resources[] | select(.module != null) |select(.module|startswith("module.dcos.module.dcos-infrastructure.module.dcos-lb")) | select(.type=="aws_lb_target_group")| . as $i | .instances[] | "terraform import \""+$i.module+"."+$i.type+"."+$i.name+"[\\\""+.attributes_flat.port+"\\\"]" +"\" \"" + .attributes_flat.arn + "\""' > import_targetgroups.sh
terraform state pull | jq -r '.resources[] | select(.module != null) |select(.module|startswith("module.dcos.module.dcos-infrastructure.module.dcos-lb")) | select(.type=="aws_lb_listener")| . as $i | .instances[] | "terraform import \""+$i.module+"."+$i.type+"."+$i.name+"[\\\""+.attributes_flat.port+"\\\"]" +"\" \"" + .attributes_flat.arn + "\""' > import_listener.sh
```

In the next step we will drop the complete state for these load balancers. We must make sure that the previous commands ran successfully and stored the targetgroups and listeners.
In our example this looks like this:
```
$ cat import_targetgroups.sh
terraform import "module.dcos.module.dcos-infrastructure.module.dcos-lb.module.dcos-lb-masters.module.masters.aws_lb_target_group.targetgroup[\"80\"]" "arn:aws:elasticloadbalancing:us-east-1:123456789123:targetgroup/generic-dcos-ee-demo-tg-80/dd6330d44538d834"
[...]
$ cat import_listener.sh
terraform import "module.dcos.module.dcos-infrastructure.module.dcos-lb.module.dcos-lb-masters.module.masters.aws_lb_listener.listeners[\"80\"]" "arn:aws:elasticloadbalancing:us-east-1:123456789123:listener/app/generic-dcos-ee-demo/1675988fcc2f675e/0e177f08d3e2ddec"
[...]
```
Overall our files have these amount of command lines:
```
$ wc -l import_listener.sh import_targetgroups.sh
      11 import_listener.sh
      11 import_targetgroups.sh
      22 total
```
The numbers might differ on your infrastructure if you use additional ports. But should be equal for both files.
Before we import these resources again we will drop state for `aws_lb_target_group` `aws_lb_listener` and `aws_lb_target_group_attachment`
```
for addr in $(terraform state pull | jq -r '.resources[] | select(.module != null) |select(.module|startswith("module.dcos.module.dcos-infrastructure.module.dcos-lb")) | select(.type=="aws_lb_target_group" or .type=="aws_lb_listener" or .type=="aws_lb_target_group_attachment")| . as $i | .instances[] | $i.module+"."+$i.type+"."+$i.name+(if .index_key == null then "" else "["+.index_key|tostring+"]" end)'); do terraform state rm "${addr}";done
```
Now lets import the target groups and listeners again
```
bash -x import_targetgroups.sh
bash -x import_listener.sh
```
After we sucessfully imported the target groups and listeners again we run a complete terraform apply
```
terraform apply
```
The Plan will show create statements for `aws_lb_target_group_attachment` this is completely ok. Make sure there is __no__ destroy in this statement. With the create statements terraform will realise that the attachment already exists and places this information in its state.
After this we're done.
