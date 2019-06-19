---
layout: layout.pug
title: Obtaining the DC/OS CA bundle
menuWeight: 100
excerpt: Obtaining the DC/OS CA bundle
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


To ensure that you are communicating with your DC/OS cluster and not another potentially malicious party, you must obtain the appropriate trust anchor. This trust anchor is part of the DC/OS CA bundle which is a collection of root CA certificates. In the simplest case, it just contains one item: the root CA certificate corresponding to the DC/OS certificate authority. You can obtain the DC/OS CA bundle, using one of these methods:

- [Out-of-band, recommended](#oob): the only secure way to retrieve the CA bundle is out-of-band.

- [Via HTTP(S) from Admin Router, insecure](#curl): using `curl` to retrieve the certificate through insecure HTTP or insecure HTTPS.

# Adding an OpenID Connect identity provider

# <a name="oob"></a>Retrieving the DC/OS CA bundle out of band

The DC/OS CA bundle is located on any master node at the file system path `/run/dcos/pki/CA/ca-bundle.crt`. For maximum security, you should manually retrieve this file. Alternatively, a reasonably secure method is to SSH into one of the master nodes to obtain the file, if the master nodes cannot be accessed physically. For simplification and to more easily use the `curl` commands provided elsewhere in the documentation, you can rename the file from `ca-bundle.crt` to e.g., `dcos-ca.crt`.

# <a name="curl"></a>Using curl to retrieve the DC/OS CA bundle

<p class="message--important"><strong>IMPORTANT: </strong>If you are using `curl` to retrieve the DC/OS CA bundle, you must use the `-k`/`--insecure` flag. If the communication is performed through HTTPS, this flag disables server certificate verification. This allows for a <a href="https://en.wikipedia.org/wiki/Man-in-the-middle_attack">man-in-the-middle attack</a>, where a malicious party in the network path could send a bad CA bundle, causing you to trust entities from outside your DC/OS cluster.</p>

**Prerequisite:** You must have the [DC/OS CLI installed](/1.13/cli/install/) in order to retrieve the cluster URL in the command below.

Use the following command to retrieve the DC/OS CA bundle and save it in the current directory:

```bash
curl -k -v $(dcos config show core.dcos_url)/ca/dcos-ca.crt -o dcos-ca.crt
```
