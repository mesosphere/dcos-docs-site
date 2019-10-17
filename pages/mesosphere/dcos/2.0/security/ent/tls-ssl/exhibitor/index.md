---
layout: layout.pug
navigationTitle:  Securing Exhibitor with mutual TLS
title: Securing Exhibitor with mutual TLS
menuWeight: 500
excerpt: Securing DC/OS with a TLS enabled Exhibitor ensemble
enterprise: true
---

# Verifying that Exhibitor is secured 

Starting with DC/OS 2.0, Exhibitor is secured by default in most circumstances. To verify that Exhibitor is secured on your cluster, run the following command on one of your master nodes: 


    curl -LI \
        --cacert /var/lib/dcos/exhibitor-tls-artifacts/root-cert.pem \
        --cert /var/lib/dcos/exhibitor-tls-artifacts/client-cert.pem \
        --key /var/lib/dcos/exhibitor-tls-artifacts/client-key.pem \
        https://localhost:8181/exhibitor/v1/ui/index.html

If you see the following, Exhibitor has been secured on your cluster:

    HTTP/1.1 200 OK
    Content-Type: text/html
    Content-Length: 0
    Server: Jetty(1.5.6-SNAPSHOT)

# Securing Exhibitor

Previously, the Exhibitor HTTP service was open to any client that can reach port 8181 on a master node. This page describes a method for protecting the Exhibitor service from unauthorized access. Once enabled, HTTP clients must access Exhibitor through Admin Router; thus applying the Admin Router access control policy to the Exhibitor service.
The strategy for securing Exhibitor is mutual TLS authentication. In order to secure Exhibitor you must first create a unique root CA certificate. This CA certificate is used to sign various end entity certificates for the Admin Router and Exhibitor services. Creating a public key infrastructure that outputs PEM and Java KeyStore formatted artifacts is not a trivial task. To make this processes easier, a simple tool has been created for producing the necessary files.

This guide is only compatible with clusters which use **static** master discovery, `master_http_loadbalancer` is not currently supported. Please see the configuration reference for [master discovery](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#master-discovery-required).

<p class="message--note"><strong>NOTE: </strong>When accessing Exhibitor through Admin Router <code>https://master_host/exhibitor</code>, authenticated users must have the <code>dcos:adminrouter:ops:exhibitor</code> privilege with the <i>full</i> action identifier</p>

## Using the tool

Prerequisite: A working Docker installation is required. If Docker is not available see the [exhibitor readme](https://github.com/mesosphere/exhibitor-tls-artifacts-gen/blob/master/README.md) for information on running the command natively.

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
    /mesosphere/dcos/2.0/security/ent/tls-ssl/exhibitor/

    Options:
    -d, --output-directory TEXT  Directory to put artifacts in. This
                                 output_directory must not exist.
    --help                       Show this message and exit.



## Generating the artifacts
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