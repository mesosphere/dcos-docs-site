---
layout: layout.pug
navigationTitle:  Securing Exhibitor with mutual TLS
title: Securing Exhibitor with mutual TLS
menuWeight: 500
excerpt: Securing DC/OS with a TLS enabled Exhibitor ensemble
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

By default, the Exhibitor HTTP service is open to any client that can reach port 8181 on a master node. This page describes a method for protecting the Exhibitor service from unauthorized access. Once enabled, HTTP clients must access Exhibitor through Admin Router; thus applying the Admin Router access control policy to the Exhibitor service.

<p class="message--note"><strong>NOTE: </strong>When accessing Exhibitor through Admin Router (https://master_host/exhibitor), authenticated users must have the <i>dcos:adminrouter:ops:exhibitor</i> privilege with the <i>full</i> action identifier</p>

# Securing Exhibitor

The strategy for securing Exhibitor is mutual TLS authentication. In order to secure Exhibitor you must first create a unique root CA certificate. This CA certificate is used to sign various end entity certificates for the Admin Router and Exhibitor services. Creating a public key infrastructure that outputs PEM and Java KeyStore formatted artifacts is not a trivial task. To make this processes easier, a simple tool has been created for producing the necessary files.

<p class="message--note"><strong>NOTE: </strong>This guide is only compatible with clusters which use <i>static</i> master discovery, <i>master_http_loadbalancer</i> is not currently supported. (https://docs.mesosphere.com/1.14/installing/production/advanced-configuration/configuration-reference/#master-discovery-required)</p>

## Using the tool

<p class="message--note"><strong>NOTE: </strong>A working Docker installation is required. If Docker is not available see https://github.com/mesosphere/exhibitor-tls-artifacts-gen/blob/master/README.md for information on running the command natively.</p>

Download the script from the <a href=https://github.com/mesosphere/exhibitor-tls-artifacts-gen/releases>GitHub release page</a> and run it:

```sh
curl -LsO https://github.com/mesosphere/exhibitor-tls-artifacts-gen/releases/download/v0.4.0/exhibitor-tls-artifacts
chmod +x exhibitor-tls-artifacts
./exhibitor-tls-artifacts --help
```

The expected output is shown below:

    Usage: exhibitor-tls-artifacts [OPTIONS] [NODES]...

    Generates Admin Router and Exhibitor TLS artifacts. NODES should consist
    of a space separated list of master IP addresses. See
    https://docs.mesosphere.com/1.14/security/ent/tls-ssl/exhibitor/

    Options:
    -d, --output-directory TEXT  Directory to put artifacts in. This
                                 output_directory must not exist.
    --help                       Show this message and exit.



### Generating the artifacts
To generate the TLS artifacts, run the tool with the master node IP addresses as positional arguments. Use the IP addresses found in the `master_list` field of the DC/OS configuration file, config.yml. If this file is not available, running `/opt/mesosphere/bin/detect_ip` on each master node will produce the correct address.

As an example, if your master nodes are `10.192.0.2, 10.192.0.3, 10.192.0.4`, invoke the script using:

```sh
./exhibitor-tls-artifacts 10.192.0.2 10.192.0.3 10.192.0.4
```

The above command will create a directory called `artifacts` (which must not exist prior to running the command) in the current directory. Under `artifacts` you will find root-cert.pem and truststore.jks. These files contain the root CA certificate in PEM and java keystore format. The `artifacts` directory will also contain 3 sub-directories, `10.192.0.2`, `10.192.0.3`, and `10.192.0.4`. Each containing the following files:

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
scp -r artifacts/10.192.0.2 root@10.192.0.2:/var/lib/dcos/exhibitor-tls-artifacts
scp -r artifacts/10.192.0.3 root@10.192.0.3:/var/lib/dcos/exhibitor-tls-artifacts
scp -r artifacts/10.192.0.4 root@10.192.0.4:/var/lib/dcos/exhibitor-tls-artifacts
```

## Restarting the services

Exhibitor and Master Admin Router must be restarted on all nodes. After all files have been copied, run the following commands on **all** master nodes.

<p class="message--warning"><strong>WARNING: </strong>This will result in a small amount of downtime for Zookeeper and Master Admin Router.</p>

```sh
systemctl restart dcos-exhibitor.service
systemctl restart dcos-adminrouter.service
```

The `systemd` unit scripts will detect the presence of the artifacts and set ownership and permissions accordingly.

## Deploying a new cluster

Generate the artifacts and copy the files to the master servers before installing DC/OS.
