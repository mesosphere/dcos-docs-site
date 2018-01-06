---
layout: layout.pug
navigationTitle:  Using a Custom CA Certificate
title: Using a Custom CA Certificate
menuWeight: 50
excerpt:

enterprise: true
---

# Motivation
Each DC/OS Enterprise cluster has its own DC/OS certificate authority (CA). By default, that CA uses a globally unique root CA certificate generated during the installation of DC/OS. That root CA certificate is used for signing certificates for the components of DC/OS, such as Admin Router. In lieu of using the auto-generated root CA certificate, you can configure DC/OS Enterprise to use a custom CA certificate, which is *either* a root CA certificate *or* an intermediate CA certificate. (see examples [below](#example-use-cases))

The benefits of using a custom CA certificate for your DC/OS Enterprise cluster include:

- Ensuring that all X.509 certificates used within the DC/OS cluster (for both signing and encrypting) derive from your organization's X.509 certification hierarchy.
- Controlling security properties of the key pair (such as type and strength) used for signing DC/OS component certificates.
- Ensuring that all DC/OS components (including Admin Router) present browser-trusted certificates.

# The structure of this document page
To facilitate the reading of this page we start out by providing a glossary for general definition of terms, followed by an in-depth configuration parameter reference. An installation walkthrough is provided in section [Installing DC/OS Enterprise with a custom CA certificate](#installing-dcos-enterprise-with-a-custom-ca-certificate). Section [Example use cases](#example-use-cases) then provides example file contents for the custom CA certificate configuration files for three popular use cases.

# What is supported and what is not
- Only custom CA certificates that have an associated RSA-type key pair are supported. Other types of certificates, such as those using ECC-type key pair, are currently not supported. Support for ECC-type key pairs will be added in the future.
- You have to use a custom CA certificate only with a fresh installation of DC/OS Enterprise 1.10 or higher. Older versions of DC/OS are not supported.

# Glossary of the terms used in this documentation
- Custom CA certificate

Your custom CA certificate in the PEM format, which will be used to issue certificates for DC/OS components such as Admin Router. The custom CA certificate is either an intermediate CA certificate (issued by another CA) or a root CA certificate (self-signed by the custom CA).

- Private key associated with the custom CA certificate

The private key in the PKCS#8 format associated with the custom CA certificate.

- Certificate chain associated with the custom CA certificate

The complete CA certification chain required for end-entity certificate verification. It has to include the certificates of all parent CAs of the intermediate custom CA up to and including the self-signed root CA certificate. Empty, if the custom CA certificate is a self-signed root CA certificate.

- Configuration

The set of the configuration parameters that governs the specific aspects of the installation procedure. The configuration is stored in the configuration file.

- DC/OS Configuration file

The file which contains the DC/OS configuration parameters, in particular, the filesystem paths to the custom CA certificate, associated private key and the certificate chain. 

The configuration file is normally called `config.yaml` and has to be present in the `genconf/` directory on the bootstrap node during the installation. It is used by the DC/OS installer to create a custom DC/OS build.

- Installation directory

The directory on the bootstrap node where the DC/OS installer resides. It contains the `genconf/` subdirectory where the configuration file, the custom CA certificate, the associated private key and the certificate chains are put. It is denoted with `$DCOS_INSTALL_DIR` in this document. This is the current working directory when executing `dcos_generate_config.ee.sh`.

# Requirements

- Advanced installation method
In order to install DC/OS Enterprise with a custom CA certificate you have to use the [advanced DC/OS installation method](/1.10/installing/custom/advanced/). Other installation methods are not supported.

- Custom CA certificate
- Private key associated with the custom CA certificate
- Certificate chain associated with the custom CA certificate

The files containing the custom CA certificate, the associated private key and the certificate chain has to be placed in the predefined locations where the installer can find them during the installation. (see the next sections for details)


## Manually placing the the custom CA certificate, the associated private key and the certificate chain onto the bootstrap node
The custom CA certificate, the associated private key and the certificate chain files have to be put in the `genconf/` directory on the bootstrap node. The paths to these files have to be specified in the configuration file.

## Manually placing the private key associated with the custom CA certificate onto the master nodes

For security reasons, the installer will not copy the private key from the bootstrap node to the master nodes. 
The private key associated with the custom CA certificate has to be distributed manually to every DC/OS master node **before starting the installation**. The filesystem path for the private key file has to be `/var/lib/dcos/pki/tls/CA/private/custom_ca.key`. The directory `/var/lib/dcos/pki/tls/CA/private` should be created manually with the following  command before putting the file `custom_ca.key` in the directory on every DC/OS master node:

```bash
 mkdir -p /var/lib/dcos/pki/tls/CA/private
```

Furthermore, the file has to be owned by the root Unix user and to have 0600 permissions set.

If you copy private key file over the network onto the master nodes, the network channel has to be adequately protected.

An example of copying the CA private key is given below. The commands are executed on the bootstrap node. The `W.X.Y.Z` denotes the IP address of a master node below.

```bash
cd $DCOS_INSTALL_DIR/config
scp custom_ca.key centos@W.X.Y.Z:/var/lib/dcos/pki/tls/CA/private
```

## Specifying the locations of the custom CA certificate, the associated private key and the certificate chain files in the configuration file

The filesystem paths to the custom CA certificate, associated private key and certificate chain files have to be specified in the configuration file using, respectively, the `ca_certificate_path`, `ca_certificate_key_path` and  `ca_certificate_chain_path` parameters.

[This section](#example-use-cases) shows how to set these configuration parameters.

# Configuration parameter reference
## ca\_certificate\_path
Path to a file within the `genconf/` directory containing a single X.509 CA certificate in the OpenSSL PEM format. For example: `genconf/CA_cert`. It is either a *root CA certificate* (“self-signed”) or an *intermediate CA certificate* (“cross-certificate”) signed by some other certificate authority.

If provided, this is the custom CA certificate. It is used as the signing CA certificate, i.e., the DC/OS CA will use this certificate for signing end-entity certificates (the subject of this certificate will be the issuer for certificates signed by the DC/OS CA). If not provided, the DC/OS cluster generates a unique root CA certificate during the initial bootstrap phase and uses that as the signing CA certificate.

The public key associated with the custom CA certificate has to be of type RSA.

## ca\_certificate\_key\_path
Path to a file within the `genconf/` directory containing the private key corresponding to the custom CA certificate, encoded in the OpenSSL (PKCS#8) PEM format. For example: `genconf/CA_cert.key`.

**Note**: this is highly sensitive data. The configuration processor accesses this file only for configuration validation purposes, and does not copy the data. After successful configuration validation this file needs to be placed out-of-band into the file system of all DC/OS master nodes to the path /var/lib/dcos/pki/tls/CA/private/custom_ca.key before most DC/OS systemd units start up. The file has to be readable by the root user, and should have have 0600 permissions set.

Required if `ca_certificate_path` is specified.

## ca\_certificate\_chain\_path
Path to a file within the `genconf/` directory containing the complete CA certification chain required for end-entity certificate verification, in the OpenSSL PEM format. For example: genconf/CA_cert_chain.pem.
Has to be left undefined if `ca_certificate_path` points to a root CA certificate.
Required if ca_certificate_path is specified and if the custom CA certificate is an *intermediate CA certificate*. 

This needs to contain all CA certificates comprising the complete sequence starting precisely with the CA certificate that was used to sign the custom CA certificate and ending with a root CA certificate (where issuer and subject are equivalent), yielding a gapless certification path. The order is significant and the list has to contain at least one certificate.


# Installing DC/OS Enterprise with a custom CA certificate
## Starting point
Based on the requirements described above, this is the starting point for the installation:

- The installation of DC/OS Enterprise via the Advanced Installer has been prepared according to the corresponding [documentation](/1.10/installing/ent/custom/advanced/).

- On the bootstrap node, the files carrying custom CA certificate, the associated private key and, optionally, the CA certificate chain have been placed into the `$DCOS_INSTALL_DIR/genconf/` directory (see the [section](#glossary-of-the-terms-used-in-this-documentation) above for more detailed description), Example (commands executed on the bootstrap node):

```bash
cd $DCOS_INSTALL_DIR
ls genconf/
```
```bash 
dcos-ca-certificate.crt
dcos-ca-certificate-key.key
dcos-ca-certificate-chain.crt
```

- The custom CA private key has been securely placed on all DC/OS master nodes and is sufficiently protected (refer to [this section](#manually-placing-the-private-key-associated-with-the-custom-ca-certificate-onto-the-master-nodes) for more details). Example (command issued on one of the DC/OS master nodes):

```bash
stat /var/lib/dcos/pki/tls/CA/private/dcos-ca-certificate-key.key
```
```bash
File: ‘/var/lib/dcos/pki/tls/CA/private/dcos-ca-certificate-key.key’
Size: 9             Blocks: 8          IO Block: 4096   regular file
Device: ca01h/51713d    Inode: 100671105   Links: 1
Access: (0600/-rw-------)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:var_lib_t:s0
Access: 2017-12-27 12:35:58.643278377 +0000
Modify: 2017-12-27 12:35:58.643278377 +0000
Change: 2017-12-27 12:36:13.019162417 +0000
Birth: -
```

- The configuration parameters `ca_certificate_path`, `ca_certificate_key_path` and `ca_certificate_chain_path` are specified in the DC/OS configuration file `$DCOS_INSTALL_DIR/genconf/config.yaml` and point to the relevant locations in the file system. Example (commands issued on the bootstrap node):

```bash
cd $DCOS_INSTALL_DIR
cat genconf/config.yaml
```
```bash
[...]
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
[...]
```
Note that `ca_certificate_chain_path` is an optional parameter when setting up DC/OS Enterprise with a custom CA certificate when the latter is a self-signed root certificate.

## Installation
Proceed with the installation as described in the [documentation of the Advanced Installer](/1.10/installing/ent/custom/advanced/#install-dcos).

## Verify installation
Issue the following command on the bootstrap node to check that the Admin Router on a master mode uses a certificate signed with the custom CA certificate:

```bash
openssl s_client -verify_ip <private_ip_master_nodeX> -CAfile genconf/dcos-ca-certificate-chain.crt -connect <public_ip_master_nodeX>:443 | grep -e “s:” -e “i:” -e “return code:”
```

The output should look similar to the following:

```bash
depth=3 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Brogrammer Unit, CN = Integration Test Root CA
verify return:1
depth=2 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Brogrammer Unit, CN = Integration Test Intermediate CA 01
verify return:1
depth=1 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Brogrammer Unit, CN = Integration Test Intermediate CA 02
verify return:1
depth=0 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = AdminRouter on 172.31.12.45
verify return:1
 0 s:/C=US/ST=CA/L=San Francisco/O=Mesosphere, Inc./CN=AdminRouter on 172.31.12.45
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 02
 1 s:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 02
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 01
 2 s:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 01
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
    Verify return code: 0 (ok)
```

# Example use cases
This section describes how the three configuration parameters `ca_certificate_path`, `ca_certificate_key_path` and `ca_certificate_chain_path` have to be specified in the `$DCOS_INSTALL_DIR/genconf/config.yaml` configuration file the most common use cases of a custom CA certificate hierarchy.

## Use case 1: The custom CA certificate is a root CA certificate
In this case the custom CA certificate is a (self-signed) root CA certificate. The CA does not have a “parent” CA, hence the CA certificate chain is empty.

The following files are present:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` file containing the custom CA certificate
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` file containing the private key associated with the custom CA certificate

- on the master nodes:
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the private key associated with the custom CA certificate. The file is owned by the root Unix user and has 0600 permissions set

Here is an example of the `issuer` and `subject` fields of a custom root CA certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
```

Since the custom CA certificate is a root CA certificate and the corresponding CA certificate chain is empty, we have to omit the ca_certificate_chain_path parameter in the configuration file. The corresponding configuration parameters have to be specified as follows in the `$DCOS_INSTALL_DIR/genconf/config.yaml` file on the bootstrap node:

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
```

## Use case 2: The custom CA certificate is an intermediate CA certificate, directly issued by a root CA

In this case the custom CA certificate is an intermediate one, issued directly by a root CA. The CA certificate chain consists of just that root CA certificate.

The following files are present:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` file containing the custom CA certificate in PEM format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-chain.crt` file containing the certificate chain in PEM format

- on the master nodes
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format. The file is owned by the root Unix user and has 0600 permissions set

Here is an example of an appropriate intermediate custom CA certificate: 

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 01
```
 
Here is an example of a corresponding CA certificate chain:  

```bash 
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-certificate-chain.crt dcos-ca-certificate-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }'
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
```

The corresponding configuration parameters have to be then specified similar to the following in the `$DCOS_INSTALL_DIR/genconf/config.yaml` configuration file on the bootstrap node:

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
```

## Use case 3: The custom CA certificate is an intermediate CA certificate issued by another intermediate CA

In this case the custom CA certificate is an intermediate one, issued directly by another intermediate CA that, in turn, has its certificate issued by a root CA. 

The CA certificate chain is comprised of the **1)** CA certificate of the issuing intermediate CA and **2)** the root CA, in the given order.

The following files are present:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` file containing the custom CA certificate in PEM format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-chain.crt` file containing the certificate chain in PEM format

- on the master nodes
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format. The file is owned by the root Unix user and has 0600 permissions set
 
Here is an example of an appropriate custom intermediate CA certificate: 

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 01
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 02
```

Here is an example of a corresponding CA certificate chain: 

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-certificate-chain.crt dcos-ca-certificate-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }'
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Intermediate CA 01

issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Brogrammer Unit/CN=Integration Test Root CA


```

The corresponding configuration parameters have to be then specified as follows in the `$DCOS_INSTALL_DIR/genconf/config.yaml` configuration file on the bootstrap node:

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
```