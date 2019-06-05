---
layout: layout.pug
navigationTitle:  Securing Exhibitor with mutual TLS
title: Securing Exhibitor with mutual TLS
menuWeight: 500
excerpt: Securing DC/OS with a TLS enabled Exhibitor ensemble
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

By default, the Exhibitor HTTP service is open to any client that can reach port 8181 on a master node. This documentation chapter describes a method for protecting the Exhibitor service from unauthorized access. Once enabled, HTTP clients must access Exhibitor through Admin Router; thus applying the Admin Router access control policy to the exhibitor service.

*Note: When accessing Exhibitor through Admin Router (**https://master_host/exhibitor**), authenticated users must have the `dcos:adminrouter:ops:exhibitor` privilege*

# Securing Exhibitor

The strategy for securing exhibitor is mutual TLS authentication. In order to secure exhibitor we must first create a unique root CA. This CA must be used to sign a client certificate for each master node. Creating a public key infrastructure that outputs PEM and Java Keytool formatted artifacts is not a trivial task. To make this processes easier, a simple tool has been created for producing the necessary files. 

*Note: This guide assumes a static exhibitor ensemble. Dynamic masters are not currently supported*

## Using the tool

*Note: A working docker installation is required. If docker is not available see https://github.com/mesosphere/exhibitor-tls-artifacts-gen/blob/master/README.md for information on running the command natively.*

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


To generate the TLS artifacts, run the tool and provide your master nodes ip addresses as positional arguments. For example, if your master nodes are `10.192.0.2, 10.192.0.3, 10.192.0.4`, invoke the command using:

```sh
./exhibitor-tls-artifacts 10.192.0.2 10.192.0.3 10.192.0.4
```

This will create a directory called `artifacts` in the current directory. Under `artifacts` you will find root-cert.pem and truststore.jks. These files contain the root CA certificate in PEM and java keystore format. The `artifacts` directory will also contain three sub-directories, `node_10_192_0_2`, `node_10_192_0_3`, and `node_10_192_0_4`. Each containing the following files:

    client-cert.pem
    client-key.pem
    clientstore.jks
    root-cert.pem
    serverstore.jks
    truststore.jks

The node_* directories contain all necessary files for securing Exhibitor on each node.

## Installing the artifacts
Copy the contents of each node's artifact directory to `/var/lib/dcos/exhibitor-tls-artifacts`. 

For example:

```sh
scp -r artifacts/node_10_192_0_2 root@10.192.0.2:/var/lib/dcos/exhibitor-tls-artifacts
```

## Restarting the services

If the cluster is already running, a restart of exhibitor and adminrouter on all nodes is required. Once the files are in place run the following commands on each master:

```sh
systemctl restart dcos-exhibitor.service
systemctl restart dcos-adminrouter.service
```

The systemd unit scripts will detect the presence of the artifacts and set ownership and permissions accordingly.

When deploying a new cluster, make sure the artifacts are generated and uploaded to the master servers prior to installing DC/OS.
