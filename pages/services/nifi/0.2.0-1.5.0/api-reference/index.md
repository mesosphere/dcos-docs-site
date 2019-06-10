---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 90
excerpt: DC/OS NiFi Service API Reference
featureMaturity:
enterprise: false
---

<!-- {% raw %} disable mustache templating in this file: retain nifid examples as-is -->

The DC/OS NiFi Service implements a REST API that may be accessed from outside the cluster. The <dcos_url> parameter referenced below indicates the base URL of the DC/OS cluster on which the DC/OS Apache NiFfi Service is deployed.

<a name="#rest-auth"></a>
# REST API Authentication
REST API requests must be authenticated. This authentication is only applicable for interacting with the DC/OS Apache NiFi REST API directly. You do not need the token to access the Apache NiFi nodes themselves.

If you are using DC/OS Enterprise, follow these instructions to [create a service account](../security/serviceaccountdetail.md) and an [authentication token](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/). You can then configure your service to automatically refresh the authentication token when it expires.

Once you have the authentication token, you can store it in an environment variable and reference it in your REST API calls:

```shell
export auth_token=uSeR_t0k3n
```

The `curl` examples in this document assume that an auth token has been stored in an environment variable named `auth_token`.

If you are using DC/OS Enterprise, the security mode of your installation may also require the `--ca-cert` flag when making REST calls. Refer to [Obtaining and passing the DC/OS certificate in Curl requests](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/ca-trust-curl/) for information on how to use the `--cacert` flag. [If your security mode is `disabled`](https://docs.mesosphere.com/1.10/security/ent/secrets/seal-store/), do not use the `--ca-cert` flag.

# Plan API
The Plan API provides endpoints for monitoring and controlling service installation and configuration updates.


## List plans
You may list the configured plans for the service. By default, all services at least have a deploy plan and a recovery plan. Some services may have additional custom plans defined.

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/plans
```

```shell
dcos nifi --name=nifi plan list
```

## View plan
You may view the current state of a listed plan:

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/plans/<plan>
```

The CLI may be used to show a formatted tree of the plan (default), or the underlying JSON data as retrieved from the above HTTP endpoint:

```shell
dcos nifi --name=nifi plan show <plan>
```

```shell
dcos nifi --name=nifi plan show <plan> --json
```


## Pause plan

The installation will pause after completing installation of the current node and wait for user input before proceeding further.

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/plans/deploy/interrupt
```

```shell
dcos nifi --name=nifi plan pause deploy
```

## Resume plan

The REST API request below will resume installation at the next pending node.

```shell
curl -X PUT <dcos_surl>/service/nifi/v1/plans/deploy/continue
```

```shell
dcos nifi --name=nifi plan continue deploy
```

# Connection API

```shell
curl -H "Authorization:token=$auth_token" dcos_url/service/nifi/v1/endpoints/<endpoint>
```

You will see a response similar to the following:

```json
{
  "address": [
    "10.0.0.197:1025",
    "10.0.0.155:1025"
  ],
  "dns": [
    "nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1025",
    "nifi-1-node.nifi.autoip.dcos.thisdcos.directory:1025"
  ],
  "vip": "node.nifi.l4lb.thisdcos.directory:1025"
}
```

The contents of the endpoint response contain details sufficient for clients to connect to the service.

# Nodes API

The pod API provides endpoints for retrieving information about nodes, restarting them, and replacing them.

## List Nodes

A list of available node ids can be retrieved by sending a GET request to `/v1/pod`:

CLI Example

```shell
dcos nifi pod list
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod
```

You will see a response similar to the following:

```json
[
  "nifi-0",
  "nifi-1"
]
```

## Node Info

You can retrieve node information by sending a GET request to `/v1/pod/<node-id>/info`:


CLI Example

```shell
dcos nifi pod info node-0
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/node-0/info
```

You will see a response similar to the following:

```json
[ {
  "info" : {
    "name" : "nifi-0-backup",
    "taskId" : {
      "value" : ""
    },
    "slaveId" : {
      "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-S4"
    },
    "resources" : [ {
      "providerId" : null,
      "name" : "cpus",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 0.5
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "600b5325-54d3-4375-b245-d1ec4657760d"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "mem",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 512.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "23146ae9-272b-42fe-8aae-8c8546d4dd42"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "disk",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1000.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "9efcf4e8-f41e-4015-9265-b3091a5fd0e0"
          } ]
        }
      } ],
      "disk" : {
        "persistence" : {
          "id" : "043c88e3-10d7-46fa-b92d-0023645683b0",
          "principal" : "nifi-principal"
        },
        "volume" : {
          "mode" : "RW",
          "containerPath" : "nifi-backup",
          "hostPath" : null,
          "image" : null,
          "source" : null
        },
        "source" : null
      },
      "revocable" : null,
      "shared" : null
    } ],
    "executor" : {
      "type" : "DEFAULT",
      "executorId" : {
        "value" : "nifi__4e03dd7d-8635-47e6-ade6-db0995dedb8a"
      },
      "frameworkId" : {
        "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-0007"
      },
      "command" : null,
      "container" : {
        "type" : "MESOS",
        "volumes" : [ ],
        "hostname" : null,
        "docker" : null,
        "mesos" : null,
        "networkInfos" : [ ],
        "linuxInfo" : null,
        "rlimitInfo" : {
          "rlimits" : [ {
            "type" : "RLMT_NOFILE",
            "hard" : 50000,
            "soft" : 50000
          }, {
            "type" : "RLMT_NPROC",
            "hard" : 10000,
            "soft" : 10000
          } ]
        },
        "ttyInfo" : null
      },
      "resources" : [ {
        "providerId" : null,
        "name" : "cpus",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 0.1
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "2f853459-817e-4b7d-aac4-734f77da6f87"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "mem",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 32.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "d38648f9-9c11-4fea-97cc-65ba144e2b44"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "disk",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 256.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "655888c9-885e-44c8-9105-fbdcd87a83fd"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      } ],
      "name" : "nifi",
      "source" : null,
      "data" : null,
      "discovery" : null,
      "shutdownGracePeriod" : null,
      "labels" : {
        "labels" : [ {
          "key" : "DCOS_SPACE",
          "value" : "/nifi"
        } ]
      }
    },
    "command" : {
      "uris" : [ {
        "value" : "https://downloads.mesosphere.com/java/server-jre-8u162-linux-x64.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/bootstrap.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-binary/nifi-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/executor.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-ap-southeast-2.amazonaws.com/nifi-toolkit/nifi-toolkit-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-janitor.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-statsd.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-api-access.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-python/python-2.7.14.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      } ],
      "environment" : {
        "variables" : [ {
          "name" : "FRAMEWORK_HOST",
          "type" : null,
          "value" : "nifi.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_NAME",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_VIP_HOST",
          "type" : null,
          "value" : "nifi.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MAX",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MIN",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FIREWALL_FILE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES",
          "type" : null,
          "value" : "3",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_IS_NODE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE",
          "type" : null,
          "value" : "25",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_PORT",
          "type" : null,
          "value" : "12000",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_THREADS",
          "type" : null,
          "value" : "10",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_READ_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_IS_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CN_DN_NODE_IDENTITY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "1440",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE",
          "type" : null,
          "value" : "10 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES",
          "type" : null,
          "value" : "100",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE",
          "type" : null,
          "value" : "50%",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "content-repository",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_VIEWER_URL",
          "type" : null,
          "value" : "/nifi-content-viewer/",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_BORED_YIELD_DURATION",
          "type" : null,
          "value" : "10 millis",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD",
          "type" : null,
          "value" : "10 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL",
          "type" : null,
          "value" : "500 ms",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME",
          "type" : null,
          "value" : "30 days",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_AUTOREFRESH_INTERVAL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_BANNER_TEXT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_DATABASE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "database-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL",
          "type" : null,
          "value" : "2 mins",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "flowfile-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_PARTITIONS",
          "type" : null,
          "value" : "256",
          "secret" : null
        }, {
          "name" : "NIFI_FRAMEWORK_USER",
          "type" : null,
          "value" : "nobody",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_DEFAULT_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_SERVICE_PRINCIPAL",
          "type" : null,
          "value" : "nifiprincipal@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_USER_PRINCIPAL",
          "type" : null,
          "value" : "nifiadmin@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KILL_GRACE_PERIOD",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_METRICS_FREQUENCY",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "100000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY",
          "type" : null,
          "value" : "1_000_000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "provenance-repository",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS",
          "type" : null,
          "value" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT",
          "type" : null,
          "value" : "16",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH",
          "type" : null,
          "value" : "65536",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE",
          "type" : null,
          "value" : "1 GB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME",
          "type" : null,
          "value" : "24 hours",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_QUEUE_SWAP_THRESHOLD",
          "type" : null,
          "value" : "20000",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SOCKET_PORT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_NEEDCLIENTAUTH",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_URL",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_AUTHORIZER",
          "type" : null,
          "value" : "file-provider",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ALGORITHM",
          "type" : null,
          "value" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY_PROTECTED",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_PROVIDER",
          "type" : null,
          "value" : "BC",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_THREADS",
          "type" : null,
          "value" : "1",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_THREADS",
          "type" : null,
          "value" : "4",
          "secret" : null
        }, {
          "name" : "NIFI_VARIABLE_REGISTRY_PROPERTIES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_VERSION",
          "type" : null,
          "value" : "1.5.0",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE",
          "type" : null,
          "value" : "32 KB",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_PORT",
          "type" : null,
          "value" : "1026",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_PORT",
          "type" : null,
          "value" : "1025",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_THREADS",
          "type" : null,
          "value" : "200",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_WORKING_DIRECTORY",
          "type" : null,
          "value" : "./work/jetty",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_WAR_DIRECTORY",
          "type" : null,
          "value" : "./lib",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_STRING",
          "type" : null,
          "value" : "master.mesos:2181",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_SESSION_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_REGION",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_ZONE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "POD_INSTANCE_INDEX",
          "type" : null,
          "value" : "0",
          "secret" : null
        }, {
          "name" : "SCHEDULER_API_HOSTNAME",
          "type" : null,
          "value" : "api.nifi.marathon.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_DEBUG",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_ENABLED",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_HOSTNAME",
          "type" : null,
          "value" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_PORT",
          "type" : null,
          "value" : "2500",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_PRIMARY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "TASK_NAME",
          "type" : null,
          "value" : "nifi-0-backup",
          "secret" : null
        }, {
          "name" : "nifi-0-backup",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "REGION",
          "type" : null,
          "value" : "aws/ap-southeast-2",
          "secret" : null
        }, {
          "name" : "ZONE",
          "type" : null,
          "value" : "aws/ap-southeast-2c",
          "secret" : null
        } ]
      },
      "shell" : null,
      "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*) ; sh $MESOS_SANDBOX/nifi-toolkit-${NIFI_VERSION}/bin/file-manager.sh -o backup -b nifi-backup -c $MESOS_SANDBOX/../../tasks/nifi-$POD_INSTANCE_INDEX-node*/nifi-1.5.0 -v;\n",
      "arguments" : [ ],
      "user" : "nobody"
    },
    "container" : {
      "type" : "MESOS",
      "volumes" : [ ],
      "hostname" : null,
      "docker" : null,
      "mesos" : null,
      "networkInfos" : [ ],
      "linuxInfo" : {
        "capabilityInfo" : null,
        "boundingCapabilities" : null,
        "effectiveCapabilities" : null,
        "sharePidNamespace" : false
      },
      "rlimitInfo" : {
        "rlimits" : [ {
          "type" : "RLMT_NOFILE",
          "hard" : 50000,
          "soft" : 50000
        }, {
          "type" : "RLMT_NPROC",
          "hard" : 10000,
          "soft" : 10000
        } ]
      },
      "ttyInfo" : null
    },
    "healthCheck" : null,
    "check" : null,
    "killPolicy" : {
      "gracePeriod" : {
        "nanoseconds" : 0
      }
    },
    "data" : null,
    "labels" : {
      "labels" : [ {
        "key" : "goal_state",
        "value" : "ONCE"
      }, {
        "key" : "index",
        "value" : "0"
      }, {
        "key" : "offer_attributes",
        "value" : ""
      }, {
        "key" : "offer_hostname",
        "value" : "10.0.0.197"
      }, {
        "key" : "offer_region",
        "value" : "aws/ap-southeast-2"
      }, {
        "key" : "offer_zone",
        "value" : "aws/ap-southeast-2c"
      }, {
        "key" : "target_configuration",
        "value" : "29bf852c-7e17-48ba-ac8e-84634fb99f86"
      }, {
        "key" : "task_type",
        "value" : "nifi"
      } ]
    },
    "discovery" : null
  },
  "status" : null
}, {
  "info" : {
    "name" : "nifi-0-metrics",
    "taskId" : {
      "value" : "nifi-0-metrics__82d8bdc2-ce76-4cb3-9273-d17ce4ce9a95"
    },
    "slaveId" : {
      "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-S4"
    },
    "resources" : [ {
      "providerId" : null,
      "name" : "cpus",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 0.2
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "da91c4df-e3fe-49ae-8b0e-12430306cb05"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "mem",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 32.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "adee1367-584f-4b99-8a81-52646d44783e"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    } ],
    "executor" : {
      "type" : "DEFAULT",
      "executorId" : {
        "value" : "nifi__4e03dd7d-8635-47e6-ade6-db0995dedb8a"
      },
      "frameworkId" : {
        "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-0007"
      },
      "command" : null,
      "container" : {
        "type" : "MESOS",
        "volumes" : [ ],
        "hostname" : null,
        "docker" : null,
        "mesos" : null,
        "networkInfos" : [ ],
        "linuxInfo" : null,
        "rlimitInfo" : {
          "rlimits" : [ {
            "type" : "RLMT_NOFILE",
            "hard" : 50000,
            "soft" : 50000
          }, {
            "type" : "RLMT_NPROC",
            "hard" : 10000,
            "soft" : 10000
          } ]
        },
        "ttyInfo" : null
      },
      "resources" : [ {
        "providerId" : null,
        "name" : "cpus",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 0.1
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "2f853459-817e-4b7d-aac4-734f77da6f87"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "mem",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 32.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "d38648f9-9c11-4fea-97cc-65ba144e2b44"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "disk",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 256.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "655888c9-885e-44c8-9105-fbdcd87a83fd"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      } ],
      "name" : "nifi",
      "source" : null,
      "data" : null,
      "discovery" : null,
      "shutdownGracePeriod" : null,
      "labels" : {
        "labels" : [ {
          "key" : "DCOS_SPACE",
          "value" : "/nifi"
        } ]
      }
    },
    "command" : {
      "uris" : [ {
        "value" : "https://downloads.mesosphere.com/java/server-jre-8u162-linux-x64.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/bootstrap.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-binary/nifi-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/executor.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-ap-southeast-2.amazonaws.com/nifi-toolkit/nifi-toolkit-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-janitor.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-statsd.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-api-access.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-python/python-2.7.14.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      } ],
      "environment" : {
        "variables" : [ {
          "name" : "FRAMEWORK_HOST",
          "type" : null,
          "value" : "nifi.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_NAME",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_VIP_HOST",
          "type" : null,
          "value" : "nifi.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MAX",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MIN",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FIREWALL_FILE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES",
          "type" : null,
          "value" : "3",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_IS_NODE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE",
          "type" : null,
          "value" : "25",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_PORT",
          "type" : null,
          "value" : "12000",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_THREADS",
          "type" : null,
          "value" : "10",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_READ_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_IS_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CN_DN_NODE_IDENTITY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "1440",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE",
          "type" : null,
          "value" : "10 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES",
          "type" : null,
          "value" : "100",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE",
          "type" : null,
          "value" : "50%",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "content-repository",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_VIEWER_URL",
          "type" : null,
          "value" : "/nifi-content-viewer/",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_BORED_YIELD_DURATION",
          "type" : null,
          "value" : "10 millis",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD",
          "type" : null,
          "value" : "10 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL",
          "type" : null,
          "value" : "500 ms",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME",
          "type" : null,
          "value" : "30 days",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_AUTOREFRESH_INTERVAL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_BANNER_TEXT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_DATABASE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "database-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL",
          "type" : null,
          "value" : "2 mins",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "flowfile-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_PARTITIONS",
          "type" : null,
          "value" : "256",
          "secret" : null
        }, {
          "name" : "NIFI_FRAMEWORK_USER",
          "type" : null,
          "value" : "nobody",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_DEFAULT_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_SERVICE_PRINCIPAL",
          "type" : null,
          "value" : "nifiprincipal@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_USER_PRINCIPAL",
          "type" : null,
          "value" : "nifiadmin@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KILL_GRACE_PERIOD",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_METRICS_FREQUENCY",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "100000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY",
          "type" : null,
          "value" : "1_000_000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "provenance-repository",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS",
          "type" : null,
          "value" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT",
          "type" : null,
          "value" : "16",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH",
          "type" : null,
          "value" : "65536",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE",
          "type" : null,
          "value" : "1 GB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME",
          "type" : null,
          "value" : "24 hours",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_QUEUE_SWAP_THRESHOLD",
          "type" : null,
          "value" : "20000",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SOCKET_PORT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_NEEDCLIENTAUTH",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_URL",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_AUTHORIZER",
          "type" : null,
          "value" : "file-provider",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ALGORITHM",
          "type" : null,
          "value" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY_PROTECTED",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_PROVIDER",
          "type" : null,
          "value" : "BC",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_THREADS",
          "type" : null,
          "value" : "1",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_THREADS",
          "type" : null,
          "value" : "4",
          "secret" : null
        }, {
          "name" : "NIFI_VARIABLE_REGISTRY_PROPERTIES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_VERSION",
          "type" : null,
          "value" : "1.5.0",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE",
          "type" : null,
          "value" : "32 KB",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_PORT",
          "type" : null,
          "value" : "1026",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_PORT",
          "type" : null,
          "value" : "1025",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_THREADS",
          "type" : null,
          "value" : "200",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_WORKING_DIRECTORY",
          "type" : null,
          "value" : "./work/jetty",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_WAR_DIRECTORY",
          "type" : null,
          "value" : "./lib",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_STRING",
          "type" : null,
          "value" : "master.mesos:2181",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_SESSION_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_REGION",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_ZONE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "POD_INSTANCE_INDEX",
          "type" : null,
          "value" : "0",
          "secret" : null
        }, {
          "name" : "SCHEDULER_API_HOSTNAME",
          "type" : null,
          "value" : "api.nifi.marathon.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_DEBUG",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_ENABLED",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_HOSTNAME",
          "type" : null,
          "value" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_PORT",
          "type" : null,
          "value" : "2500",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_PRIMARY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "TASK_NAME",
          "type" : null,
          "value" : "nifi-0-metrics",
          "secret" : null
        }, {
          "name" : "nifi-0-metrics",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "REGION",
          "type" : null,
          "value" : "aws/ap-southeast-2",
          "secret" : null
        }, {
          "name" : "ZONE",
          "type" : null,
          "value" : "aws/ap-southeast-2c",
          "secret" : null
        } ]
      },
      "shell" : null,
      "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\nusernodesecret=`cat usernode.keytab`\necho \"Before running statsd\"\nsleep 180\ncp ../../misc-repository/url-info.properties .\njava -jar nifi-statsd.jar url-info.properties $STATSD_UDP_HOST $STATSD_UDP_PORT ${NIFI_METRICS_FREQUENCY} ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\necho \"After running statsd\"\n",
      "arguments" : [ ],
      "user" : "nobody"
    },
    "container" : {
      "type" : "MESOS",
      "volumes" : [ ],
      "hostname" : null,
      "docker" : null,
      "mesos" : null,
      "networkInfos" : [ ],
      "linuxInfo" : {
        "capabilityInfo" : null,
        "boundingCapabilities" : null,
        "effectiveCapabilities" : null,
        "sharePidNamespace" : false
      },
      "rlimitInfo" : {
        "rlimits" : [ {
          "type" : "RLMT_NOFILE",
          "hard" : 50000,
          "soft" : 50000
        }, {
          "type" : "RLMT_NPROC",
          "hard" : 10000,
          "soft" : 10000
        } ]
      },
      "ttyInfo" : null
    },
    "healthCheck" : null,
    "check" : null,
    "killPolicy" : {
      "gracePeriod" : {
        "nanoseconds" : 0
      }
    },
    "data" : null,
    "labels" : {
      "labels" : [ {
        "key" : "goal_state",
        "value" : "RUNNING"
      }, {
        "key" : "index",
        "value" : "0"
      }, {
        "key" : "offer_attributes",
        "value" : ""
      }, {
        "key" : "offer_hostname",
        "value" : "10.0.0.197"
      }, {
        "key" : "offer_region",
        "value" : "aws/ap-southeast-2"
      }, {
        "key" : "offer_zone",
        "value" : "aws/ap-southeast-2c"
      }, {
        "key" : "target_configuration",
        "value" : "29bf852c-7e17-48ba-ac8e-84634fb99f86"
      }, {
        "key" : "task_type",
        "value" : "nifi"
      } ]
    },
    "discovery" : null
  },
  "status" : {
    "taskId" : {
      "value" : "nifi-0-metrics__82d8bdc2-ce76-4cb3-9273-d17ce4ce9a95"
    },
    "state" : "TASK_RUNNING",
    "message" : null,
    "source" : "SOURCE_EXECUTOR",
    "reason" : null,
    "data" : null,
    "slaveId" : {
      "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-S4"
    },
    "executorId" : {
      "value" : "nifi__4e03dd7d-8635-47e6-ade6-db0995dedb8a"
    },
    "timestamp" : 1.526653359317726E9,
    "uuid" : "yzIJnt7yTtGiRtkFHDD0Og==",
    "healthy" : null,
    "checkStatus" : null,
    "labels" : null,
    "containerStatus" : {
      "containerId" : {
        "value" : "cf3e720e-5e44-4086-a532-b52cac1e128c",
        "parent" : {
          "value" : "06131b60-ffc2-4721-977e-881518b5547a",
          "parent" : null
        }
      },
      "networkInfos" : [ {
        "ipAddresses" : [ {
          "protocol" : null,
          "ipAddress" : "10.0.0.197"
        } ],
        "name" : null,
        "groups" : [ ],
        "labels" : null,
        "portMappings" : [ ]
      } ],
      "cgroupInfo" : null,
      "executorPid" : 15010
    },
    "unreachableTime" : null
  }
}, {
  "info" : {
    "name" : "nifi-0-node",
    "taskId" : {
      "value" : "nifi-0-node__8f0a64cb-1b65-4e15-8446-35d81c2d8129"
    },
    "slaveId" : {
      "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-S4"
    },
    "resources" : [ {
      "providerId" : null,
      "name" : "ports",
      "type" : "RANGES",
      "scalar" : null,
      "ranges" : {
        "range" : [ {
          "begin" : 1025,
          "end" : 1025
        } ]
      },
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "0bdbcff3-244b-42a2-b921-dbda93b158e3"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "cpus",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "0205ff52-edd1-440e-8db6-b3d22af486e4"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "mem",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 4096.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "dcef570f-f60e-4c65-9de8-48dde5ab7fe2"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "disk",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1000.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "96d5d225-4714-4f64-bc72-040139158e49"
          } ]
        }
      } ],
      "disk" : {
        "persistence" : {
          "id" : "92143280-3d4c-4411-99a2-bf977c2d854c",
          "principal" : "nifi-principal"
        },
        "volume" : {
          "mode" : "RW",
          "containerPath" : "database-repository",
          "hostPath" : null,
          "image" : null,
          "source" : null
        },
        "source" : null
      },
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "disk",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1000.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "0d48b1db-a5a8-4c4f-928f-4f598eb74759"
          } ]
        }
      } ],
      "disk" : {
        "persistence" : {
          "id" : "e1d0a391-6b39-49e0-ad49-7fcefce1710f",
          "principal" : "nifi-principal"
        },
        "volume" : {
          "mode" : "RW",
          "containerPath" : "flowfile-repository",
          "hostPath" : null,
          "image" : null,
          "source" : null
        },
        "source" : null
      },
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "disk",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1000.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "68d8edee-ff86-40a6-b534-cc537de7442c"
          } ]
        }
      } ],
      "disk" : {
        "persistence" : {
          "id" : "307226e0-30ae-4bb2-912b-fec502b3500e",
          "principal" : "nifi-principal"
        },
        "volume" : {
          "mode" : "RW",
          "containerPath" : "provenance-repository",
          "hostPath" : null,
          "image" : null,
          "source" : null
        },
        "source" : null
      },
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "disk",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1000.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "9040df53-97ad-431b-a903-4ac913d0d3ad"
          } ]
        }
      } ],
      "disk" : {
        "persistence" : {
          "id" : "19f7bc15-e8bc-4c3f-9412-b6f675da015d",
          "principal" : "nifi-principal"
        },
        "volume" : {
          "mode" : "RW",
          "containerPath" : "content-repository",
          "hostPath" : null,
          "image" : null,
          "source" : null
        },
        "source" : null
      },
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "disk",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 1000.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "e576dae7-2475-4891-ac7b-b56237617aa0"
          } ]
        }
      } ],
      "disk" : {
        "persistence" : {
          "id" : "1a3a9789-7af7-4843-8c80-26466943ae0d",
          "principal" : "nifi-principal"
        },
        "volume" : {
          "mode" : "RW",
          "containerPath" : "misc-repository",
          "hostPath" : null,
          "image" : null,
          "source" : null
        },
        "source" : null
      },
      "revocable" : null,
      "shared" : null
    } ],
    "executor" : {
      "type" : "DEFAULT",
      "executorId" : {
        "value" : "nifi__4e03dd7d-8635-47e6-ade6-db0995dedb8a"
      },
      "frameworkId" : {
        "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-0007"
      },
      "command" : null,
      "container" : {
        "type" : "MESOS",
        "volumes" : [ ],
        "hostname" : null,
        "docker" : null,
        "mesos" : null,
        "networkInfos" : [ ],
        "linuxInfo" : null,
        "rlimitInfo" : {
          "rlimits" : [ {
            "type" : "RLMT_NOFILE",
            "hard" : 50000,
            "soft" : 50000
          }, {
            "type" : "RLMT_NPROC",
            "hard" : 10000,
            "soft" : 10000
          } ]
        },
        "ttyInfo" : null
      },
      "resources" : [ {
        "providerId" : null,
        "name" : "cpus",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 0.1
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "2f853459-817e-4b7d-aac4-734f77da6f87"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "mem",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 32.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "d38648f9-9c11-4fea-97cc-65ba144e2b44"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "disk",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 256.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "655888c9-885e-44c8-9105-fbdcd87a83fd"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      } ],
      "name" : "nifi",
      "source" : null,
      "data" : null,
      "discovery" : null,
      "shutdownGracePeriod" : null,
      "labels" : {
        "labels" : [ {
          "key" : "DCOS_SPACE",
          "value" : "/nifi"
        } ]
      }
    },
    "command" : {
      "uris" : [ {
        "value" : "https://downloads.mesosphere.com/java/server-jre-8u162-linux-x64.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/bootstrap.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-binary/nifi-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/executor.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-ap-southeast-2.amazonaws.com/nifi-toolkit/nifi-toolkit-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-janitor.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-statsd.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-api-access.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-python/python-2.7.14.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://api.nifi.marathon.l4lb.thisdcos.directory/v1/artifacts/template/29bf852c-7e17-48ba-ac8e-84634fb99f86/nifi/node/nifi.properties",
        "executable" : null,
        "extract" : false,
        "cache" : null,
        "outputFile" : "config-templates/nifi.properties"
      }, {
        "value" : "http://api.nifi.marathon.l4lb.thisdcos.directory/v1/artifacts/template/29bf852c-7e17-48ba-ac8e-84634fb99f86/nifi/node/bootstrap.conf",
        "executable" : null,
        "extract" : false,
        "cache" : null,
        "outputFile" : "config-templates/bootstrap.conf"
      }, {
        "value" : "http://api.nifi.marathon.l4lb.thisdcos.directory/v1/artifacts/template/29bf852c-7e17-48ba-ac8e-84634fb99f86/nifi/node/statemanagement.conf",
        "executable" : null,
        "extract" : false,
        "cache" : null,
        "outputFile" : "config-templates/statemanagement.conf"
      } ],
      "environment" : {
        "variables" : [ {
          "name" : "CONFIG_TEMPLATE_BOOTSTRAP_CONF",
          "type" : null,
          "value" : "config-templates/bootstrap.conf,nifi-1.5.0/conf/bootstrap.conf",
          "secret" : null
        }, {
          "name" : "CONFIG_TEMPLATE_NIFI_PROPERTIES",
          "type" : null,
          "value" : "config-templates/nifi.properties,nifi-1.5.0/conf/nifi.properties",
          "secret" : null
        }, {
          "name" : "CONFIG_TEMPLATE_STATEMANAGEMENT_CONF",
          "type" : null,
          "value" : "config-templates/statemanagement.conf,nifi-1.5.0/conf/state-management.xml",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_HOST",
          "type" : null,
          "value" : "nifi.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_NAME",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_VIP_HOST",
          "type" : null,
          "value" : "nifi.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MAX",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MIN",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FIREWALL_FILE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES",
          "type" : null,
          "value" : "3",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_IS_NODE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE",
          "type" : null,
          "value" : "25",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_PORT",
          "type" : null,
          "value" : "12000",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_THREADS",
          "type" : null,
          "value" : "10",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_READ_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_IS_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CN_DN_NODE_IDENTITY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "1440",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE",
          "type" : null,
          "value" : "10 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES",
          "type" : null,
          "value" : "100",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE",
          "type" : null,
          "value" : "50%",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "content-repository",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_VIEWER_URL",
          "type" : null,
          "value" : "/nifi-content-viewer/",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_BORED_YIELD_DURATION",
          "type" : null,
          "value" : "10 millis",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD",
          "type" : null,
          "value" : "10 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL",
          "type" : null,
          "value" : "500 ms",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME",
          "type" : null,
          "value" : "30 days",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_AUTOREFRESH_INTERVAL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_BANNER_TEXT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_DATABASE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "database-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL",
          "type" : null,
          "value" : "2 mins",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "flowfile-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_PARTITIONS",
          "type" : null,
          "value" : "256",
          "secret" : null
        }, {
          "name" : "NIFI_FRAMEWORK_USER",
          "type" : null,
          "value" : "nobody",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_DEFAULT_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_SERVICE_PRINCIPAL",
          "type" : null,
          "value" : "nifiprincipal@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_USER_PRINCIPAL",
          "type" : null,
          "value" : "nifiadmin@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KILL_GRACE_PERIOD",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_METRICS_FREQUENCY",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "100000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY",
          "type" : null,
          "value" : "1_000_000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "provenance-repository",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS",
          "type" : null,
          "value" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT",
          "type" : null,
          "value" : "16",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH",
          "type" : null,
          "value" : "65536",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE",
          "type" : null,
          "value" : "1 GB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME",
          "type" : null,
          "value" : "24 hours",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_QUEUE_SWAP_THRESHOLD",
          "type" : null,
          "value" : "20000",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SOCKET_PORT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_NEEDCLIENTAUTH",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_URL",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_AUTHORIZER",
          "type" : null,
          "value" : "file-provider",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ALGORITHM",
          "type" : null,
          "value" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY_PROTECTED",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_PROVIDER",
          "type" : null,
          "value" : "BC",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_THREADS",
          "type" : null,
          "value" : "1",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_THREADS",
          "type" : null,
          "value" : "4",
          "secret" : null
        }, {
          "name" : "NIFI_VARIABLE_REGISTRY_PROPERTIES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_VERSION",
          "type" : null,
          "value" : "1.5.0",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE",
          "type" : null,
          "value" : "32 KB",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_PORT",
          "type" : null,
          "value" : "1026",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_PORT",
          "type" : null,
          "value" : "1025",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_THREADS",
          "type" : null,
          "value" : "200",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_WORKING_DIRECTORY",
          "type" : null,
          "value" : "./work/jetty",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_WAR_DIRECTORY",
          "type" : null,
          "value" : "./lib",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_STRING",
          "type" : null,
          "value" : "master.mesos:2181",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_SESSION_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "NODE_CPUS",
          "type" : null,
          "value" : "1",
          "secret" : null
        }, {
          "name" : "NODE_MEM",
          "type" : null,
          "value" : "4096",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_REGION",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_ZONE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "POD_INSTANCE_INDEX",
          "type" : null,
          "value" : "0",
          "secret" : null
        }, {
          "name" : "PORT_WEB",
          "type" : null,
          "value" : "1025",
          "secret" : null
        }, {
          "name" : "SCHEDULER_API_HOSTNAME",
          "type" : null,
          "value" : "api.nifi.marathon.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_DEBUG",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_ENABLED",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_HOSTNAME",
          "type" : null,
          "value" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_PORT",
          "type" : null,
          "value" : "2500",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_PRIMARY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "TASK_NAME",
          "type" : null,
          "value" : "nifi-0-node",
          "secret" : null
        }, {
          "name" : "nifi-0-node",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "REGION",
          "type" : null,
          "value" : "aws/ap-southeast-2",
          "secret" : null
        }, {
          "name" : "ZONE",
          "type" : null,
          "value" : "aws/ap-southeast-2c",
          "secret" : null
        } ]
      },
      "shell" : null,
      "value" : "./bootstrap \nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\necho \"INSTALL\" > misc-repository/readiness-info.txt\ninit_status=`cat misc-repository/init-status.txt`\necho $init_status\nif [ \"$init_status\" == \"Y\" ] ; then\n  mv misc-repository/login-identity-providers.xml nifi-1.5.0/conf\n  mv misc-repository/authorizers.xml nifi-1.5.0/conf \n  echo \"N\" > misc-repository/init-status.txt\nfi\n./nifi-${NIFI_VERSION}/bin/nifi.sh run\n",
      "arguments" : [ ],
      "user" : "nobody"
    },
    "container" : {
      "type" : "MESOS",
      "volumes" : [ ],
      "hostname" : null,
      "docker" : null,
      "mesos" : null,
      "networkInfos" : [ ],
      "linuxInfo" : {
        "capabilityInfo" : null,
        "boundingCapabilities" : null,
        "effectiveCapabilities" : null,
        "sharePidNamespace" : false
      },
      "rlimitInfo" : {
        "rlimits" : [ {
          "type" : "RLMT_NOFILE",
          "hard" : 50000,
          "soft" : 50000
        }, {
          "type" : "RLMT_NPROC",
          "hard" : 10000,
          "soft" : 10000
        } ]
      },
      "ttyInfo" : null
    },
    "healthCheck" : null,
    "check" : {
      "type" : "COMMAND",
      "command" : {
        "command" : {
          "uris" : [ ],
          "environment" : {
            "variables" : [ {
              "name" : "FRAMEWORK_HOST",
              "type" : null,
              "value" : "nifi.autoip.dcos.thisdcos.directory",
              "secret" : null
            }, {
              "name" : "FRAMEWORK_NAME",
              "type" : null,
              "value" : "nifi",
              "secret" : null
            }, {
              "name" : "FRAMEWORK_VIP_HOST",
              "type" : null,
              "value" : "nifi.l4lb.thisdcos.directory",
              "secret" : null
            }, {
              "name" : "NIFI_BOOTSTRAP_JVM_MAX",
              "type" : null,
              "value" : "512",
              "secret" : null
            }, {
              "name" : "NIFI_BOOTSTRAP_JVM_MIN",
              "type" : null,
              "value" : "512",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_FIREWALL_FILE",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES",
              "type" : null,
              "value" : "3",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME",
              "type" : null,
              "value" : "1 mins",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_IS_NODE",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT",
              "type" : null,
              "value" : "5 secs",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE",
              "type" : null,
              "value" : "25",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_NODE_PROTOCOL_PORT",
              "type" : null,
              "value" : "12000",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_NODE_PROTOCOL_THREADS",
              "type" : null,
              "value" : "10",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_NODE_READ_TIMEOUT",
              "type" : null,
              "value" : "5 secs",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL",
              "type" : null,
              "value" : "5 secs",
              "secret" : null
            }, {
              "name" : "NIFI_CLUSTER_PROTOCOL_IS_SECURE",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "NIFI_CN_DN_NODE_IDENTITY",
              "type" : null,
              "value" : "nifi",
              "secret" : null
            }, {
              "name" : "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE",
              "type" : null,
              "value" : "1440",
              "secret" : null
            }, {
              "name" : "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY",
              "type" : null,
              "value" : "1 mins",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE",
              "type" : null,
              "value" : "10 MB",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES",
              "type" : null,
              "value" : "100",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD",
              "type" : null,
              "value" : "12 hours",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE",
              "type" : null,
              "value" : "50%",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_REPOSITORY_DIRECTORY",
              "type" : null,
              "value" : "content-repository",
              "secret" : null
            }, {
              "name" : "NIFI_CONTENT_VIEWER_URL",
              "type" : null,
              "value" : "/nifi-content-viewer/",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_BORED_YIELD_DURATION",
              "type" : null,
              "value" : "10 millis",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD",
              "type" : null,
              "value" : "10 secs",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL",
              "type" : null,
              "value" : "500 ms",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE",
              "type" : null,
              "value" : "500 MB",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME",
              "type" : null,
              "value" : "30 days",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT",
              "type" : null,
              "value" : "1 mins",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_UI_AUTOREFRESH_INTERVAL",
              "type" : null,
              "value" : "30 secs",
              "secret" : null
            }, {
              "name" : "NIFI_CORE_UI_BANNER_TEXT",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_DATABASE_REPOSITORY_DIRECTORY",
              "type" : null,
              "value" : "database-repository",
              "secret" : null
            }, {
              "name" : "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL",
              "type" : null,
              "value" : "2 mins",
              "secret" : null
            }, {
              "name" : "NIFI_FLOWFILE_REPOSITORY_DIRECTORY",
              "type" : null,
              "value" : "flowfile-repository",
              "secret" : null
            }, {
              "name" : "NIFI_FLOWFILE_REPOSITORY_PARTITIONS",
              "type" : null,
              "value" : "256",
              "secret" : null
            }, {
              "name" : "NIFI_FRAMEWORK_USER",
              "type" : null,
              "value" : "nobody",
              "secret" : null
            }, {
              "name" : "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION",
              "type" : null,
              "value" : "12 hours",
              "secret" : null
            }, {
              "name" : "NIFI_KERBEROS_DEFAULT_REALM",
              "type" : null,
              "value" : "LOCAL",
              "secret" : null
            }, {
              "name" : "NIFI_KERBEROS_SERVICE_PRINCIPAL",
              "type" : null,
              "value" : "nifiprincipal@LOCAL",
              "secret" : null
            }, {
              "name" : "NIFI_KERBEROS_USER_PRINCIPAL",
              "type" : null,
              "value" : "nifiadmin@LOCAL",
              "secret" : null
            }, {
              "name" : "NIFI_KILL_GRACE_PERIOD",
              "type" : null,
              "value" : "20",
              "secret" : null
            }, {
              "name" : "NIFI_METRICS_FREQUENCY",
              "type" : null,
              "value" : "20",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE",
              "type" : null,
              "value" : "100000",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS",
              "type" : null,
              "value" : "2",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY",
              "type" : null,
              "value" : "1_000_000",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_DIRECTORY",
              "type" : null,
              "value" : "provenance-repository",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS",
              "type" : null,
              "value" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE",
              "type" : null,
              "value" : "500 MB",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS",
              "type" : null,
              "value" : "2",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT",
              "type" : null,
              "value" : "16",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH",
              "type" : null,
              "value" : "65536",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE",
              "type" : null,
              "value" : "1 GB",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME",
              "type" : null,
              "value" : "24 hours",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS",
              "type" : null,
              "value" : "2",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE",
              "type" : null,
              "value" : "100 MB",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME",
              "type" : null,
              "value" : "30 secs",
              "secret" : null
            }, {
              "name" : "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_QUEUE_SWAP_THRESHOLD",
              "type" : null,
              "value" : "20000",
              "secret" : null
            }, {
              "name" : "NIFI_REMOTE_INPUT_HTTP_ENABLED",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL",
              "type" : null,
              "value" : "30 secs",
              "secret" : null
            }, {
              "name" : "NIFI_REMOTE_INPUT_SECURE",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "NIFI_REMOTE_INPUT_SOCKET_PORT",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SECURITY_NEEDCLIENTAUTH",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SECURITY_OCSP_RESPONDER_URL",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SECURITY_USER_AUTHORIZER",
              "type" : null,
              "value" : "file-provider",
              "secret" : null
            }, {
              "name" : "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SENSITIVE_PROPS_ALGORITHM",
              "type" : null,
              "value" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
              "secret" : null
            }, {
              "name" : "NIFI_SENSITIVE_PROPS_KEY",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SENSITIVE_PROPS_KEY_PROTECTED",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_SENSITIVE_PROPS_PROVIDER",
              "type" : null,
              "value" : "BC",
              "secret" : null
            }, {
              "name" : "NIFI_SWAP_IN_PERIOD",
              "type" : null,
              "value" : "5 secs",
              "secret" : null
            }, {
              "name" : "NIFI_SWAP_IN_THREADS",
              "type" : null,
              "value" : "1",
              "secret" : null
            }, {
              "name" : "NIFI_SWAP_OUT_PERIOD",
              "type" : null,
              "value" : "5 secs",
              "secret" : null
            }, {
              "name" : "NIFI_SWAP_OUT_THREADS",
              "type" : null,
              "value" : "4",
              "secret" : null
            }, {
              "name" : "NIFI_VARIABLE_REGISTRY_PROPERTIES",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_VERSION",
              "type" : null,
              "value" : "1.5.0",
              "secret" : null
            }, {
              "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE",
              "type" : null,
              "value" : "32 KB",
              "secret" : null
            }, {
              "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE",
              "type" : null,
              "value" : "100 MB",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_HTTPS_HOST",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_HTTPS_PORT",
              "type" : null,
              "value" : "1026",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_HTTP_HOST",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT",
              "type" : null,
              "value" : "",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_HTTP_PORT",
              "type" : null,
              "value" : "1025",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_JETTY_THREADS",
              "type" : null,
              "value" : "200",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_JETTY_WORKING_DIRECTORY",
              "type" : null,
              "value" : "./work/jetty",
              "secret" : null
            }, {
              "name" : "NIFI_WEB_WAR_DIRECTORY",
              "type" : null,
              "value" : "./lib",
              "secret" : null
            }, {
              "name" : "NIFI_ZOOKEEPER_CONNECT_STRING",
              "type" : null,
              "value" : "master.mesos:2181",
              "secret" : null
            }, {
              "name" : "NIFI_ZOOKEEPER_CONNECT_TIMEOUT",
              "type" : null,
              "value" : "3 secs",
              "secret" : null
            }, {
              "name" : "NIFI_ZOOKEEPER_SESSION_TIMEOUT",
              "type" : null,
              "value" : "3 secs",
              "secret" : null
            }, {
              "name" : "NODE_CPUS",
              "type" : null,
              "value" : "1",
              "secret" : null
            }, {
              "name" : "NODE_MEM",
              "type" : null,
              "value" : "4096",
              "secret" : null
            }, {
              "name" : "PLACEMENT_REFERENCED_REGION",
              "type" : null,
              "value" : "true",
              "secret" : null
            }, {
              "name" : "PLACEMENT_REFERENCED_ZONE",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "POD_INSTANCE_INDEX",
              "type" : null,
              "value" : "0",
              "secret" : null
            }, {
              "name" : "PORT_WEB",
              "type" : null,
              "value" : "1025",
              "secret" : null
            }, {
              "name" : "SCHEDULER_API_HOSTNAME",
              "type" : null,
              "value" : "api.nifi.marathon.l4lb.thisdcos.directory",
              "secret" : null
            }, {
              "name" : "SECURITY_KERBEROS_DEBUG",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "SECURITY_KERBEROS_ENABLED",
              "type" : null,
              "value" : "false",
              "secret" : null
            }, {
              "name" : "SECURITY_KERBEROS_KDC_HOSTNAME",
              "type" : null,
              "value" : "kdc.marathon.autoip.dcos.thisdcos.directory",
              "secret" : null
            }, {
              "name" : "SECURITY_KERBEROS_KDC_PORT",
              "type" : null,
              "value" : "2500",
              "secret" : null
            }, {
              "name" : "SECURITY_KERBEROS_PRIMARY",
              "type" : null,
              "value" : "nifi",
              "secret" : null
            }, {
              "name" : "SECURITY_KERBEROS_REALM",
              "type" : null,
              "value" : "LOCAL",
              "secret" : null
            }, {
              "name" : "TASK_NAME",
              "type" : null,
              "value" : "nifi-0-node",
              "secret" : null
            }, {
              "name" : "nifi-0-node",
              "type" : null,
              "value" : "true",
              "secret" : null
            } ]
          },
          "shell" : null,
          "value" : "# The NiFi node has started when it logs a specific \n# \"${TASK_NAME}.${FRAMEWORK_HOST}:$nifi_web_port is now connected\" log line. \n# An example is below:\n# 2018/03/05 11:11:37 nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1025 is now connected.\nnifi_server_log_files=nifi-${NIFI_VERSION}/logs/nifi-app.log\nnifi_authorizations_file=$MESOS_SANDBOX/../../misc-repository/authorizations.xml\nnifi_host_name=${TASK_NAME}.${FRAMEWORK_HOST}\nnifi_web_port=${PORT_WEB}\nreadiness_info=`cat misc-repository/readiness-info.txt`\necho \"Executing shell script.\"\necho \"$readiness_info\"\nif [ \"$readiness_info\" == \"INSTALL\" ] ; then\n  echo \"Checking for successful log line in $nifi_server_log_files.\"\n  echo \"Looking for \\\"$nifi_host_name:$nifi_web_port is now connected or NiFi has started.\\\" in the server log file.\"\n  grep -q \"$nifi_host_name:$nifi_web_port is now connected\\|NiFi has started.\" $nifi_server_log_files\n  if [ $? -eq 0 ] ; then\n    echo \"Found started log line.\"\n    echo \"READY\" > misc-repository/readiness-info.txt\n    echo \"HOST=$nifi_host_name\" > misc-repository/url-info.properties\n    echo \"PORT=$nifi_web_port\" >> misc-repository/url-info.properties\n    echo \"AUTHORIZATIONS_FILE=$nifi_authorizations_file\" >> misc-repository/url-info.properties\n  else\n    echo \"started log line not found. Exiting.\"\n    exit 1\n  fi\n  echo \"Required log line found. NiFi is ready.\"\nelif [ $readiness_info == \"READY\" ] ; then\n  echo \"NiFi is ready.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the NiFi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nelif [ $readiness_info == \"RUNNING\" ] ; then\n  echo \"NiFi is running.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the NiFi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nfi\nexit 0\n",
          "arguments" : [ ],
          "user" : null
        }
      },
      "http" : null,
      "tcp" : null,
      "delaySeconds" : 10.0,
      "intervalSeconds" : 5.0,
      "timeoutSeconds" : 120.0
    },
    "killPolicy" : {
      "gracePeriod" : {
        "nanoseconds" : 0
      }
    },
    "data" : null,
    "labels" : {
      "labels" : [ {
        "key" : "goal_state",
        "value" : "RUNNING"
      }, {
        "key" : "index",
        "value" : "0"
      }, {
        "key" : "offer_attributes",
        "value" : ""
      }, {
        "key" : "offer_hostname",
        "value" : "10.0.0.197"
      }, {
        "key" : "offer_region",
        "value" : "aws/ap-southeast-2"
      }, {
        "key" : "offer_zone",
        "value" : "aws/ap-southeast-2c"
      }, {
        "key" : "target_configuration",
        "value" : "29bf852c-7e17-48ba-ac8e-84634fb99f86"
      }, {
        "key" : "task_type",
        "value" : "nifi"
      } ]
    },
    "discovery" : {
      "visibility" : "CLUSTER",
      "name" : "nifi-0-node",
      "environment" : null,
      "location" : null,
      "version" : null,
      "ports" : {
        "ports" : [ {
          "number" : 1025,
          "name" : "node",
          "protocol" : "tcp",
          "visibility" : "EXTERNAL",
          "labels" : {
            "labels" : [ {
              "key" : "VIP_cbdf1bcf-2363-40b9-85f9-0894453e3282",
              "value" : "node:1025"
            } ]
          }
        } ]
      },
      "labels" : null
    }
  },
  "status" : {
    "taskId" : {
      "value" : "nifi-0-node__8f0a64cb-1b65-4e15-8446-35d81c2d8129"
    },
    "state" : "TASK_RUNNING",
    "message" : null,
    "source" : "SOURCE_EXECUTOR",
    "reason" : "REASON_TASK_CHECK_STATUS_UPDATED",
    "data" : null,
    "slaveId" : {
      "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-S4"
    },
    "executorId" : {
      "value" : "nifi__4e03dd7d-8635-47e6-ade6-db0995dedb8a"
    },
    "timestamp" : 1.5266533810304341E9,
    "uuid" : "64gHf/tlSFCZIPKoCce8tQ==",
    "healthy" : null,
    "checkStatus" : {
      "type" : "COMMAND",
      "command" : {
        "exitCode" : 0
      },
      "http" : null,
      "tcp" : null
    },
    "labels" : null,
    "containerStatus" : {
      "containerId" : {
        "value" : "698604de-538f-4baa-b7b6-80bf9e6171f3",
        "parent" : {
          "value" : "06131b60-ffc2-4721-977e-881518b5547a",
          "parent" : null
        }
      },
      "networkInfos" : [ {
        "ipAddresses" : [ {
          "protocol" : null,
          "ipAddress" : "10.0.0.197"
        } ],
        "name" : null,
        "groups" : [ ],
        "labels" : null,
        "portMappings" : [ ]
      } ],
      "cgroupInfo" : null,
      "executorPid" : 7710
    },
    "unreachableTime" : null
  }
}, {
  "info" : {
    "name" : "nifi-0-restart-cleanup",
    "taskId" : {
      "value" : ""
    },
    "slaveId" : {
      "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-S4"
    },
    "resources" : [ {
      "providerId" : null,
      "name" : "cpus",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 0.5
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "7e02eed8-0968-4212-86a9-929ff376d4ed"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    }, {
      "providerId" : null,
      "name" : "mem",
      "type" : "SCALAR",
      "scalar" : {
        "value" : 512.0
      },
      "ranges" : null,
      "set" : null,
      "role" : null,
      "allocationInfo" : null,
      "reservation" : null,
      "reservations" : [ {
        "type" : "DYNAMIC",
        "role" : "nifi-role",
        "principal" : "nifi-principal",
        "labels" : {
          "labels" : [ {
            "key" : "resource_id",
            "value" : "71dc9b48-33cd-440d-9d02-d0fb44c8e014"
          } ]
        }
      } ],
      "disk" : null,
      "revocable" : null,
      "shared" : null
    } ],
    "executor" : {
      "type" : "DEFAULT",
      "executorId" : {
        "value" : "nifi__4e03dd7d-8635-47e6-ade6-db0995dedb8a"
      },
      "frameworkId" : {
        "value" : "f16589ce-d94e-44ee-9663-f2a6ca8809e0-0007"
      },
      "command" : null,
      "container" : {
        "type" : "MESOS",
        "volumes" : [ ],
        "hostname" : null,
        "docker" : null,
        "mesos" : null,
        "networkInfos" : [ ],
        "linuxInfo" : null,
        "rlimitInfo" : {
          "rlimits" : [ {
            "type" : "RLMT_NOFILE",
            "hard" : 50000,
            "soft" : 50000
          }, {
            "type" : "RLMT_NPROC",
            "hard" : 10000,
            "soft" : 10000
          } ]
        },
        "ttyInfo" : null
      },
      "resources" : [ {
        "providerId" : null,
        "name" : "cpus",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 0.1
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "2f853459-817e-4b7d-aac4-734f77da6f87"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "mem",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 32.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "d38648f9-9c11-4fea-97cc-65ba144e2b44"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      }, {
        "providerId" : null,
        "name" : "disk",
        "type" : "SCALAR",
        "scalar" : {
          "value" : 256.0
        },
        "ranges" : null,
        "set" : null,
        "role" : null,
        "allocationInfo" : null,
        "reservation" : null,
        "reservations" : [ {
          "type" : "DYNAMIC",
          "role" : "nifi-role",
          "principal" : "nifi-principal",
          "labels" : {
            "labels" : [ {
              "key" : "resource_id",
              "value" : "655888c9-885e-44c8-9105-fbdcd87a83fd"
            } ]
          }
        } ],
        "disk" : null,
        "revocable" : null,
        "shared" : null
      } ],
      "name" : "nifi",
      "source" : null,
      "data" : null,
      "discovery" : null,
      "shutdownGracePeriod" : null,
      "labels" : {
        "labels" : [ {
          "key" : "DCOS_SPACE",
          "value" : "/nifi"
        } ]
      }
    },
    "command" : {
      "uris" : [ {
        "value" : "https://downloads.mesosphere.com/java/server-jre-8u162-linux-x64.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/bootstrap.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-binary/nifi-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/executor.zip",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-ap-southeast-2.amazonaws.com/nifi-toolkit/nifi-toolkit-1.5.0-bin.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-janitor.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-statsd.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-api-access.jar",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      }, {
        "value" : "https://s3-us-west-1.amazonaws.com/nifi-python/python-2.7.14.tar.gz",
        "executable" : null,
        "extract" : null,
        "cache" : null,
        "outputFile" : null
      } ],
      "environment" : {
        "variables" : [ {
          "name" : "FRAMEWORK_HOST",
          "type" : null,
          "value" : "nifi.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_NAME",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "FRAMEWORK_VIP_HOST",
          "type" : null,
          "value" : "nifi.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MAX",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_BOOTSTRAP_JVM_MIN",
          "type" : null,
          "value" : "512",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FIREWALL_FILE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES",
          "type" : null,
          "value" : "3",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_IS_NODE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE",
          "type" : null,
          "value" : "25",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_PORT",
          "type" : null,
          "value" : "12000",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_PROTOCOL_THREADS",
          "type" : null,
          "value" : "10",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_NODE_READ_TIMEOUT",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CLUSTER_PROTOCOL_IS_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CN_DN_NODE_IDENTITY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "1440",
          "secret" : null
        }, {
          "name" : "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE",
          "type" : null,
          "value" : "10 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES",
          "type" : null,
          "value" : "100",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE",
          "type" : null,
          "value" : "50%",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "content-repository",
          "secret" : null
        }, {
          "name" : "NIFI_CONTENT_VIEWER_URL",
          "type" : null,
          "value" : "/nifi-content-viewer/",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_BORED_YIELD_DURATION",
          "type" : null,
          "value" : "10 millis",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD",
          "type" : null,
          "value" : "10 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL",
          "type" : null,
          "value" : "500 ms",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME",
          "type" : null,
          "value" : "30 days",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT",
          "type" : null,
          "value" : "1 mins",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_AUTOREFRESH_INTERVAL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_CORE_UI_BANNER_TEXT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_DATABASE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "database-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL",
          "type" : null,
          "value" : "2 mins",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "flowfile-repository",
          "secret" : null
        }, {
          "name" : "NIFI_FLOWFILE_REPOSITORY_PARTITIONS",
          "type" : null,
          "value" : "256",
          "secret" : null
        }, {
          "name" : "NIFI_FRAMEWORK_USER",
          "type" : null,
          "value" : "nobody",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION",
          "type" : null,
          "value" : "12 hours",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_DEFAULT_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_SERVICE_PRINCIPAL",
          "type" : null,
          "value" : "nifiprincipal@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KERBEROS_USER_PRINCIPAL",
          "type" : null,
          "value" : "nifiadmin@LOCAL",
          "secret" : null
        }, {
          "name" : "NIFI_KILL_GRACE_PERIOD",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_METRICS_FREQUENCY",
          "type" : null,
          "value" : "20",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE",
          "type" : null,
          "value" : "100000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY",
          "type" : null,
          "value" : "1_000_000",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_DIRECTORY",
          "type" : null,
          "value" : "provenance-repository",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS",
          "type" : null,
          "value" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE",
          "type" : null,
          "value" : "500 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT",
          "type" : null,
          "value" : "16",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH",
          "type" : null,
          "value" : "65536",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE",
          "type" : null,
          "value" : "1 GB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME",
          "type" : null,
          "value" : "24 hours",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS",
          "type" : null,
          "value" : "2",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_QUEUE_SWAP_THRESHOLD",
          "type" : null,
          "value" : "20000",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_ENABLED",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL",
          "type" : null,
          "value" : "30 secs",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SECURE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "NIFI_REMOTE_INPUT_SOCKET_PORT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_NEEDCLIENTAUTH",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_OCSP_RESPONDER_URL",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_AUTHORIZER",
          "type" : null,
          "value" : "file-provider",
          "secret" : null
        }, {
          "name" : "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_ALGORITHM",
          "type" : null,
          "value" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_KEY_PROTECTED",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_SENSITIVE_PROPS_PROVIDER",
          "type" : null,
          "value" : "BC",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_IN_THREADS",
          "type" : null,
          "value" : "1",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_PERIOD",
          "type" : null,
          "value" : "5 secs",
          "secret" : null
        }, {
          "name" : "NIFI_SWAP_OUT_THREADS",
          "type" : null,
          "value" : "4",
          "secret" : null
        }, {
          "name" : "NIFI_VARIABLE_REGISTRY_PROPERTIES",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_VERSION",
          "type" : null,
          "value" : "1.5.0",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE",
          "type" : null,
          "value" : "32 KB",
          "secret" : null
        }, {
          "name" : "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE",
          "type" : null,
          "value" : "100 MB",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTPS_PORT",
          "type" : null,
          "value" : "1026",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_HOST",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT",
          "type" : null,
          "value" : "",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_HTTP_PORT",
          "type" : null,
          "value" : "1025",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_THREADS",
          "type" : null,
          "value" : "200",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_JETTY_WORKING_DIRECTORY",
          "type" : null,
          "value" : "./work/jetty",
          "secret" : null
        }, {
          "name" : "NIFI_WEB_WAR_DIRECTORY",
          "type" : null,
          "value" : "./lib",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_STRING",
          "type" : null,
          "value" : "master.mesos:2181",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_CONNECT_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "NIFI_ZOOKEEPER_SESSION_TIMEOUT",
          "type" : null,
          "value" : "3 secs",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_REGION",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "PLACEMENT_REFERENCED_ZONE",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "POD_INSTANCE_INDEX",
          "type" : null,
          "value" : "0",
          "secret" : null
        }, {
          "name" : "SCHEDULER_API_HOSTNAME",
          "type" : null,
          "value" : "api.nifi.marathon.l4lb.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_DEBUG",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_ENABLED",
          "type" : null,
          "value" : "false",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_HOSTNAME",
          "type" : null,
          "value" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_KDC_PORT",
          "type" : null,
          "value" : "2500",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_PRIMARY",
          "type" : null,
          "value" : "nifi",
          "secret" : null
        }, {
          "name" : "SECURITY_KERBEROS_REALM",
          "type" : null,
          "value" : "LOCAL",
          "secret" : null
        }, {
          "name" : "TASK_NAME",
          "type" : null,
          "value" : "nifi-0-restart-cleanup",
          "secret" : null
        }, {
          "name" : "nifi-0-restart-cleanup",
          "type" : null,
          "value" : "true",
          "secret" : null
        }, {
          "name" : "REGION",
          "type" : null,
          "value" : "aws/ap-southeast-2",
          "secret" : null
        }, {
          "name" : "ZONE",
          "type" : null,
          "value" : "aws/ap-southeast-2c",
          "secret" : null
        } ]
      },
      "shell" : null,
      "value" : "# Clean NiFi Application i.e. remove all disconnected node.\nmisc_repo_path=../../misc-repository\nsleep 180\nusernodesecret=`cat usernode.keytab`\ncp $misc_repo_path/readiness-info.txt .\ncp $misc_repo_path/url-info.properties .\necho \"Executing Janitor program to clean the NiFi disconnected node.\"\nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\njava -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\n",
      "arguments" : [ ],
      "user" : "nobody"
    },
    "container" : {
      "type" : "MESOS",
      "volumes" : [ ],
      "hostname" : null,
      "docker" : null,
      "mesos" : null,
      "networkInfos" : [ ],
      "linuxInfo" : {
        "capabilityInfo" : null,
        "boundingCapabilities" : null,
        "effectiveCapabilities" : null,
        "sharePidNamespace" : false
      },
      "rlimitInfo" : {
        "rlimits" : [ {
          "type" : "RLMT_NOFILE",
          "hard" : 50000,
          "soft" : 50000
        }, {
          "type" : "RLMT_NPROC",
          "hard" : 10000,
          "soft" : 10000
        } ]
      },
      "ttyInfo" : null
    },
    "healthCheck" : null,
    "check" : null,
    "killPolicy" : {
      "gracePeriod" : {
        "nanoseconds" : 0
      }
    },
    "data" : null,
    "labels" : {
      "labels" : [ {
        "key" : "goal_state",
        "value" : "ONCE"
      }, {
        "key" : "index",
        "value" : "0"
      }, {
        "key" : "offer_attributes",
        "value" : ""
      }, {
        "key" : "offer_hostname",
        "value" : "10.0.0.197"
      }, {
        "key" : "offer_region",
        "value" : "aws/ap-southeast-2"
      }, {
        "key" : "offer_zone",
        "value" : "aws/ap-southeast-2c"
      }, {
        "key" : "target_configuration",
        "value" : "29bf852c-7e17-48ba-ac8e-84634fb99f86"
      }, {
        "key" : "task_type",
        "value" : "nifi"
      } ]
    },
    "discovery" : null
  },
  "status" : null
} ]
```

## Replace a Node

The replace endpoint can be used to replace a node with an instance running on another agent node.

CLI Example

```shell
dcos nifi pod replace <node-id>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/replace
```

If the operation succeeds, a `200 OK` is returned.

## Restart a Node

The restart endpoint can be used to restart a node in place on the same agent node.

CLI Example

```shell
dcos nifi pod restart <node-id>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/restart
```

If the operation succeeds a `200 OK` is returned.

## Pause a Node
The pause endpoint can be used to relaunch a node in an idle command state for debugging purposes.

CLI example

```shell
dcos nifi --name=nifi debug pod pause <node-id>
```

HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/pause
```


