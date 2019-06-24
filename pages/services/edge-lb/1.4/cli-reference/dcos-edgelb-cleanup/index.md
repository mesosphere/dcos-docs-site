---
layout: layout.pug
navigationTitle:  dcos edgelb cleanup
title: dcos edgelb cleanup
menuWeight: 5
excerpt: List and remove elements of the AWS Elastic Load Balancer (ELB) created by Edge-LB
enterprise: true
---

# Description
The `dcos edgelb cleanup` command lists and removes all Amazon Web Services (AWS) Elastic Load Balancer (ELB) instances that remain after Edge-LB has been uninstalled from a DC/OS cluster.

# Usage

```bash
dcos edgelb cleanup
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--yes` | Remove Elastic Load Balancers without prompting for confirmation. |
| `--apiserver-app-id=APISERVER-APP-ID` | Specify the Marathon application ID of the Edge-LB API server associated with the AWS Elastic Load Balancer. |
| `--pool-name=POOL-NAME` | Edge-LB pool name. You can specify multiple pool names separated by commas (,). |
| `--elb-name=ELB-NAME` | Specify the Elastic Load Balancer name. |
| `--force` | Force the removal of the Elastic Load Balancers. |
| `--help, h`   | Display usage information. |
| `--verbose`   | Enable additional logging of requests and responses. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](../../cli-reference/) |  Manage Edge-LB. |

# Examples
After uninstalling Edge-LB packages, you can use the following command to remove remnants of the Elastic load balancing framework deployed on AWS instances:

```bash
dcos edgelb cleanup --yes
```
The command returns information similar to the following:

```
cluster_id :3dcbca3e-f810-489b-a36e-f538fcb9d562
  ELB NAME                          CLUSTER ID  APISERVER APP ID  POOL NAME  ORIGINAL ELB NAME
  dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG
1 ELBs will be deleted
Begin to delete ELB dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG
[dcos-edgelb:48744] INFO[2019-04-15T22:53:56.432257+08:00] deleting the listener                         arn=0xc0000a0bc8 src="awslb/awslb.go:1296"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:56.841851+08:00] deleted the listener                          arn=0xc0000a0bc8 src="awslb/awslb.go:1321"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:56.841956+08:00] deleting the target group                     arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:targetgroup/test-hqch2/3e918f45757c33c0" src="awslb/awslb.go:1265"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:57.152635+08:00] deleted the target group                      arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:targetgroup/test-hqch2/3e918f45757c33c0" src="awslb/awslb.go:1288"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:57.455911+08:00] deleting the elastic load balancer            arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:loadbalancer/net/dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG/d69fa56632d59f2f" src="awslb/awslb.go:1237"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:57.967195+08:00] deleted the elastic load balancer             arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:loadbalancer/net/dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG/d69fa56632d59f2f" src="awslb/awslb.go:1258"
Deleted ELB dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG
1/1 ELBs are deleted
```

For more information, see [Uninstalling](../../uninstalling/) and [Edge-LB Usage](../../usage/).