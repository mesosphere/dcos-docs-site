---
layout: layout.pug
navigationTitle:  Configuring a Custom External Certificate
title: Configuring a Custom External Certificate
menuWeight: 50
excerpt: Configuring DC/OS Enterprise to use a custom external certificate
beta: false
enterprise: true
render: mustache
model: /mesosphere/dcos/2.1/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


External access to a DC/OS Enterprise cluster goes through Admin Router. By default, the certificate presented by Admin Router is signed by the DC/OS Certificate Authority. The default DC/OS CA certificate is not trusted by default, and requires clients to manually configure trust in the CA (e.g. by accepting a pop-up browser dialog). A trusted CA certificate can be provided using [custom CA certificates](/mesosphere/dcos/2.1/security/ent/tls-ssl/ca-custom/). However, obtaining a suitable CA certificate can be difficult. Custom external certificates allow the cluster administrator to provide an easily obtained non-CA certificate and key that Admin Router will present to external connections.

The benefits of using a custom external certificate for your DC/OS Enterprise cluster include:

- only needing to obtain a standard certificate instead of an intermediate CA signing certificate, in order to make connections to the cluster trusted by the clients by default (i.e. browser-trusted certificates);
- using a certificate with different properties for clients connecting to the cluster using different server names.

# Contents
- [Support](#support)
- [Glossary](#glossary) for general definition of terms
- [Requirements](#requirements)
- [Configuration parameter reference](#config-ref)
- [Installation](#installing-dcos-enterprise-with-a-custom-external-certificate)

# Support
- Custom external certificates are supported in DC/OS Enterprise 2.1 and later.
- Custom external certificates can be added during initial installation or during an upgrade.
- Custom external certificates support both RSA and ECC keys.

# Glossary
- **Custom external certificate:** A certificate in PEM format, that will be used to access the cluster through Admin Router for a provided set of server names. If necessary, it should include all the intermediate CA certificates up to the root CA certificate trusted by the clients. The root CA certificate does not need to be included in the PEM file.

- **Server names:** A set of names that Admin Router will match to the custom external certificate's Canonical Name and Subject Alternative Names.

- **Custom private key:** A private key in the PKCS#8 format associated with the custom external certificate.

- **Installation directory:** The directory on the bootstrap node where the DC/OS installer resides. It is denoted with `$DCOS_INSTALL_DIR` in this document.

- **Configuration:** The set of the configuration parameters that governs the specific aspects of the installation procedure. The configuration is stored in the DC/OS configuration file.

- **DC/OS configuration file:** The file which contains the DC/OS configuration parameters. The DC/OS configuration file is normally called `config.yaml` and must be present in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node during the installation. It is used by the DC/OS installer.


# Requirements

In order to install DC/OS Enterprise with a custom external certificate you will need:

- A file containing the custom external certificate.
- A file containing the custom private key.

## Specifying locations

The filesystem paths to the custom external certificate and custom private key in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node must be specified in the DC/OS configuration file using, respectively, the `external_certificate_path` and `external_certificate_key_path` parameters. The paths must be relative to `$DCOS_INSTALL_DIR`.

# <a name="config-ref"></a>Configuration parameter reference
## external_certificate_path
Path to a file (relative to `$DCOS_INSTALL_DIR`) containing a single X.509 leaf certificate in the OpenSSL PEM format. For example: `genconf/external-certificate.crt`. If necessary, it should include all the intermediate CA certificates up to the root CA certificate trusted by the clients. It is advised to not to include the final root CA certificate in the PEM file, but is not strictly necessary.

If provided, this is the custom external certificate.  If not provided, the DC/OS cluster uses a unique leaf certificate generated during the initial bootstrap phase signed by DC/OS CA and presents it to the clients.

See the `external_certificate_validation_disable` parameter on the validation that the external certificate undergoes and how it can be overridden.

## external_certificate_key_path
Path to a file (relative to `$DCOS_INSTALL_DIR`) containing the private key corresponding to the custom external certificate, encoded in the OpenSSL (PKCS#8) PEM format. For example: `genconf/external-certificate-key.key`.

This is highly sensitive data. The configuration processor accesses this file only for configuration validation purposes, and does not copy the data. After successful configuration validation this file needs to be placed out-of-band into the file system of all DC/OS master nodes to the path `/var/lib/dcos/pki/tls/private/adminrouter-external.key` before most DC/OS `systemd` units start up. The file must be readable by the root user, and should have 0600 permissions set.

This path is required if `external_certificate_path` is specified.

## external_certificate_servernames

The list of server names that clients can use while accessing the cluster in
order to make Admin Router present the custom external certificate to the
client. The server names can include:
  - a plain hostname, e.g. `host.example.com`.
  - an IP address, e.g. `192.0.2.5`.
  - a `*` wildcard, e.g. `*.example.com`, will match all the subdomains of
    `example.com` (e.g. `foo.example.com`, `bar.example.com`), but not the domain
    itself - `example.com` or deeper subdomains: `foo.bar.example.com`.
  - a `.` wildcard, e.g. `.example.com`, will match the same as `*` wildcard plus the domain
    itself (e.g. `foo.example.com`, `bar.example.com`, `example.com`).

  The server names cannot include:
  - `master.mesos`
  - `leader.mesos`
  - `registry.component.thisdcos.directory`
  - any IP address returned by the `/opt/mesosphere/bin/detect_ip` script (created from the `ip_detect_contents` or `ip_detect_filename` configuration parameter).

Every server name provided in this option must be present in the custom external
certificate's Canonical Name or Subject Alternative Names.

This option is required if `external_certificate_path` is specified.

## external_certificate_validation_disable
The custom external certificate undergoes validation before being taken into
consideration. Namely:

  - the restrictions for server names mentioned for
      `external_certificate_servernames` parameter
  - certificate key must be of type RSA or ECC
  - minimum size of an RSA key is 2048
  - minimum size of the ECC key is 256
  - the ECC's key curve must be one of SECP256R1 or SECP384R1,
  - key usage extension must be defined
  - the validity period of the certificate must not start in the future
  - the validity period of the certificate must not end sooner than in 365
      days
  - the basic constraints are not required, but if they are defined, they
      should not have the CA flag set
  - key usage extension must have the digital signature and key encipherment
      extensions set
  - extended key usage extension must be present and tls server
      authentication flag must be set

Additionally, if the certificate chain is present in the external
certificate's PEM, the chain itself must:

  - start with the leaf certificate and be followed by intermediate CA's, each one
  signing its predecessor and being signed by its successor
  - each intermediate CA cert must be a valid CA cert (expiration, etc...)

If these restrictions are too strict, they can be overridden by
setting the `external_certificate_validation_disable` parameter to `true`.

# Installing DC/OS Enterprise with a custom external certificate

## Prerequisites

- The installation of DC/OS Enterprise via the Installer has been prepared according to the corresponding [documentation](/mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/), up to the section [**Install DC/OS**](/mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/#install-dcos) of that documentation.

- The configuration parameters `external_certificate_path`, `external_certificate_key_path` and `external_certificate_servernames` are specified in the DC/OS configuration file `$DCOS_INSTALL_DIR/genconf/config.yaml` and point to the relevant locations in the file system. Example of commands issued on the bootstrap node:

```bash
cd $DCOS_INSTALL_DIR
cat genconf/config.yaml
```
```
[...]
external_certificate_path: genconf/external-certificate.crt
external_certificate_key_path: genconf/external-certificate-key.key
external_certificate_servernames:
  - foo.example.com
  - bar.example.com
  - .example.org
  - *.example.net
[...]
```

## Copy custom external certificate and private key to the bootstrap node

The custom external certificate and the custom private key must be put in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node:

```bash
cd $DCOS_INSTALL_DIR
ls genconf/
```
```
external-certificate.crt
external-certificate-key.key
```

## Manually copy the custom private key to all master nodes

For security reasons, the installer will not copy the private key from the bootstrap node to the master nodes.
The custom private key must be distributed securely to every DC/OS master node **before starting the installation**.

The filesystem path for the custom private key file must be `/var/lib/dcos/pki/tls/private/adminrouter-external.key`. The file containing the private key `adminrouter-external.key` corresponding to the custom external certificate must be owned by the root Unix user and have 0600 permissions set.  It is also recommended to ensure that the directory `/var/lib/dcos/pki/tls/private` is owned by root and has 0700 permissions.

If you copy the private key file over the network onto the master nodes, the network channel must be adequately protected.

For example, this could be achieved by running the following commands as `root` on each master node (`W.X.Y.Z` indicates the IP address of the bootstrap node):

```bash
mkdir -p /var/lib/dcos/pki/tls/private/
chown root /var/lib/dcos/pki/tls/private/
chmod 700 /var/lib/dcos/pki/tls/private/
scp centos@W.X.Y.Z:$DCOS_INSTALL_DIR/genconf/external-certificate-key.key /var/lib/dcos/pki/tls/private/
chown root /var/lib/dcos/pki/tls/private/adminrouter-external.key
chmod 600 /var/lib/dcos/pki/tls/private/adminrouter-external.key
```

## Installation
Proceed with the installation as described in the [documentation of the Installer](/mesosphere/dcos/2.1/installing/production/deploying-dcos/installation/#install-dcos). Note that the current working directory when executing `dcos_generate_config.ee.sh` must be the `$DCOS_INSTALL_DIR` directory.

If you are changing from a DC/OS CA issued certificate to a custom external certificate or vice versa, note that your clients may need to trust both CA's during the upgrade.

## Verify installation
To verify that the DC/OS Enterprise cluster was installed correctly with the custom external certificate, initiate a TLS connection to Admin Router which will present the custom external certificate for the configured server names. In order to do this, specify a server name in the request that will match one of the entries in `external_certificate_servernames`.

Provided that you have the CA root certificate for the signed external certificate, the following command can be executed:

```bash
openssl s_client -connect <public_ip_master_node_X>:443 -showcerts -servername <one of configured server names> -verifyCAfile <path to the CA file that signed external certificate/external certificate intermediate chain>  | grep -e "s:" -e "i:" -e "return code:" | grep -e "s:" -e "i:" -e "return code:"
```

The output should look like the following:

```
depth=4 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Root CA
verify return:1
depth=3 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 0
verify return:1
depth=2 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 1
verify return:1
depth=1 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 2
verify return:1
depth=0 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Leaf Certificate
verify return:1
 0 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Leaf Certificate
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 2
 1 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 2
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 1
 2 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 1
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 0
 3 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Intermediate CA 0
   i:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = Root CA
    Verify return code: 0 (ok)
```