# Configuration API

The configuration API provides an endpoint to view current and previous configurations of the cluster.

## View Target Config

You can view the current target configuration by sending a GET request to `/v1/configurations/target`.

CLI Example

```shell
dcos nifi config target
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations/target
```

You will see a response similar to the following:

```json
{
  "name" : "nifi",
  "role" : "nifi-role",
  "principal" : "nifi-principal",
  "web-url" : null,
  "zookeeper" : "master.mesos:2181",
  "pod-specs" : [ {
    "type" : "nifi",
    "user" : "nobody",
    "count" : 2,
    "image" : null,
    "networks" : [ ],
    "rlimits" : [ {
      "name" : "RLIMIT_NOFILE",
      "soft" : 50000,
      "hard" : 50000
    }, {
      "name" : "RLIMIT_NPROC",
      "soft" : 10000,
      "hard" : 10000
    } ],
    "uris" : [ "https://downloads.mesosphere.com/java/server-jre-8u162-linux-x64.tar.gz", "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/bootstrap.zip", "https://s3-us-west-1.amazonaws.com/nifi-binary/nifi-1.5.0-bin.tar.gz", "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/executor.zip", "https://s3-ap-southeast-2.amazonaws.com/nifi-toolkit/nifi-toolkit-1.5.0-bin.tar.gz", "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-janitor.jar", "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-statsd.jar", "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-api-access.jar", "https://s3-us-west-1.amazonaws.com/nifi-python/python-2.7.14.tar.gz" ],
    "task-specs" : [ {
      "name" : "metrics",
      "goal" : "RUNNING",
      "essential" : false,
      "resource-set" : {
        "id" : "metrics-resource-set",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.2
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 32.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\nusernodesecret=`cat usernode.keytab`\necho \"Before running statsd\"\nsleep 180\ncp ../../misc-repository/url-info.properties .\njava -jar nifi-statsd.jar url-info.properties $STATSD_UDP_HOST $STATSD_UDP_PORT ${NIFI_METRICS_FREQUENCY} ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\necho \"After running statsd\"\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "init",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "node-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 4096.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "NamedVIPSpec",
          "value" : {
            "type" : "RANGES",
            "scalar" : null,
            "ranges" : {
              "range" : [ {
                "begin" : 1025,
                "end" : 1025
              } ]
            },
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal",
          "env-key" : "PORT_WEB",
          "port-name" : "node",
          "protocol" : "tcp",
          "visibility" : "EXTERNAL",
          "vip-name" : "node",
          "vip-port" : 1025,
          "network-names" : [ ],
          "name" : "ports"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "database-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "flowfile-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "provenance-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "content-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "misc-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "./bootstrap\nkerb_enabled=false\nif [ \"$kerb_enabled\" == true ] ; then\n  echo \"Y\" > misc-repository/init-status.txt\nelse\n  echo \"N\" > misc-repository/init-status.txt\nfi\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ {
        "name" : "nifi.properties",
        "relative-path" : "nifi-1.5.0/conf/nifi.properties",
        "template-content" : "# Licensed to the Apache Software Foundation (ASF) under one or more\n# contributor license agreements.  See the NOTICE file distributed with\n# this work for additional information regarding copyright ownership.\n# The ASF licenses this file to You under the Apache License, Version 2.0\n# (the \"License\"); you may not use this file except in compliance with\n# the License.  You may obtain a copy of the License at\n#\n#     http://www.apache.org/licenses/LICENSE-2.0\n#\n# Unless required by applicable law or agreed to in writing, software\n# distributed under the License is distributed on an \"AS IS\" BASIS,\n# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n# See the License for the specific language governing permissions and\n# limitations under the License.\n\n# Core Properties #\nnifi.flow.configuration.file={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/flow.xml.gz\nnifi.flow.configuration.archive.enabled={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED}}\nnifi.flow.configuration.archive.dir={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/archive\nnifi.flow.configuration.archive.max.time={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME}}\nnifi.flow.configuration.archive.max.storage={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE}}\nnifi.flow.configuration.archive.max.count={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT}}\nnifi.flowcontroller.autoResumeState={{NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE}}\nnifi.flowcontroller.graceful.shutdown.period={{NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD}}\nnifi.flowservice.writedelay.interval={{NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL}}\nnifi.administrative.yield.duration=30 secs\n# If a component has no work to do (is \"bored\"), how long should we wait before checking again for work?\nnifi.bored.yield.duration={{NIFI_CORE_BORED_YIELD_DURATION}}\n\nnifi.authorizer.configuration.file=./conf/authorizers.xml\nnifi.login.identity.provider.configuration.file=./conf/login-identity-providers.xml\nnifi.templates.directory=./conf/templates\nnifi.ui.banner.text={{NIFI_CORE_UI_BANNER_TEXT}}\nnifi.ui.autorefresh.interval={{NIFI_CORE_UI_AUTOREFRESH_INTERVAL}}\nnifi.nar.library.directory=./lib\nnifi.nar.working.directory=./work/nar\nnifi.documentation.working.directory=./work/docs/components\n\nnifi.processor.scheduling.timeout={{NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT}}\n\n\n# State Management #\n####################\nnifi.state.management.configuration.file=./conf/state-management.xml\n# The ID of the local state provider\nnifi.state.management.provider.local=local-provider\n# The ID of the cluster-wide state provider. This will be ignored if NiFi is not clustered but must be populated if running in a cluster.\nnifi.state.management.provider.cluster=zk-provider\n# Specifies whether or not this instance of NiFi should run an embedded ZooKeeper server\nnifi.state.management.embedded.zookeeper.start=false\n# Properties file that provides the ZooKeeper properties to use if <nifi.state.management.embedded.zookeeper.start> is set to true\nnifi.state.management.embedded.zookeeper.properties=./conf/zookeeper.properties\n\n\n# H2 Settings\nnifi.database.directory={{MESOS_SANDBOX}}/{{NIFI_DATABASE_REPOSITORY_DIRECTORY}}\nnifi.h2.url.append=;LOCK_TIMEOUT=25000;WRITE_DELAY=0;AUTO_SERVER=FALSE\n\n# FlowFile Repository\nnifi.flowfile.repository.implementation=org.apache.nifi.controller.repository.WriteAheadFlowFileRepository\nnifi.flowfile.repository.directory={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}\nnifi.flowfile.repository.partitions={{NIFI_FLOWFILE_REPOSITORY_PARTITIONS}}\nnifi.flowfile.repository.checkpoint.interval={{NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL}}\nnifi.flowfile.repository.always.sync={{NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC}}\n\n# Swap Management Properties\nnifi.swap.manager.implementation=org.apache.nifi.controller.FileSystemSwapManager\nnifi.queue.swap.threshold={{NIFI_QUEUE_SWAP_THRESHOLD}}\nnifi.swap.in.period={{NIFI_SWAP_IN_PERIOD}}\nnifi.swap.in.threads={{NIFI_SWAP_IN_THREADS}}\nnifi.swap.out.period={{NIFI_SWAP_OUT_PERIOD}}\nnifi.swap.out.threads={{NIFI_SWAP_OUT_THREADS}}\n\n# Content Repository Properties\nnifi.content.repository.implementation=org.apache.nifi.controller.repository.FileSystemRepository\n\n# File System Content Repository Properties\nnifi.content.claim.max.appendable.size={{NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE}}\nnifi.content.claim.max.flow.files={{NIFI_CONTENT_CLAIM_MAX_FLOW_FILES}}\nnifi.content.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_CONTENT_REPOSITORY_DIRECTORY}}\nnifi.content.repository.archive.max.retention.period={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD}}\nnifi.content.repository.archive.max.usage.percentage={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE}}\nnifi.content.repository.archive.enabled={{NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED}}\nnifi.content.repository.always.sync={{NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC}}\nnifi.content.viewer.url={{NIFI_CONTENT_VIEWER_URL}}\n\n#Volatile Content Repository Properties\nnifi.volatile.content.repository.max.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE}}\nnifi.volatile.content.repository.block.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE}}\n\n# Provenance Repository Properties\nnifi.provenance.repository.implementation=org.apache.nifi.provenance.PersistentProvenanceRepository\nnifi.provenance.repository.debug.frequency=1_000_000\nnifi.provenance.repository.encryption.key.provider.implementation=\nnifi.provenance.repository.encryption.key.provider.location=\nnifi.provenance.repository.encryption.key.id=\nnifi.provenance.repository.encryption.key=\n\n# Persistent Provenance Repository Properties\nnifi.provenance.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_PROVENANCE_REPOSITORY_DIRECTORY}}\nnifi.provenance.repository.max.storage.time={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME}}\nnifi.provenance.repository.max.storage.size={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE}}\nnifi.provenance.repository.rollover.time={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME}}\nnifi.provenance.repository.rollover.size={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE}}\nnifi.provenance.repository.query.threads={{NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS}}\nnifi.provenance.repository.index.threads={{NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS}}\nnifi.provenance.repository.compress.on.rollover={{NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER}}\nnifi.provenance.repository.always.sync={{NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC}}\nnifi.provenance.repository.journal.count={{NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT}}\nnifi.provenance.repository.indexed.fields={{NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS}}\nnifi.provenance.repository.indexed.attributes={{NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES}}\nnifi.provenance.repository.index.shard.size={{NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE}}\nnifi.provenance.repository.max.attribute.length={{NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH}}\n\n# Volatile Provenance Respository Properties\nnifi.provenance.repository.buffer.size={{NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE}}\n\n# Write Ahead Provenance Repository Properties\n# (In addition to Persistent Provenance Repository Properties)\nnifi.provenance.repository.concurrent.merge.threads={{NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS}}\nnifi.provenance.repository.warm.cache.frequency={{NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY}}\n\n# Encrypted Write Ahead Provenance Repository Properties\nnifi.provenance.repository.debug.frequency={{NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY}}\nnifi.provenance.repository.encryption.key.provider.implementation={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION}}\nnifi.provenance.repository.encryption.key.provider.location={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION}}\nnifi.provenance.repository.encryption.key.id={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID}}\nnifi.provenance.repository.encryption.key={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY}}\n\n# Component Status Repository\nnifi.components.status.repository.implementation=org.apache.nifi.controller.status.history.VolatileComponentStatusRepository\nnifi.components.status.repository.buffer.size={{NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE}}\nnifi.components.status.snapshot.frequency={{NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY}}\n\n# Site to Site properties\nnifi.remote.input.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.remote.input.secure={{NIFI_REMOTE_INPUT_SECURE}}\nnifi.remote.input.socket.port={{NIFI_REMOTE_INPUT_SOCKET_PORT}}\nnifi.remote.input.http.enabled={{NIFI_REMOTE_INPUT_HTTP_ENABLED}}\nnifi.remote.input.http.transaction.ttl={{NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL}}\n\n# Web Properties\nnifi.web.war.directory={{NIFI_WEB_WAR_DIRECTORY}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.web.http.port={{NIFI_WEB_HTTP_PORT}}\nnifi.web.http.network.interface.default=\nnifi.web.https.host=\nnifi.web.https.port=\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host=\nnifi.web.http.port=\nnifi.web.http.network.interface.default=\nnifi.web.https.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\n#nifi.web.https.host=0.0.0.0\nnifi.web.https.port={{NIFI_WEB_HTTPS_PORT}}\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.jetty.working.directory={{NIFI_WEB_JETTY_WORKING_DIRECTORY}}\nnifi.web.jetty.threads={{NIFI_WEB_JETTY_THREADS}}\n\n# Security Properties\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore={{MESOS_SANDBOX}}/node.keystore\nnifi.security.keystoreType=jks\nnifi.security.keystorePasswd=notsecure\nnifi.security.keyPasswd=notsecure\nnifi.security.truststore={{MESOS_SANDBOX}}/node.truststore\nnifi.security.truststoreType=jks\nnifi.security.truststorePasswd=notsecure\nnifi.security.needClientAuth=true\n\nnifi.security.user.authorizer=managed-authorizer\n{{#SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=kerberos-provider\n{{/SECURITY_KERBEROS_ENABLED}}\n{{^SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=\n{{/SECURITY_KERBEROS_ENABLED}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore=\nnifi.security.keystoreType=\nnifi.security.keystorePasswd=\nnifi.security.keyPasswd=\nnifi.security.truststore=\nnifi.security.truststoreType=\nnifi.security.truststorePasswd=\n\nnifi.security.needClientAuth={{NIFI_SECURITY_NEEDCLIENTAUTH}}\nnifi.security.user.authorizer={{NIFI_SECURITY_USER_AUTHORIZER}}\nnifi.security.user.login.identity.provider={{NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Identity Mapping Properties\nnifi.security.identity.mapping.pattern.dn=\nnifi.security.identity.mapping.value.dn=\nnifi.security.identity.mapping.pattern.kerb=\nnifi.security.identity.mapping.value.kerb=\n\n# Cluster Common Properties\nnifi.cluster.protocol.heartbeat.interval={{NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=false\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}} \n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=true\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Cluster Node Properties\nnifi.cluster.is.node={{NIFI_CLUSTER_IS_NODE}}\nnifi.cluster.node.address={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.cluster.node.protocol.port={{NIFI_CLUSTER_NODE_PROTOCOL_PORT}}\nnifi.cluster.node.protocol.threads={{NIFI_CLUSTER_NODE_PROTOCOL_THREADS}}\nnifi.cluster.node.event.history.size={{NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE}}\nnifi.cluster.node.connection.timeout={{NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT}}\nnifi.cluster.node.read.timeout={{NIFI_CLUSTER_NODE_READ_TIMEOUT}}\nnifi.cluster.firewall.file={{NIFI_CLUSTER_FIREWALL_FILE}}\nnifi.cluster.flow.election.max.wait.time={{NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME}}\nnifi.cluster.flow.election.max.candidates=\n\n# Zookeeper Properties\nnifi.zookeeper.connect.string={{NIFI_ZOOKEEPER_CONNECT_STRING}}\nnifi.zookeeper.connect.timeout={{NIFI_ZOOKEEPER_CONNECT_TIMEOUT}}\nnifi.zookeeper.session.timeout={{NIFI_ZOOKEEPER_SESSION_TIMEOUT}}\nnifi.zookeeper.root.node=/nifi{{FRAMEWORK_NAME}}\n\n# Kerberos Properties\nnifi.kerberos.krb5.file={{MESOS_SANDBOX}}/nifi-{{NIFI_VERSION}}/conf/krb5.conf\nnifi.kerberos.service.principal={{NIFI_KERBEROS_SERVICE_PRINCIPAL}}\nnifi.kerberos.service.keytab.location=node.keytab\n\nnifi.kerberos.spnego.principal=\nnifi.kerberos.spnego.keytab.location=\nnifi.kerberos.spnego.authentication.expiration=12 hours\n\n# Custom Properties\nnifi.variable.registry.properties={{NIFI_VARIABLE_REGISTRY_PROPERTIES}}\n"
      } ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "node",
      "goal" : "RUNNING",
      "essential" : true,
      "resource-set" : {
        "id" : "node-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 4096.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "NamedVIPSpec",
          "value" : {
            "type" : "RANGES",
            "scalar" : null,
            "ranges" : {
              "range" : [ {
                "begin" : 1025,
                "end" : 1025
              } ]
            },
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal",
          "env-key" : "PORT_WEB",
          "port-name" : "node",
          "protocol" : "tcp",
          "visibility" : "EXTERNAL",
          "vip-name" : "node",
          "vip-port" : 1025,
          "network-names" : [ ],
          "name" : "ports"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "database-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "flowfile-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "provenance-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "content-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "misc-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "./bootstrap \nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\necho \"INSTALL\" > misc-repository/readiness-info.txt\ninit_status=`cat misc-repository/init-status.txt`\necho $init_status\nif [ \"$init_status\" == \"Y\" ] ; then\n  mv misc-repository/login-identity-providers.xml nifi-1.5.0/conf\n  mv misc-repository/authorizers.xml nifi-1.5.0/conf \n  echo \"N\" > misc-repository/init-status.txt\nfi\n./nifi-${NIFI_VERSION}/bin/nifi.sh run\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "NODE_CPUS" : "1",
          "NODE_MEM" : "4096",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : {
        "command" : "# The NiFi node has started when it logs a specific \n# \"${TASK_NAME}.${FRAMEWORK_HOST}:$nifi_web_port is now connected\" log line. \n# An example is below:\n# 2018/03/05 11:11:37 nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1025 is now connected.\nnifi_server_log_files=nifi-${NIFI_VERSION}/logs/nifi-app.log\nnifi_authorizations_file=$MESOS_SANDBOX/../../misc-repository/authorizations.xml\nnifi_host_name=${TASK_NAME}.${FRAMEWORK_HOST}\nnifi_web_port=${PORT_WEB}\nreadiness_info=`cat misc-repository/readiness-info.txt`\necho \"Executing shell script.\"\necho \"$readiness_info\"\nif [ \"$readiness_info\" == \"INSTALL\" ] ; then\n  echo \"Checking for successful log line in $nifi_server_log_files.\"\n  echo \"Looking for \\\"$nifi_host_name:$nifi_web_port is now connected or NiFi has started.\\\" in the server log file.\"\n  grep -q \"$nifi_host_name:$nifi_web_port is now connected\\|NiFi has started.\" $nifi_server_log_files\n  if [ $? -eq 0 ] ; then\n    echo \"Found started log line.\"\n    echo \"READY\" > misc-repository/readiness-info.txt\n    echo \"HOST=$nifi_host_name\" > misc-repository/url-info.properties\n    echo \"PORT=$nifi_web_port\" >> misc-repository/url-info.properties\n    echo \"AUTHORIZATIONS_FILE=$nifi_authorizations_file\" >> misc-repository/url-info.properties\n  else\n    echo \"started log line not found. Exiting.\"\n    exit 1\n  fi\n  echo \"Required log line found. NiFi is ready.\"\nelif [ $readiness_info == \"READY\" ] ; then\n  echo \"NiFi is ready.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the NiFi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nelif [ $readiness_info == \"RUNNING\" ] ; then\n  echo \"NiFi is running.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the NiFi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nfi\nexit 0\n",
        "delay" : 10,
        "interval" : 5,
        "timeout" : 120
      },
      "config-files" : [ {
        "name" : "nifi.properties",
        "relative-path" : "nifi-1.5.0/conf/nifi.properties",
        "template-content" : "# Licensed to the Apache Software Foundation (ASF) under one or more\n# contributor license agreements.  See the NOTICE file distributed with\n# this work for additional information regarding copyright ownership.\n# The ASF licenses this file to You under the Apache License, Version 2.0\n# (the \"License\"); you may not use this file except in compliance with\n# the License.  You may obtain a copy of the License at\n#\n#     http://www.apache.org/licenses/LICENSE-2.0\n#\n# Unless required by applicable law or agreed to in writing, software\n# distributed under the License is distributed on an \"AS IS\" BASIS,\n# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n# See the License for the specific language governing permissions and\n# limitations under the License.\n\n# Core Properties #\nnifi.flow.configuration.file={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/flow.xml.gz\nnifi.flow.configuration.archive.enabled={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED}}\nnifi.flow.configuration.archive.dir={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/archive\nnifi.flow.configuration.archive.max.time={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME}}\nnifi.flow.configuration.archive.max.storage={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE}}\nnifi.flow.configuration.archive.max.count={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT}}\nnifi.flowcontroller.autoResumeState={{NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE}}\nnifi.flowcontroller.graceful.shutdown.period={{NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD}}\nnifi.flowservice.writedelay.interval={{NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL}}\nnifi.administrative.yield.duration=30 secs\n# If a component has no work to do (is \"bored\"), how long should we wait before checking again for work?\nnifi.bored.yield.duration={{NIFI_CORE_BORED_YIELD_DURATION}}\n\nnifi.authorizer.configuration.file=./conf/authorizers.xml\nnifi.login.identity.provider.configuration.file=./conf/login-identity-providers.xml\nnifi.templates.directory=./conf/templates\nnifi.ui.banner.text={{NIFI_CORE_UI_BANNER_TEXT}}\nnifi.ui.autorefresh.interval={{NIFI_CORE_UI_AUTOREFRESH_INTERVAL}}\nnifi.nar.library.directory=./lib\nnifi.nar.working.directory=./work/nar\nnifi.documentation.working.directory=./work/docs/components\n\nnifi.processor.scheduling.timeout={{NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT}}\n\n\n# State Management #\n####################\nnifi.state.management.configuration.file=./conf/state-management.xml\n# The ID of the local state provider\nnifi.state.management.provider.local=local-provider\n# The ID of the cluster-wide state provider. This will be ignored if NiFi is not clustered but must be populated if running in a cluster.\nnifi.state.management.provider.cluster=zk-provider\n# Specifies whether or not this instance of NiFi should run an embedded ZooKeeper server\nnifi.state.management.embedded.zookeeper.start=false\n# Properties file that provides the ZooKeeper properties to use if <nifi.state.management.embedded.zookeeper.start> is set to true\nnifi.state.management.embedded.zookeeper.properties=./conf/zookeeper.properties\n\n\n# H2 Settings\nnifi.database.directory={{MESOS_SANDBOX}}/{{NIFI_DATABASE_REPOSITORY_DIRECTORY}}\nnifi.h2.url.append=;LOCK_TIMEOUT=25000;WRITE_DELAY=0;AUTO_SERVER=FALSE\n\n# FlowFile Repository\nnifi.flowfile.repository.implementation=org.apache.nifi.controller.repository.WriteAheadFlowFileRepository\nnifi.flowfile.repository.directory={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}\nnifi.flowfile.repository.partitions={{NIFI_FLOWFILE_REPOSITORY_PARTITIONS}}\nnifi.flowfile.repository.checkpoint.interval={{NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL}}\nnifi.flowfile.repository.always.sync={{NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC}}\n\n# Swap Management Properties\nnifi.swap.manager.implementation=org.apache.nifi.controller.FileSystemSwapManager\nnifi.queue.swap.threshold={{NIFI_QUEUE_SWAP_THRESHOLD}}\nnifi.swap.in.period={{NIFI_SWAP_IN_PERIOD}}\nnifi.swap.in.threads={{NIFI_SWAP_IN_THREADS}}\nnifi.swap.out.period={{NIFI_SWAP_OUT_PERIOD}}\nnifi.swap.out.threads={{NIFI_SWAP_OUT_THREADS}}\n\n# Content Repository Properties\nnifi.content.repository.implementation=org.apache.nifi.controller.repository.FileSystemRepository\n\n# File System Content Repository Properties\nnifi.content.claim.max.appendable.size={{NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE}}\nnifi.content.claim.max.flow.files={{NIFI_CONTENT_CLAIM_MAX_FLOW_FILES}}\nnifi.content.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_CONTENT_REPOSITORY_DIRECTORY}}\nnifi.content.repository.archive.max.retention.period={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD}}\nnifi.content.repository.archive.max.usage.percentage={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE}}\nnifi.content.repository.archive.enabled={{NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED}}\nnifi.content.repository.always.sync={{NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC}}\nnifi.content.viewer.url={{NIFI_CONTENT_VIEWER_URL}}\n\n#Volatile Content Repository Properties\nnifi.volatile.content.repository.max.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE}}\nnifi.volatile.content.repository.block.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE}}\n\n# Provenance Repository Properties\nnifi.provenance.repository.implementation=org.apache.nifi.provenance.PersistentProvenanceRepository\nnifi.provenance.repository.debug.frequency=1_000_000\nnifi.provenance.repository.encryption.key.provider.implementation=\nnifi.provenance.repository.encryption.key.provider.location=\nnifi.provenance.repository.encryption.key.id=\nnifi.provenance.repository.encryption.key=\n\n# Persistent Provenance Repository Properties\nnifi.provenance.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_PROVENANCE_REPOSITORY_DIRECTORY}}\nnifi.provenance.repository.max.storage.time={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME}}\nnifi.provenance.repository.max.storage.size={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE}}\nnifi.provenance.repository.rollover.time={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME}}\nnifi.provenance.repository.rollover.size={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE}}\nnifi.provenance.repository.query.threads={{NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS}}\nnifi.provenance.repository.index.threads={{NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS}}\nnifi.provenance.repository.compress.on.rollover={{NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER}}\nnifi.provenance.repository.always.sync={{NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC}}\nnifi.provenance.repository.journal.count={{NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT}}\nnifi.provenance.repository.indexed.fields={{NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS}}\nnifi.provenance.repository.indexed.attributes={{NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES}}\nnifi.provenance.repository.index.shard.size={{NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE}}\nnifi.provenance.repository.max.attribute.length={{NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH}}\n\n# Volatile Provenance Respository Properties\nnifi.provenance.repository.buffer.size={{NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE}}\n\n# Write Ahead Provenance Repository Properties\n# (In addition to Persistent Provenance Repository Properties)\nnifi.provenance.repository.concurrent.merge.threads={{NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS}}\nnifi.provenance.repository.warm.cache.frequency={{NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY}}\n\n# Encrypted Write Ahead Provenance Repository Properties\nnifi.provenance.repository.debug.frequency={{NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY}}\nnifi.provenance.repository.encryption.key.provider.implementation={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION}}\nnifi.provenance.repository.encryption.key.provider.location={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION}}\nnifi.provenance.repository.encryption.key.id={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID}}\nnifi.provenance.repository.encryption.key={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY}}\n\n# Component Status Repository\nnifi.components.status.repository.implementation=org.apache.nifi.controller.status.history.VolatileComponentStatusRepository\nnifi.components.status.repository.buffer.size={{NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE}}\nnifi.components.status.snapshot.frequency={{NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY}}\n\n# Site to Site properties\nnifi.remote.input.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.remote.input.secure={{NIFI_REMOTE_INPUT_SECURE}}\nnifi.remote.input.socket.port={{NIFI_REMOTE_INPUT_SOCKET_PORT}}\nnifi.remote.input.http.enabled={{NIFI_REMOTE_INPUT_HTTP_ENABLED}}\nnifi.remote.input.http.transaction.ttl={{NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL}}\n\n# Web Properties\nnifi.web.war.directory={{NIFI_WEB_WAR_DIRECTORY}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.web.http.port={{NIFI_WEB_HTTP_PORT}}\nnifi.web.http.network.interface.default=\nnifi.web.https.host=\nnifi.web.https.port=\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host=\nnifi.web.http.port=\nnifi.web.http.network.interface.default=\nnifi.web.https.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\n#nifi.web.https.host=0.0.0.0\nnifi.web.https.port={{NIFI_WEB_HTTPS_PORT}}\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.jetty.working.directory={{NIFI_WEB_JETTY_WORKING_DIRECTORY}}\nnifi.web.jetty.threads={{NIFI_WEB_JETTY_THREADS}}\n\n# Security Properties\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore={{MESOS_SANDBOX}}/node.keystore\nnifi.security.keystoreType=jks\nnifi.security.keystorePasswd=notsecure\nnifi.security.keyPasswd=notsecure\nnifi.security.truststore={{MESOS_SANDBOX}}/node.truststore\nnifi.security.truststoreType=jks\nnifi.security.truststorePasswd=notsecure\nnifi.security.needClientAuth=true\n\nnifi.security.user.authorizer=managed-authorizer\n{{#SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=kerberos-provider\n{{/SECURITY_KERBEROS_ENABLED}}\n{{^SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=\n{{/SECURITY_KERBEROS_ENABLED}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore=\nnifi.security.keystoreType=\nnifi.security.keystorePasswd=\nnifi.security.keyPasswd=\nnifi.security.truststore=\nnifi.security.truststoreType=\nnifi.security.truststorePasswd=\n\nnifi.security.needClientAuth={{NIFI_SECURITY_NEEDCLIENTAUTH}}\nnifi.security.user.authorizer={{NIFI_SECURITY_USER_AUTHORIZER}}\nnifi.security.user.login.identity.provider={{NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Identity Mapping Properties\nnifi.security.identity.mapping.pattern.dn=\nnifi.security.identity.mapping.value.dn=\nnifi.security.identity.mapping.pattern.kerb=\nnifi.security.identity.mapping.value.kerb=\n\n# Cluster Common Properties\nnifi.cluster.protocol.heartbeat.interval={{NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=false\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}} \n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=true\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Cluster Node Properties\nnifi.cluster.is.node={{NIFI_CLUSTER_IS_NODE}}\nnifi.cluster.node.address={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.cluster.node.protocol.port={{NIFI_CLUSTER_NODE_PROTOCOL_PORT}}\nnifi.cluster.node.protocol.threads={{NIFI_CLUSTER_NODE_PROTOCOL_THREADS}}\nnifi.cluster.node.event.history.size={{NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE}}\nnifi.cluster.node.connection.timeout={{NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT}}\nnifi.cluster.node.read.timeout={{NIFI_CLUSTER_NODE_READ_TIMEOUT}}\nnifi.cluster.firewall.file={{NIFI_CLUSTER_FIREWALL_FILE}}\nnifi.cluster.flow.election.max.wait.time={{NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME}}\nnifi.cluster.flow.election.max.candidates=\n\n# Zookeeper Properties\nnifi.zookeeper.connect.string={{NIFI_ZOOKEEPER_CONNECT_STRING}}\nnifi.zookeeper.connect.timeout={{NIFI_ZOOKEEPER_CONNECT_TIMEOUT}}\nnifi.zookeeper.session.timeout={{NIFI_ZOOKEEPER_SESSION_TIMEOUT}}\nnifi.zookeeper.root.node=/nifi{{FRAMEWORK_NAME}}\n\n# Kerberos Properties\nnifi.kerberos.krb5.file={{MESOS_SANDBOX}}/nifi-{{NIFI_VERSION}}/conf/krb5.conf\nnifi.kerberos.service.principal={{NIFI_KERBEROS_SERVICE_PRINCIPAL}}\nnifi.kerberos.service.keytab.location=node.keytab\n\nnifi.kerberos.spnego.principal=\nnifi.kerberos.spnego.keytab.location=\nnifi.kerberos.spnego.authentication.expiration=12 hours\n\n# Custom Properties\nnifi.variable.registry.properties={{NIFI_VARIABLE_REGISTRY_PROPERTIES}}\n"
      }, {
        "name" : "bootstrap.conf",
        "relative-path" : "nifi-1.5.0/conf/bootstrap.conf",
        "template-content" : "#\n# Licensed to the Apache Software Foundation (ASF) under one or more\n# contributor license agreements.  See the NOTICE file distributed with\n# this work for additional information regarding copyright ownership.\n# The ASF licenses this file to You under the Apache License, Version 2.0\n# (the \"License\"); you may not use this file except in compliance with\n# the License.  You may obtain a copy of the License at\n#\n#\n# Unless required by applicable law or agreed to in writing, software\n# distributed under the License is distributed on an \"AS IS\" BASIS,\n# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n# See the License for the specific language governing permissions and\n# limitations under the License.\n#\n\n# Java command to use when running NiFi\njava=java\n\n# Username to use when running NiFi. This value will be ignored on Windows.\nrun.as=\n\n# Configure where NiFi's lib and conf directories live\nlib.dir=./lib\nconf.dir=./conf\n\n# How long to wait after telling NiFi to shutdown before explicitly killing the Process\ngraceful.shutdown.seconds={{NIFI_KILL_GRACE_PERIOD}}\n\n# Disable JSR 199 so that we can use JSP's without running a JDK\njava.arg.1=-Dorg.apache.jasper.compiler.disablejsr199=true\n\n# JVM memory settings\njava.arg.2=-Xms{{NIFI_BOOTSTRAP_JVM_MIN}}m\njava.arg.3=-Xmx{{NIFI_BOOTSTRAP_JVM_MAX}}m\n\n# Enable Remote Debugging\n#java.arg.debug=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000\n\njava.arg.4=-Djava.net.preferIPv4Stack=true\n\n# allowRestrictedHeaders is required for Cluster/Node communications to work properly\njava.arg.5=-Dsun.net.http.allowRestrictedHeaders=true\njava.arg.6=-Djava.protocol.handler.pkgs=sun.net.www.protocol\n\n# The G1GC is still considered experimental but has proven to be very advantageous in providing great\n# performance without significant \"stop-the-world\" delays.\njava.arg.13=-XX:+UseG1GC\n\n#Set headless mode by default\njava.arg.14=-Djava.awt.headless=true\n\n# Master key in hexadecimal format for encrypted sensitive configuration values\nnifi.bootstrap.sensitive.key=\n\n# Sets the provider of SecureRandom to /dev/urandom to prevent blocking on VMs\njava.arg.15=-Djava.security.egd=file:/dev/urandom\n\n# Requires JAAS to use only the provided JAAS configuration to authenticate a Subject, without using any \"fallback\" methods (such as prompting for username/password)\n# Please see https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/single-signon.html, section \"EXCEPTIONS TO THE MODEL\"\njava.arg.16=-Djavax.security.auth.useSubjectCredsOnly=true\n\n###\n# Notification Services for notifying interested parties when NiFi is stopped, started, dies\n###\n\n# XML File that contains the definitions of the notification services\nnotification.services.file=./conf/bootstrap-notification-services.xml\n\n# In the case that we are unable to send a notification for an event, how many times should we retry?\nnotification.max.attempts=5\n\n# Comma-separated list of identifiers that are present in the notification.services.file; which services should be used to notify when NiFi is started?\n#nifi.start.notification.services=email-notification\n\n# Comma-separated list of identifiers that are present in the notification.services.file; which services should be used to notify when NiFi is stopped?\n#nifi.stop.notification.services=email-notification\n\n# Comma-separated list of identifiers that are present in the notification.services.file; which services should be used to notify when NiFi dies?\n#nifi.dead.notification.services=email-notification\n"
      }, {
        "name" : "statemanagement.conf",
        "relative-path" : "nifi-1.5.0/conf/state-management.xml",
        "template-content" : "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<!--\n  Licensed to the Apache Software Foundation (ASF) under one or more\n  contributor license agreements.  See the NOTICE file distributed with\n  this work for additional information regarding copyright ownership.\n  The ASF licenses this file to You under the Apache License, Version 2.0\n  (the \"License\"); you may not use this file except in compliance with\n  the License.  You may obtain a copy of the License at\n  Unless required by applicable law or agreed to in writing, software\n  distributed under the License is distributed on an \"AS IS\" BASIS,\n  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  See the License for the specific language governing permissions and\n  limitations under the License.\n-->\n<!--\n  This file provides a mechanism for defining and configuring the State Providers\n  that should be used for storing state locally and across a NiFi cluster. In order\n  to use a specific provider, it must be configured here and its identifier\n  must be specified in the nifi.properties file.\n-->\n<stateManagement>\n    <!--\n        State Provider that stores state locally in a configurable directory. This Provider requires the following properties:\n        \n        Directory - the directory to store components' state in. If the directory being used is a sub-directory of the NiFi installation, it\n                    is important that the directory be copied over to the new version when upgrading NiFi.\n        Always Sync - If set to true, any change to the repository will be synchronized to the disk, meaning that NiFi will ask the operating system not to cache the information. This is very\n                expensive and can significantly reduce NiFi performance. However, if it is false, there could be the potential for data loss if either there is a sudden power loss or the\n                operating system crashes. The default value is false.\n        Partitions - The number of partitions.\n        Checkpoint Interval - The amount of time between checkpoints.\n     -->\n    <local-provider>\n        <id>local-provider</id>\n        <class>org.apache.nifi.controller.state.providers.local.WriteAheadLocalStateProvider</class>\n        <property name=\"Directory\">./state/local</property>\n        <property name=\"Always Sync\">false</property>\n        <property name=\"Partitions\">16</property>\n        <property name=\"Checkpoint Interval\">2 mins</property>\n    </local-provider>\n  <!--\n        State Provider that is used to store state in ZooKeeper. This Provider requires the following properties:\n        \n        Root Node - the root node in ZooKeeper where state should be stored. The default is '/nifi', but it is advisable to change this to a different value if not using\n                   the embedded ZooKeeper server and if multiple NiFi instances may all be using the same ZooKeeper Server.\n                   \n        Connect String - A comma-separated list of host:port pairs to connect to ZooKeeper. For example, myhost.mydomain:2181,host2.mydomain:5555,host3:6666\n        \n        Session Timeout - Specifies how long this instance of NiFi is allowed to be disconnected from ZooKeeper before creating a new ZooKeeper Session. Default value is \"30 seconds\"\n        \n        Access Control - Specifies which Access Controls will be applied to the ZooKeeper ZNodes that are created by this State Provider. This value must be set to one of:\n                            - Open  : ZNodes will be open to any ZooKeeper client.\n                            - CreatorOnly  : ZNodes will be accessible only by the creator. The creator will have full access to create children, read, write, delete, and administer the ZNodes.\n                                             This option is available only if access to ZooKeeper is secured via Kerberos or if a Username and Password are set.\n    -->\n    <cluster-provider>\n        <id>zk-provider</id>\n        <class>org.apache.nifi.controller.state.providers.zookeeper.ZooKeeperStateProvider</class>\n        <property name=\"Connect String\">{{NIFI_ZOOKEEPER_CONNECT_STRING}}</property>\n        <property name=\"Root Node\">/nifi/state{{FRAMEWORK_NAME}}</property>\n        <property name=\"Session Timeout\">{{NIFI_ZOOKEEPER_SESSION_TIMEOUT}}</property>\n        <property name=\"Access Control\">Open</property>\n    </cluster-provider>\n\n    <!--\n        Cluster State Provider that stores state in Redis. This can be used as an alternative to the ZooKeeper State Provider.\n\n        This provider requires the following properties:\n\n            Redis Mode - The type of Redis instance:\n                            - Standalone\n                            - Sentinel\n                            - Cluster (currently not supported for state-management due to use of WATCH command which Redis does not support in clustered mode)\n\n            Connection String - The connection string for Redis.\n                        - In a standalone instance this value will be of the form hostname:port.\n                        - In a sentinel instance this value will be the comma-separated list of sentinels, such as host1:port1,host2:port2,host3:port3.\n                        - In a clustered instance this value will be the comma-separated list of cluster masters, such as host1:port,host2:port,host3:port.\n        This provider has the following optional properties:\n\n            Key Prefix - The prefix for each key stored by this state provider. When sharing a single Redis across multiple NiFi instances, setting a unique\n                        value for the Key Prefix will make it easier to identify which instances the keys came from (default nifi/components/).\n\n            Database Index - The database index to be used by connections created from this connection pool.\n                        See the databases property in redis.conf, by default databases 0-15 will be available.\n\n            Communication Timeout - The timeout to use when attempting to communicate with Redis.\n\n            Cluster Max Redirects - The maximum number of redirects that can be performed when clustered.\n\n            Sentinel Master - The name of the sentinel master, require when Mode is set to Sentinel.\n\n            Password - The password used to authenticate to the Redis server. See the requirepass property in redis.conf.\n\n            Pool - Max Total - The maximum number of connections that can be allocated by the pool (checked out to clients, or idle awaiting checkout).\n                        A negative value indicates that there is no limit.\n\n            Pool - Max Idle - The maximum number of idle connections that can be held in the pool, or a negative value if there is no limit.\n\n            Pool - Min Idle - The target for the minimum number of idle connections to maintain in the pool. If the configured value of Min Idle is\n                    greater than the configured value for Max Idle, then the value of Max Idle will be used instead.\n\n            Pool - Block When Exhausted - Whether or not clients should block and wait when trying to obtain a connection from the pool when the pool\n                    has no available connections. Setting this to false means an error will occur immediately when a client requests a connection and\n                    none are available.\n\n            Pool - Max Wait Time - The amount of time to wait for an available connection when Block When Exhausted is set to true.\n\n            Pool - Min Evictable Idle Time - The minimum amount of time an object may sit idle in the pool before it is eligible for eviction.\n\n            Pool - Time Between Eviction Runs - The amount of time between attempting to evict idle connections from the pool.\n\n            Pool - Num Tests Per Eviction Run - The number of connections to tests per eviction attempt. A negative value indicates to test all connections.\n\n            Pool - Test On Create - Whether or not connections should be tested upon creation (default false).\n\n            Pool - Test On Borrow - Whether or not connections should be tested upon borrowing from the pool (default false).\n            Pool - Test On Return - Whether or not connections should be tested upon returning to the pool (default false).\n\n            Pool - Test While Idle - Whether or not connections should be tested while idle (default true).\n\n        <cluster-provider>\n            <id>redis-provider</id>\n            <class>org.apache.nifi.redis.state.RedisStateProvider</class>\n            <property name=\"Redis Mode\">Standalone</property>\n            <property name=\"Connection String\">localhost:6379</property>\n        </cluster-provider>\n    -->\n\n</stateManagement>\n"
      } ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "restart-cleanup",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-cleanupresources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "# Clean NiFi Application i.e. remove all disconnected node.\nmisc_repo_path=../../misc-repository\nsleep 180\nusernodesecret=`cat usernode.keytab`\ncp $misc_repo_path/readiness-info.txt .\ncp $misc_repo_path/url-info.properties .\necho \"Executing Janitor program to clean the NiFi disconnected node.\"\nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\njava -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "nifi-access",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-cleanupresources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "# Provide access to initial admin to NiFi System Diagnostics.\nmisc_repo_path=../../misc-repository\nsleep 180\ncp $misc_repo_path/readiness-info.txt .\ncp $misc_repo_path/url-info.properties .\nusernodesecret=`cat usernode.keytab`\necho \"Executing NiFi API Access.\"\nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\njava -jar nifi-api-access.jar readiness-info.txt url-info.properties ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "backup",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "nifi-backup",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*) ; sh $MESOS_SANDBOX/nifi-toolkit-${NIFI_VERSION}/bin/file-manager.sh -o backup -b nifi-backup -c $MESOS_SANDBOX/../../tasks/nifi-$POD_INSTANCE_INDEX-node*/nifi-1.5.0 -v;\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "upload-s3",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "nifi-backup",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export PATH=$MESOS_SANDBOX/python-dist/bin:$PATH ; aws s3 cp nifi-backup s3://${S3_BUCKET_NAME}/nifi-${POD_INSTANCE_INDEX}/ --recursive\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "cleanup-backup",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "nifi-backup",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre/) ; rm -r nifi-backup/*\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    } ],
    "placement-rule" : {
      "@type" : "AndRule",
      "rules" : [ {
        "@type" : "IsLocalRegionRule"
      }, {
        "@type" : "MaxPerHostnameRule",
        "max" : 1,
        "task-filter" : {
          "@type" : "RegexMatcher",
          "pattern" : "nifi-.*"
        }
      } ]
    },
    "volumes" : [ ],
    "pre-reserved-role" : "*",
    "secrets" : [ ],
    "share-pid-namespace" : false,
    "allow-decommission" : false
  } ],
  "replacement-failure-policy" : null,
  "user" : "nobody"
}
```

