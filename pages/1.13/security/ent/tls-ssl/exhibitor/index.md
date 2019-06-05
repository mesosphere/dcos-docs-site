---
layout: layout.pug
navigationTitle:  Securing Exhibitor with mutual TLS
title: Securing Exhibitor with mutual TLS
menuWeight: 500
excerpt: Securing DC/OS with a TLS enabled Exhibitor ensemble
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

By default, the Exhibitor HTTP service is open to any client that can reach port 8181 on a master node. This documentation chapter describes a method for protecting the Exhibitor service from unauthorized access. Once enabled, HTTP clients must access Exhibitor through Admin Router; thus applying the Admin Router access control policy to the Exhibitor service.

*Note: When accessing Exhibitor through Admin Router (**https://master_host/exhibitor**), authenticated users must have the `dcos:adminrouter:ops:exhibitor` privilege*

# Securing Exhibitor

The strategy for securing Exhibitor is mutual TLS authentication. In order to secure Exhibitor we must first create a unique root CA certificate. This CA certificate is used to sign various end entity certificates for the Admin Router and Exhibitor services. Creating a public key infrastructure that outputs PEM and Java Keytool formatted artifacts is not a trivial task. To make this processes easier, a simple tool has been created for producing the necessary files.

*Note: This guide is only compatible with clusters which use `static` master discovery, `master_http_loadbalancer` is not currently supported. (https://docs.mesosphere.com/1.13/installing/production/advanced-configuration/configuration-reference/#master-discovery-required)*

## Using the tool

*Note: A working Docker installation is required. If Docker is not available see https://github.com/mesosphere/exhibitor-tls-artifacts-gen/blob/master/README.md for information on running the command natively.*

Download the script from the github release page and run it:

```sh
curl -LsO https://github.com/mesosphere/exhibitor-tls-artifacts-gen/releases/download/0.0.3/exhibitor-tls-artifacts
chmod +x exhibitor-tls-artifacts
./exhibitor-tls-artifacts --help
```

You should see something like this:

    Usage: exhibitor-tls-artifacts [OPTIONS] [NODES]...

    Generates Admin Router and Exhibitor TLS artifacts. NODES should consist
    of a space separated list of master ip addresses. See
    https://docs.mesosphere.com/1.13/security/ent/tls-ssl/exhibitor/

    Options:
    -d, --output-directory TEXT  Directory to put artifacts in. This
                                 output_directory must not exist.
    --help                       Show this message and exit.



### Generating the artifacts
To generate the TLS artifacts, run the tool with the master node ip addresses as positional arguments. The ip addresses to use are found in the `master_list` field of the config.yml. If this file is not available, running `/opt/mesosphere/bin/detect_ip` on each master should also produce the correct address.

As an example, if your master nodes are `10.192.0.2, 10.192.0.3, 10.192.0.4`, invoke the script using:

```sh
./exhibitor-tls-artifacts 10.192.0.2 10.192.0.3 10.192.0.4
```

This will create a directory called `artifacts` (which must not exist prior to running the command) in the current directory. Under `artifacts` you will find root-cert.pem and truststore.jks. These files contain the root CA certificate in PEM and java keystore format. The `artifacts` directory will also contain three sub-directories, `node_10_192_0_2`, `node_10_192_0_3`, and `node_10_192_0_4`. Each containing the following files:

    client-cert.pem
    client-key.pem
    clientstore.jks
    root-cert.pem
    serverstore.jks
    truststore.jks

These directories contain all necessary files for securing each Exhibitor node.

## Installing the artifacts
Copy the contents of each node's artifact directory to `/var/lib/dcos/exhibitor-tls-artifacts` to the appropriate master. 

For example:

```sh
scp -r artifacts/node_10_192_0_2 root@10.192.0.2:/var/lib/dcos/exhibitor-tls-artifacts
scp -r artifacts/node_10_192_0_3 root@10.192.0.3:/var/lib/dcos/exhibitor-tls-artifacts
scp -r artifacts/node_10_192_0_4 root@10.192.0.4:/var/lib/dcos/exhibitor-tls-artifacts
```

## Restarting the services

Exhibitor and Master Admin Router must be restarted on all nodes. After all files have been copied, run the following commands on **all** master nodes.

**Warning: This will result in a small amount downtime for Zookeeper and Master Admin Router.**

```sh
systemctl restart dcos-exhibitor.service
systemctl restart dcos-adminrouter.service
```

The systemd unit scripts will detect the presence of the artifacts and set ownership and permissions accordingly.

When deploying a new cluster, make sure the artifacts are generated and uploaded to the master servers prior to installing DC/OS.
