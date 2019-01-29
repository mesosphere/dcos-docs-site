---
layout: layout.pug
navigationTitle:
title: Kerberos
menuWeight: 70
excerpt: Adding principals for agent hostnames
featureMaturity:
enterprise: true
---
# Setting up Apache ZooKeeper with Kerberos

## Create principals

In order to run Apache ZooKeeper with Kerberos security enabled, a principal needs to be added for every node in the ensemble. For example, a three node ensemble with the default service primary (`service.security.kerberos.primary`) of `zookeeper` will require to following principals:
```
zookeeper/zookeeper-0-server.kafka-zookeeper.autoip.dcos.thisdcos.directory@LOCAL
zookeeper/zookeeper-1-server.kafka-zookeeper.autoip.dcos.thisdcos.directory@LOCAL
zookeeper/zookeeper-2-server.kafka-zookeeper.autoip.dcos.thisdcos.directory@LOCAL
```
(assuming a default service name of `kafka-zookeeper`)

Note that due to a limitation in the current version of Apache ZooKeeper, it is required that the principals for the agent hostnames also be added as well as the DC/OS DNS names. `{{AGENT-0-HOSTNAME}}` can be determined by running `hostname` on the agent where Apache ZooKeeper will be installed.

This means that at least the following three principals **must** also be created:
```
zookeeper/{{AGENT-0-HOSTNAME}}@LOCAL
zookeeper/{{AGENT-1-HOSTNAME}}@LOCAL
zookeeper/{{AGENT-2-HOSTNAME}}@LOCAL
```
Adding principals for additional hosts will make the service more resilient to resource limitations and node failures. Once the desired number of principals have been added, [placement constraints](#service-settings) are used to ensure that the nodes of the ensemble are run on the desired hosts.

## Create the keytab secret

Once the principals have been created, a keytab file must be generated and uploaded to the DC/OS secret store as a base-64-encoded value. Assuming the keytab for **all** the ZooKeeper principals has been created as a file `keytab`, this can be added to the secret store as follows (note that the DC/OS Enterprise CLI needs to be installed to gain access to the `security` command):
```bash
$ base64 -w 0 keytab > keytab.base64
$ dcos security secrets create  __dcos_base64__keytab --text-file keytab.base64
```

The name of the secret created (`__dcos_base64__keytab`) can be changed, as long as the `__dcos__base64__` prefix is maintained.

## Deploy kerberized ZooKeeper

Create the following `kerberos-options.json` file:
```json
{
    "service": {
        "name": "kafka-zookeeper",
        "security": {
            "kerberos": {
                "enabled": true,
                "kdc": {
                    "hostname": "kdc.marathon.autoip.dcos.thisdcos.directory",
                    "kdc": 2500
                },
                "keytab_secret": "__dcos_base64__keytab"
            }
        }
    },
    "node": {
        "placement_constraint": "[[\"hostname\", \"LIKE", \"{{AGENT-0-HOSTNAME}}|{{AGENT-1-HOSTNAME}}|{{AGENT-2-HOSTNAME}}\"]]"
    }
}
```
Note the specification of the secret name as created in the previous step and the addition of the `node.placement_constraint` property selecting the nodes for which principals were added.

The kerberized Apache ZooKeeper service is then deployed by running:
```bash
$ dcos package install beta-kafka-zookeeper --options=kerberos-options.json
```