## List Configs

You can list all configuration IDs by sending a GET request to `/v1/configurations`.

CLI Example

```shell
dcos nifi config list
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations
```

You will see a response similar to the following:

```json
["29bf852c-7e17-48ba-ac8e-84634fb99f86"]
```

## View Specified Config

You can view a specific configuration by sending a GET request to `/v1/configurations/<config-id>`.

CLI Example

```shell
dcos nifi config show 29bf852c-7e17-48ba-ac8e-84634fb99f86
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations/29bf852c-7e17-48ba-ac8e-84634fb99f86
```

You will see a response similar to the following:

```json
{
  "name" : "nifi",
  "role" : "nifi-role",
  "principal" : "nifi-principal",
  "web-url" : null,
  "zookeeper" : "master.mesos:2181",
  "pod-specs" : [ {
    "type" : "nifi",
    "user" : "nobody",
    "count" : 2,
    "image" : null,
    "networks" : [ ],
    "rlimits" : [ {
      "name" : "RLIMIT_NOFILE",
      "soft" : 50000,
      "hard" : 50000
    }, {
      "name" : "RLIMIT_NPROC",
      "soft" : 10000,
      "hard" : 10000
    } ],
    "uris" : [ "https://downloads.mesosphere.com/java/server-jre-8u162-linux-x64.tar.gz", "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/bootstrap.zip", "https://s3-us-west-1.amazonaws.com/nifi-binary/nifi-1.5.0-bin.tar.gz", "http://downloads.mesosphere.com/dcos-commons/artifacts/0.40.2/executor.zip", "https://s3-ap-southeast-2.amazonaws.com/nifi-toolkit/nifi-toolkit-1.5.0-bin.tar.gz", "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-janitor.jar", "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-statsd.jar", "https://devdcos3.s3.amazonaws.com/autodelete7d/nifi/20180518-141627-MKsCyLUzJH3VtAzw/nifi-api-access.jar", "https://s3-us-west-1.amazonaws.com/nifi-python/python-2.7.14.tar.gz" ],
    "task-specs" : [ {
      "name" : "metrics",
      "goal" : "RUNNING",
      "essential" : false,
      "resource-set" : {
        "id" : "metrics-resource-set",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.2
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 32.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\nusernodesecret=`cat usernode.keytab`\necho \"Before running statsd\"\nsleep 180\ncp ../../misc-repository/url-info.properties .\njava -jar nifi-statsd.jar url-info.properties $STATSD_UDP_HOST $STATSD_UDP_PORT ${NIFI_METRICS_FREQUENCY} ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\necho \"After running statsd\"\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "init",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "node-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 4096.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "NamedVIPSpec",
          "value" : {
            "type" : "RANGES",
            "scalar" : null,
            "ranges" : {
              "range" : [ {
                "begin" : 1025,
                "end" : 1025
              } ]
            },
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal",
          "env-key" : "PORT_WEB",
          "port-name" : "node",
          "protocol" : "tcp",
          "visibility" : "EXTERNAL",
          "vip-name" : "node",
          "vip-port" : 1025,
          "network-names" : [ ],
          "name" : "ports"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "database-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "flowfile-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "provenance-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "content-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "misc-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "./bootstrap\nkerb_enabled=false\nif [ \"$kerb_enabled\" == true ] ; then\n  echo \"Y\" > misc-repository/init-status.txt\nelse\n  echo \"N\" > misc-repository/init-status.txt\nfi\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ {
        "name" : "nifi.properties",
        "relative-path" : "nifi-1.5.0/conf/nifi.properties",
        "template-content" : "# Licensed to the Apache Software Foundation (ASF) under one or more\n# contributor license agreements.  See the NOTICE file distributed with\n# this work for additional information regarding copyright ownership.\n# The ASF licenses this file to You under the Apache License, Version 2.0\n# (the \"License\"); you may not use this file except in compliance with\n# the License.  You may obtain a copy of the License at\n#\n#     http://www.apache.org/licenses/LICENSE-2.0\n#\n# Unless required by applicable law or agreed to in writing, software\n# distributed under the License is distributed on an \"AS IS\" BASIS,\n# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n# See the License for the specific language governing permissions and\n# limitations under the License.\n\n# Core Properties #\nnifi.flow.configuration.file={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/flow.xml.gz\nnifi.flow.configuration.archive.enabled={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED}}\nnifi.flow.configuration.archive.dir={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/archive\nnifi.flow.configuration.archive.max.time={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME}}\nnifi.flow.configuration.archive.max.storage={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE}}\nnifi.flow.configuration.archive.max.count={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT}}\nnifi.flowcontroller.autoResumeState={{NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE}}\nnifi.flowcontroller.graceful.shutdown.period={{NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD}}\nnifi.flowservice.writedelay.interval={{NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL}}\nnifi.administrative.yield.duration=30 secs\n# If a component has no work to do (is \"bored\"), how long should we wait before checking again for work?\nnifi.bored.yield.duration={{NIFI_CORE_BORED_YIELD_DURATION}}\n\nnifi.authorizer.configuration.file=./conf/authorizers.xml\nnifi.login.identity.provider.configuration.file=./conf/login-identity-providers.xml\nnifi.templates.directory=./conf/templates\nnifi.ui.banner.text={{NIFI_CORE_UI_BANNER_TEXT}}\nnifi.ui.autorefresh.interval={{NIFI_CORE_UI_AUTOREFRESH_INTERVAL}}\nnifi.nar.library.directory=./lib\nnifi.nar.working.directory=./work/nar\nnifi.documentation.working.directory=./work/docs/components\n\nnifi.processor.scheduling.timeout={{NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT}}\n\n\n# State Management #\n####################\nnifi.state.management.configuration.file=./conf/state-management.xml\n# The ID of the local state provider\nnifi.state.management.provider.local=local-provider\n# The ID of the cluster-wide state provider. This will be ignored if NiFi is not clustered but must be populated if running in a cluster.\nnifi.state.management.provider.cluster=zk-provider\n# Specifies whether or not this instance of NiFi should run an embedded ZooKeeper server\nnifi.state.management.embedded.zookeeper.start=false\n# Properties file that provides the ZooKeeper properties to use if <nifi.state.management.embedded.zookeeper.start> is set to true\nnifi.state.management.embedded.zookeeper.properties=./conf/zookeeper.properties\n\n\n# H2 Settings\nnifi.database.directory={{MESOS_SANDBOX}}/{{NIFI_DATABASE_REPOSITORY_DIRECTORY}}\nnifi.h2.url.append=;LOCK_TIMEOUT=25000;WRITE_DELAY=0;AUTO_SERVER=FALSE\n\n# FlowFile Repository\nnifi.flowfile.repository.implementation=org.apache.nifi.controller.repository.WriteAheadFlowFileRepository\nnifi.flowfile.repository.directory={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}\nnifi.flowfile.repository.partitions={{NIFI_FLOWFILE_REPOSITORY_PARTITIONS}}\nnifi.flowfile.repository.checkpoint.interval={{NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL}}\nnifi.flowfile.repository.always.sync={{NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC}}\n\n# Swap Management Properties\nnifi.swap.manager.implementation=org.apache.nifi.controller.FileSystemSwapManager\nnifi.queue.swap.threshold={{NIFI_QUEUE_SWAP_THRESHOLD}}\nnifi.swap.in.period={{NIFI_SWAP_IN_PERIOD}}\nnifi.swap.in.threads={{NIFI_SWAP_IN_THREADS}}\nnifi.swap.out.period={{NIFI_SWAP_OUT_PERIOD}}\nnifi.swap.out.threads={{NIFI_SWAP_OUT_THREADS}}\n\n# Content Repository Properties\nnifi.content.repository.implementation=org.apache.nifi.controller.repository.FileSystemRepository\n\n# File System Content Repository Properties\nnifi.content.claim.max.appendable.size={{NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE}}\nnifi.content.claim.max.flow.files={{NIFI_CONTENT_CLAIM_MAX_FLOW_FILES}}\nnifi.content.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_CONTENT_REPOSITORY_DIRECTORY}}\nnifi.content.repository.archive.max.retention.period={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD}}\nnifi.content.repository.archive.max.usage.percentage={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE}}\nnifi.content.repository.archive.enabled={{NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED}}\nnifi.content.repository.always.sync={{NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC}}\nnifi.content.viewer.url={{NIFI_CONTENT_VIEWER_URL}}\n\n#Volatile Content Repository Properties\nnifi.volatile.content.repository.max.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE}}\nnifi.volatile.content.repository.block.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE}}\n\n# Provenance Repository Properties\nnifi.provenance.repository.implementation=org.apache.nifi.provenance.PersistentProvenanceRepository\nnifi.provenance.repository.debug.frequency=1_000_000\nnifi.provenance.repository.encryption.key.provider.implementation=\nnifi.provenance.repository.encryption.key.provider.location=\nnifi.provenance.repository.encryption.key.id=\nnifi.provenance.repository.encryption.key=\n\n# Persistent Provenance Repository Properties\nnifi.provenance.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_PROVENANCE_REPOSITORY_DIRECTORY}}\nnifi.provenance.repository.max.storage.time={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME}}\nnifi.provenance.repository.max.storage.size={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE}}\nnifi.provenance.repository.rollover.time={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME}}\nnifi.provenance.repository.rollover.size={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE}}\nnifi.provenance.repository.query.threads={{NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS}}\nnifi.provenance.repository.index.threads={{NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS}}\nnifi.provenance.repository.compress.on.rollover={{NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER}}\nnifi.provenance.repository.always.sync={{NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC}}\nnifi.provenance.repository.journal.count={{NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT}}\nnifi.provenance.repository.indexed.fields={{NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS}}\nnifi.provenance.repository.indexed.attributes={{NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES}}\nnifi.provenance.repository.index.shard.size={{NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE}}\nnifi.provenance.repository.max.attribute.length={{NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH}}\n\n# Volatile Provenance Respository Properties\nnifi.provenance.repository.buffer.size={{NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE}}\n\n# Write Ahead Provenance Repository Properties\n# (In addition to Persistent Provenance Repository Properties)\nnifi.provenance.repository.concurrent.merge.threads={{NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS}}\nnifi.provenance.repository.warm.cache.frequency={{NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY}}\n\n# Encrypted Write Ahead Provenance Repository Properties\nnifi.provenance.repository.debug.frequency={{NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY}}\nnifi.provenance.repository.encryption.key.provider.implementation={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION}}\nnifi.provenance.repository.encryption.key.provider.location={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION}}\nnifi.provenance.repository.encryption.key.id={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID}}\nnifi.provenance.repository.encryption.key={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY}}\n\n# Component Status Repository\nnifi.components.status.repository.implementation=org.apache.nifi.controller.status.history.VolatileComponentStatusRepository\nnifi.components.status.repository.buffer.size={{NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE}}\nnifi.components.status.snapshot.frequency={{NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY}}\n\n# Site to Site properties\nnifi.remote.input.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.remote.input.secure={{NIFI_REMOTE_INPUT_SECURE}}\nnifi.remote.input.socket.port={{NIFI_REMOTE_INPUT_SOCKET_PORT}}\nnifi.remote.input.http.enabled={{NIFI_REMOTE_INPUT_HTTP_ENABLED}}\nnifi.remote.input.http.transaction.ttl={{NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL}}\n\n# Web Properties\nnifi.web.war.directory={{NIFI_WEB_WAR_DIRECTORY}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.web.http.port={{NIFI_WEB_HTTP_PORT}}\nnifi.web.http.network.interface.default=\nnifi.web.https.host=\nnifi.web.https.port=\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host=\nnifi.web.http.port=\nnifi.web.http.network.interface.default=\nnifi.web.https.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\n#nifi.web.https.host=0.0.0.0\nnifi.web.https.port={{NIFI_WEB_HTTPS_PORT}}\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.jetty.working.directory={{NIFI_WEB_JETTY_WORKING_DIRECTORY}}\nnifi.web.jetty.threads={{NIFI_WEB_JETTY_THREADS}}\n\n# Security Properties\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore={{MESOS_SANDBOX}}/node.keystore\nnifi.security.keystoreType=jks\nnifi.security.keystorePasswd=notsecure\nnifi.security.keyPasswd=notsecure\nnifi.security.truststore={{MESOS_SANDBOX}}/node.truststore\nnifi.security.truststoreType=jks\nnifi.security.truststorePasswd=notsecure\nnifi.security.needClientAuth=true\n\nnifi.security.user.authorizer=managed-authorizer\n{{#SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=kerberos-provider\n{{/SECURITY_KERBEROS_ENABLED}}\n{{^SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=\n{{/SECURITY_KERBEROS_ENABLED}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore=\nnifi.security.keystoreType=\nnifi.security.keystorePasswd=\nnifi.security.keyPasswd=\nnifi.security.truststore=\nnifi.security.truststoreType=\nnifi.security.truststorePasswd=\n\nnifi.security.needClientAuth={{NIFI_SECURITY_NEEDCLIENTAUTH}}\nnifi.security.user.authorizer={{NIFI_SECURITY_USER_AUTHORIZER}}\nnifi.security.user.login.identity.provider={{NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Identity Mapping Properties\nnifi.security.identity.mapping.pattern.dn=\nnifi.security.identity.mapping.value.dn=\nnifi.security.identity.mapping.pattern.kerb=\nnifi.security.identity.mapping.value.kerb=\n\n# Cluster Common Properties\nnifi.cluster.protocol.heartbeat.interval={{NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=false\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}} \n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=true\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Cluster Node Properties\nnifi.cluster.is.node={{NIFI_CLUSTER_IS_NODE}}\nnifi.cluster.node.address={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.cluster.node.protocol.port={{NIFI_CLUSTER_NODE_PROTOCOL_PORT}}\nnifi.cluster.node.protocol.threads={{NIFI_CLUSTER_NODE_PROTOCOL_THREADS}}\nnifi.cluster.node.event.history.size={{NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE}}\nnifi.cluster.node.connection.timeout={{NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT}}\nnifi.cluster.node.read.timeout={{NIFI_CLUSTER_NODE_READ_TIMEOUT}}\nnifi.cluster.firewall.file={{NIFI_CLUSTER_FIREWALL_FILE}}\nnifi.cluster.flow.election.max.wait.time={{NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME}}\nnifi.cluster.flow.election.max.candidates=\n\n# Zookeeper Properties\nnifi.zookeeper.connect.string={{NIFI_ZOOKEEPER_CONNECT_STRING}}\nnifi.zookeeper.connect.timeout={{NIFI_ZOOKEEPER_CONNECT_TIMEOUT}}\nnifi.zookeeper.session.timeout={{NIFI_ZOOKEEPER_SESSION_TIMEOUT}}\nnifi.zookeeper.root.node=/nifi{{FRAMEWORK_NAME}}\n\n# Kerberos Properties\nnifi.kerberos.krb5.file={{MESOS_SANDBOX}}/nifi-{{NIFI_VERSION}}/conf/krb5.conf\nnifi.kerberos.service.principal={{NIFI_KERBEROS_SERVICE_PRINCIPAL}}\nnifi.kerberos.service.keytab.location=node.keytab\n\nnifi.kerberos.spnego.principal=\nnifi.kerberos.spnego.keytab.location=\nnifi.kerberos.spnego.authentication.expiration=12 hours\n\n# Custom Properties\nnifi.variable.registry.properties={{NIFI_VARIABLE_REGISTRY_PROPERTIES}}\n"
      } ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "node",
      "goal" : "RUNNING",
      "essential" : true,
      "resource-set" : {
        "id" : "node-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 4096.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "NamedVIPSpec",
          "value" : {
            "type" : "RANGES",
            "scalar" : null,
            "ranges" : {
              "range" : [ {
                "begin" : 1025,
                "end" : 1025
              } ]
            },
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal",
          "env-key" : "PORT_WEB",
          "port-name" : "node",
          "protocol" : "tcp",
          "visibility" : "EXTERNAL",
          "vip-name" : "node",
          "vip-port" : 1025,
          "network-names" : [ ],
          "name" : "ports"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "database-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "flowfile-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "provenance-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "content-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "misc-repository",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "./bootstrap \nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\necho \"INSTALL\" > misc-repository/readiness-info.txt\ninit_status=`cat misc-repository/init-status.txt`\necho $init_status\nif [ \"$init_status\" == \"Y\" ] ; then\n  mv misc-repository/login-identity-providers.xml nifi-1.5.0/conf\n  mv misc-repository/authorizers.xml nifi-1.5.0/conf \n  echo \"N\" > misc-repository/init-status.txt\nfi\n./nifi-${NIFI_VERSION}/bin/nifi.sh run\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "NODE_CPUS" : "1",
          "NODE_MEM" : "4096",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : {
        "command" : "# The NiFi node has started when it logs a specific \n# \"${TASK_NAME}.${FRAMEWORK_HOST}:$nifi_web_port is now connected\" log line. \n# An example is below:\n# 2018/03/05 11:11:37 nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1025 is now connected.\nnifi_server_log_files=nifi-${NIFI_VERSION}/logs/nifi-app.log\nnifi_authorizations_file=$MESOS_SANDBOX/../../misc-repository/authorizations.xml\nnifi_host_name=${TASK_NAME}.${FRAMEWORK_HOST}\nnifi_web_port=${PORT_WEB}\nreadiness_info=`cat misc-repository/readiness-info.txt`\necho \"Executing shell script.\"\necho \"$readiness_info\"\nif [ \"$readiness_info\" == \"INSTALL\" ] ; then\n  echo \"Checking for successful log line in $nifi_server_log_files.\"\n  echo \"Looking for \\\"$nifi_host_name:$nifi_web_port is now connected or NiFi has started.\\\" in the server log file.\"\n  grep -q \"$nifi_host_name:$nifi_web_port is now connected\\|NiFi has started.\" $nifi_server_log_files\n  if [ $? -eq 0 ] ; then\n    echo \"Found started log line.\"\n    echo \"READY\" > misc-repository/readiness-info.txt\n    echo \"HOST=$nifi_host_name\" > misc-repository/url-info.properties\n    echo \"PORT=$nifi_web_port\" >> misc-repository/url-info.properties\n    echo \"AUTHORIZATIONS_FILE=$nifi_authorizations_file\" >> misc-repository/url-info.properties\n  else\n    echo \"started log line not found. Exiting.\"\n    exit 1\n  fi\n  echo \"Required log line found. NiFi is ready.\"\nelif [ $readiness_info == \"READY\" ] ; then\n  echo \"NiFi is ready.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the NiFi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nelif [ $readiness_info == \"RUNNING\" ] ; then\n  echo \"NiFi is running.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the NiFi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nfi\nexit 0\n",
        "delay" : 10,
        "interval" : 5,
        "timeout" : 120
      },
      "config-files" : [ {
        "name" : "nifi.properties",
        "relative-path" : "nifi-1.5.0/conf/nifi.properties",
        "template-content" : "# Licensed to the Apache Software Foundation (ASF) under one or more\n# contributor license agreements.  See the NOTICE file distributed with\n# this work for additional information regarding copyright ownership.\n# The ASF licenses this file to You under the Apache License, Version 2.0\n# (the \"License\"); you may not use this file except in compliance with\n# the License.  You may obtain a copy of the License at\n#\n#     http://www.apache.org/licenses/LICENSE-2.0\n#\n# Unless required by applicable law or agreed to in writing, software\n# distributed under the License is distributed on an \"AS IS\" BASIS,\n# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n# See the License for the specific language governing permissions and\n# limitations under the License.\n\n# Core Properties #\nnifi.flow.configuration.file={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/flow.xml.gz\nnifi.flow.configuration.archive.enabled={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED}}\nnifi.flow.configuration.archive.dir={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}/archive\nnifi.flow.configuration.archive.max.time={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME}}\nnifi.flow.configuration.archive.max.storage={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE}}\nnifi.flow.configuration.archive.max.count={{NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT}}\nnifi.flowcontroller.autoResumeState={{NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE}}\nnifi.flowcontroller.graceful.shutdown.period={{NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD}}\nnifi.flowservice.writedelay.interval={{NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL}}\nnifi.administrative.yield.duration=30 secs\n# If a component has no work to do (is \"bored\"), how long should we wait before checking again for work?\nnifi.bored.yield.duration={{NIFI_CORE_BORED_YIELD_DURATION}}\n\nnifi.authorizer.configuration.file=./conf/authorizers.xml\nnifi.login.identity.provider.configuration.file=./conf/login-identity-providers.xml\nnifi.templates.directory=./conf/templates\nnifi.ui.banner.text={{NIFI_CORE_UI_BANNER_TEXT}}\nnifi.ui.autorefresh.interval={{NIFI_CORE_UI_AUTOREFRESH_INTERVAL}}\nnifi.nar.library.directory=./lib\nnifi.nar.working.directory=./work/nar\nnifi.documentation.working.directory=./work/docs/components\n\nnifi.processor.scheduling.timeout={{NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT}}\n\n\n# State Management #\n####################\nnifi.state.management.configuration.file=./conf/state-management.xml\n# The ID of the local state provider\nnifi.state.management.provider.local=local-provider\n# The ID of the cluster-wide state provider. This will be ignored if NiFi is not clustered but must be populated if running in a cluster.\nnifi.state.management.provider.cluster=zk-provider\n# Specifies whether or not this instance of NiFi should run an embedded ZooKeeper server\nnifi.state.management.embedded.zookeeper.start=false\n# Properties file that provides the ZooKeeper properties to use if <nifi.state.management.embedded.zookeeper.start> is set to true\nnifi.state.management.embedded.zookeeper.properties=./conf/zookeeper.properties\n\n\n# H2 Settings\nnifi.database.directory={{MESOS_SANDBOX}}/{{NIFI_DATABASE_REPOSITORY_DIRECTORY}}\nnifi.h2.url.append=;LOCK_TIMEOUT=25000;WRITE_DELAY=0;AUTO_SERVER=FALSE\n\n# FlowFile Repository\nnifi.flowfile.repository.implementation=org.apache.nifi.controller.repository.WriteAheadFlowFileRepository\nnifi.flowfile.repository.directory={{MESOS_SANDBOX}}/{{NIFI_FLOWFILE_REPOSITORY_DIRECTORY}}\nnifi.flowfile.repository.partitions={{NIFI_FLOWFILE_REPOSITORY_PARTITIONS}}\nnifi.flowfile.repository.checkpoint.interval={{NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL}}\nnifi.flowfile.repository.always.sync={{NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC}}\n\n# Swap Management Properties\nnifi.swap.manager.implementation=org.apache.nifi.controller.FileSystemSwapManager\nnifi.queue.swap.threshold={{NIFI_QUEUE_SWAP_THRESHOLD}}\nnifi.swap.in.period={{NIFI_SWAP_IN_PERIOD}}\nnifi.swap.in.threads={{NIFI_SWAP_IN_THREADS}}\nnifi.swap.out.period={{NIFI_SWAP_OUT_PERIOD}}\nnifi.swap.out.threads={{NIFI_SWAP_OUT_THREADS}}\n\n# Content Repository Properties\nnifi.content.repository.implementation=org.apache.nifi.controller.repository.FileSystemRepository\n\n# File System Content Repository Properties\nnifi.content.claim.max.appendable.size={{NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE}}\nnifi.content.claim.max.flow.files={{NIFI_CONTENT_CLAIM_MAX_FLOW_FILES}}\nnifi.content.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_CONTENT_REPOSITORY_DIRECTORY}}\nnifi.content.repository.archive.max.retention.period={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD}}\nnifi.content.repository.archive.max.usage.percentage={{NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE}}\nnifi.content.repository.archive.enabled={{NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED}}\nnifi.content.repository.always.sync={{NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC}}\nnifi.content.viewer.url={{NIFI_CONTENT_VIEWER_URL}}\n\n#Volatile Content Repository Properties\nnifi.volatile.content.repository.max.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE}}\nnifi.volatile.content.repository.block.size={{NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE}}\n\n# Provenance Repository Properties\nnifi.provenance.repository.implementation=org.apache.nifi.provenance.PersistentProvenanceRepository\nnifi.provenance.repository.debug.frequency=1_000_000\nnifi.provenance.repository.encryption.key.provider.implementation=\nnifi.provenance.repository.encryption.key.provider.location=\nnifi.provenance.repository.encryption.key.id=\nnifi.provenance.repository.encryption.key=\n\n# Persistent Provenance Repository Properties\nnifi.provenance.repository.directory.default={{MESOS_SANDBOX}}/{{NIFI_PROVENANCE_REPOSITORY_DIRECTORY}}\nnifi.provenance.repository.max.storage.time={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME}}\nnifi.provenance.repository.max.storage.size={{NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE}}\nnifi.provenance.repository.rollover.time={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME}}\nnifi.provenance.repository.rollover.size={{NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE}}\nnifi.provenance.repository.query.threads={{NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS}}\nnifi.provenance.repository.index.threads={{NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS}}\nnifi.provenance.repository.compress.on.rollover={{NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER}}\nnifi.provenance.repository.always.sync={{NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC}}\nnifi.provenance.repository.journal.count={{NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT}}\nnifi.provenance.repository.indexed.fields={{NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS}}\nnifi.provenance.repository.indexed.attributes={{NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES}}\nnifi.provenance.repository.index.shard.size={{NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE}}\nnifi.provenance.repository.max.attribute.length={{NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH}}\n\n# Volatile Provenance Respository Properties\nnifi.provenance.repository.buffer.size={{NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE}}\n\n# Write Ahead Provenance Repository Properties\n# (In addition to Persistent Provenance Repository Properties)\nnifi.provenance.repository.concurrent.merge.threads={{NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS}}\nnifi.provenance.repository.warm.cache.frequency={{NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY}}\n\n# Encrypted Write Ahead Provenance Repository Properties\nnifi.provenance.repository.debug.frequency={{NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY}}\nnifi.provenance.repository.encryption.key.provider.implementation={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION}}\nnifi.provenance.repository.encryption.key.provider.location={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION}}\nnifi.provenance.repository.encryption.key.id={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID}}\nnifi.provenance.repository.encryption.key={{NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY}}\n\n# Component Status Repository\nnifi.components.status.repository.implementation=org.apache.nifi.controller.status.history.VolatileComponentStatusRepository\nnifi.components.status.repository.buffer.size={{NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE}}\nnifi.components.status.snapshot.frequency={{NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY}}\n\n# Site to Site properties\nnifi.remote.input.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.remote.input.secure={{NIFI_REMOTE_INPUT_SECURE}}\nnifi.remote.input.socket.port={{NIFI_REMOTE_INPUT_SOCKET_PORT}}\nnifi.remote.input.http.enabled={{NIFI_REMOTE_INPUT_HTTP_ENABLED}}\nnifi.remote.input.http.transaction.ttl={{NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL}}\n\n# Web Properties\nnifi.web.war.directory={{NIFI_WEB_WAR_DIRECTORY}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.web.http.port={{NIFI_WEB_HTTP_PORT}}\nnifi.web.http.network.interface.default=\nnifi.web.https.host=\nnifi.web.https.port=\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.http.host=\nnifi.web.http.port=\nnifi.web.http.network.interface.default=\nnifi.web.https.host={{TASK_NAME}}.{{FRAMEWORK_HOST}}\n#nifi.web.https.host=0.0.0.0\nnifi.web.https.port={{NIFI_WEB_HTTPS_PORT}}\nnifi.web.https.network.interface.default=\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.web.jetty.working.directory={{NIFI_WEB_JETTY_WORKING_DIRECTORY}}\nnifi.web.jetty.threads={{NIFI_WEB_JETTY_THREADS}}\n\n# Security Properties\n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore={{MESOS_SANDBOX}}/node.keystore\nnifi.security.keystoreType=jks\nnifi.security.keystorePasswd=notsecure\nnifi.security.keyPasswd=notsecure\nnifi.security.truststore={{MESOS_SANDBOX}}/node.truststore\nnifi.security.truststoreType=jks\nnifi.security.truststorePasswd=notsecure\nnifi.security.needClientAuth=true\n\nnifi.security.user.authorizer=managed-authorizer\n{{#SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=kerberos-provider\n{{/SECURITY_KERBEROS_ENABLED}}\n{{^SECURITY_KERBEROS_ENABLED}}\nnifi.security.user.login.identity.provider=\n{{/SECURITY_KERBEROS_ENABLED}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.sensitive.props.key={{NIFI_SENSITIVE_PROPS_KEY}}\nnifi.sensitive.props.key.protected={{NIFI_SENSITIVE_PROPS_KEY_PROTECTED}}\nnifi.sensitive.props.algorithm={{NIFI_SENSITIVE_PROPS_ALGORITHM}}\nnifi.sensitive.props.provider={{NIFI_SENSITIVE_PROPS_PROVIDER}}\nnifi.sensitive.props.additional.keys={{NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS}}\n\nnifi.security.keystore=\nnifi.security.keystoreType=\nnifi.security.keystorePasswd=\nnifi.security.keyPasswd=\nnifi.security.truststore=\nnifi.security.truststoreType=\nnifi.security.truststorePasswd=\n\nnifi.security.needClientAuth={{NIFI_SECURITY_NEEDCLIENTAUTH}}\nnifi.security.user.authorizer={{NIFI_SECURITY_USER_AUTHORIZER}}\nnifi.security.user.login.identity.provider={{NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER}}\nnifi.security.ocsp.responder.url={{NIFI_SECURITY_OCSP_RESPONDER_URL}}\nnifi.security.ocsp.responder.certificate={{NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE}}\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Identity Mapping Properties\nnifi.security.identity.mapping.pattern.dn=\nnifi.security.identity.mapping.value.dn=\nnifi.security.identity.mapping.pattern.kerb=\nnifi.security.identity.mapping.value.kerb=\n\n# Cluster Common Properties\nnifi.cluster.protocol.heartbeat.interval={{NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL}}\n{{^NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=false\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}} \n{{#NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\nnifi.cluster.protocol.is.secure=true\n{{/NIFI_CLUSTER_PROTOCOL_IS_SECURE}}\n\n# Cluster Node Properties\nnifi.cluster.is.node={{NIFI_CLUSTER_IS_NODE}}\nnifi.cluster.node.address={{TASK_NAME}}.{{FRAMEWORK_HOST}}\nnifi.cluster.node.protocol.port={{NIFI_CLUSTER_NODE_PROTOCOL_PORT}}\nnifi.cluster.node.protocol.threads={{NIFI_CLUSTER_NODE_PROTOCOL_THREADS}}\nnifi.cluster.node.event.history.size={{NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE}}\nnifi.cluster.node.connection.timeout={{NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT}}\nnifi.cluster.node.read.timeout={{NIFI_CLUSTER_NODE_READ_TIMEOUT}}\nnifi.cluster.firewall.file={{NIFI_CLUSTER_FIREWALL_FILE}}\nnifi.cluster.flow.election.max.wait.time={{NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME}}\nnifi.cluster.flow.election.max.candidates=\n\n# Zookeeper Properties\nnifi.zookeeper.connect.string={{NIFI_ZOOKEEPER_CONNECT_STRING}}\nnifi.zookeeper.connect.timeout={{NIFI_ZOOKEEPER_CONNECT_TIMEOUT}}\nnifi.zookeeper.session.timeout={{NIFI_ZOOKEEPER_SESSION_TIMEOUT}}\nnifi.zookeeper.root.node=/nifi{{FRAMEWORK_NAME}}\n\n# Kerberos Properties\nnifi.kerberos.krb5.file={{MESOS_SANDBOX}}/nifi-{{NIFI_VERSION}}/conf/krb5.conf\nnifi.kerberos.service.principal={{NIFI_KERBEROS_SERVICE_PRINCIPAL}}\nnifi.kerberos.service.keytab.location=node.keytab\n\nnifi.kerberos.spnego.principal=\nnifi.kerberos.spnego.keytab.location=\nnifi.kerberos.spnego.authentication.expiration=12 hours\n\n# Custom Properties\nnifi.variable.registry.properties={{NIFI_VARIABLE_REGISTRY_PROPERTIES}}\n"
      }, {
        "name" : "bootstrap.conf",
        "relative-path" : "nifi-1.5.0/conf/bootstrap.conf",
        "template-content" : "#\n# Licensed to the Apache Software Foundation (ASF) under one or more\n# contributor license agreements.  See the NOTICE file distributed with\n# this work for additional information regarding copyright ownership.\n# The ASF licenses this file to You under the Apache License, Version 2.0\n# (the \"License\"); you may not use this file except in compliance with\n# the License.  You may obtain a copy of the License at\n#\n#\n# Unless required by applicable law or agreed to in writing, software\n# distributed under the License is distributed on an \"AS IS\" BASIS,\n# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n# See the License for the specific language governing permissions and\n# limitations under the License.\n#\n\n# Java command to use when running NiFi\njava=java\n\n# Username to use when running NiFi. This value will be ignored on Windows.\nrun.as=\n\n# Configure where NiFi's lib and conf directories live\nlib.dir=./lib\nconf.dir=./conf\n\n# How long to wait after telling NiFi to shutdown before explicitly killing the Process\ngraceful.shutdown.seconds={{NIFI_KILL_GRACE_PERIOD}}\n\n# Disable JSR 199 so that we can use JSP's without running a JDK\njava.arg.1=-Dorg.apache.jasper.compiler.disablejsr199=true\n\n# JVM memory settings\njava.arg.2=-Xms{{NIFI_BOOTSTRAP_JVM_MIN}}m\njava.arg.3=-Xmx{{NIFI_BOOTSTRAP_JVM_MAX}}m\n\n# Enable Remote Debugging\n#java.arg.debug=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000\n\njava.arg.4=-Djava.net.preferIPv4Stack=true\n\n# allowRestrictedHeaders is required for Cluster/Node communications to work properly\njava.arg.5=-Dsun.net.http.allowRestrictedHeaders=true\njava.arg.6=-Djava.protocol.handler.pkgs=sun.net.www.protocol\n\n# The G1GC is still considered experimental but has proven to be very advantageous in providing great\n# performance without significant \"stop-the-world\" delays.\njava.arg.13=-XX:+UseG1GC\n\n#Set headless mode by default\njava.arg.14=-Djava.awt.headless=true\n\n# Master key in hexadecimal format for encrypted sensitive configuration values\nnifi.bootstrap.sensitive.key=\n\n# Sets the provider of SecureRandom to /dev/urandom to prevent blocking on VMs\njava.arg.15=-Djava.security.egd=file:/dev/urandom\n\n# Requires JAAS to use only the provided JAAS configuration to authenticate a Subject, without using any \"fallback\" methods (such as prompting for username/password)\n# Please see https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/single-signon.html, section \"EXCEPTIONS TO THE MODEL\"\njava.arg.16=-Djavax.security.auth.useSubjectCredsOnly=true\n\n###\n# Notification Services for notifying interested parties when NiFi is stopped, started, dies\n###\n\n# XML File that contains the definitions of the notification services\nnotification.services.file=./conf/bootstrap-notification-services.xml\n\n# In the case that we are unable to send a notification for an event, how many times should we retry?\nnotification.max.attempts=5\n\n# Comma-separated list of identifiers that are present in the notification.services.file; which services should be used to notify when NiFi is started?\n#nifi.start.notification.services=email-notification\n\n# Comma-separated list of identifiers that are present in the notification.services.file; which services should be used to notify when NiFi is stopped?\n#nifi.stop.notification.services=email-notification\n\n# Comma-separated list of identifiers that are present in the notification.services.file; which services should be used to notify when NiFi dies?\n#nifi.dead.notification.services=email-notification\n"
      }, {
        "name" : "statemanagement.conf",
        "relative-path" : "nifi-1.5.0/conf/state-management.xml",
        "template-content" : "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<!--\n  Licensed to the Apache Software Foundation (ASF) under one or more\n  contributor license agreements.  See the NOTICE file distributed with\n  this work for additional information regarding copyright ownership.\n  The ASF licenses this file to You under the Apache License, Version 2.0\n  (the \"License\"); you may not use this file except in compliance with\n  the License.  You may obtain a copy of the License at\n  Unless required by applicable law or agreed to in writing, software\n  distributed under the License is distributed on an \"AS IS\" BASIS,\n  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  See the License for the specific language governing permissions and\n  limitations under the License.\n-->\n<!--\n  This file provides a mechanism for defining and configuring the State Providers\n  that should be used for storing state locally and across a NiFi cluster. In order\n  to use a specific provider, it must be configured here and its identifier\n  must be specified in the nifi.properties file.\n-->\n<stateManagement>\n    <!--\n        State Provider that stores state locally in a configurable directory. This Provider requires the following properties:\n        \n        Directory - the directory to store components' state in. If the directory being used is a sub-directory of the NiFi installation, it\n                    is important that the directory be copied over to the new version when upgrading NiFi.\n        Always Sync - If set to true, any change to the repository will be synchronized to the disk, meaning that NiFi will ask the operating system not to cache the information. This is very\n                expensive and can significantly reduce NiFi performance. However, if it is false, there could be the potential for data loss if either there is a sudden power loss or the\n                operating system crashes. The default value is false.\n        Partitions - The number of partitions.\n        Checkpoint Interval - The amount of time between checkpoints.\n     -->\n    <local-provider>\n        <id>local-provider</id>\n        <class>org.apache.nifi.controller.state.providers.local.WriteAheadLocalStateProvider</class>\n        <property name=\"Directory\">./state/local</property>\n        <property name=\"Always Sync\">false</property>\n        <property name=\"Partitions\">16</property>\n        <property name=\"Checkpoint Interval\">2 mins</property>\n    </local-provider>\n  <!--\n        State Provider that is used to store state in ZooKeeper. This Provider requires the following properties:\n        \n        Root Node - the root node in ZooKeeper where state should be stored. The default is '/nifi', but it is advisable to change this to a different value if not using\n                   the embedded ZooKeeper server and if multiple NiFi instances may all be using the same ZooKeeper Server.\n                   \n        Connect String - A comma-separated list of host:port pairs to connect to ZooKeeper. For example, myhost.mydomain:2181,host2.mydomain:5555,host3:6666\n        \n        Session Timeout - Specifies how long this instance of NiFi is allowed to be disconnected from ZooKeeper before creating a new ZooKeeper Session. Default value is \"30 seconds\"\n        \n        Access Control - Specifies which Access Controls will be applied to the ZooKeeper ZNodes that are created by this State Provider. This value must be set to one of:\n                            - Open  : ZNodes will be open to any ZooKeeper client.\n                            - CreatorOnly  : ZNodes will be accessible only by the creator. The creator will have full access to create children, read, write, delete, and administer the ZNodes.\n                                             This option is available only if access to ZooKeeper is secured via Kerberos or if a Username and Password are set.\n    -->\n    <cluster-provider>\n        <id>zk-provider</id>\n        <class>org.apache.nifi.controller.state.providers.zookeeper.ZooKeeperStateProvider</class>\n        <property name=\"Connect String\">{{NIFI_ZOOKEEPER_CONNECT_STRING}}</property>\n        <property name=\"Root Node\">/nifi/state{{FRAMEWORK_NAME}}</property>\n        <property name=\"Session Timeout\">{{NIFI_ZOOKEEPER_SESSION_TIMEOUT}}</property>\n        <property name=\"Access Control\">Open</property>\n    </cluster-provider>\n\n    <!--\n        Cluster State Provider that stores state in Redis. This can be used as an alternative to the ZooKeeper State Provider.\n\n        This provider requires the following properties:\n\n            Redis Mode - The type of Redis instance:\n                            - Standalone\n                            - Sentinel\n                            - Cluster (currently not supported for state-management due to use of WATCH command which Redis does not support in clustered mode)\n\n            Connection String - The connection string for Redis.\n                        - In a standalone instance this value will be of the form hostname:port.\n                        - In a sentinel instance this value will be the comma-separated list of sentinels, such as host1:port1,host2:port2,host3:port3.\n                        - In a clustered instance this value will be the comma-separated list of cluster masters, such as host1:port,host2:port,host3:port.\n        This provider has the following optional properties:\n\n            Key Prefix - The prefix for each key stored by this state provider. When sharing a single Redis across multiple NiFi instances, setting a unique\n                        value for the Key Prefix will make it easier to identify which instances the keys came from (default nifi/components/).\n\n            Database Index - The database index to be used by connections created from this connection pool.\n                        See the databases property in redis.conf, by default databases 0-15 will be available.\n\n            Communication Timeout - The timeout to use when attempting to communicate with Redis.\n\n            Cluster Max Redirects - The maximum number of redirects that can be performed when clustered.\n\n            Sentinel Master - The name of the sentinel master, require when Mode is set to Sentinel.\n\n            Password - The password used to authenticate to the Redis server. See the requirepass property in redis.conf.\n\n            Pool - Max Total - The maximum number of connections that can be allocated by the pool (checked out to clients, or idle awaiting checkout).\n                        A negative value indicates that there is no limit.\n\n            Pool - Max Idle - The maximum number of idle connections that can be held in the pool, or a negative value if there is no limit.\n\n            Pool - Min Idle - The target for the minimum number of idle connections to maintain in the pool. If the configured value of Min Idle is\n                    greater than the configured value for Max Idle, then the value of Max Idle will be used instead.\n\n            Pool - Block When Exhausted - Whether or not clients should block and wait when trying to obtain a connection from the pool when the pool\n                    has no available connections. Setting this to false means an error will occur immediately when a client requests a connection and\n                    none are available.\n\n            Pool - Max Wait Time - The amount of time to wait for an available connection when Block When Exhausted is set to true.\n\n            Pool - Min Evictable Idle Time - The minimum amount of time an object may sit idle in the pool before it is eligible for eviction.\n\n            Pool - Time Between Eviction Runs - The amount of time between attempting to evict idle connections from the pool.\n\n            Pool - Num Tests Per Eviction Run - The number of connections to tests per eviction attempt. A negative value indicates to test all connections.\n\n            Pool - Test On Create - Whether or not connections should be tested upon creation (default false).\n\n            Pool - Test On Borrow - Whether or not connections should be tested upon borrowing from the pool (default false).\n            Pool - Test On Return - Whether or not connections should be tested upon returning to the pool (default false).\n\n            Pool - Test While Idle - Whether or not connections should be tested while idle (default true).\n\n        <cluster-provider>\n            <id>redis-provider</id>\n            <class>org.apache.nifi.redis.state.RedisStateProvider</class>\n            <property name=\"Redis Mode\">Standalone</property>\n            <property name=\"Connection String\">localhost:6379</property>\n        </cluster-provider>\n    -->\n\n</stateManagement>\n"
      } ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "restart-cleanup",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-cleanupresources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "# Clean NiFi Application i.e. remove all disconnected node.\nmisc_repo_path=../../misc-repository\nsleep 180\nusernodesecret=`cat usernode.keytab`\ncp $misc_repo_path/readiness-info.txt .\ncp $misc_repo_path/url-info.properties .\necho \"Executing Janitor program to clean the NiFi disconnected node.\"\nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\njava -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "nifi-access",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-cleanupresources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "# Provide access to initial admin to NiFi System Diagnostics.\nmisc_repo_path=../../misc-repository\nsleep 180\ncp $misc_repo_path/readiness-info.txt .\ncp $misc_repo_path/url-info.properties .\nusernodesecret=`cat usernode.keytab`\necho \"Executing NiFi API Access.\"\nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\njava -jar nifi-api-access.jar readiness-info.txt url-info.properties ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "backup",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "nifi-backup",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*) ; sh $MESOS_SANDBOX/nifi-toolkit-${NIFI_VERSION}/bin/file-manager.sh -o backup -b nifi-backup -c $MESOS_SANDBOX/../../tasks/nifi-$POD_INSTANCE_INDEX-node*/nifi-1.5.0 -v;\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "upload-s3",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "nifi-backup",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export PATH=$MESOS_SANDBOX/python-dist/bin:$PATH ; aws s3 cp nifi-backup s3://${S3_BUCKET_NAME}/nifi-${POD_INSTANCE_INDEX}/ --recursive\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    }, {
      "name" : "cleanup-backup",
      "goal" : "ONCE",
      "essential" : true,
      "resource-set" : {
        "id" : "sidecar-resources",
        "resource-specifications" : [ {
          "@type" : "DefaultResourceSpec",
          "name" : "cpus",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 0.5
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        }, {
          "@type" : "DefaultResourceSpec",
          "name" : "mem",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 512.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "volume-specifications" : [ {
          "@type" : "DefaultVolumeSpec",
          "type" : "ROOT",
          "container-path" : "nifi-backup",
          "name" : "disk",
          "value" : {
            "type" : "SCALAR",
            "scalar" : {
              "value" : 1000.0
            },
            "ranges" : null,
            "set" : null,
            "text" : null
          },
          "role" : "nifi-role",
          "pre-reserved-role" : "*",
          "principal" : "nifi-principal"
        } ],
        "role" : "nifi-role",
        "principal" : "nifi-principal"
      },
      "command-spec" : {
        "value" : "export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre/) ; rm -r nifi-backup/*\n",
        "environment" : {
          "NIFI_BOOTSTRAP_JVM_MAX" : "512",
          "NIFI_BOOTSTRAP_JVM_MIN" : "512",
          "NIFI_CLUSTER_FIREWALL_FILE" : "",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_CANDIDATES" : "3",
          "NIFI_CLUSTER_FLOW_ELECTION_MAX_WAIT_TIME" : "1 mins",
          "NIFI_CLUSTER_IS_NODE" : "true",
          "NIFI_CLUSTER_NODE_CONNECTION_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_NODE_EVENT_HISTORY_SIZE" : "25",
          "NIFI_CLUSTER_NODE_PROTOCOL_PORT" : "12000",
          "NIFI_CLUSTER_NODE_PROTOCOL_THREADS" : "10",
          "NIFI_CLUSTER_NODE_READ_TIMEOUT" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_HEARTBEAT_INTERVAL" : "5 secs",
          "NIFI_CLUSTER_PROTOCOL_IS_SECURE" : "false",
          "NIFI_CN_DN_NODE_IDENTITY" : "nifi",
          "NIFI_COMPONENTS_STATUS_REPOSITORY_BUFFER_SIZE" : "1440",
          "NIFI_COMPONENTS_STATUS_SNAPSHOT_FREQUENCY" : "1 mins",
          "NIFI_CONTENT_CLAIM_MAX_APPENDABLE_SIZE" : "10 MB",
          "NIFI_CONTENT_CLAIM_MAX_FLOW_FILES" : "100",
          "NIFI_CONTENT_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_ENABLED" : "true",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_RETENTION_PERIOD" : "12 hours",
          "NIFI_CONTENT_REPOSITORY_ARCHIVE_MAX_USAGE_PERCENTAGE" : "50%",
          "NIFI_CONTENT_REPOSITORY_DIRECTORY" : "content-repository",
          "NIFI_CONTENT_VIEWER_URL" : "/nifi-content-viewer/",
          "NIFI_CORE_BORED_YIELD_DURATION" : "10 millis",
          "NIFI_CORE_FLOWCONTROLLER_AUTORESUMESTATE" : "true",
          "NIFI_CORE_FLOWCONTROLLER_GRACEFUL_SHUTDOWN_PERIOD" : "10 secs",
          "NIFI_CORE_FLOWSERVICE_WRITEDELAY_INTERVAL" : "500 ms",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_ENABLED" : "true",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_COUNT" : "",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_STORAGE" : "500 MB",
          "NIFI_CORE_FLOW_CONFIGURATION_ARCHIVE_MAX_TIME" : "30 days",
          "NIFI_CORE_PROCESSOR_SCHEDULING_TIMEOUT" : "1 mins",
          "NIFI_CORE_UI_AUTOREFRESH_INTERVAL" : "30 secs",
          "NIFI_CORE_UI_BANNER_TEXT" : "",
          "NIFI_DATABASE_REPOSITORY_DIRECTORY" : "database-repository",
          "NIFI_FLOWFILE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_FLOWFILE_REPOSITORY_CHECKPOINT_INTERVAL" : "2 mins",
          "NIFI_FLOWFILE_REPOSITORY_DIRECTORY" : "flowfile-repository",
          "NIFI_FLOWFILE_REPOSITORY_PARTITIONS" : "256",
          "NIFI_FRAMEWORK_USER" : "nobody",
          "NIFI_KERBEROS_AUTHENTICATION_EXPIRATION" : "12 hours",
          "NIFI_KERBEROS_DEFAULT_REALM" : "LOCAL",
          "NIFI_KERBEROS_SERVICE_PRINCIPAL" : "nifiprincipal@LOCAL",
          "NIFI_KERBEROS_USER_PRINCIPAL" : "nifiadmin@LOCAL",
          "NIFI_KILL_GRACE_PERIOD" : "20",
          "NIFI_METRICS_FREQUENCY" : "20",
          "NIFI_PROVENANCE_REPOSITORY_ALWAYS_SYNC" : "false",
          "NIFI_PROVENANCE_REPOSITORY_BUFFER_SIZE" : "100000",
          "NIFI_PROVENANCE_REPOSITORY_COMPRESS_ON_ROLLOVER" : "true",
          "NIFI_PROVENANCE_REPOSITORY_CONCURRENT_MERGE_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_DEBUG_FREQUENCY" : "1_000_000",
          "NIFI_PROVENANCE_REPOSITORY_DIRECTORY" : "provenance-repository",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_ID" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_IMPLEMENTATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_ENCRYPTION_KEY_PROVIDER_LOCATION" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_ATTRIBUTES" : "",
          "NIFI_PROVENANCE_REPOSITORY_INDEXED_FIELDS" : "EventType, FlowFileUUID, Filename, ProcessorID, Relationship",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_SHARD_SIZE" : "500 MB",
          "NIFI_PROVENANCE_REPOSITORY_INDEX_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_JOURNAL_COUNT" : "16",
          "NIFI_PROVENANCE_REPOSITORY_MAX_ATTRIBUTE_LENGTH" : "65536",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_SIZE" : "1 GB",
          "NIFI_PROVENANCE_REPOSITORY_MAX_STORAGE_TIME" : "24 hours",
          "NIFI_PROVENANCE_REPOSITORY_QUERY_THREADS" : "2",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_SIZE" : "100 MB",
          "NIFI_PROVENANCE_REPOSITORY_ROLLOVER_TIME" : "30 secs",
          "NIFI_PROVENANCE_REPOSITORY_WARM_CACHE_FREQUENCY" : "",
          "NIFI_QUEUE_SWAP_THRESHOLD" : "20000",
          "NIFI_REMOTE_INPUT_HTTP_ENABLED" : "true",
          "NIFI_REMOTE_INPUT_HTTP_TRANSACTION_TTL" : "30 secs",
          "NIFI_REMOTE_INPUT_SECURE" : "false",
          "NIFI_REMOTE_INPUT_SOCKET_PORT" : "",
          "NIFI_SECURITY_NEEDCLIENTAUTH" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_CERTIFICATE" : "",
          "NIFI_SECURITY_OCSP_RESPONDER_URL" : "",
          "NIFI_SECURITY_USER_AUTHORIZER" : "file-provider",
          "NIFI_SECURITY_USER_LOGIN_IDENTITY_PROVIDER" : "",
          "NIFI_SENSITIVE_PROPS_ADDITIONAL_KEYS" : "",
          "NIFI_SENSITIVE_PROPS_ALGORITHM" : "PBEWITHMD5AND256BITAES-CBC-OPENSSL",
          "NIFI_SENSITIVE_PROPS_KEY" : "",
          "NIFI_SENSITIVE_PROPS_KEY_PROTECTED" : "",
          "NIFI_SENSITIVE_PROPS_PROVIDER" : "BC",
          "NIFI_SWAP_IN_PERIOD" : "5 secs",
          "NIFI_SWAP_IN_THREADS" : "1",
          "NIFI_SWAP_OUT_PERIOD" : "5 secs",
          "NIFI_SWAP_OUT_THREADS" : "4",
          "NIFI_VARIABLE_REGISTRY_PROPERTIES" : "",
          "NIFI_VERSION" : "1.5.0",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_BLOCK_SIZE" : "32 KB",
          "NIFI_VOLATILE_CONTENT_REPOSITORY_MAX_SIZE" : "100 MB",
          "NIFI_WEB_HTTPS_HOST" : "",
          "NIFI_WEB_HTTPS_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTPS_PORT" : "1026",
          "NIFI_WEB_HTTP_HOST" : "",
          "NIFI_WEB_HTTP_NETWORK_INTERFACE_DEFAULT" : "",
          "NIFI_WEB_HTTP_PORT" : "1025",
          "NIFI_WEB_JETTY_THREADS" : "200",
          "NIFI_WEB_JETTY_WORKING_DIRECTORY" : "./work/jetty",
          "NIFI_WEB_WAR_DIRECTORY" : "./lib",
          "NIFI_ZOOKEEPER_CONNECT_STRING" : "master.mesos:2181",
          "NIFI_ZOOKEEPER_CONNECT_TIMEOUT" : "3 secs",
          "NIFI_ZOOKEEPER_SESSION_TIMEOUT" : "3 secs",
          "SECURITY_KERBEROS_DEBUG" : "false",
          "SECURITY_KERBEROS_ENABLED" : "false",
          "SECURITY_KERBEROS_KDC_HOSTNAME" : "kdc.marathon.autoip.dcos.thisdcos.directory",
          "SECURITY_KERBEROS_KDC_PORT" : "2500",
          "SECURITY_KERBEROS_PRIMARY" : "nifi",
          "SECURITY_KERBEROS_REALM" : "LOCAL"
        }
      },
      "health-check-spec" : null,
      "readiness-check-spec" : null,
      "config-files" : [ ],
      "discovery-spec" : null,
      "kill-grace-period" : 0,
      "transport-encryption" : [ ]
    } ],
    "placement-rule" : {
      "@type" : "AndRule",
      "rules" : [ {
        "@type" : "IsLocalRegionRule"
      }, {
        "@type" : "MaxPerHostnameRule",
        "max" : 1,
        "task-filter" : {
          "@type" : "RegexMatcher",
          "pattern" : "nifi-.*"
        }
      } ]
    },
    "volumes" : [ ],
    "pre-reserved-role" : "*",
    "secrets" : [ ],
    "share-pid-namespace" : false,
    "allow-decommission" : false
  } ],
  "replacement-failure-policy" : null,
  "user" : "nobody"
}
```

