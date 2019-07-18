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

- Provides automated scale-up and scale-down adjustments for the Edge-LB pool and its load balancer instances.

- Enables you to configure load balancing across multiple availability zones. 

You should note that, currently, Edge-LB only supports using AWS Network Load Balancers (NLB) for integrated cloud provider load balancing. For information about deploying and configuring AWS Network Load Balancers (NLB), see the AWS documentation for [Network Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html).

# Configuring cloud provider settings
Cloud provider load balancers such as the AWS Network Load Balancer are configured with a top-level `cloudProvider` field in the Edge-LB pool configuration file. 

The following code excerpt illustrates how you can define the properties required for the `cloudProvider` field in the Edge-LB pool configuration file:

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

As illustrated in this example, the `cloudProvider` field includes a subfield that identifies a specific cloud provider. In this case, the cloud provider subfield is `aws` to specify integration with an AWS Network Load Balancer. 

The `aws` cloud provider field also has a subfield of `elbs`. The `elbs` field contains the configuration settings for a particular load balancer. The settings in this example define an AWS NLB configuration using the following fields and values:

- `name` - Specifies the name that Edge-LB uses to generate names of the load balancers and their resources.

- `type` - Specifies a load balancer type. Currently, only NLB is supported.

- `internal` - Indicates whether the corresponding load balancer is for internal requests (`true`) or not (`false`). 

  If the `internal` setting is `true`, the load balancer routes requests from internal clients running within the same cluster. 

  If a load balancer is internet-facing with the `internal` field set to `false`, the load balancer can route external requests that are received from clients over the internet.
  
- `listeners` - Defines the following configuration details for each listener that receives inbound requests for the Edge-LB pool:
  - `port` specifies a port number on which the respective load balancer is to listen for incoming connections from clients.

  - `linkFrontend` specifies the name of the individual HAProxy frontend of the pool to which inbound requests are routed.

