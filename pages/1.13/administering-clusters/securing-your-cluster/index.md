---
layout: layout.pug
navigationTitle:  Securing a cluster
title: Securing a cluster
excerpt: Understanding the security features in DC/OS
menuWeight: 7
---

# General security concepts

DC/OS is based on a Linux kernel and user space. The same best practices for
securing any Linux system apply to securing DC/OS, including setting correct
file permissions, restricting root and normal user accounts, protecting
network interfaces with `iptables` or other firewalls, and regularly applying
updates from the Linux distribution used with DC/OS to ensure that system
libraries, utilities and core services like systemd and OpenSSH are secure.

# Network security

You must use appropriate network mechanisms to prevent unauthorized access to cluster nodes.

Depending on your cluster environment, this may include:
- using physical or virtual subnets to isolate [DC/OS Security Zones](#security-zones);
- using router firewalls or security groups to restrict access to ports;
- using firewall software (e.g. `iptables`) on the nodes to restrict access to ports.

Use these mechanisms to provide the following connectivity:
- between master nodes: allow connections on all ports.
- between agent nodes: allow connections on all ports.
- from master nodes to agent nodes: allow connections on all ports.
- from agent nodes to master nodes: allow connections on all ports except TCP ports 8201 and 26257.
- from external machines to master nodes: block connection requests on all ports except TCP ports 80 and 443.
- from external machines to private agent nodes: block connection requests on all ports.
- from external machines to public agent nodes: block connection requests on all ports except [advertised port ranges](/1.13/installing/production/system-requirements/ports/#agent).

You may want to open port 22 to external machines to allow administrative tasks using Secure Shell (`ssh`).
Although DC/OS components do not currently support private network selection, you can configure
`ssh` to be accessible to a private management network using the [`ListenAddress`](https://man.openbsd.org/sshd_config#ListenAddress) directive.

# Security zones

At the highest level we can distinguish three security zones in a DC/OS
deployment, namely the admin, private, and public security zones.

## Admin zone

The **admin** zone is accessible via HTTP/HTTPS and SSH connections, and
provides access to the master nodes. It also provides reverse proxy access to
the other nodes in the cluster via URL routing. For security, the DC/OS cloud
template allows configuring a whitelist so that only specific IP address
ranges are permitted to access the admin zone.

### Admin Router

Access to the admin zone is controlled by Admin Router.

HTTP requests incoming to your DC/OS cluster are proxied through Admin Router (using [Nginx](http://nginx.org) with [OpenResty](https://openresty.org) at its core). Admin Router denies access to most HTTP endpoints for unauthenticated requests. In order for a request to be authenticated, it must present a valid authentication token in its Authorization header. A token can be obtained by going through the authentication flow. See the [Security documentation](/1.13/security/) for more information.

Authenticated users are authorized to perform arbitrary actions in their cluster. That is, there is currently no fine-grained access control in DC/OS besides having access or not having access to services.

#### Steps for securing Admin Router

By default, Admin Router will permit unencrypted HTTP traffic. This is not considered secure, and you must provide a valid TLS certificate and redirect all HTTP traffic to HTTPS to properly secure access to your cluster. After you have a valid TLS certificate, install the certificate on each master. Copy the certificate and private key to a well known location, such as under `/etc/ssl/certs`.

If you run HAProxy in front of Admin Router, you should secure the communication between them. For information about securing your communication, see the [documentation](/1.13/security/oss/tls-ssl/haproxy-adminrouter/).

## Private zone

A **private** zone is a non-routable network that is only accessible from
the admin zone or through the edge router from the public zone. Deployed
services are run in the private zone. This zone is where the majority of agent
nodes are run.

## Public zone

The optional **public** zone is where publicly accessible applications are run. Generally, only a small number of agent nodes are run in this zone. The edge router forwards traffic to applications running in the private zone.

The agent nodes in the public zone are labeled with a special role so that only specific tasks can be scheduled here. These agent nodes have both public and private IP addresses and only specific ports should be open in their
`iptables` firewall.

By default, when using the cloud-based installers such as the AWS CloudFormation templates, a large number of ports are exposed to the Internet for the public zone. In production systems, it is unlikely that you would expose all of these ports. It is recommended that you close all ports except 80 and 443 (for HTTP/HTTPS traffic) and use [Marathon-LB](https://docs.mesosphere.com/services/marathon-lb/) with HTTPS to manage ingress traffic.

### Typical AWS deployment

A typical AWS deployment including AWS Load Balancers is shown below:

![Security Zones](/1.13/img/security-zones.jpg)

Figure 1. Security zones in AWS deployment

