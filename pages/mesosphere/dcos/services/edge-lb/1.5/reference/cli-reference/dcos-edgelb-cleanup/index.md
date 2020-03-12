---
layout: layout.pug
navigationTitle: dcos edge-lb cleanup
title: dcos edge-lb cleanup
menuWeight: 6
excerpt: Reference for the dcos edge-lb cleanup command
enterprise: true
---

Use this command to list and remove all Amazon Web Services&reg; (AWS&reg;) Elastic Load Balancer&reg; (ELB&reg;) instances that remain after Edge-LB has been uninstalled from a DC/OS&trade; cluster.

###Usage

```bash
dcos edgelb cleanup [options]
```

## Options

| Name, shorthand | Description |
|---------|-------------|
| `--yes` | Remove Elastic Load Balancers without prompting for confirmation. |
| `--apiserver-app-id=APISERVER-APP-ID` | Specify the Marathon application ID of the Edge-LB API server associated with the AWS Elastic Load Balancer. |
| `--pool-name=POOL-NAME` | Edge-LB pool name. You can specify multiple pool names separated by commas (,). |
| `--elb-name=ELB-NAME` | Specify the Elastic Load Balancer name. |
| `--force` | Force the removal of the Elastic Load Balancers. |
| `--help, -h`    | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |

## Permissions
To remove the Elastic Load Balancer framework that was created by Edge-LB when deployed on AWS instances, the Edge-LB service account or user account must have the following permissions:

```
dcos:adminrouter:service:marathon full
dcos:adminrouter:package full
dcos:adminrouter:service:edgelb full
```

## Example
After uninstalling Edge-LB packages, you can use the command that follows to remove remnants of the Elastic load balancer deployed on AWS instances:

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

For additional information about deleting Edge-LB pools and uninstalling Edge-LB packages, see [Uninstalling Edge-LB](../../how-to-tasks/uninstalling/).
