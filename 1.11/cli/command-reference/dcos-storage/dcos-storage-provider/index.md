---
layout: layout.pug
navigationTitle:  dcos storage provider
title: dcos storage provider
menuWeight: 2
enterprise: true
beta: true
---

A _volume provider_ manages storage capacity offered by a CSI plugin to the DC/OS cluster through a DC/OS [storage plugin](/1.11/storage/plugins/). A DC/OS storage plugin consists of a CSI plugin along with some code that integrates it into DC/OS. A volume provider that specifies its plugin as "lvm" is referred to as a "lvm" volume provider.

There are two kinds of volume provider: local and external. A local volume provider manages storage capacity that is tied to a specific Mesos agent, such as a LVM2 volume group managed by a "lvm" volume provider. An external volume provider manages storage capacity that is not tied to any specific Mesos Agent such as the "ebs" volume provider which uses the Amazon EBS API to remotely operate on any Mesos agent in the cluster.

There can be several volume providers for the same type of CSI plugin. For example, the LVM2 CSI plugin manages a single LVM2 volume group, but there can be more than one LVM2 volume group on an agent, so each LVM2 volume group will be configured as a separate volume provider.


```bash
dcos storage provider --help
dcos storage provider [<command> [options] | --help]
Manage volume providers.

Commands:
  dcos storage provider create [options]
    Create a new volume provider.
  dcos storage provider remove [<name> | --help]
    Remove an existing volume provider.
  dcos storage provider list [--help]
    List existing volume providers.
  dcos storage provider show [<type> <name> | --help]
    Show the details of a specific volume provider.
```

# dcos storage provider create

You configure a volume provider by passing a JSON document to the `provider create` command. The JSON configuration is read from `<path>` or from stdin if no `<path>` is specified.

The provider configuration consists of multiple fields: `name`, `description`, and `spec`.

- The `name` field uniquely identifies the volume provider. It is a string of up to 128 characters. The name must consist of the characters from `[A-Za-z0-9\-]`, and must start with a letter. It must be unique throughout the cluster. This field is required.
- The `description` item lets you specify a human-readable description for the volume provider to add some extra context. This is a string of up to 512 characters. This field is optional.
- The `spec` field is itself a nested structure containing the following fields: `plugin`, `node`, `plugin-configuration`, `labels`, and `secrets`. When you later configure volume profiles you can select which volume providers to use by filtering on the fields in their `spec`. This field is required.
- The `spec.plugin` field specifies the name of a DC/OS storage plugin (e.g., "lvm", "ebs"). This field is required.
- The `spec.node` field specifies the Mesos agent ID of a specific agent to which a local volume provider is bound. This field is required for local volume providers and must be omitted for external volume providers.
- The `spec.plugin-configuration` field is plugin specific and you should consult the specific plugin documentation for the supported configuration. This field is required.

The `spec.labels` section lets you label the volume provider. Labels are not interpreted by DC/OS and it is up to you to ensure that they are meaningful. Labels consist of key-value pairs. The keys must be strings of 128 characters or fewer. The values must be strings of 128 characters or fewer. At maximum 64 labels can be defined although some plugins might further limit the number and format of labels. This field is optional. Example labels:

```json
{
  "name": "...",
  "description": "...",
  "spec": {
    "plugin": "...",
    "node": "...",
    "plugin-configuration": { ... },
    "secrets": { ... },
    "labels": {
      "rotational": "false",
      "manufacturer": "samsung",
      "nvme": "true",
      "raid": "1"
    }
  }
}
```

The `spec.secrets` section lets you specify DC/OS secrets that will be injected into the ‘plugin-configuration’ section. This section is optional. Example secrets:

```json
{
  "name": "...",
  "spec": {
    "plugin": "ebs",
    "plugin-configuration": {
      "credentials": {
        "secret_access_key": "dcos-aws-secret"
      }
    },
    "secrets": {
      "dcos-aws-secret": "/aws/secret"
    },
    "labels": { ... }
  }
}
```

```bash
dcos storage provider create --help
dcos storage provider create [<path> | --help]
Create a new volume provider.

Arguments:
  <path>  A URL or local path to the volume provider configuration JSON. If omitted the 
      volume provider configuration JSON is read from stdin.

Options:
  -h, --help        Display this help text.
```

Example `plugin-configuration` for a "lvm" volume provider.

```json
{
"name": "lvm-ssds",
  "description": "LVM2 volume group with multiple metadata copies.",
  "spec": {
    "plugin": "lvm",
    "node": "10.10.0.2",
    "plugin-configuration": {
      "devices": ["/dev/sdb", "/dev/sdc"],
      "parameters": {"metadatacopies": 3}
    },
    "secrets": { ... },
    "labels": { ... }
  }
}
```


## Example

Create a LVM2 volume group called "volume-group-1" from configuration in a local file called `provider.json`:

  ```bash
  cat provider.json
  ```
  
  ```json
  {
    "name": "volume-group-1",
      "description": "the primary volume group",
    "spec": {
      "plugin": "lvm",
      "node": "10.10.0.2",
      "plugin-configuration": {
        "devices": ["/dev/sdb", "/dev/sdc"],
        "parameters": {"metadatacopies": 3}
      },
      "labels": {"rotational": "false"}
    }
  }
  ```

  ```bash
  dcos storage provider create provider.json
  ```


Create a LVM2 volume group called "volume-group-1" from configuration passed on stdin:

