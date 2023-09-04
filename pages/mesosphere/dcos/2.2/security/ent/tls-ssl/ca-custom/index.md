---
layout: layout.pug
navigationTitle:  Configuring a Certificate Authority
title: Configuring a Certificate Authority
menuWeight: 50
excerpt: Configuring DC/OS Enterprise to use a custom Certificate Authority
enterprise: true
render: mustache
model: /mesosphere/dcos/2.2/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


Each DC/OS Enterprise cluster has a DC/OS certificate authority (CA). By default the DC/OS CA uses a globally unique root CA certificate generated during the installation of DC/OS. This CA certificate is used to sign certificates for the components of DC/OS such as Admin Router. Instead of using the default root CA certificate, you can configure DC/OS Enterprise to use a specific CA certificate, either a root CA certificate or an intermediate signing certificate. (See examples [below](#example-use-cases))

Using a custom CA certificate for your DC/OS Enterprise cluster provides several benefits over using the default CA certificate:

- Ensures that all X.509 certificates used within the DC/OS cluster, for both signing and encrypting, derive from your organization's X.509 certification hierarchy.
- Controls security properties of the key pair, such as type and strength, used for signing DC/OS component certificates.
- Ensures that all DC/OS components, including Admin Router, present browser-trusted certificates.
- Allows replacement of expiring or compromised certificates without reinstalling the cluster.

# Contents
- [Custom CA certificate support](#custom-ca-certificate-support)
- [Definitions](#definitions)
- [Create signing CA files](#create-signing-ca-files)
- [DC/OS Configuration](#dcos-configuration)
- [Installing a cluster with a custom CA Certificate](#installing-a-cluster-with-a-custom-ca-certificate)
- [Changing the CA Certificate in an existing cluster](#changing-the-ca-certificate-in-an-existing-cluster)
- [Verify the new certificates](#verify-the-new-certificates)
- [Example use cases](#example-use-cases)

# Custom CA certificate support
- Only RSA and Elliptic Curve (EC) certificates are supported.
- DC/OS Enterprise 1.9 and earlier do **not** support custom signing certificates.
- DC/OS Enterprise 2.1 and earlier do **not** support modification (addition, removal, or replacement) of signing certificates in an existing cluster.
- If Calico is enabled, modifying a CA certificate will restart Docker on agent nodes, stopping any workloads running on the agent.

# Definitions 
- **Signing certificate:** A CA certificate that will be used to issue certificates for DC/OS components such as Admin Router. The custom signing certificate is either an intermediate signing certificate (issued by another CA) or a root CA certificate (self-signed by the custom CA). Provide the signing certificate in PEM format (starting with `-----BEGIN CERTIFICATE-----`).

- **Signing key:** The signing key associated with the signing certificate. Provide the signing key in unencrypted PKCS8 format (starting with `-----BEGIN PRIVATE KEY-----`).

- **Signing certificate chain:** The complete CA certification chain required for end-entity certificate verification. It must include the certificates of all parent CAs of the signing certificate up to and including the root CA certificate. If the signing certificate is a root certificate, the chain must be empty. Provide the certificates in PEM format (starting with `-----BEGIN CERTIFICATE-----`).

- **Installation directory:** The directory on the bootstrap node where the DC/OS installer resides. It is denoted by `$DCOS_INSTALL_DIR` in this document.

- **DC/OS configuration file:** The file which contains the DC/OS configuration parameters. The DC/OS configuration file is typically called `config.yaml` and must be present in the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node during the installation.


# Create signing CA files

Prepare files containing the signing certificate, the signing key, and, if required, the signing certificate chain.

One way to generate a signing certificate and key is to use the OpenSSL command line. First create a configuration file:
```bash
cat > openssl-ca.cnf <<EOF
HOME                = .
RANDFILE            = \$ENV::HOME/.rnd

[ ca ]
default_ca          = CA_default

[ CA_default ]
default_md          = sha256

[ req ]
distinguished_name  = ca_distinguished_name
x509_extensions     = ca_extensions
string_mask         = utf8only
prompt              = no

# Set for your organization
[ ca_distinguished_name ]
countryName         = US
stateOrProvinceName = Nebraska
localityName        = Lincoln
organizationName    = Example
commonName          = DC/OS CA

[ ca_extensions ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always, issuer
basicConstraints       = critical, CA:true
keyUsage               = keyCertSign, cRLSign
EOF
```
then run the command:
```bash
openssl req -config openssl-ca.cnf -newkey rsa:4096 -nodes -keyout dcos-ca.key -x509 -days 1850 -out dcos-ca.crt
```

You should review the security requirements for your organization to determine a suitable way to create or obtain CA certificates.

# DC/OS Configuration

Add the paths for the signing CA files to the DC/OS configuration file.
The paths must be relative to `$DCOS_INSTALL_DIR` and hence will always start with `genconf/`.

<p class="message--note"><strong>NOTE: </strong>If Calico is enabled then changing these configuration values for an existing cluster will restart Docker on agent nodes. This will terminate running workloads.</p>

### ca\_certificate\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing the signing certificate. For example: `genconf/dcos-ca.crt`. It can be either a self-signed root certificate or an intermediate certificate signed by another certificate authority.

The DC/OS CA will use this certificate for signing end-entity certificates. The subject of this certificate will be the issuer for certificates signed by the DC/OS CA. If not provided the DC/OS cluster generates a unique root certificate during the initial bootstrap phase and uses that as the signing certificate.

### ca\_certificate\_key\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing the signing key. For example: `genconf/dcos-ca.key`.

This is highly sensitive data. The configuration processor accesses this file only for configuration validation, and does not copy the data.

This path is required if `ca_certificate_path` is specified.

### ca\_certificate\_chain\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing the complete CA certification chain required for end-entity certificate verification. For example: `genconf/dcos-ca-chain.pem`.

If `ca_certificate_path` points to a self-signed root certificate then omit this parameter.

Otherwise `ca_certificate_chain_path` points to a file containing the complete chain of certificates up to a self-signed root certificate, but excluding the signing certificate contained in `ca_certificate_path`. The order is significant: the first certificate must verify the signing certificate in `ca_certificate_path` and each subsequent certificate must verify the preceding certificate.

### ca\_truststore\_path
Path (relative to the `$DCOS_INSTALL_DIR`) to a file containing additional trusted CA certificates. This should be a file containing one or more PEM certificates. For example: `genconf/dcos-truststore.pem`.

The signing certificate root CA is automatically trusted and does not need to be added here.


# Installing a cluster with a custom CA Certificate

Create the signing files [as described above](#create-signing-ca-files) and copy them to the `$DCOS_INSTALL_DIR/genconf/` directory on the bootstrap node.

Modify the DC/OS Configuration file [as described above](#dcos-configuration) to point to the signing files.

Proceed with the installation by running the appropriate `dcos_generate_config.ee.sh` command as described in the [documentation of the Advanced Installer](/mesosphere/dcos/2.2/installing/production/deploying-dcos/installation). Note that the current working directory when executing `dcos_generate_config.ee.sh` must be the `$DCOS_INSTALL_DIR` directory.

For security reasons, the installer will not copy the signing key file from the bootstrap node to the master nodes.
Manually distribute the signing key to every DC/OS master node before running the `dcos-install.sh` script.
If you copy the signing key file over the network onto the master nodes, the network channel must be adequately protected.

On each master node:
1. Copy the `dcos-install.sh` script to the node.
2. Create the directory `/var/lib/dcos/pki/tls/CA/private/` owned by the `root` user and with permission mode 0700.
3. Copy the signing key file to `/var/lib/dcos/pki/tls/CA/private/custom_ca.key`. Ensure that the signing key file is owned by the `root` user and is only accessible to the owner (permission mode 0600).
4. Run the `dcos-install.sh` script as described in the installation instructions.

# Changing the CA Certificate in an existing cluster

To replace the CA certificate (for example, if it is expiring or compromised), perform the following procedure consisting of three patch upgrades.  Three patch upgrades are required to ensure that the cluster stays healthy during the certificate replacement.  If Calico is enabled (the default setting), then workloads may be stopped.

## Add new CA certificate to truststore

In the first patch upgrade, add the new CA certificate to the truststore.

```yaml
ca_truststore_path: genconf/new-ca.crt
```

Proceed with the patch upgrade by running the appropriate `dcos_generate_config.ee.sh` command as described in the [documentation of the Advanced Installer](/mesosphere/dcos/2.2/installing/production/patching). Note that the current working directory when executing `dcos_generate_config.ee.sh` must be the `$DCOS_INSTALL_DIR` directory.

Run the `dcos_node_upgrade.sh` script on each cluster node as described in the patch instructions.

## Replace the CA signing certificate

In the second patch upgrade, replace the signing certificate. Modify the truststore to refer to the old CA certificate.

```yaml
ca_certificate_path: genconf/new-ca.crt
ca_certificate_key_path: genconf/new-ca.key
ca_certificate_chain_path: genconf/new-ca-chain.crt
ca_truststore_path: genconf/old-ca.crt
```

Note that this example assumes the signing certificate is an intermediate certificate. If it is self-signed root certificate, remove the `ca_certificate_chain_path` attribute.

Proceed with the patch upgrade by running the appropriate `dcos_generate_config.ee.sh` command as described in the [documentation of the Advanced Installer](/mesosphere/dcos/2.2/installing/production/patching). Note that the current working directory when executing `dcos_generate_config.ee.sh` must be the `$DCOS_INSTALL_DIR` directory.

For security reasons, the installer will not copy the signing key file from the bootstrap node to the master nodes.
Manually distribute the signing key to every DC/OS master node **before starting the upgrade**.
If you copy the signing key file over the network onto the master nodes, the network channel must be adequately protected.

On each master node in turn:
1. Copy the `dcos_node_upgrade.sh` script to the node.
2. Ensure the directory `/var/lib/dcos/pki/tls/CA/private/` exists and is owned by the `root` user with permission mode 0700.
3. Copy the signing key file to `/var/lib/dcos/pki/tls/CA/private/custom_ca.key`. Ensure that the signing key file is owned by the `root` user and is only accessible to the owner (permission mode 0600).
4. Run the `dcos_node_upgrade.sh` script as described in the patch instructions.
5. Before proceeding, validate the patch as described in the patch instructions.

Run the `dcos_node_upgrade.sh` script on each agent node as described in the patch instructions.

## Remove old CA certificate from truststore

This step is optional, but recommended. If this step is not done, then certificates signed by the old CA certificate will continue to be trusted. If the old CA certificate may have been compromised or may be compromised within its remaining lifetime, performing this step is required.

In the third patch upgrade, remove the old CA from the truststore by removing the `ca_truststore_path` attribute from the DC/OS configuration file.

Proceed with the patch upgrade by running the appropriate `dcos_generate_config.ee.sh` command as described in the [documentation of the Advanced Installer](/mesosphere/dcos/2.2/installing/production/patching). Note that the current working directory when executing `dcos_generate_config.ee.sh` must be the `$DCOS_INSTALL_DIR` directory.

Run the `dcos_node_upgrade.sh` script on each cluster node as described in the patch instructions.

# Verify the new certificates

To verify that the DC/OS Enterprise cluster was installed with the custom signing certificate, use your browser to access the DC/OS web UI and inspect the certificate and check that the CA has the expected DN.

Alternatively, you can follow these steps:

Select a master node to test:
```bash
MASTER=172.28.128.21
```

You will need the CA certificate. If necessary, retrieve it from the master node using:
```bash
curl -k -v https://${MASTER}/ca/dcos-ca.crt -o dcos-ca.crt
```

Retrieve the certificate chain from the web UI and verify it with the CA certificate:
```bash
openssl s_client -verify_ip ${MASTER} -CAfile dcos-ca.crt -connect ${MASTER}:443 | grep -e "s:" -e "i:" -e "return code:"
```

The output should look like the following:

```
depth=1 C = US, ST = Nebraska, L = Lincoln, O = Example, CN = DC/OS CA
verify return:1
depth=0 C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = AdminRouter on 172.28.128.21
verify return:1
 0 s:C = US, ST = CA, L = San Francisco, O = "Mesosphere, Inc.", CN = AdminRouter on 172.28.128.21
   i:C = US, ST = Nebraska, L = Lincoln, O = Example, CN = DC/OS CA
    Verify return code: 0 (ok)
```

# Example use cases
This section describes how the three configuration parameters `ca_certificate_path`, `ca_certificate_key_path` and `ca_certificate_chain_path` must be specified in the `$DCOS_INSTALL_DIR/genconf/config.yaml` DC/OS configuration file for the most common use cases of a custom CA certificate hierarchy.

## Use case 1: 
The signing certificate is a self-signed root certificate. The CA does not have a “parent” CA, hence the signing certificate chain is empty.

Provide the following files:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca.crt` file containing the signing certificate
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca.key` file containing the signing key

- on the master nodes:
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the signing key

Here is an example of the `issuer` and `subject` fields of a custom root Signing certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca.crt -issuer -subject -noout
```
```
issuer= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
subject= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
```

Since the signing certificate is a root certificate and the corresponding signing certificate chain is empty, we must omit the `ca_certificate_chain_path` parameter in the DC/OS configuration file. Specify the configuration parameters as follows in the DC/OS configuration file on the bootstrap node:

```yaml
ca_certificate_path: genconf/dcos-ca.crt
ca_certificate_key_path: genconf/dcos-ca.key
```

## Use case 2: 

In this case the signing certificate is an intermediate one, issued directly by a root CA. The signing certificate chain consists of just the root CA certificate. Provide the following files:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca.crt` file containing the signing certificate in PEM format
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca.key` file containing the signing key
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-chain.crt` file containing the root signing certificate in PEM format

- on the master nodes
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the signing key

Here is an example of an appropriate intermediate signing certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca.crt -issuer -subject -noout
```
```
issuer= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
subject= /C=US/L=Nebraska/O=Example/CN=Integration Test Intermediate CA 01
```

Here is an example of a corresponding signing certificate chain:  

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }'
```
```
issuer= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
subject= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
```

Specify the configuration parameters as follows in the DC/OS configuration file on the bootstrap node:

```yaml
ca_certificate_path: genconf/dcos-ca.crt
ca_certificate_key_path: genconf/dcos-ca.key
ca_certificate_chain_path: genconf/dcos-ca-chain.crt
```

## Use case 3: 

In this case the signing certificate is an intermediate one, issued directly by another intermediate CA that, in turn, has its certificate issued by a root CA.

The signing certificate chain comprises the 
1. signing certificate of the issuing intermediate CA, and 
1. the root CA 

in that order.

Provide the following files:

- on the bootstrap node:
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca.crt` file containing the signing certificate
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca.key` file containing the signing key
    - `$DCOS_INSTALL_DIR/genconf/dcos-ca-chain.crt` file containing the signing certificate chain

- on the master nodes
    - `/var/lib/dcos/pki/tls/CA/private/custom_ca.key` file containing the signing key

Here is an example of an appropriate custom intermediate signing certificate:

```bash
cd $DCOS_INSTALL_DIR
openssl x509 -in genconf/dcos-ca.crt -issuer -subject -noout
```
```
issuer= /C=US/L=Nebraska/O=Example/CN=Integration Test Intermediate CA 01
subject= /C=US/L=Nebraska/O=Example/CN=Integration Test Intermediate CA 02
```

Here is an example of a corresponding signing certificate chain:

```bash
cd $DCOS_INSTALL_DIR
cat genconf/dcos-ca-chain.crt | awk -v cmd="openssl x509 -issuer -subject -noout && echo" '/-----BEGIN/ { c = $0; next } c { c = c "\n" $0 } /-----END/ { print c|cmd; close(cmd); c = 0 }'
```
```
issuer= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
subject= /C=US/L=Nebraska/O=Example/CN=Integration Test Intermediate CA 01
issuer= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
subject= /C=US/L=Nebraska/O=Example/CN=Integration Test Root CA
```

Specify the configuration parameters as follows in the DC/OS configuration file on the bootstrap node:

```yaml
ca_certificate_path: genconf/dcos-ca.crt
ca_certificate_key_path: genconf/dcos-ca.key
ca_certificate_chain_path: genconf/dcos-ca-chain.crt
```
