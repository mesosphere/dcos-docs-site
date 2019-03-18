---
layout: layout.pug
navigationTitle:  Licenses
title: Licenses
menuWeight: 1100
enterprise: true
excerpt: Administering your cluster in conformance with your license requirements
---

The DC/OS licensing component allows you to administer your cluster in conformance with your license requirements. DC/OS licensing tracks the state of a cluster license, collects information to check if any licensing terms have been breached, and supports operations for updating the license when a contract is extended or changed.

A cluster license file contains all of the information to determine if the terms of a contract agreement has been breached. It also contains the set of keys necessary to encrypt and decrypt a checksum of the audit data collected by the DC/OS licensing component. The license text contains:

- A private key used by the DC/OS licensing component to sign the audit data checksum.
- A public key used to decrypt the audit data checksum.
- The terms of the license:
   - The maximum number of nodes allowed to be connected at any time.
   - The start and end dates of the license.


# Configuring the cluster license

You specify the license file when you configure a cluster installation. To configure a cluster license, create the `genconf/license.txt`file and add the license key text you received in the email sent to you by your Authorized Support Contact. For additional information about this step, see the instructions for [running the installer](/1.13/installing/production/deploying-dcos/installation/).

The DC/OS licensing component will launch successfully only if the information in the license is legitimate. Once the DC/OS licensing component launches, the deployment of the DC/OS components is resumed and validated. If the license is missing or invalid, the deployment will fail.

# License audit data

A license contains the maximum number of nodes attached to a cluster at any given time and the start and end date of the license.

Once a day, the DC/OS licensing component logs the number of nodes. The DC/OS licensing component also logs any graceful process shutdown. If the number of nodes exceeds the number specified in the contract, the DC/OS licensing component logs a breach of contract.

To validate that Mesosphere is not logging sensitive data, you can retrieve the audit data decryption key and decrypt the audit data checksum.

# Cluster upgrades

For major release upgrades, the license needs to be renewed. A license can be renewed by adding a new license to the config during release upgrades or config upgrades.