```bash
cat <<EOF | dcos storage provider create
{
  "name": "volume-group-1",
  "description": "the primary volume group",
  "spec": {
    "plugin": "lvm",
    "node": "10.10.0.2",
    "plugin-configuration": {
      "devices": ["/dev/sdb", "/dev/sdc"],
      "parameters": {"metadatacopies": 3}
    },
    "labels": {"rotational": "false"}
  }
}
EOF
```

Create an Amazon EBS volume provider using credentials stored as a DC/OS secret called "/aws/secret":

```bash
cat <<EOF | dcos storage provider create ebs archive
{
  "name": "archive",
  "spec": {
    "plugin": "ebs",
    "plugin-configuration": {
      "availability-region": "us-west-1",
      "credentials": {
        "access_key_id": "AKIAIH3SLCHGZVR4Q",
        "secret_access_key": "dcos-aws-secret
      }
    },
    "secrets": {
      "dcos-aws-secret": "/aws/secret"
    },
    "labels": {
      "slow": "true",
      "rotational": "false"
    }
  }
}
EOF
```

# dcos storage provider remove

```bash
dcos storage provider remove --help
dcos storage provider remove [<name> | --help]
Remove an existing volume provider.

Arguments:
  <name>    The name of the volume provider (eg., volume-group-1, nfs-local-1)

Options:
-h, --help  Display this help text.
```

## Example

Create a volume provider then remove it.

```bash
  cat <<EOF | dcos storage provider create
  {
    "name": "ssds",
    "spec": {
      "plugin": "lvm",
      "node": "10.10.0.3",
      "plugin-configuration": {
        "devices": ["/dev/sdb", "/dev/sdc"]
      },
      "labels": {"rotational": "false"}
    }
  }
  
  dcos storage provider remove ssds
```

# dcos storage provider list

```bash
dcos storage provider list --help
dcos storage provider list [[options] | --help]
List existing volume providers.

Options:
-h, --help  Display this help text.
  --json    Display the list of volume providers in json format.
  --node    Only show local volume providers on node.
```


## Example

Create two volume providers then list them.

  ```bash
  cat <<EOF | dcos storage provider create
  {
    "name": "ssds",
    "spec": {
      "plugin": "lvm",
      "node": "10.10.0.3",
      "plugin-configuration": {
        "devices": ["/dev/sdb", "/dev/sdc"]
      },
      "labels": {"rotational": "false"}
    }
  }
  EOF
  
  cat <<EOF | dcos storage provider create
  {
    "name": "secure-ebs",
    "spec": {
      "plugin": "ebs",
      "plugin-configuration": {
        "availability-region": "us-west-1",
        "credentials": {
          "access_key_id": "AKIAIH3SLCHGZVR4Q",
          "secret_access_key": "dcos-aws-secret"
        }
      },
      "secrets": {
        "dcos-aws-secret": "/aws/secret"
      }
    }
  }
  EOF
  
  dcos storage provider list
  TYPE  NAME      NODE    STATUS
  lvm  ssds      10.10.0.3  degraded
  ebs  secure-ebs    -    ok
  
  dcos storage provider list --json
  ```
  
  ```json
  {
    "providers": [
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.3",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      },
      "status": "degraded"
    },
    {
      "name": "secure-ebs",
      "spec": {
        "plugin": "ebs",
        "plugin-configuration": {
          "availability-region": "us-west-1",
          "credentials": {
            "access_key_id": "AKIAIH3SLCHGZVR4Q",
            "secret_access_key": "dcos-aws-secret"
          }
        },
        "secrets": {
          "dcos-aws-secret": "/aws/secret"
        }
      },
      "status": "ok"
    } ]
  }
  ```

# dcos storage provider show

```bash
dcos storage provider show --help
dcos storage provider show [<name> [options]| --help]
Show the details of a specific volume provider.

Arguments:
  <name>    The name of the volume provider whose details to show.

Options:
  -h, --help  Display this help text
  --json    Display the details in JSON format
```

## Example

Create two volume providers then show their details.

1. Create the "ssds" volume provider.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "ssds",
      "spec": {
        "plugin": "lvm",
        "node": "10.10.0.3",
        "plugin-configuration": {
          "devices": ["/dev/sdb", "/dev/sdc"]
        },
        "labels": {"rotational": "false"}
      }
    }
    EOF
    ```
    
1. Create the "secure-ebs" volume provider.

    ```bash
    cat <<EOF | dcos storage provider create
    {
      "name": "secure-ebs",
      "spec": {
        "plugin": "ebs",
        "plugin-configuration": {
          "availability-region": "us-west-1",
          "credentials": {
            "access_key_id": "AKIAIH3SLCHGZVR4Q",
            "secret_access_key": "dcos-aws-secret"
          }
        },
        "secrets": {
          "dcos-aws-secret": "/aws/secret"
        }
      }
    }
    EOF
    
    dcos storage provider show ssds
    NAME
    ssds
    SPEC
    {
      "plugin": "lvm",
      "node": "10.10.0.3",
      "plugin-configuration": {
        "devices": ["/dev/sdb", "/dev/sdc"]
      },
      "labels": {"rotational": "false"}
    }
    STATUS
    ok
    
    dcos storage provider show secure-ebs --json
    ```
    
    ```json
    {
      "name": "secure-ebs",
      "spec": {
        "plugin": "ebs",
        "plugin-configuration": {
          "availability-region": "us-west-1",
          "credentials": {
            "access_key_id": "AKIAIH3SLCHGZVR4Q",
            "secret_access_key": "dcos-aws-secret"
          }
        },
        "secrets": {
          "dcos-aws-secret": "/aws/secret"
        }
      },
      "status": "ok"
    }
    ```
