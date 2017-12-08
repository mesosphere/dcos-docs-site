---
layout: layout.pug
navigationTitle:  Securing communication with TLS
title: Securing communication with TLS
menuWeight: 7
excerpt:
featureMaturity: preview
enterprise: true
---


# About TLS encryption

The encryption of DC/OS communications varies according to your [security mode](/1.8/administration/installing/custom/configuration-parameters/#security).

<table class="table" STYLE="margin-bottom: 25px;">
  <tr>
    <th>
      Security mode
    </th>
    <th>
      External communications*
    </th>
    <th>
      Internode communications
    </th>
  </tr>
  <tr>
    <td width="20%">
      <code>disabled</code>
    </td>
    <td>
      HTTP connections are not redirected to HTTPS or vice versa. HTTPS connections will be rejected because the Admin Router is not configured to serve them.
    </td>
    <td>
      Unencrypted
    </td>
  </tr>
  <tr>
    <td>
      <code>permissive</code> (default)
    </td>
    <td>
      HTTP requests to the root path (i.e., to <code>http://cluster-hostname.com/</code> or to <code>http://cluster-hostname.com</code>) are redirected to HTTPS. HTTP requests with a target different from the root path (e.g., <code>http://cluster-hostname.com/foo</code>) are not redirected to HTTPS.
    </td>
    <td>
      Encryption enabled
    </td>
  </tr>
  <tr>
    <td>
      <code>strict</code>
    </td>
    <td>
      All HTTP connections are redirected to HTTPS.
    </td>
    <td>
      Encryption enforced**
    </td>
  </tr>
</table> 

\* *Communications with clients outside of the cluster. For example, browsers and the DC/OS CLI*.

\*\* *Except internode communications between instances of ZooKeeper, which are not encrypted in any security mode. Each master node has a ZooKeeper instance. These ZooKeeper instances communicate periodically to keep their in-memory databases in sync. You can use [IPsec](https://datatracker.ietf.org/wg/ipsec/documents/) to manually encrypt these communications. We plan to automatically encrypt communications between instances of ZooKeeper in a future release*.

Not all existing user services support encryption at this time. If the service supports encryption, you can enable it in `permissive` mode. In `strict` mode, encryption of user service communications is enforced. As a result, only user services that support encryption can be deployed in `strict` mode.

Internode communications occur over TLS 1.2. To ensure browser support, external communications currently accept TLS 1.0, 1.1, and 1.2. These settings  are configurable.  

# <a name="about-ssl-cert"></a> About your DC/OS Certificate Authority 

In `permissive` and `strict` security modes, your DC/OS Certificate Authority signs the TLS certificates and provisions them to systemd-started services during the bootstrap sequence. This accomplishes encrypted communications with no manual intervention. Each DC/OS cluster has its own DC/OS Certificate Authority and a unique root certificate to protect DC/OS clusters from each other. 

Because your DC/OS Certificate Authority does not appear in any lists of trusted certificate authorities, requests coming in from outside the cluster, such as from a browser or curl, will result in warning messages. 

To establish trusted communications with your DC/OS cluster and stop the warning messages:

1. [Obtain the root certificate of your DC/OS CA](/1.8/administration/tls-ssl/get-cert/).

1. Perform one of the following.

     - [Set up a proxy](/1.8/administration/tls-ssl/haproxy-adminrouter/) between DC/OS and requests coming in from outside of the cluster. The proxy terminates the requests and resends them to DC/OS. By configuring this proxy to trust the root certificate of your DC/OS CA, you can ensure that it connects securely to your DC/OS cluster.
   
     - Manually add your DC/OS Certificate Authority as a trusted authority in [browser](/1.8/administration/tls-ssl/ca-trust-browser/), [DC/OS CLI](/1.8/administration/tls-ssl/ca-trust-cli/), [curl commands](/1.8/administration/tls-ssl/ca-trust-curl/), and other clients.



