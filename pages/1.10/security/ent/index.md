---
layout: layout.pug
title: DC/OS Enterprise Security
menuWeight: 100
excerpt:

enterprise: true
---

DC/OS Enterprise offers a range of features that allow you to secure your cluster and prevent breaches and other attacks. This section provides an overview of the security features and recommendations for hardening your cluster.

The goals of DC/OS security are:

-  Isolate the cluster perimeter with strong authentication and authorization across all interfaces.
-  Secure and protect the internal cluster communication, containers, and sandboxes.
-  Enhance cluster security with support for 3rd party security integrations.

DC/OS is based on a Linux kernel and userspace. The same best practices for securing any Linux system apply to securing DC/OS, including setting correct file permissions, restricting root and normal user accounts, protecting network interfaces with iptables or other firewalls, and regularly applying updates from the Linux distribution used with DC/OS to ensure that system libraries, utilities, and core services like systemd and OpenSSH are secure.

# Security Zones
At the highest level we can distinguish three security zones in a DC/OS deployment, namely the admin, private, and public security zones.

## Admin zone
The **admin** zone is accessible via HTTP/HTTPS and SSH connections, and provides access to the master nodes. It also provides reverse proxy access to the other nodes in the cluster via URL routing. For security, the DC/OS cloud template allows configuring a whitelist so that only specific IP address ranges are permitted to access the admin zone.