# Service Status Info
Send a GET request to the `/v1/state/properties/suppressed` endpoint to learn if DC/OS Apache NiFi is in a `suppressed` state and not receiving offers. If a service does not need offers, Mesos can "suppress" it so that other services are not starved for resources.
You can use this request to troubleshoot: if you think DC/OS Apache NiFi should be receiving resource offers, but is not, you can use this API call to see if DC/OS Apache NiFi is suppressed.

```shell
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/nifi/v1/state/properties/suppressed"
```



# Apache NiFi Node Operations
These operations provide access to the NiFi cluster node using the available NiFi REST API. The Rest API provides programmatic access to command and control a NiFi instance in real time. You can see the [NiFi REST API](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) for more about the available API.


## List NiFi Cluster Summary

CLI Example
```shell
dcos nifi cluster summary
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/cluster/
```


## List NiFi Node

CLI Example
```shell
dcos nifi node list
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/
```

## List NiFi Node for a status

CLI Example
```shell
dcos nifi node status <nifi_node_status>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/status/<nifi_node_status>
```

## Details of a NiFi Node

CLI Example
```shell
dcos nifi node <nifi_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/<nifi_node_id>
```


## Remove a NiFi Node

CLI Example
```shell
dcos nifi node remove <nifi_node_id>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nodes/remove/<nifi_node_id>
```



