---
layout: layout.pug
navigationTitle:  Install and Customize
title: Install and Customize
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


Kafka is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

##  <a name="install-enterprise"></a>Prerequisites

- Depending on your security mode in Enterprise DC/OS, you may [need to provision a service account](/services/kafka/kafka-auth/) before installing Confluent Kafka. Only someone with `superuser` permission can create the service account.
	- `strict` [security mode](/1.9/installing/ent/custom/configuration/configuration-parameters/#security-and-authentication) requires a service account.
	- `permissive` security mode a service account is optional.
	- `disabled` security mode does not require a service account.
- Your cluster must have at least three private nodes.

# Default Installation

To start a basic test cluster with three brokers, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing Kafka on Enterprise DC/OS](#install-enterprise).

    $ dcos package install confluent-kafka


This command creates a new Confluent Kafka cluster with the default name `confluent-kafka`. Two clusters cannot share the same name, so installing additional clusters beyond the default cluster requires [customizing the `name` at install time][4] for each additional instance.

All `dcos confluent-kafka` CLI commands have a `--name` argument allowing the user to specify which Kafka instance to query. If you do not specify a service name, the CLI assumes the default value, `confluent-kafka`. The default value for `--name` can be customized via the DC/OS CLI configuration:

    $ dcos confluent-kafka --name confluent-kafka-dev <cmd>

**Note:** Alternatively, you can [install Beta Confluent Kafka from the DC/OS web interface](/1.9/deploying-services/install/). If you install Beta Confluent Kafka from the web interface, you must install the Beta Confluent Kafka DC/OS CLI subcommands separately. From the DC/OS CLI, enter:

```bash
dcos package install confluent-kafka --cli
```

# Minimal Installation

For development purposes, you may wish to install Beta Confluent Kafka on a local DC/OS cluster. For this, you can use [dcos-vagrant][5].

To start a minimal cluster with a single broker, create a JSON options file named `sample-confluent-kafka-minimal.json`:

    {
        "brokers": {
            "count": 1,
            "mem": 512,
            "disk": 1000
        }
    }


The command below creates a cluster using `sample-confluent-kafka-minimal.json`:

    $ dcos package install --options=sample-confluent-kafka-minimal.json confluent-kafka

<a name="custom-installation"></a>
# Custom Installation

Customize the defaults by creating a JSON file. Then, pass it to `dcos package install` using the `--options` parameter.

Sample JSON options file named `sample-confluent-kafka-custom.json`:

    {
        "service": {
            "name": "sample-confluent-kafka-custom",
            "placement_strategy": "NODE"
        },
        "brokers": {
            "count": 10,
            "kill_grace_period": 30
        },
        "kafka": {
            "delete_topic_enable": true,
            "log_retention_hours": 128
        }
    }


The command below creates a cluster using `sample-confluent-kafka.json`:

    $ dcos package install --options=sample-confluent-kafka-custom.json confluent-kafka

**Recommendation:** Store your custom configuration in source control.

See [Configuration Options][6] for a list of fields that can be customized via an options JSON file when the Kafka cluster is created.

# Multiple Confluent Kafka cluster installation

Installing multiple Kafka clusters is identical to installing Kafka clusters with custom configurations as described above. The only requirement on the operator is that a unique `name` be specified for each installation. For example:

    $ cat confluent-kafka1.json
    {
        "service": {
            "name": "confluent-kafka1"
        }
    }

    $ dcos package install confluent-kafka --options=confluent-kafka1.json

<!-- THIS BLOCK DUPLICATES THE OPERATIONS GUIDE -->

## Integration with DC/OS access controls

In Enterprise DC/OS 1.10 and above, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access to only certain services. You do this by installing your service into a folder, and then restricting access to some number of folders. Folders also allow you to namespace services. For instance, `staging/confluent` and `production/confluent`.

Steps:

1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click **Organization** > **Groups** > **+** or **Organization** > **Users** > **+**. If you create a group, you must also create a user and add them to the group.
1. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called `developer`, who will have access to the `/testing` folder.
   Select the group or user you created. Select **ADD PERMISSION** and then toggle to **INSERT PERMISSION STRING**. Add each of the following permissions to your user or group, and then click **ADD PERMISSIONS**.

   ```
   dcos:adminrouter:service:marathon full
   dcos:service:marathon:marathon:services:/testing full
   dcos:adminrouter:ops:mesos full
   dcos:adminrouter:ops:slave full
   ```
1. Install your service into a folder called `test`. Go to **Catalog**, then search for **confluent**.
1. Click **CONFIGURE** and change the service name to `/testing/confluent`, then deploy.

   The slashes in your service name are interpreted as folders. You are deploying Kafka in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

**Important:**
- Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders.
- DC/OS 1.9 and earlier does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.

### Interacting with your foldered service

- Interact with your foldered service via the DC/OS CLI with this flag: `--name=/path/to/myservice`.
- To interact with your foldered service over the web directly, use `http://<dcos-url>/service/path/to/myservice`. E.g., `http://<dcos-url>/service/testing/kafka/v1/endpoints`.

<!-- END DUPLICATE BLOCK -->

 [4]: #custom-installation
 [5]: https://github.com/mesosphere/dcos-vagrant
 [6]: /services/kafka/configure/#configuration-options
