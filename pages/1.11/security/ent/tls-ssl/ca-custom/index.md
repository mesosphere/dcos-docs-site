---
layout: layout.pug
navigationTitle:  Configuring a Custom CA Certificate
title: Configuring a Custom CA Certificate
menuWeight: 50
excerpt: Configuring DC/OS Enterprise to use a custom CA certificate

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Each DC/OS Enterprise cluster has its own DC/OS certificate authority (CA). By default, that CA uses a globally unique root CA certificate generated during the installation of DC/OS. That root CA certificate is used for signing certificates for the components of DC/OS, such as Admin Router. Instead of using the auto-generated root CA certificate, you can configure DC/OS Enterprise to use a custom CA certificate, which is either a root CA certificate or an intermediate CA certificate. (See examples [below](#example-use-cases))

The benefits of using a custom CA certificate for your DC/OS Enterprise cluster include:

- Ensuring that all X.509 certificates used within the DC/OS cluster, for both signing and encrypting, derive from your organization's X.509 certification hierarchy.
- Controlling security properties of the key pair, such as type and strength, used for signing DC/OS component certificates.
- Ensuring that all DC/OS components, including Admin Router, present browser-trusted certificates.

# Contents
- [Supported certificates](#supported-ca-certificates)
- [Glossary](#glossary) for general definition of terms 
- [Requirements](#requirements)
- [Configuration parameter reference](#config-ref)
- [Installation walkthrough](#installing-dcos-enterprise-with-a-custom-ca-certificate). 
- [Example use cases](#example-use-cases) then provide example file contents for the custom CA certificate configuration files for three popular use cases.

# Supported CA certificates
- Only custom CA certificates that have an associated RSA-type key pair are supported. Other types of certificates, such as those using ECC-type key pair, are currently not supported. 
- Custom CA certificates are only supported for a fresh installation of DC/OS Enterprise 1.10 or later. Older versions of DC/OS are not supported, and it is not possible to add a custom CA certificate during an upgrade.

# Glossary 
- **Custom CA certificate:** Your custom CA certificate in the PEM format, which will be used to issue certificates for DC/OS components such as Admin Router. The custom CA certificate is either an intermediate CA certificate (issued by another CA) or a root CA certificate (self-signed by the custom CA).

- **Private key associated with the custom CA certificate:** The private key in the PKCS#8 format associated with the custom CA certificate.

- **Certificate chain associated with the custom CA certificate:** The complete CA certification chain required for end-entity certificate verification. It must include the certificates of all parent CAs of the intermediate custom CA up to and including the root CA certificate. If the custom CA certificate is a root CA certificate, the chain must be empty.

- **Installation directory:** The directory on the bootstrap node where the DC/OS installer resides. It is denoted with `$DCOS_INSTALL_DIR` in this document.

- **Configuration:** The set of the configuration parameters that governs the specific aspects of the installation procedure. The configuration is stored in the DC/OS configuration file.

- **DC/OS configuration file:** The file which contains the DC/OS configuration parameters. The DC/OS configuration file is normally called `config.yaml` and must be present in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node during the installation. It is used by the DC/OS installer.


# Requirements

In order to install DC/OS Enterprise with a custom CA certificate you will need:

- to use the [advanced DC/OS installation method](/1.11/installing/production/deploying-dcos/installation/). Other installation methods are not supported.
- A file containing the custom CA certificate.
- A file containing the private key associated with the custom CA certificate.
- If the CA is **not** a self-signed root CA, a file containing the certificate chain associated with the custom CA certificate.

## <a name="manually-placing-custom"></a>Manually placing custom CA certificate


The custom CA certificate, the associated private key and the certificate chain files must be put in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node:

```bash
cd $DCOS_INSTALL_DIR
ls genconf/
```
```bash
dcos-ca-certificate.crt
dcos-ca-certificate-key.key
dcos-ca-certificate-chain.crt
```

## <a name="manually-placing-master"></a>Manually placing the private key 


For security reasons, the installer will not copy the private key from the bootstrap node to the master nodes.
The private key associated with the custom CA certificate must be distributed manually to every DC/OS master node **before starting the installation**.

The filesystem path for the private key file must be `/var/lib/dcos/pki/tls/CA/private/custom_ca.key`.
The directory `/var/lib/dcos/pki/tls/CA/private/` can be created manually with the following command before putting the file `custom_ca.key` in the directory on every DC/OS master node:

```bash
 mkdir -p /var/lib/dcos/pki/tls/CA/private
```

Furthermore, the file containing the private key `custom_ca.key` corresponding to the custom CA certificate must be owned by the root Unix user and have 0600 permissions set.

If you copy the private key file over the network onto the master nodes, the network channel must be adequately protected. An example of copying the CA private key is given below. The commands are executed on the bootstrap node. The `W.X.Y.Z` below indicates the IP address of a master node:

```bash
cd $DCOS_INSTALL_DIR/genconf
scp dcos-ca-certificate-key.key centos@W.X.Y.Z:/var/lib/dcos/pki/tls/CA/private/custom_ca.key
```

## Specifying locations

The filesystem paths to the custom CA certificate, associated private key and certificate chain files in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node must be specified in the DC/OS configuration file using, respectively, the `ca_certificate_path`, `ca_certificate_key_path` and  `ca_certificate_chain_path` parameters. The paths must be relative to `$DCOS_INSTALL_DIR`.

The [Example use cases](#example-use-cases) section below shows how to set these configuration parameters.

# <a name="config-ref"></a>Configuration parameter reference
## ca\_certificate\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing a single X.509 CA certificate in the OpenSSL PEM format. For example: `genconf/dcos-ca-certificate.crt`. It is either a **root CA certificate** (“self-signed”) or an **intermediate CA certificate** (“cross-certificate”) signed by some other certificate authority.

If provided, this is the custom CA certificate. It is used as the signing CA certificate, that is, the DC/OS CA will use this certificate for signing end-entity certificates; the subject of this certificate will be the issuer for certificates signed by the DC/OS CA. If not provided, the DC/OS cluster generates a unique root CA certificate during the initial bootstrap phase and uses that as the signing CA certificate.

The public key associated with the custom CA certificate must be of type RSA.

## ca\_certificate\_key\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing the private key corresponding to the custom CA certificate, encoded in the OpenSSL (PKCS#8) PEM format. For example: `genconf/CA_cert.key`.

This is highly sensitive data. The configuration processor accesses this file only for configuration validation purposes, and does not copy the data. After successful configuration validation this file needs to be placed out-of-band into the file system of all DC/OS master nodes to the path `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` before most DC/OS `systemd` units start up. The file must be readable by the root user, and should have have 0600 permissions set.

This path is required if `ca_certificate_path` is specified.

## ca\_certificate\_chain\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing the complete CA certification chain required for end-entity certificate verification, in the OpenSSL PEM format. For example: `genconf/CA_cert_chain.pem`.

The parameter must be left undefined if `ca_certificate_path` points to a root CA certificate. Required if `ca_certificate_path` is specified and if the custom CA certificate is an **intermediate CA certificate**.

For an intermediate CA, this needs to point to a file containing all CA certificates comprising the complete sequence, starting precisely with the CA certificate that was used to sign the custom CA certificate and ending with a root CA certificate (where issuer and subject are equivalent), yielding a gapless certification path. The order is significant and the list must contain at least one certificate.

# Installing DC/OS Enterprise with a custom CA certificate

**Prerequisites**:

- The installation of DC/OS Enterprise via the Advanced Installer has been prepared according to the corresponding [documentation](/1.11/installing/production/deploying-dcos/installation/), up to the section [**Install DC/OS**](/1.11/installing/production/deploying-dcos/installation/#install-dcos) of that documentation.

- On the bootstrap node, the files carrying the custom CA certificate, the associated private key and, optionally, the CA certificate chain have been placed into the `$DCOS_INSTALL_DIR/genconf/` directory. (See the [section](#manually-placing-custom) above for more detailed description)

- The private key associated with the custom CA certificate has been securely placed on all DC/OS master nodes (See this [section](#manually-placing-master) for more details). Example of a command issued on one of the DC/OS master nodes:

```bash
stat /var/lib/dcos/pki/tls/CA/private/custom_ca.key
```
```bash
File: ‘/var/lib/dcos/pki/tls/CA/private/custom_ca.key’
Size: 9             Blocks: 8          IO Block: 4096   regular file
Device: ca01h/51713d    Inode: 100671105   Links: 1
Access: (0600/-rw-------)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:var_lib_t:s0
Access: 2017-12-27 12:35:58.643278377 +0000
Modify: 2017-12-27 12:35:58.643278377 +0000
Change: 2017-12-27 12:36:13.019162417 +0000
Birth: -
```

- The configuration parameters `ca_certificate_path`, `ca_certificate_key_path` and `ca_certificate_chain_path` are specified in the DC/OS configuration file `$DCOS_INSTALL_DIR/genconf/config.yaml` and point to the relevant locations in the file system. Example of commands issued on the bootstrap node:

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
Note that `ca_certificate_chain_path` must not be present when setting up DC/OS Enterprise with a root certificate as the custom CA certificate.

## Installation
Proceed with the installation as described in the [documentation of the Advanced Installer](/1.11/installing/production/deploying-dcos/installation/#install-dcos). Note that the current working directory when executing `dcos_generate_config.ee.sh` must be the `$DCOS_INSTALL_DIR` directory.

## Verify installation
One method of verifying that the DC/OS Enterprise cluster was installed properly with the custom CA certificate is to initiate a TLS connection to Admin Router which, after installation, will present a certificate signed by the custom CA. In order to do this, you first need to obtain the DC/OS CA bundle of the deployed cluster. [This page](/1.11/security/ent/tls-ssl/get-cert/) shows how you can do that.

Provided you have obtained the DC/OS CA bundle and stored it in a file named `dcos-ca.crt`, issue the following command in the directory containing the `dcos-ca.crt` file in order to check that Admin Router on a master node uses a certificate signed by the custom CA:

```bash
openssl s_client -verify_ip <private_ip_master_node_X> -CAfile dcos-ca.crt -connect <public_ip_master_node_X>:443 | grep -e "s:" -e "i:" -e "return code:"
```

The output should look like the following:

```bash
depth=3 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Programmer Unit, CN = Integration Test Root CA
verify return:1
depth=2 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Programmer Unit, CN = Integration Test Intermediate CA 01
verify return:1
depth=1 DC = io, DC = integration-test, C = DE, ST = Utopia, O = DC/OS, OU = Programmer Unit, CN = Integration Test Intermediate CA 02
verify return:1
depth=0 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = AdminRouter on 172.31.12.45
verify return:1
 0 s:/C=US/ST=CA/L=San Francisco/O=Mesosphere, Inc./CN=AdminRouter on 172.31.12.45
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 02
 1 s:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 02
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
 2 s:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
   i:/DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
    Verify return code: 0 (ok)
```

## Example use cases
This section describes how the three configuration parameters `ca_certificate_path`, `ca_certificate_key_path` and `ca_certificate_chain_path` must be specified in the `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS configuration file for the most common use cases of a custom CA certificate hierarchy.

### Use case 1: 
The custom CA certificate is a self-signed root CA certificate. The CA does not have a “parent” CA, hence the CA certificate chain is empty.

The following files are present:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` file containing the custom CA certificate
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` file containing the private key associated with the custom CA certificate

- on the master nodes:
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the private key associated with the custom CA certificate.

Here is an example of the `issuer` and `subject` fields of a custom root CA certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
```

Since the custom CA certificate is a root CA certificate and the corresponding CA certificate chain is empty, we must omit the `ca_certificate_chain_path` parameter in the DC/OS configuration file. The configuration parameters must be specified as follows in the `$DCOS_INSTALL_DIR/genconf/config.yaml` file on the bootstrap node:

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
```

### Use case 2: 

In this case the custom CA certificate is an intermediate one, issued directly by a root CA. The CA certificate chain consists of just that root CA certificate. The following files are present:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` file containing the custom CA certificate in PEM format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-chain.crt` file containing the certificate chain in PEM format

- on the master nodes
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format.

Here is an example of an appropriate intermediate custom CA certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
```

Here is an example of a corresponding CA certificate chain:  

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-certificate-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }'
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
```

The configuration parameters must be specified similar to the following in the `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS configuration file on the bootstrap node:

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
```

### Use case 3: 

In this case the custom CA certificate is an intermediate one, issued directly by another intermediate CA that, in turn, has its certificate issued by a root CA.

The CA certificate chain comprises the 
1. CA certificate of the issuing intermediate CA, and 
1. the root CA 

in that order.

The following files are present:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate.crt` file containing the custom CA certificate in PEM format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-key.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-certificate-chain.crt` file containing the certificate chain in PEM format

- on the master nodes
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the private key associated with the custom CA certificate in the PKCS#8 format.

Here is an example of an appropriate custom intermediate CA certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca-certificate.crt -issuer -subject -noout
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 02
```

Here is an example of a corresponding CA certificate chain:

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-certificate-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }'
```
```bash
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Intermediate CA 01
issuer= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
subject= /DC=io/DC=integration-test/C=DE/ST=Utopia/O=DC/OS/OU=Programmer Unit/CN=Integration Test Root CA
```

The configuration parameters must be specified as follows in the `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS configuration file on the bootstrap node:

```bash
ca_certificate_path: genconf/dcos-ca-certificate.crt
ca_certificate_key_path: genconf/dcos-ca-certificate-key.key
ca_certificate_chain_path: genconf/dcos-ca-certificate-chain.crt
```
