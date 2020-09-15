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
Ideally you should use tfenv to switch between terraform versions but you can also do it by yourself. so tfenv use 0.12.25 means you need to replace your 0.11 terraform version with 0.12.25
We assume you’re using a clusters main.tf similar to this:
```hcl
provider "azurerm" {}
# Used to determine your public IP for forwarding rules
data "http" "whatismyip" {
  url = "http://whatismyip.akamai.com/"
}
locals {
  cluster_name = "generic-dcos-ee-demo"
}
module "dcos" {
  source  = "dcos-terraform/dcos/azurerm"
  version = "~> 0.2.0"
  providers = {
    azurerm = "azurerm"
  }
  location = "West US"
  cluster_name        = "${local.cluster_name}"
  ssh_public_key_file = "~/.ssh/id_rsa.pub"
  admin_ips           = ["${data.http.whatismyip.body}/32"]
  num_masters        = 1
  num_private_agents = 2
  num_public_agents  = 1
  dcos_instance_os = "centos_7.6"
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

As there where changes to the Azure provider we also have to add the features section:
Therefore replace:

```hcl
provider "azurerm" {}
```

with:

```hcl
provider "azurerm" {
  version = "=2.14.0"
  features {}
}
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

```hcl
providers = {
  azurerm = "azurerm"
}
```

it should look like this:

```hcl
providers = {
  azurerm = azurerm
}
```

the important part is that the provider reference must be without quotes ("")
You can find more information about tf 0.11 to 0.12 upgrade here: https://www.terraform.io/upgrade-guides/0-12.html

## Start the upgrade procedure
Now we apply the new modules to our previous terraform state.

### We need to let terraform run on everything except load balancers
Due to a needed change in the way the load balancer module is being used we must exclude it from the first apply:
```
terraform apply $(terraform state list | grep -v module.loadbalancers | xargs printf -- '-target %s ')
```

We expect changes to `...` and `...``

After this was successful most of the infrastructure is updated

### Import load balancers rules in the new format.
The load balancer module had quite some changes about its addressing. Therefore we now need to create import statements from the current state, drop the old state for load balancer rules and reimport them into terraform.

```
terraform state pull | jq -r '.resources[] | select(.module != null) |select(.module|startswith("module.dcos.module.dcos-infrastructure.module.loadbalancers")) | select(.type=="azurerm_lb_rule")| . as $i | .instances[] | "terraform import \""+$i.module+"."+$i.type+"."+$i.name+"[\\\""+.attributes_flat.frontend_port+"\\\"]" +"\" \"" + .attributes_flat.id + "\""' > import_lb_rules.sh
```

In the next step we will drop the complete state for these load balancers. We must make sure that the previous commands ran successfully and stored the targetgroups and listeners.

In our example this looks like this:
```
cat import_targetgroups.sh
terraform import "module.dcos.module.dcos-infrastructure.module.loadbalancers.module.masters-internal.module.masters-internal.azurerm_lb_rule.load_balancer_rule[\"80\"]" "/subscriptions/12345678-1234-5678-abcd-abcdefghijkl/resourceGroups/generic-dcos-ee-demo/providers/Microsoft.Network/loadBalancers/int-generic-dcos-ee-demo/loadBalancingRules/load-balancer-rule-80"
[...]
```

Our file has this amount of command lines:
```
wc -l import_lb_rules.sh
      10 import_lb_rules.sh
```

The numbers might differ on your infrastructure if you use additional ports.
Before we import these resources again we will drop state for the load balancer rules:
```bash
for addr in $(terraform state pull | jq -r '.resources[] | select(.module != null) |select(.module|startswith("module.dcos.module.dcos-infrastructure.module.loadbalancers")) | select(.type=="azurerm_lb_rule")| . as $i | .instances[] | $i.module+"."+$i.type+"."+$i.name+(if .index_key == null then "" else "["+(.index_key|tostring)+"]" end)'); do terraform state rm "${addr}";done
```

After dropping the state we import the load balancer rules into our new format
```
bash -x ./import_lb_rules.sh
```

Some references got lost in the process. But we can easily reproduce them. The following statement will reimport `azurerm_network_interface_security_group_association` into the terraform state.

```
terraform plan -out=tf.plan && terraform show -json tf.plan | jq -r '.resource_changes[] | select(.type == "azurerm_network_interface_security_group_association") | "terraform import \""+ .address +"\" \""+.change.after.network_interface_id+"|"+.change.after.network_security_group_id+"\""' | bash -
```

After this is finished we need to run a final apply as in the new format terraform needs to create some security rules:
```
terraform apply
```

from now on `terraform plan` should not show any additional changes.
