---
layout: layout.pug
navigationTitle:  >
title: >
  Obtaining the root certificate of your
  DC/OS CA
menuWeight: 100
excerpt: >
  As a first step in ensuring that clients
  communicate with your DC/OS cluster and
  not another party, obtain the root
  certificate of your DC/OS CA.
beta: true
enterprise: true
---

# About obtaining the root certificate of your DC/OS CA

To ensure that you communicate with your DC/OS cluster and not another party, obtain the root certificate of your DC/OS CA using one of the following methods.

- [Out of band (recommended)](#oob): the most secure way to retrieve the root certificate is out of band. This method provides more assurance that you have the root certificate of your own DC/OS CA and not another CA.

- [Via curl (less secure)](#curl): using curl to retrieve the certificate requires the use of the `-k` flag, which opens you up to a [man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). In such an attack, someone could substitute the root certificate of a CA other than yours, causing you to trust and communicate with someone other than your own DC/OS cluster.

# <a name="oob"></a>Retrieving the root certificate of your DC/OS CA out of band

The root certificate of your DC/OS CA can be found on any master node at the following path `/run/dcos/pki/CA/certs/ca.crt`. For maximum security, you should physically retrieve this file. Alternatively, you could SSH into one of the masters to obtain it. 

**Tip:** Do not modify the `ca.crt` file stored on the master node in any way. However, after making a copy of this file and storing it elsewhere, we recommend renaming the copy from `ca.crt` to `dcos-ca.crt`. This will make it easier to copy and paste the curl commands provided elsewhere in the documentation.

# <a name="#curl"></a>Using curl to retrieve the root certificate of your DC/OS CA

Using curl to retrieve the root certificate of your DC/OS CA requires the use of the `-k` flag, which opens up the possibility of a man-in-the-middle attack. If this risk does not concern you, use the following command to retrieve the certificate file and save it in the current directory.

**Prerequisite:** You must have the [DC/OS CLI installed](/1.8/usage/cli/install/).

```bash
curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o dcos-ca.crt
```