## Control NiFi Node using GET endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) uses GET method are accessable using below DC/OS cli and http.

CLI Example
```shell
dcos nifi api get <nifi_get_endpoints_uri>
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/get?uri=<nifi_get_endpoints_uri>
```

## Control NiFi Node using POST endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) uses POST method are accessable using below DC/OS cli and http.

CLI Example
```shell
dcos nifi api post <nifi_post_endpoints_uri> stdin
{
  "id": "",
  "service": ""
}
```

OR

```shell
dcos nifi api post <nifi_post_endpoints_uri> <json_payload_file>
```



HTTP Example

```shell
curl -X POST -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/post?uri=<nifi_post_endpoints_uri>
{
  "id": "",
  "service": ""
}
```

## Control NiFi Node using PUT endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) uses PUT method are accessable using below DC/OS cli and http.

CLI Example
```shell
dcos nifi api put <nifi_put_endpoints_uri> stdin
{
  "id": "",
  "service": ""
}
```

OR

```shell
dcos nifi api post <nifi_put_endpoints_uri> <json_payload_file>
```



HTTP Example

```shell
curl -X PUT -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/put?uri=<nifi_put_endpoints_uri>
{
  "id": "",
  "service": ""
}
```


## Control NiFi Node using DELETE endpoint
All NiFi [endpoints](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) uses DELETE method are accessable using below DC/OS cli and http.

CLI Example
```shell
dcos nifi api delete <nifi_delete_endpoints_uri>
```

HTTP Example

```shell
curl -X DELETE -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/nifi-api/delete?uri=<nifi_delete_endpoints_uri>
```