### Admin Router
Access to the admin zone is controlled by the [Admin Router](/1.10/overview/architecture/components/#admin-router).

HTTP requests incoming to your DC/OS cluster are proxied through the Admin Router (using [Nginx](http://nginx.org) with [OpenResty](https://openresty.org) at its core). The Admin Router denies access to most HTTP endpoints for unauthenticated requests. In order for a request to be authenticated, it needs to present a valid authentication token in its `Authorization` header. A token can be obtained by going through the authentication flow.

## Private Zone
The **private** zone is a non-routable network that is only accessible from the admin zone or through the edge router from the public zone. Deployed services are run in the private zone. This zone is where the majority of agent nodes are run.

## Public Zone
The optional **public** zone is where publicly accessible applications are run. Generally, only a small number of agent nodes are run in this zone. The edge router forwards traffic to applications running in the private zone.

The agent nodes in the public zone are labeled with a special role so that only specific tasks can be scheduled here. These agent nodes have both public and private IP addresses and only specific ports should be open in their `iptables` firewall.

### Typical Deployment

A typical deployment, including load balancers is shown below:

![Security Zones](/1.10/img/security-zones.png)


# <a name="security-modes"></a>Security Modes

You can control DC/OS Enterprise access by resource and operation (create, read, update, delete). The available security modes are disabled, permissive, and strict. Strict mode provides the finest-grained controls. The DC/OS permissions are enforced based on your security mode. The security mode is set during [DC/OS installation](/1.10/installing/production/deploying-dcos/installation/) and can only be changed by performing an upgrade.

| Permission Category                                 | Disabled | Permissive | Strict |
|-----------------------------------------------------|:--------:|:----------:|:------:|
| Admin Router permissions (`dcos:adminrouter`)       |     x    |      x     |    x   |
| Mesos permissions (`dcos:mesos`)                    |          |            |    x   |
| Marathon and Metronome permissions (`dcos:service`) |          |      x     |    x   |
| Secret store permissions (`dcos:secrets`)           |     x    |      x     |    x   |

See the [permissions reference](/1.10/security/ent/perms-reference/) for a complete description.

### Disabled
This mode is designed to ensure smooth upgrades from earlier versions of DC/OS, but only provides minimal security features and is not intended for production environments. Disabled mode does not provide Marathon or Mesos permissions.

### Permissive
This mode provides some of the security features, but does not include the Mesos permissions.

### Strict
This mode provides the most robust security posture and requires a significant amount of configuration.

## <a name="set"></a>Setting Your Security Mode
The security mode is set during [DC/OS installation](/1.10/installing/production/deploying-dcos/installation/) and can only be changed by performing an [upgrade](/1.10/installing/production/upgrading/). The security mode is set in the installation configuration file with the [`security` parameter](/1.10/installing/ent/custom/configuration/configuration-parameters/#security-enterprise).

**Important:** You can only move from `disabled` to `permissive`, and from `permissive` to `strict` during an upgrade.

## <a name="discover"></a>Discovering Your Security Mode
You can use either of the following methods to determine the security mode of an existing cluster.

- Make a `GET` request to the following endpoint: `http[s]://<cluster-url>/dcos-metadata/bootstrap-config.json`.
   **Requirements:** Your user account must have either the `dcos:adminrouter:ops:metadata full` permission or the `dcos:superuser` permission. In `permissive` or `strict`, you must use HTTPS. Review [Securing your TLS communications](/1.10/security/ent/tls-ssl/) to discover how to obtain the root certificate of your DC/OS CA and provision it to your preferred client.

- [SSH](/1.10/administering-clusters/sshcluster/) into your master and view the contents of `/opt/mesosphere/etc/bootstrap-config.json`.

# <a name="authentication"></a>Authentication
All requests from outside of the DC/OS cluster require an authentication token. Depending on your security mode, in-cluster authentication tokens may be required. For more information, see the [Service Accounts documentation](/1.10/security/ent/service-auth/).

The DC/OS authentication token is a [JSON web token (JWT)](https://jwt.io/introduction/) that expires five days after issuance by default. The default expiration can be modified during a [custom install or upgrade](/1.10/installing/ent/custom/configuration/configuration-parameters/#bouncer-expiration-auth-token-days-enterprise).

DC/OS provisions masters with ZooKeeper credentials during the bootstrap sequence. This allows the masters to nominate themselves as potential Mesos leaders.

**Important:** Each cluster will use the same default ZooKeeper credentials unless you change them during an install or upgrade (strongly recommended). See [Hardening](/1.10/security/ent/hardening/#zk) for more information.

## <a name="user"></a>User Login
Users can log in by using the DC/OS GUI, the DC/OS CLI, or a programmatic client.

- If you have configured an LDAP directory server, DC/OS will pass the user's credentials to the LDAP directory server for verification.
- If you have configured a SAML or an OpenID Connect identity provider (IdP), the user passes their credentials directly to the IdP.

**Tip:** If the user is logging in with the DC/OS GUI, SAML and OpenID Connect providers may discover the necessary login details in a browser cookie. In this case, users will not need to pass their credentials.

The following diagram details the sequence.

![User authentication](/1.10/img/authn-user.png)

When the authentication token expires, the user can re-authenticate to receive another.

When a user logs in with the DC/OS GUI, the Identity and Access Manager plants a cookie that contains the authentication token. While it is protected with an [`HttpOnly`](https://www.owasp.org/index.php/HttpOnly) flag, users should **Sign Out** at the end of their browser session to clear this cookie.

Note that clearing the cookie does not invalidate the authentication token. If sniffed over an unencrypted connection or extracted from the cookie, someone could use the authentication token to log into DC/OS. To mitigate this risk,  we recommend setting  the [secure flag](https://www.owasp.org/index.php/SecureFlag) on the cookie in `permissive` and `strict` modes, as discussed in [Hardening](/1.10/security/ent/hardening/#secure-flag).

## <a name="passwords"></a>Passwords

Credentials for cluster-local user accounts (those not using LDAP, SAML, or OpenID Connect) consist of a user name and password that can be used to validate, but not reproduce, user passwords. Passwords are individually salted and cryptographically hashed using [crypt(3)](http://man7.org/linux/man-pages/man3/crypt.3.html) SHA-512. This results in one-way hashes that can be used to validate but not reproduce user passwords. To further impede brute force attacks and meet or exceed NIST FIPS security requirements, the hash function performs many iterations using a 128 bit salt length.

Once DC/OS IAM has validated user credentials, an authentication token is returned to the user. The authentication token is then used for further request authentication during the user session. This way the password does not need to be stored in the client and is only sent over the wire immediately after the user enters it. Over the wire, the authentication request is encrypted using TLS. TLS is required and enforced in strict mode, but optional in permissive mode. For more information, see [Security Modes](/1.10/security/ent/#security-modes).

## <a name="service"></a>Service Authentication
Service accounts provide an identity for [services](/1.10/overview/concepts/#dcos-service) to authenticate with DC/OS. Service accounts control communication between services and DC/OS components. DC/OS services may require [service accounts](/1.10/security/ent/service-auth/) depending on your security mode.

## <a name="sysd"></a>Component Authentication
In strict and permissive [security modes](/1.10/security/ent/#security-modes), DC/OS automatically provisions DC/OS components ([systemd services on the DC/OS nodes](/1.10/overview/concepts/#systemd-service)) with service accounts during the bootstrap sequence. Service accounts are not available in disabled security mode.

For example, the Mesos agents are provisioned with service accounts that they use to authenticate to the Mesos master. This ensures that only authorized agents can join the Mesos cluster, advertise resources, and get asked to launch tasks.

You can view the systemd service accounts from the **Organization -> Service Accounts** tab of the DC/OS GUI. These service accounts are prefixed with `dcos_`.

**Important:** Modifying the permissions of any of the automatically provisioned service accounts may cause the service to fail.

# <a name="authorization"></a>Authorization

In addition to authenticating requests, DC/OS also checks the permissions associated with the account to determine whether the requestor is authorized to access the requested resource.

The following diagram describes the authorization sequence.

![Authorization sequence](/1.10/img/authz.png)

The `OPT` sequence in the diagram illustrates how permission enforcement varies by security mode.

- The Admin Router and the Secret Store enforce their permissions in all security modes.

- Metronome and Marathon enforce their permissions in `permissive` and `strict` modes. However, the enforcement in `permissive` mode only occurs if the requestor presents an authentication token, which is optional in `permissive` mode. If an in-cluster requestor does not present an authentication token, Metronome and Marathon will act as if the request was made by a user with the `dcos:superuser` permission.
- The Mesos masters and agents enforce their permissions only in `strict` security mode.

The diagram does not show the Secret Store sequence. The Admin Router does not check the permissions on requests to the Secret Store. It routes these requests to the Secret Store, which enforces its own permissions on each request.

For more information about permissions, refer to [Managing permissions](/1.10/security/ent/perms-reference/).

# <a name="encryption"></a>Transport Layer Security (TLS) Encryption

The encryption of DC/OS communications varies according to your [security mode](/1.10/security/ent/#security-modes).

| Security mode | External communications*                                                                                                                                                                                    | Internode communications |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| Disabled      | Only HTTP is supported. HTTP connections are not redirected to HTTPS or vice versa. HTTPS connections will be rejected because the Admin Router is not configured to serve them. If you log in to DC/OS with a password, the password will be transmitted insecurely between the user agent (e.g. web browser or DC/OS CLI) and Admin Router.         | Unencrypted              |
| Permissive    |  HTTP and HTTPS are supported. HTTP requests to the root path (e.g. `http://example.com/`) are redirected to HTTPS. HTTP requests with a target different than the root path (e.g.  `http://example.com/foo`) are not redirected to HTTPS. If you log in to DC/OS with a password, you can choose whether the password is transmitted insecurely or securely (requires proper certificate verification, including hostname verification on the client side). | Encryption enabled       |
| Strict        | Only HTTPS is supported. All HTTP connections are redirected to HTTPS. If you log in to DC/OS with a password, the password is transmitted securely (requires proper certificate verification, including hostname verification on the client side). If one or more HTTP proxies or load balancers are between the user agent and Admin Router, then the secure password transmission applies to the final communication between Admin Router and the previous proxy or load balancer.  | Encryption enforced**    |

\* *Communications with clients outside of the cluster. For example, browsers and the DC/OS CLI*.

\*\* *Except internode communications between instances of ZooKeeper, which are not encrypted in any security mode. Each master node has a ZooKeeper instance. These ZooKeeper instances communicate periodically to keep their in-memory databases in sync. You can use [IPsec](https://datatracker.ietf.org/wg/ipsec/documents/) to manually encrypt these communications.*.

Not all existing user services support encryption at this time. If the service supports encryption, you can enable it in `permissive` mode. In `strict` mode, encryption of user service communications is enforced. As a result, only user services that support encryption can be deployed in `strict` mode.

Internode communications occur over TLS 1.2. To ensure browser support, external communications currently accept TLS 1.0, 1.1, and 1.2. These settings  are configurable.

For more information, see [Securing communication with TLS](/1.10/security/ent/tls-ssl/).

# <a name="spaces"></a>Spaces

Spaces allow you to:

- [Restrict user access to services and jobs](#serv-job).

- [Restrict service access to secrets](#secrets).

At a minimum, we recommend using spaces to restrict service access to secrets.

## <a name="serv-job"></a>Spaces for Services and Jobs

One aspect of spaces involves service and job groups. You can put services and jobs into groups in any security mode. This can help users find the jobs or services that pertain to them.

In `strict` and `permissive` security modes, you can use [permissions](/1.10/security/ent/perms-reference/#marathon-metronome) to restrict user's access on a per service/job or service/job group basis.

To learn how to do this, see [Controlling user access to services](/1.10/deploying-services/service-groups/) and [Controlling user access to jobs](/1.10/deploying-jobs/job-groups/).

## <a name="secrets"></a>Spaces for Secrets

The secret path controls which services can access it. If you do not specify a path when storing a secret, any service can access it.

Secret paths work in conjunction with service groups to control access. However, you do not need to have service groups to control access to secrets, you can also use the name of the service. The following table provides a few examples to show how it works.

| Secret              | Service                  | Can service access secret? |
|---------------------|--------------------------|----------------------------|
| `group/secret`      | `/marathon-user/service` | No                         |
| `group/secret`      | `/group/hdfs/service`    | Yes                        |
| `group/hdfs/secret` | `/group/spark/service`   | No                         |
| `hdfs/secret`       | `/hdfs`                  | Yes                        |

**Tips:**

- If only a single service requires access to a secret, store the secret in a path that matches the name of the service (e.g. `hdfs/secret`). This prevents it from being accessed by other services.
- Service groups begin with `/`, while secret paths do not.

# Secrets

To secure sensitive values like private keys, API tokens, and database passwords, DC/OS provides:

- [Secure storage and transport](#storage-transport)
- [Fine-grained access controls](#access)

## <a name="storage-transport"></a>Secure Storage and Transport of Secrets

DC/OS stores Secret Store data in ZooKeeper encrypted under an unseal key using the Advanced Encryption Standard (AES) algorithm in Galois Counter Mode (GCM). The Secret Store uses the unseal key to encrypt secrets before sending them to ZooKeeper and to decrypt secrets after receiving them from ZooKeeper. This ensures that secrets are encrypted both at rest and in transit. TLS provides an additional layer of encryption on the secrets in transit from ZooKeeper to the Secret Store.

The unseal key is encrypted under a public GPG key. Requests to the [Secrets API](/1.10/security/ent/secrets/secrets-api/) return only the encrypted unseal key. When the Secret Store becomes sealed, either manually or due to a failure, the private GPG key must be used to decrypt the unseal key and unseal the Secret Store.

As a convenience, DC/OS automatically generates a new 4096-bit GPG keypair during the bootstrap sequence. It uses this keypair to initialize the Secret Store and stores the keypair in ZooKeeper.

The Secret Store is available in all security modes.

By default, you cannot store a secret larger than one megabyte. If you need to exceed this limit, contact Mesosphere support.

We do not support alternate or additional Secret Stores at this time. You should use only the `default` Secret Store provided by Mesosphere.

## <a name="access"></a>Fine-grained Access Control of Secrets

DC/OS allows you to restrict:

- **User access to secrets:** use [permissions](/1.10/security/ent/perms-reference/#secrets) to control which users can access what secrets and what operations they can perform.

- **Application access to secrets:** use [spaces](/1.10//security/ent/#spaces) to control which applications can retrieve what secrets.

# <a name="linux-users"></a>Linux User Accounts

The default Linux user for tasks and sandbox files varies according to your [security mode](/1.10/security/ent/#security-modes) and the [type of container](/1.10/deploying-services/containerizers/) the task runs inside of.

By default, all tasks will run inside of Docker containers. Please see [Deploying a Docker-based Service to Marathon](/1.10/deploying-services/creating-services/deploy-docker-app/) for an example.

The following table identifies the default Linux user in each situation.

| Container type | Disabled                                                               | Permissive                                                             | Strict                                                                     |
|----------------|------------------------------------------------------------------------|------------------------------------------------------------------------|----------------------------------------------------------------------------|
| Mesos (UCR)    | Task runs under `root`. Fetched and created files are owned by `root`. | Task runs under `root`. Fetched and created files are owned by `root`. | Task runs under `nobody`. Fetched and created files are owned by `nobody`. |
| Docker         | Task runs under `root`. Fetched and created files are owned by `root`. | Task runs under `root`. Fetched and created files are owned by `root`. | Task runs under `root`. Fetched and created files are owned by `nobody`.   |

Docker tasks run under `root` by default, but Docker user privileges are confined to the Docker container. Should you wish to change the default task user, modify the Docker container. Please reference the [Docker documentation](https://docs.docker.com/engine/tutorials/dockerimages/) for more information, as well as the user service [documentation](/services/).

**Note:** If the fetched file is compressed, the individual files inside will retain the permissions and ownership assigned when the file was compressed and are unaffected by any other configurations or settings.

See [Overriding the default Linux user](/1.10/security/ent/users-groups/config-linux-user/).
