---
layout: layout.pug
navigationTitle: Integrating with cloud providers
title: Integrating with cloud providers
menuWeight: 1
excerpt: Describes how you can integrate Edge-LB with cloud provider load balancers
enterprise: true
---
When you define the configuration settings for an Edge-LB pool, you have the option to support automatic provisioning and lifecycle management of cloud provider load balancers. 

There are several benefits to having a public cloud load balancer--such as the AWS Network Load Balancer (NLB)--deployed in front of an Edge-LB pool and managed by the Edge-LB server. 

For example, using the public cloud load balancer in combination with Edge-LB:

- Ensures higher availability of the Edge-LB pool by providing a second tier of failover and fault-tolerance.

- Enables better load distribution across multiple instances of an Edge-LB pool.

- Provides automated scale-up and scale-down adjustments for the Edge-LB pool.

- Enables you to configure load balancing across multiple availability zones. 

You should note that, currently, Edge-LB only supports using AWS Network Load Balancers (NLB) for integrated cloud provider load balancing. For information about deploying and configuring AWS Network Load Balancers (NLB), see the AWS documentation for [Network Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html).

# Configuration
Cloud provider load balancers such as the AWS Network Load Balancer are configured with a top-level `cloudProvider` field. You can find the swagger definition for the `cloudProvider` field in the Edge-LB `swagger.json` file. For example:

```json
"cloudProvider": {
  "aws": {
    "elbs": [
      {
        "name": "echo",
        "type": "NLB",
        "internal": false,
        "listeners": [
          {
            "port": 80,
            "linkFrontend": "echo"
          }
        ],
        "tags": [
          {
            "key": "Protocol",
            "value": "HTTP"
          }
        ]
      }
    ]
  }
}
```

As illustrated in this example, the `cloudProvider` field supports a subfield, currently called `aws`. The `aws` cloud provider field also has a subfield of `elbs`. The `elbs` field contains an array of configuration settings for a particular load balancer. The array in this example defines an AWS NLB configuration using the following keys and values:

