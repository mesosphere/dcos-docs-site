---
layout: layout.pug
navigationTitle:  Multi-Tenancy Primitives
title: Multi-Tenancy Primitives
menuWeight: 90
excerpt: A primer to Multi-Tenancy in DC/OS
---

# Overview
Resources in DC/OS can be reserved and prioritised using a combination of roles, reservations, quotas, and weights. These features are provided by Apache Mesos, at the core of DC/OS and are referred to as `Primitives`, as they are only accessible via API and have not yet been integrated into the DC/OS UI or CLI. A user requires good monitoring in place of available/used resources when working with quotas, reservations, and weights. 

Resource management in this context refers to concepts such as reservations of resources on agents, resource quotas, and weights (priorities) for frameworks. These are useful for a number of scenarios, such as configuring multi-tenant environments, where multiple teams or projects co-exist on the same DC/OS cluster and the available resources (CPU, RAM, disk, and ports) must be carved up and guaranteed for each cluster with guaranteed quotas. Secondly, with mixed workloads on a single cluster where one class of frameworks may have a higher weight (priority) than another, and should be able to deploy faster than a lower weight framework.

This page covers the multi-tenancy primitives: Multi-Tenant quota management primitives, two examples to real-world scenarios, implementation instructions, and reference links. 

# Multi-Tenant Quota Management Primitives
The key concepts of multi-tenancy primitives include the following:

## Roles
Roles refer to a resource consumer within the cluster. The resource consumer could represent a user within an organization, but it could also represent a team, a group, or a service. It most commonly refers to a class or type of activity which is running. In DC/OS, schedulers subscribe to one or more roles in order to receive resources and schedule work on behalf of the resource consumer(s) they are servicing. Examples of schedulers include Marathon, Kubernetes, and a number of the certified frameworks in the DC/OS catalog such as Kafka and Cassandra, which have been built to include their own scheduler.

There are two default roles which frameworks will subscribe to:
- `*` on private agents
- `slave_public` on public. 

Frameworks from the catalog deploy with their own roles and unique roles can be created on demand. 

## Reservations
Reservations refer to where the resources are reserved on targeted public and private agents for a specific role. Statically reserved resources are applied on agent (public/private) startup and cannot be amended for other roles without restarting the agent. Dynamically reserved resources enable operators and authorized frameworks to reserve and unreserve resources after agent startup and on demand. All SDK based frameworks, like Kafka and Cassandra (certified frameworks listed in the DC/OS catalog) leverage dynamic reservations for reserving the resources they intend to use with a deployment.

## Quotas
Quotas refer to a mechanism for guaranteeing that a role will receive a specific amount of resources. Today, quotas are a maximal, if a quota is defined and the task for the role is deployed, then those resources will be reserved immediately, whether the task scales up to use them or not. Other tasks will not be able to make use of those resources even though they may be unused by the task they are provided for. Dynamic quotas, where the task will only use what it needs at the time but is guaranteed to reach its quota, revocable resources and oversubscription are planned for a future release.

## Weights
Weights refer to a mechanism for prioritising one role over another, to allow all tasks assigned to that role to receive more offers (of resources) over other roles with a lower weight. This can provide faster deployment time, scaling and replacement of tasks.

# Examples
The concepts are described based on two real-world scenarios of existing customer use cases. 

## Analytics platform with weighted Spark roles
This example is based on an existing customer’s use case of an analytics pipeline. The primary workload is Spark with three tiers of Spark jobs, tagged with roles; Low - 1, medium - 2, and high - 3, representing the priority and weights accordingly. 

In practise, the high role is allocated three times the fair share of offers (resources) than medium which will be provided twice the fair share of low. Alongside weights, the high priority Spark role is provided a quota of `x` CPU shares and `y` RAM. 

As Spark jobs are deployed, the high priority Spark jobs receive their offers over the medium and low roles. Given the medium and low priority roles do not have a quota applied, medium roles will be provided offers sooner than low, but there is no quota for medium, so if medium requires `z` cores and they are not available, it will receive as many are available at that time.

## Jenkins in Marathon on Marathon
In this example, the customer runs Jenkins (CI/CD pipeline) as a service, with hundreds of instances, one instance for each development team that requires a service run.

On the DC/OS cluster, there are other applications-as-a-service deployed as Marathon tasks. Each application, including Jenkins are grouped in their own instance of Marathon referred to as Marathon on Marathon (MoM) and in DC/OS documentation as non-native Marathon - where native Marathon is the default Marathon that ships with DC/OS. Conceptually, there is a native Marathon and non-native Marathon on Marathon that are dedicated for grouping other tasks.

