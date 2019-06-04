---
layout: layout.pug
navigationTitle:  Securing Exhibitor with mutual TLS
title: Securing Exhibitor with mutual TLS
menuWeight: 500
excerpt: Deploying or upgrading DC/OS with a TLS enabled Exhibitor ensemble
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

The exhibitor service can be configured to require mutual authentication over TLS. When this configuration is active, all clients connecting to an exhibitor service must present a signed, verifiable certificate. In order to enforce the existing DC/OS security model, it is recommended that the existing cluster PKI is not used to secure Exhibitor. 

# Generating the PKI
## Using the tool

Exhibitor is a Java application and requires that certificates and keys be stored in JKS (Java KeyStore) format. PEM files are also required for the AdminRouter service. Fortunately, a script is available to simplify the creation of these files.

### Docker
A docker image containing the tool is available at https://hub.docker.com/r/mesosphere/exhibitor-tls-artifacts-gen/. Depending on your environment, this image is probably the simplest way to generate the artifacts needed for exhibitor TLS support. The tool takes master node ip addresses as positional arguments. For example, if your master nodes internal ip addresses are `10.192.0.2, 10.192.0.3, 10.192.0.4` you can invoke the command:

```
curl https://github.com/mesosphere/exhibitor-tls-artifacts-gen/releases/download/0.0.3/exhibitor-tls-artifacts -LsSf | sh -s -- 10.192.0.2 10.192.0.3 10.192.0.4
```

This will generate the following artifacts in your CWD:

```
artifacts/
├── node_10_192_0_2
│   ├── client-cert.pem
│   ├── client-key.pem
│   ├── clientstore.jks
│   ├── root-cert.pem
│   ├── serverstore.jks
│   └── truststore.jks
├── node_10_192_0_3
│   ├── client-cert.pem
│   ├── client-key.pem
│   ├── clientstore.jks
│   ├── root-cert.pem
│   ├── serverstore.jks
│   └── truststore.jks
├── node_10_192_0_4
│   ├── client-cert.pem
│   ├── client-key.pem
│   ├── clientstore.jks
│   ├── root-cert.pem
│   ├── serverstore.jks
│   └── truststore.jks
├── root-cert.pem
└── truststore.jks

3 directories, 20 files
```

For each master node, the artifacts at node_* should be copied to each master at `/var/lib/dcos/exhibitor-tls-artifacts`. The presence of these files on a master node activates the configuration. No other configuration is required.

### Native

Instructions for running the tool natively can be found here:

https://github.com/mesosphere/exhibitor-tls-artifacts-gen/blob/master/README.md


# Deploying
Before installing DC/OS Enterprise, the following files must exist under `/var/lib/dcos/exhibitor-tls-artifacts` on each master:

```
client-cert.pem
client-key.pem
clientstore.jks
root-cert.pem
serverstore.jks
truststore.jks
```

The client* artifacts should be unique to each master and the PKI should be unique to each cluster. Once these files are in place, the normal installation process can commence. 

# Upgrading

Converting a cluster from insecure Exhibitor to secure Exhibitor requires downtime. It is not possible to perform a rolling restart of exhibitor once TLS is enabled because the clients must also be configured to use TLS simultaneously. To perform the upgrade, create and copy the artifacts to `/var/lib/dcos/exhibitor-tls-artifacts` on each master node. Once the files are in place, restart the exhibitor and adminrouter systemd units:

```
systemctl restart exhibitor.service adminrouter.service
```

Once this operation is performed on all master nodes, the cluster should return to a healthy state.
