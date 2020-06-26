---
layout: layout.pug
navigationTitle: External LDAP directory
title: External LDAP directory
menuWeight: 10
excerpt: Connect your Konvoy cluster to an external LDAP directory
enterprise: false
---

## How to connect Konvoy to an external LDAP directory

This guide shows how to configure your Konvoy cluster so that users can log in with the credentials stored in an external LDAP directory service.

### Step 1: add LDAP connector

Each LDAP directory is set up in a specific manner so these steps are non-trivial.
The following example does not cover all possible configurations.
Refer to the Dex LDAP connector reference documentation, available [here][dex-ldap-connector] for more details.

In the following example, we are configuring the Konvoy cluster to connect to the [Online LDAP Test Server][ldap-test-server].

Create a YAML file (`ldap.yaml`) like the following:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ldap-password
  namespace: kubeaddons
type: Opaque
stringData:
  password: password
---
apiVersion: dex.mesosphere.io/v1alpha1
kind: Connector
metadata:
  name: ldap
  namespace: kubeaddons
spec:
  enabled: true
  type: ldap
  displayName: LDAP Test
  ldap:
    host: ldap.forumsys.com:389
    insecureNoSSL: true
    bindDN: cn=read-only-admin,dc=example,dc=com
    bindSecretRef:
      name: ldap-password
    userSearch:
      baseDN: dc=example,dc=com
      filter: "(objectClass=inetOrgPerson)"
      username: uid
      idAttr: uid
      emailAttr: mail
    groupSearch:
      baseDN: dc=example,dc=com
      filter: "(objectClass=groupOfUniqueNames)"
      userAttr: DN
      groupAttr: uniqueMember
      nameAttr: ou
```

<p class="message--note"><strong>NOTE: </strong> The value for the LDAP connector <tt>name</tt> parameter (here: <tt>LDAP Test</tt>) appears on one of the login buttons in the Konvoy user interface. You should choose an expressive name.</p>

Also note that for demoing purposes the configuration shown above uses `insecureNoSSL: true`.
In production, the LDAP communication should be protected with properly configured transport layer security (TLS).
When using TLS, the admin can add `insecureSkipVerify: true` to `spec.ldap` to skip server certificate verification if needed.

Then, run the following command to deploy the LDAP connector.

```bash
kubectl apply -f ldap.yaml
```

### Step 2: log in

Visit `https://<YOUR-CLUSTER-HOST>/token` and initiate a login flow.
On the login page choose the `Log in with <ldap-name>` button.
Enter the LDAP credentials, and log in.

### Debugging help

It is likely that the Dex LDAP connector configuration is not quite right from the start.
In that case you need to be able to debug the problem and iterate on it.
The Dex log output contains helpful error messages as indicated by the following examples.

#### Errors upon Dex startup

If the Dex configuration fragment provided results in an invalid Dex config then Dex does not properly start up.
In that case the Dex logs will provide error details:

```bash
kubectl logs -f dex-kubeaddons-66675fcb7c-snxb8  -n kubeaddons --kubeconfig=admin.conf
error parse config file /etc/dex/cfg/config.yaml: error unmarshaling JSON: parse connector config: illegal base64 data at input byte 0
```

One symptom of Dex not starting up is that `https://<YOUR-CLUSTER-HOST>/token` throws a 5xx HTTP error response after timing out.

#### Errors upon login

Most problems with the Dex LDAP connector configuration will become apparent only upon a login attempt.
A login failing as of misconfiguration will result in an error page showing only `Internal Server Error` and `Login error`.

The root cause can then usually be found by reading the Dex log, as shown in the following example:

```bash
kubectl logs -f dex-kubeaddons-5d55b6b94b-9pm2d  -n kubeaddons --kubeconfig=admin.conf
[...]
time="2019-07-29T13:03:57Z" level=error msg="Failed to login user: failed to connect: LDAP Result Code 200 \"Network Error\": dial tcp: lookup freeipa.example.com on 10.255.0.10:53: no such host"
```

Here, the directory's DNS name was misconfigured and it should be easy to address that problem.

A more difficult problem is when a login through Dex via LDAP fails because Dex was not able to unambiguously find the specified user in the directory.
One reason for that can be an invalid LDAP user search configuration. Example error message in the Dex log:

```text
time="2019-07-29T14:21:27Z" level=info msg="performing ldap search cn=users,cn=compat,dc=demo1,dc=freeipa,dc=org sub (&(objectClass=posixAccount)(uid=employee))"
time="2019-07-29T14:21:27Z" level=error msg="Failed to login user: ldap: filter returned multiple (2) results: \"(&(objectClass=posixAccount)(uid=employee))\""
```

Solving problems like this requires to carefully review the structure of the directory (which can be very different from directory setup to directory setup), and to then carefully assemble a user search configuration matching the directory structure.

Notably, with some directories it can be hard to generally distinguish the cases "properly configured, and user not found" (login fails in an expected way) and "not properly configured, and therefore user not found" (login fails in an unexpected way).

#### Example for successful login

For comparison, these are log lines emitted by Dex upon successful login:

```text
time="2019-07-29T15:35:51Z" level=info msg="performing ldap search cn=accounts,dc=demo1,dc=freeipa,dc=org sub (&(objectClass=posixAccount)(uid=employee))"
time="2019-07-29T15:35:52Z" level=info msg="username \"employee\" mapped to entry uid=employee,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org"
time="2019-07-29T15:35:52Z" level=info msg="login successful: connector \"ldap\", username=\"\", email=\"employee@demo1.freeipa.org\", groups=[]"
```

[ldap-test-server]: https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/
[dex-ldap-connector]: https://github.com/dexidp/dex/blob/master/Documentation/connectors/ldap.md