Each MoM hosts one of the groups of the application, and they have a role and quota attached. Each role and quota provides a method to guarantee that where one of them scales frequently, like Jenkins does as it spins up its agents on demand for a new build, that it can get the resources it requires. If Jenkins requires more resources, the quota can be amended on the fly to provide them. Another common use of MoMs is for grouping environments such as Development, Testing, and Staging on one DC/OS cluster with robust resource and access management. 

In summary, Jenkins-as-a-service is a very dynamic workload, with hundreds of Jenkins agents being run on demand. Having good visibility of the resources available and to understand when the quota is reached is an important parameter for tuning, availability and growth. The Spark example measures how much sooner the high role tasks ran than the low and to inform the tuning of the weights. 

# Implementation
You can use the following resources to learn how to implement both Marathon on Marathon and Spark quotas:
- [Deploying non-native instances of Marathon](https://docs.mesosphere.com/1.12/deploying-services/marathon-on-marathon/)
- [Spark Quota](https://docs.mesosphere.com/services/spark/2.3.1-2.2.1-2/job-scheduling/#setting-quotas-for-the-drivers)

In the examples below, it is recommended to run the application from a host with [DC/OS CLI](https://docs.mesosphere.com/1.12/cli/) installed.

<p class="message--note"><strong>NOTE: </strong> All double quotes in the JSON examples below require sanitising before use when copying and pasting into editors or a terminal.</p>

## Roles
[Roles](https://mesos.apache.org/documentation/latest/roles/) refer to a tag or a label which is assigned to a framework, task, or an agent. The default role is called <sup>`*`</sup> and all existing roles in a cluster can be viewed through the Mesos UI: `https://<cluster-name-or-IP>/mesos/#/roles`. 


In the following example, a role called `high` is assigned to a Spark task at runtime. Multiple instances of the Spark task can be executed, ensuring they all benefit from the resource management associated with high. 

`spark.mesos.role=high`

Applications in the DC/OS catalog, like Kafka and Cassandra, are automatically deployed with a common role name which is not user configurable.

`confluent_kafka_role`

Roles do not require explicit management, like configuring a new role and assigning it to a task, they are created on demand when deploying a task or configuring a weight or quota. Likewise, you should not delete roles, they exist for the duration of the cluster.

## Reservations
[Reservations](https://mesos.apache.org/documentation/latest/reservation/) can be manually configured and are used by SDK frameworks. In both cases, an authorised user must be declared which is referred to as the principal/framework or an operator. In the case of SDK frameworks in DC/OS this is also known as the service account.

### Adding
Adding reserves resources on a specific agent with id `312dc1dc-9b39-474f-8295-87fc43872e7c-S0` for role low, guaranteeing `four` CPU shares and `512MB` of RAM. When any task with a role of low requests offers that match what this agent has reserved then the task will be guaranteed to the agent itself.

<p class="message--note"><strong>NOTE: </strong>The principal of bootstrapuser differs for each user. In this example, the principal of `bootstrapuser` is my superuser account.</p>

You must change the `agent_id` for the agent ID on your cluster. Use `$dcos node` to find the agent id. 

```
tee add-reservation.json << EOF
{
  "type": "RESERVE_RESOURCES",
  "reserve_resources": {
    "agent_id": {
      "value": "312dc1dc-9b39-474f-8295-87fc43872e7c-S0"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 4.0
        }
      },
      {
        "type": "SCALAR",
                "name": "mem",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "ranges": {
          "range": [
            {
              "begin": 8112,
              "end": 8114
            }
          ]
        }
      }
    ]
  }
}
EOF



curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @add-reservation.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

If successful, a `HTTP 202` response is expected.

If resources are not available for reservation, a `HTTP 409` is expected in response and the reservation cannot be made on that agent. There may already be tasks running that have consumed those resources.

### Reviewing
Reviewing is best achieved through the Mesos UI against the specific agent which you applied the reservation or by parsing the `state.json` through `jq`.

`https://<cluster-URL>/mesos/#/agents/<agent-id>`

### Removing
Removing requires amending the input `JSON` to reference only the resources in the following format:

<p class="message--note"><strong>NOTE: </strong>Change the agent_id to match the agent ID on your cluster (as in the previous example).</p> 

```
tee remove-reservation.json << EOF
{
  "type": "UNRESERVE_RESOURCES",
  "unreserve_resources": {
    "agent_id": {
      "value": "312dc1dc-9b39-474f-8295-87fc43872e7c-S0"
    },
    "resources": [
      {
        "type": "SCALAR",
        "name": "cpus",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 4.0
        }
      },
      {
        "type": "SCALAR",
        "name": "mem",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "scalar": {
          "value": 512.0
        }
      },
      {
        "type": "RANGES",
        "name": "ports",
        "reservation": {
          "principal": "bootstrapuser"
        },
        "role": "confluent-kafka-role",
        "ranges": {
          "range": [
            {
              "begin": 8112,
              "end": 8114
            }
          ]
        }
      }
    ]
  }
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @remove-reservation.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

There are further options related to dynamic and static operations and amending existing reservations that can be found in the reference links.

## Quotas
[Quotas](https://mesos.apache.org/documentation/latest/quota/) specify a minimum amount of resources that the role is guaranteed to receive (unless the total resources in the cluster are less than the configured quota resources, which often indicates a misconfiguration). 

### Adding
Quotas cannot be updated once applied, they must be removed and added again. The following example applies a quota of `two` CPU shares and `4GB` of RAM to a role called `high`.

```
tee set-quota.json << EOF
{
  "type": "SET_QUOTA",
  "set_quota": {
    "quota_request": {
      "force": true,
      "guarantee": [
        {
          "name": "cpus",
          "role": "*",
          "scalar": {
            "value": 2.0
          },
          "type": "SCALAR"
        },
        {
          "name": "mem",
          "role": "*",
          "scalar": {
            "value": 4096.0
          },
          "type": "SCALAR"
        }
      ],
      "role": "high"
    }
  }
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @set-quota.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

If successful, expect a `HTTP/1.1 200 OK` response.

### Reviewing

```
tee get-quota.json << EOF
{
  "type": "GET_QUOTA"
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @get-quota.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 21 Sep 2018 15:35:09 GMT
Content-Type: application/json
Content-Length: 224
Connection: keep-alive

{"type":"GET_QUOTA","get_quota":{"status":{"infos":[{"role":"high","principal":"bootstrapuser","guarantee":[{"name":"cpus","type":"SCALAR","scalar":{"value":2.0}},{"name":"mem","type":"SCALAR","scalar":{"value":128.0}}]}]}}}
```

### Removing

```
tee remove-quota.json << EOF
{
  "type": "REMOVE_QUOTA",
  "remove_quota": {
    "role": "high"
  }
}
EOF
curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @remove-quota.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 21 Sep 2018 15:38:15 GMT
Content-Length: 0
Connection: keep-alive
```

If successful, expect a `HTTP/1.1 200 OK` response.

## Weights 
[Weights](https://mesos.apache.org/documentation/latest/weights/) can be used to control the relative share of cluster resources that is offered to different roles.

### Applying
This applies a weight of `five` to role `perf`.

```
tee set-weight.json << EOF
{
  "type": "UPDATE_WEIGHTS",
  "update_weights": {
    "weight_infos": [
      {
        "role": "perf",
        "weight": 5.0
      }
    ]
  }
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @set-weight.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"
```

If successful, expect a `HTTP/1.1 200 OK` response.

### Reviewing
```
tee get-weight.json << EOF
{
  "type": "GET_WEIGHTS"
}
EOF

curl -i -k \
      -H "Authorization: token=`dcos config show core.dcos_acs_token`" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json" \
      -d @get-weight.json \
-X POST "`dcos config show core.dcos_url`/mesos/api/v1"

HTTP/1.1 200 OK
Server: openresty
Date: Fri, 21 Sep 2018 15:25:25 GMT
Content-Type: application/json
Content-Length: 84
Connection: keep-alive
{"type":"GET_WEIGHTS","get_weights":{"weight_infos":[{"weight":5.0,"role":"perf"}]}}
```

### Removing
Weights cannot be removed once set, they can be amended using the same method as applying to update the weight. If you wish to reset the weight for a role, you could set it back to `two` which is the same weight as the default role <sup>`*`</sup>.


## Marathon on Marathon
The DC/OS catalog includes Marathon, which can be used to deploy a MoM. It should be noted that this is only useful for DC/OS OSS installations, as it does not provide support for Strict mode, Secrets or ACLs.

To install Enterprise MoM, you must contact Mesosphere Support for the Enterprise MoM tarball, then deploy it using the root Marathon. 

# Additional Resources
You can use the following additional resources to learn more about:

- [Oversubscription](https://mesos.apache.org/documentation/latest/oversubscription/)
- [Authorization](https://mesos.apache.org/documentation/latest/authorization/)
- [Mesos API](https://mesos.apache.org/documentation/latest/operator-http-api/)














