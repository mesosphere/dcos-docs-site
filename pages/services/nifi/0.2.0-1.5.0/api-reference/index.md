---
layout: layout.pug
navigationTitle:  API Reference
title: API Reference
menuWeight: 70
excerpt: DC/OS Apache NiFi Service API Reference
featureMaturity:
enterprise: false
---

<!-- {% raw %} disable mustache templating in this file: retain nifid examples as-is -->

The DC/OS Apache NiFi Service implements a REST API that may be accessed from outside the cluster. The <dcos_url> parameter referenced below indicates the base URL of the DC/OS cluster on which the DC/OS Apache NiFfi Service is deployed.

<a name="#rest-auth"></a>
# REST API Authentication
REST API requests must be authenticated. This authentication is only applicable for interacting with the DC/OS Apache NiFi REST API directly. You do not need the token to access the Apache NiFi nodes themselves.

If you are using Enterprise DC/OS, follow these instructions to [create a service account](../security/serviceaccountdetail.md) and an [authentication token](https://docs.mesosphere.com/1.10/security/ent/service-auth/custom-service-auth/). You can then configure your service to automatically refresh the authentication token when it expires. 

Once you have the authentication token, you can store it in an environment variable and reference it in your REST API calls:

```shell
export auth_token=uSeR_t0k3n
```

The `curl` examples in this document assume that an auth token has been stored in an environment variable named `auth_token`.

If you are using Enterprise DC/OS, the security mode of your installation may also require the `--ca-cert` flag when making REST calls. Refer to [Obtaining and passing the DC/OS certificate in Curl requests](https://docs.mesosphere.com/1.10/security/ent/tls-ssl/ca-trust-curl/) for information on how to use the `--cacert` flag. [If your security mode is `disabled`](https://docs.mesosphere.com/1.10/security/ent/secrets/seal-store/), do not use the `--ca-cert` flag.

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

<!-- TODO: provide endpoint <endpoint> example (default options) output -->

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

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/<node-id>/info
```

You will see a response similar to the following:

```bash
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
          "value" : "# The Nifi node has started when it logs a specific \n# \"${TASK_NAME}.${FRAMEWORK_HOST}:$nifi_web_port is now connected\" log line. \n# An example is below:\n# 2018/03/05 11:11:37 nifi-0-node.nifi.autoip.dcos.thisdcos.directory:1025 is now connected.\nnifi_server_log_files=nifi-${NIFI_VERSION}/logs/nifi-app.log\nnifi_authorizations_file=$MESOS_SANDBOX/../../misc-repository/authorizations.xml\nnifi_host_name=${TASK_NAME}.${FRAMEWORK_HOST}\nnifi_web_port=${PORT_WEB}\nreadiness_info=`cat misc-repository/readiness-info.txt`\necho \"Executing shell script.\"\necho \"$readiness_info\"\nif [ \"$readiness_info\" == \"INSTALL\" ] ; then\n  echo \"Checking for successful log line in $nifi_server_log_files.\"\n  echo \"Looking for \\\"$nifi_host_name:$nifi_web_port is now connected or NiFi has started.\\\" in the server log file.\"\n  grep -q \"$nifi_host_name:$nifi_web_port is now connected\\|NiFi has started.\" $nifi_server_log_files\n  if [ $? -eq 0 ] ; then\n    echo \"Found started log line.\"\n    echo \"READY\" > misc-repository/readiness-info.txt\n    echo \"HOST=$nifi_host_name\" > misc-repository/url-info.properties\n    echo \"PORT=$nifi_web_port\" >> misc-repository/url-info.properties\n    echo \"AUTHORIZATIONS_FILE=$nifi_authorizations_file\" >> misc-repository/url-info.properties\n  else\n    echo \"started log line not found. Exiting.\"\n    exit 1\n  fi\n  echo \"Required log line found. Nifi is ready.\"\nelif [ $readiness_info == \"READY\" ] ; then\n  echo \"Nifi is ready.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the Nifi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nelif [ $readiness_info == \"RUNNING\" ] ; then\n  echo \"Nifi is running.\"\n  misc_repo_path=../../misc-repository\n  usernodesecret=`cat usernode.keytab`\n  cp $misc_repo_path/readiness-info.txt .\n  cp $misc_repo_path/url-info.properties .\n  echo \"Executing Janitor program to clean the Nifi disconnected node.\"\n  export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\n  java -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\nfi\nexit 0\n",
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
      "value" : "# Clean Nifi Application i.e. remove all disconnected node.\nmisc_repo_path=../../misc-repository\nsleep 180\nusernodesecret=`cat usernode.keytab`\ncp $misc_repo_path/readiness-info.txt .\ncp $misc_repo_path/url-info.properties .\necho \"Executing Janitor program to clean the Nifi disconnected node.\"\nexport JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH\njava -jar nifi-janitor.jar readiness-info.txt url-info.properties ${SECURITY_KERBEROS_ENABLED} ${NIFI_KERBEROS_USER_PRINCIPAL} \"$usernodesecret\"\n",
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

CLI Example

```shell
dcos nifi pod info node-0
```

HTTP Example

```shell
curl  -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/pod/node-0/info
```

You will see a response similar to the following:

<!-- TODO: provide pod <node-id> example (default options) output -->

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

<!-- TODO: provide configurations/target example (default options) output -->

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

<!-- TODO: provide configurations example (default options) output -->

## View Specified Config

You can view a specific configuration by sending a GET request to `/v1/configurations/<config-id>`.

CLI Example

```shell
dcos nifi config show 9a8d4308-ab9d-4121-b460-696ec3368ad6
```

HTTP Example

```shell
curl -H "Authorization:token=$auth_token" <dcos_url>/service/nifi/v1/configurations/9a8d4308-ab9d-4121-b460-696ec3368ad6
```

You will see a response similar to the target config above.

# Service Status Info
Send a GET request to the `/v1/state/properties/suppressed` endpoint to learn if DC/OS Apache NiFi is in a `suppressed` state and not receiving offers. If a service does not need offers, Mesos can "suppress" it so that other services are not starved for resources.
You can use this request to troubleshoot: if you think DC/OS Apache NiFi should be receiving resource offers, but is not, you can use this API call to see if DC/OS Apache NiFi is suppressed.

```shell
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/nifi/v1/state/properties/suppressed"
```



# Apache NiFi Node Operations
These operations provide access to the NiFi cluster node using the available NiFi REST Api. The Rest Api provides programmatic access to command and control a NiFi instance in real time. You can see the [NiFi REST Api](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html) for more about the available Api.


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
