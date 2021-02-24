---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/install/provision-extra-volumes/index.md
navigationTitle: Provision Extra Agent Volumes
title: Provision Extra Agent Volumes
menuWeight: 40
excerpt: Provision extra agent volumes using Universal Installer
enterprise: true
---

DC/OS Storage Service (DSS) can leverage additional raw volumes mounted on an agent to provide additional services.
[DC/OS Universal Installer](/latest/installing/evaluation/) supports provisioning a cluster with extra volumes created for each agent node.

# AWS

Please follow the [instructions](/latest/installing/evaluation/aws/) to setup the Universal Installer on AWS.

To provision extra volumes on each agent node, specify the `private_agents_extra_volumes` variable in the main AWS `dcos` module.
All agent nodes will have the same volume configurations specified.

```hcl
module "dcos" {
  source  = "dcos-terraform/dcos/aws"
  version = "~> 0.1.0"

  # ......

  private_agents_extra_volumes = [
    {
      size        = "100"
      type        = "gp2"
      iops        = "5000"
      device_name = "/dev/xvdi"
    },
    {
      size        = "500"
      type        = "st1"
      device_name = "/dev/xvdj"
    },
  ]
}
```

## Volume Configurations

- `size`: The size in GB for the volume (*optional*, default = "120").
- `type`: The type of the volume (i.e., API Name in this [AWS doc](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html)) (*optional*, default = "standard")
- `iops`: The [IOPS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) of the volume (*optional*, default is the AWS default).
- `device_name`: The device name (e.g., `/dev/xvdi`) used to attach the volume on the host (*required*).
  Note that `device_name` has to be unique, otherwise, the install will fail.