- `tags` - Specifies an array of user-defined tag name and value pairs. The tags you specify using this field are applied to load balancers and target groups in addition to the [internal tags](#internal-tagging) that are automatically defined by the Edge-LB API server.

## Specifying subnets
You can define the subnets that are associated an AWS Network Load Balancer either manually or automatically.

To specify subnets manually, you can add a `subnets` field to the cloud provider configuration details in the Edge-LB pool configuration file. For example, the following code snippet illustrates how to manually specify `subnet-1234567890abcdefgi` for the cloud provider load balancer:

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

If you don't specify the subnets you want attached to the AWS Network Load Balancer manually, then subnets are discovered automatically based on the **metadata** provided by Edge-LB pool instances. For more information about Edge-LB pool metadata, see [metadata]().

## Specifying Elastic IP addresses
You can associate Elastic IP addresses with any AWS Network Load Balancer that Edge-LB creates. For example, the following code snippet illustrates how to specify two Elastic IP addresses for the cloud provider load balancer:

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

As this example illustrates, you can specify the Elastic network addresses using:
- an IPv4 address like `1.1.1.1` in the example.
- an allocation ID like `eipalloc-12345678` in the example. 

If you use an IPv4 address, the address is resolved into the corresponding allocation ID before it is associated with the NLB.

## Enabling Transport Layer Security (TLS)
By default, AWS Network Load Balancer listeners use the TCP protocol. If you want to enable secure encrypted communication using Transport Layer Security and secure socket layer (SSL) certificates, you should do the following in the Edge-LB pool configuration file:
- Set the `protocol` field to TLS.
- Set the `policy` field to specify a [secure socket layer (SSL) policy](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html#describe-ssl-policies).
- Set the `certificates` field to specify one or more [SSL certificates](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html#tls-listener-certificates).

For example, the following code snippet illustrates how to specify configuration properties for secure communication:

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

As this example illustrates, you can specify multiple certificates using certificate [Amazon Resource Names (ARNs)](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).

## Enabling access logging
You can log requests made to the TLS listeners by setting the `accessLogS3Location` field to <bucket-name>/prefix or just <bucket-name>.

For example, the following code snippet illustrates how to enable logging for inbound requests that use the secure TLS protocol:

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

For more information about the format of access log files, see [Access Logs for Your Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-access-logs.html#access-log-file-format) in the AWS documentation.

## Preventing accidental deletion
You can prevent accidental deletion of AWS Network Load Balancers by enabling the deletion protection flag in the `cloudProvider` section of the Edge-LB pool configuration file.

The following code excerpt illustrates how you can set the `deletionProtection` field to prevent AWS Network Load Balancers for an Edge-LB pool from being accidentally deleted:

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

Accidental deletion protection is disabled by default. If you enable deletion protection, you should keep in mind that deleting an Edge-LB pool associated with the AWS Network Load Balancer will not delete the AWS Network Load Balancer. If you want to delete all of the AWS Network Load Balancers associated with an Edge-LB pool when you delete the Edge-LB pool, you should set the `deletionProtection` field to `false` for all AWS Network Load Balancers before you delete the Edge-LB pool.

### Using existing Amazon Resource Names
Edge-LB can manage an existing AWS Network Load Balancers by specifying the AWS Network Load Balancer resouce names in the `cloudProvider` section of the Edge-LB pool configuration file.

The following code excerpt illustrates how you can use Amazon Resource Names (ARNs) to associate an existing AWS Network Load Balancer with an Edge-LB pool in the Edge-LB pool configuration file:

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

If you specify a custom ARN identifier in the pool configuration file, Edge-LB assumes that there is an existing Network Load Balancer for the pool to use. In this scenario, the Edge-LB API server does not attempt to create or delete a Network Load Balancer for the pool. Instead, Edge-LB attempts to manage resources for the specified Network Load Balancer. Therefore, if you want to use an existing Network Load Balancer, you should be sure that the existing Network Load Balancer configuration aligns with the configuration settings specified in the Edge-LB pool configuration file. For example, if you enable access logging for the existing Network Load Balancer, you should also enable access logging in the corresponding pool configuration file to ensure that setting is used. 

If there is a conflict between the configuration of the existing Network Load Balancer and the settings defined in the pool configuration file that use that Network Load Balancer, the pool configuration settings override the existing Network Load Balancer configuration.

## Internal tagging
Load balancers are automatically defined with the following information in addition to any user-defined tags:

- `DC/OS:EdgeLB:ClusterID` that specifies a cluster identifier for the DC/OS cluster Edge-LB is running on. For example: 18f21a68-058f-4d14-8055-e61ed91e3794.

- `DC/OS:EdgeLB:ApplicationID` that specifies the Marathon application identifier for the Edge-LB API server. For example, /dcos-edgelb/api.

- `DC/OS:EdgeLB:PoolName` that specifies a name of pool the load balancer belongs to. For example: test-http-pool-with-aws-nlb.

- `DC/OS:EdgeLB:LoadBalancerName` that specifies the original load balancer name. For example: echo.

Target groups have two additional tags:

- `DC/OS:EdgeLB:FrontendName` that specifies the name of a corresponding frontend. For example: echo.

- `DC/OS:EdgeLB:ListenerPort` that specifies a port number. For example: 80.

## Required permissions
Either the instance on which Edge-LB API server is running on, or the IAM user that is specified using an AWS access key at the time of Edge-LB installation should have the following AWS API permissions in order to be able to manage Network Load Balancers:

```
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
```

For more information about required permissions, see [Elastic Load Balancing API Permissions](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/elb-api-permissions.html) in the AWS documentation. For more information about using Edge-LB configuration properties to provide AWS credentials, see the [Edge-LB configuration reference](https://github.com/mesosphere/dcos-edge-lb/blob/master/framework/edgelb/universe/config.json).

# Deploying with the cloud provider load balancer
To illustrate how you can deploy an Edge-LB pool that uses an Amazon Network Load Balancer, you can deploy a sample application that uses an Edge-LB pool to route incoming requests to the app.

1. Open a text editor, then copy and paste the following sample app definition to create the `host-echo.json` file:

    ```json
    {
        "id": "/host-echo",
        "cmd": "/start $PORT0",
        "instances": 1,
        "cpus": 0.1,
        "mem": 32,
        "constraints": [["public_ip", "UNLIKE", "true"]],
        "container": {
            "type": "DOCKER",
            "docker": {
                "image": "mesosphere/echo-http"
            }
        },
        "portDefinitions": [
            {
                "name": "web",
                "protocol": "tcp",
                "port": 0
            }
        ],
        "healthChecks": [
            {
                "portIndex": 0,
                "path": "/",
                "protocol": "HTTP"
            }
        ]
    }
    ```

1. Deploy the `host-echo` service using the `host-echo.json` app definition by running the following command:

    ```bash
    dcos marathon app add examples/apps/host-echo.json
    ```

1. Open a text editor, then copy and paste the following Edge-LB pool configuration settings to define the `pool-http-with-aws-nlb` Edge-LB pool:

    ```json
    {
      "apiVersion": "V2",
      "name": "pool-http-with-aws-nlb",
      "count": 1,
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
      },
      "haproxy": {
        "frontends": [
          {
            "name": "echo",
            "bindPort": 80,
            "protocol": "HTTP",
            "linkBackend": {
              "defaultBackend": "echo"
            }
          }
        ],
        "backends": [
          {
            "name": "echo",
            "protocol": "HTTP",
            "services": [
              {
                "marathon": {
                  "serviceID": "/host-echo"
                },
                "endpoint": {
                  "portName": "web"
                }
              }
            ]
          }
        ]
      }
    }
    ```

1. Deploy the `pool-http-with-aws-nlb` pool configuration file to create the pool instance for load balancing access to the `host-echo` service by running the following command:

    ```bash
    dcos edgelb create examples/config/pool-http-with-aws-nlb.json
    ```

1. List the cloud provider load balancers managed by Edge-LB running in the attached DC/OS cluster by running the following command:

    ```bash
    dcos edgelb ingresslb pool-http-with-aws-nlb
    ```

    The command returns output similar to the following:

    ```bash
    NAME              DNS
    echo              dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv-f0f10cfccfa7d5a8.elb.us-west-2.amazonaws.com

    AVAILABILITY ZONE  ELASTIC IP

    LISTENER PROTOCOL  LISTENER PORT  FRONTEND
    TCP                80             echo
    ```

      In this example, the generated AWS Network Load Balancer name returned is:
      `dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv-f0f10cfccfa7d5a8.elb.us-west-2.amazonaws.com`

      You can use the generated AWS Network Load Balancer name to retrieve details about the Network Load Balancer and its associated resources.

1. Use the generated AWS Network Load Balancer name to describe the Network Load Balancer by running the following command:

    ```bash
    aws elbv2 describe-load-balancers --names dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv
    ```

    The command returns information similar to the following:

    ```bash
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

1. List the load balancer's listeners by running the following command:

    ```bash
    aws elbv2 describe-listeners --load-balancer-arn arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8
    ```

    The command returns information similar to the following:

    ```bash
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

1. Get the load balancer's tags by running the following command:

    ```bash
    aws elbv2 describe-tags --resource-arns arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8
    ```

    The command returns information similar to the following:

    ```bash
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

1. Get a list of target groups associated with the load balancer by running the following command:

    ```bash
    aws elbv2 describe-target-groups --load-balancer-arn arn:aws:elasticloadbalancing:us-west-2:273854932432:loadbalancer/net/dcos-lb-JOQ3wMJ7Z-Q8ayl-XzLP-PVv/f0f10cfccfa7d5a8
    ```

    The command returns information similar to the following:

    ```bash
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

1. Get the target group's tags by running the following command:

    ```bash
    aws elbv2 describe-tags --resource-arns arn:aws:elasticloadbalancing:us-west-2:273854932432:targetgroup/dcos-tg-Gt8X3J46KQWg-80-PVvAO/d5a676c635d7e437
    ```

    The command returns information similar to the following:

    ```bash
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

# Viewing pool metadata
Pool metadata contains additional information about cloud provider load balancers, if any additional information has been defined. 

To get load balancer metadata for a pool, you can make a request to the `/service/edgelb/v2/pools/<pool-name>/metadata` endpoint.

Here is an example of a response:

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

In this example, `aws.elbs` is an array of entries where each entry corresponds to a respective AWS load balancer configuration in the pool definition. 

Each `aws.elbs` entry has the following fields:
- `name` is a user-defined load balancer name.

- `dns` is a DNS name of load balancer.

- `listeners` is listeners as defined in the respective pool configuration.

- `state` specifies the status of the load balancer, together with a description for unexpected statuses.

- `availabilityZones` specify the availability zones that identify where load balancer nodes are located.

For other details on metadata format, see the pool [metadata reference](../../pool-configuration/metadata/) section.