| Field  | Value description |
|:------ |:------------------|
| `name` | Specifies the name that Edge-LB uses to generate names of the load balancers and their resources. |
| `type` | Specifies a load balancer type. Currently, only NLB is supported. |
| `internal` | Indicates whether the corresponding load balancer is for internal requests (`true`) or not (`false`). If the `internal` setting is `true`, the load balancer routes requests from internal clients running within the same cluster. 
If a load balancer is internet-facing with the `internal` field set to `false`, the load balancer can route external requests that are received from clients over the internet. |
| `listeners` | Defines the following configuration details for each listener that receives inbound requests for the Edge-LB pool:
- `port` specifies a port number on which the respective load balancer is to listen for incoming connections from clients.
- `linkFrontend` specifies the name of the individual HAProxy frontend of the pool to which inbound requests are routed. |
| `tags` | Specifies an array of user-defined tag name and value pairs. The tags you specify using this field are applied to load balancers and target groups in addition to the [internal tags](#internal-tagging) that are automatically defined by the Edge-LB API server.

## Subnets
Subnets to which an NLB gets attached to can be either defined manually or automatically discovered based on the metadata provided by Edge-LB pool instances. If no subnets are specified, then the discovery approach is employed. To specify subnets manually, please add subnets field to an ELB configuration.

```json
{
  "name": "echo",
  "type": "NLB",
  "subnets": [
    "subnet-1234567890abcdefgi"
  ],
  "listeners": [
    {
      "port": 80,
      "linkFrontend": "echo"
    }
  ]
}
```

## Elastic IP addresses
It is possible to associate Elastic IPs with an NLB that Edge-LB creates. For instance:

```json
{
  "name": "echo",
  "type": "NLB",
  "elasticIPs": [
    "1.1.1.1",
    "eipalloc-12345678"
  ],
  "listeners": [
    {
      "port": 80,
      "linkFrontend": "echo"
    }
  ]
}
```

Please note that an Elastic IP may be specified using either an IPv4 address (like 1.1.1.1 in the above example) or an allocation ID (like eipalloc-12345678). If an IPv4 address is used, it gets resolved into the corresponding allocation ID before it is associated with an NLB.

## TLS protocol
NLB listeners use TCP protocol by default. For TLS, the protocol field should be set to TLS, and a SSL policy and SSL certificates should be specified:

```json
  "listeners": [
    {
      "port": 80,
      "protocol": "TLS",
      "tls": {
        "policy": "ELBSecurityPolicy-2016-08",
        "certificates": [
          "arn:aws:acm:us-west-2:123456789012:certificate/12345678-efgi-abcd-efgi-12345678abcd"
        ]
      },
      "linkFrontend": "echo"
    }
  ]
```  

where certificates is an array of certificate ARNs.

## Access logging
It is possible to log requests made to the TLS listeners by setting the accessLogS3Location field to <bucket-name>/prefix or just <bucket-name>.

```json
{
  "name": "echo",
  "type": "NLB",
  "listeners": [
    {
      "port": 80,
      "protocol": "TLS",
      "tls": {
        "policy": "ELBSecurityPolicy-2016-08",
        "certificates": [
          "arn:aws:acm:us-west-2:123456789012:certificate/12345678-efgi-abcd-efgi-12345678abcd"
        ]
      },
      "linkFrontend": "echo"
    }
  ],
  "accessLogS3Location": "access-logs/echo"
}
```

Please refer to the AWS documentation on the format of access log files for further details.

## Deletion protection
It is possible to prevent accidental deletion of NLBs by enabling deletion protection flag in cloudProvider configuration.

```json
{
  "name": "echo",
  "type": "NLB",
  "deletionProtection": true,
  "listeners": [
    {
      "port": 80,
      "linkFrontend": "echo"
    }
  ]
}
```

It is disabled by default. Please note that even if deletion protection is enabled then even when corresponding pool is deleted from Edge-LB, the NLB won't be deleted by Edge-LB. If deletion of all NLBs associated with a pool upon the pool deletion is desired, the deletionProtection should be set to false for all NLBs prior to deleting the pool.

### Existing ARN
Edge-LB can manage an existing NLB by specifying an NLB ARN in cloudProvider configuration

```json
{
  "name": "echo",
  "type": "NLB",
  "arn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/1234567890abcfge",
  "listeners": [
    {
      "port": 80,
      "linkFrontend": "echo"
    }
  ]
}
```

If a custom ARN is specified, Edge-LB assumes that there is an existing NLB, and that it doesn't own it, hence it won't attempt to create or delete the NLB. Please note that Edge-LB does manage resources of such NLBs. So, if, for instance, access logging is enabled for such an NLB, it should be enabled in the corresponding pool configuration too, in order to have it preserved.

## Internal tagging
Load balancers are automatically defined with the following information in addition to user-defined tags:

DC/OS:EdgeLB:ClusterID - a DC/OS cluster ID, Edge-LB is running on, for instance, 18f21a68-058f-4d14-8055-e61ed91e3794.
DC/OS:EdgeLB:ApplicationID - a Marathon application ID of Edge-LB API server, for instance, /dcos-edgelb/api.
DC/OS:EdgeLB:PoolName - a name of pool the load balancer belongs to, for instance, test-http-pool-with-aws-nlb.
DC/OS:EdgeLB:LoadBalancerName - the original load balancer name, for instance, echo.

Target groups have two other tags in addition:

DC/OS:EdgeLB:FrontendName - a name of corresponding frontend, for instance, echo.
DC/OS:EdgeLB:ListenerPort - a port number, for instance, 80.

## Permissions
Either the instance on which Edge-LB API server is running on, or the IAM user, that is specified using an AWS access key at the time of Edge-LB installation, should have the following AWS API permissions in order to be able to manage NLBs:

elasticloadbalancing:DescribeLoadBalancers
elasticloadbalancing:CreateLoadBalancer
elasticloadbalancing:DeleteLoadBalancer
elasticloadbalancing:DescribeListeners
elasticloadbalancing:CreateListener
elasticloadbalancing:DeleteListener
elasticloadbalancing:ModifyListener
elasticloadbalancing:CreateTargetGroup
elasticloadbalancing:DeleteTargetGroup
elasticloadbalancing:DescribeTargetGroups
elasticloadbalancing:ModifyTargetGroup
elasticloadbalancing:RegisterTargets
elasticloadbalancing:DeregisterTargets
elasticloadbalancing:DescribeTargetHealth
elasticloadbalancing:DescribeLoadBalancerAttributes
elasticloadbalancing:ModifyLoadBalancerAttributes
elasticloadbalancing:DescribeTags
elasticloadbalancing:AddTags
elasticloadbalancing:RemoveTags
ec2:DescribeAddresses

Please refer to the AWS docs for further details on the required permissions, and to the Edge-LB configuration properties for further details on providing AWS credentials.

## Usage
Let's create an app and a pool to balance requests to the app:

```bash
dcos marathon app add examples/apps/host-echo.json
dcos edgelb create examples/config/pool-http-with-aws-nlb.json
```

And now let's introspect the pool and the corresponding AWS NLB using DC/OS CLI and AWS CLI. To list cloud provider load balancers managed by Edge-LB running in the attached DC/OS cluster, perform:

```bash
dcos edgelb ingresslb test-http-pool-with-aws-nlb
  NAME  DNS                                                                            PORT  FRONTEND
  echo  dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv-f0f10cfccfa7d5a8.elb.us-west-2.amazonaws.com  80    echo
```

Using the generated AWS NLB name, let's retrieve various details about the NLB and its associated resources. To describe the load balancer, execute:

aws elbv2 describe-load-balancers --names dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv
{
    "LoadBalancers": [
        {
            "LoadBalancerArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8",
            "DNSName": "dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv-f0f10cfccfa7d5a8.elb.us-west-2.amazonaws.com",
            "CanonicalHostedZoneId": "Z18D5FSROUN65G",
            "CreatedTime": "2019-04-26T16:20:20.071Z",
            "LoadBalancerName": "dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv",
            "Scheme": "internet-facing",
            "VpcId": "vpc-0d745ccca41eb2da1",
            "State": {
                "Code": "active"
            },
            "Type": "network",
            "AvailabilityZones": [
                {
                    "ZoneName": "us-west-2c",
                    "SubnetId": "subnet-05e8d3ea6fbad165a"
                }
            ],
            "IpAddressType": "ipv4"
        }
    ]
}
```

To list the load balancer's listeners, run:

```bash
aws elbv2 describe-listeners --load-balancer-arn arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8
{
    "Listeners": [
        {
            "ListenerArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:listener/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8/df8377617abd7bf2",
            "LoadBalancerArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8",
            "Port": 80,
            "Protocol": "TCP",
            "DefaultActions": [
                {
                    "Type": "forward",
                    "TargetGroupArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:targetgroup/dcos-tg-Gt8X3J46KQWg-80-PVvAO/d5a676c635d7e437"
                }
            ]
        }
    ]
}
```

To get the load balancer's tags, execute:

```bash
aws elbv2 describe-tags --resource-arns arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8
{
    "TagDescriptions": [
        {
            "ResourceArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8",
            "Tags": [
                {
                    "Key": "DC/OS:EdgeLB:ApplicationID",
                    "Value": "/dcos-edgelb/api"
                },
                {
                    "Key": "DC/OS:EdgeLB:ClusterID",
                    "Value": "18f21a68-058f-4d14-8055-e61ed91e3794"
                },
                {
                    "Key": "DC/OS:EdgeLB:PoolName",
                    "Value": "test-http-pool-with-aws-nlb"
                },
                {
                    "Key": "Protocol",
                    "Value": "HTTP"
                },
                {
                    "Key": "DC/OS:EdgeLB:LoadBalancerName",
                    "Value": "echo"
                }
            ]
        }
    ]
}
```

To get a list of target groups associated with the load balancer, run:

```bash
aws elbv2 describe-target-groups --load-balancer-arn arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8
{
    "TargetGroups": [
        {
            "TargetGroupArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:targetgroup/dcos-tg-Gt8X3J46KQWg-80-PVvAO/d5a676c635d7e437",
            "TargetGroupName": "dcos-tg-Gt8X3J46KQWg-80-PVvAO",
            "Protocol": "TCP",
            "Port": 65535,
            "VpcId": "vpc-0d745ccca41eb2da1",
            "HealthCheckProtocol": "TCP",
            "HealthCheckPort": "traffic-port",
            "HealthCheckEnabled": true,
            "HealthCheckIntervalSeconds": 30,
            "HealthCheckTimeoutSeconds": 10,
            "HealthyThresholdCount": 3,
            "UnhealthyThresholdCount": 3,
            "LoadBalancerArns": [
                "arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8"
            ],
            "TargetType": "instance"
        }
    ]
}
```

To get the target group's tags, do:

```bash
aws elbv2 describe-tags --resource-arns arn:aws:elasticloadbalancing:us-west-2:273854932432:targetgroup/dcos-tg-Gt8X3J46KQWg-80-PVvAO/d5a676c635d7e437
{
    "TagDescriptions": [
        {
            "ResourceArn": "arn:aws:elasticloadbalancing:us-west-2:273854932432:targetgroup/dcos-tg-Gt8X3J46KQWg-80-PVvAO/d5a676c635d7e437",
            "Tags": [
                {
                    "Key": "DC/OS:EdgeLB:ListenerPort",
                    "Value": "80"
                },
                {
                    "Key": "DC/OS:EdgeLB:ApplicationID",
                    "Value": "/dcos-edgelb/api"
                },
                {
                    "Key": "DC/OS:EdgeLB:ClusterID",
                    "Value": "18f21a68-058f-4d14-8055-e61ed91e3794"
                },
                {
                    "Key": "DC/OS:EdgeLB:PoolName",
                    "Value": "test-http-pool-with-aws-nlb"
                },
                {
                    "Key": "Protocol",
                    "Value": "HTTP"
                },
                {
                    "Key": "DC/OS:EdgeLB:FrontendName",
                    "Value": "echo"
                },
                {
                    "Key": "DC/OS:EdgeLB:LoadBalancerName",
                    "Value": "echo"
                }
            ]
        }
    ]
}
```

## Metadata
Pool metadata contains additional information about cloud provider load balancers, if any is defined. To fetch metadata for a pool, you can make a request to /service/edgelb/v2/pools/<pool-name>/metadata. Here is an example of a response:

```json
{
  "aws": {
    "elbs": [
      {
        "availabilityZones": [
          {
            "elasticIP": "34.212.99.119",
            "name": "us-west-2a"
          }
        ],
        "dns": "dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv-f0f10cfccfa7d5a8.elb.us-west-2.amazonaws.com",
        "listeners": [
          {
            "linkFrontend": "echo",
            "port": 80
          }
        ],
        "name": "echo",
        "state": {
          "status": "active"
        }
      }
    ]
  },
  "frontends": [
    {
      "endpoints": [
        {
          "port": 80,
          "private": [
            "10.0.4.103"
          ],
          "public": [
            "34.211.112.50"
          ]
        }
      ],
      "name": "echo"
    }
  ],
  "name": "test-http-pool-with-aws-nlb",
  "stats": [
    {
      "port": 9090,
      "private": [
        "10.0.4.103"
      ],
      "public": [
        "34.211.112.50"
      ]
    }
  ]
}
```

where

aws.elbs is an array of entries where each entry corresponds to a respective AWS load balancer configuration in the pool definition. Each entry has the following fields:
name is a user-defined load balancer name.
dns is a DNS name of load balancer.
listeners is listeners as defined in the respective pool configuration.
state carries the status of the load balancer, together with a description for unexpected statuses.
availabilityZones is the availability zones that load balancer nodes are located.
For other details on metadata format, please refer to this page.