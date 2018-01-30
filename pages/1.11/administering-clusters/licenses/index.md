---
layout: layout.pug
navigationTitle:  Licenses
title: Licenses
menuWeight: 1100
enterprise: true
---

Mesosphere uses licenses to ensure that customers respect their contract terms. The DC/OS licensing component tracks the state of a cluster license, collects information to check if any licensing terms have been breached, and supports operations for updating the license when a contract is extended or changed.

A cluster license file contains all of the information to determine if the terms of a contract agreement has been breached. It also contains the set of keys necessary to encrypt and decrypt a checksum of the audit data collected by the DC/OS licensing component. The license text contains:

- A private key used by the DC/OS licensing component to sign the audit data checksum.
- A public key used to decrypt the audit data checksum.
- The terms of the license:
   - The maximum number of nodes allowed to be connected at any time.
   - The start and end dates of the license.


# Configuring the cluster license

You specify the license file when you configure a cluster installation. To configure a cluster license, specify the license text received in email sent by your Authorized Support Contact in a file you create at `genconf/license.txt` [before running the installer](/1.11/installing/ent/custom/advanced/#license).

The DC/OS licensing component will launch successfully only if the information in the license is legitimate. Once the DC/OS licensing component launches, the deployment of the DC/OS components is resumed and validated. If the license is missing or invalid, the deployment will fail.

# License audit data

A license contains the maximum number of nodes attached to a cluster at any given time and the start and end date of the license.

To validate that Mesosphere is not logging sensitive data, you can retrieve the audit data decryption key and decrypt the audit data checksum.

#Cluster upgrades

For major release upgrades, the license needs to be renewed.
