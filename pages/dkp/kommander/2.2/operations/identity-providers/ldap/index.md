---
layout: layout.pug
navigationTitle: External LDAP directory
title: External LDAP directory
menuWeight: 30
excerpt: Connect your cluster to an external LDAP directory
beta: false
enterprise: false
---

<!--- markdownlint-disable MD030 --->

## How to connect your cluster to an external LDAP directory

This guide shows you how to configure your DKP cluster so that users can log in with the credentials stored in an external LDAP directory service.

### Step 1: Add LDAP connector

Each LDAP directory is set up in its own specific manner, so these steps are non-trivial. The following example does not cover all possible configurations. Refer to the [Dex LDAP connector reference documentation][dex-ldap-connector] for more details.

The following example configures a DKP cluster to connect to the [Online LDAP Test Server][ldap-test-server].

1.  Create a YAML file (`ldap.yaml`) similar to the following:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: ldap-password
      namespace: kommander
    type: Opaque
    stringData:
      password: password
    ---
    apiVersion: dex.mesosphere.io/v1alpha1
    kind: Connector
    metadata:
      name: ldap
      namespace: kommander
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

    <p class="message--note"><strong>NOTE: </strong> The value for the LDAP connector <code>name</code> parameter (here: <code>LDAP Test</code>) appears on one of the login buttons in the DKP UI. You should choose an expressive name.</p>

    Also note that for demonstration purposes, the configuration shown above uses `insecureNoSSL: true`.

    In production, you should protect LDAP communication with a properly-configured transport layer security (TLS). When using TLS, the admin can add `insecureSkipVerify: true` to `spec.ldap` to skip server certificate verification, if needed.

2.  Run the following command to deploy the LDAP connector.

    ```bash
    kubectl apply -f ldap.yaml
    ```

### Step 2: Log in

1.  Visit `https://<YOUR-CLUSTER-HOST>/token` and initiate a login flow.

1.  On the login page choose the `Log in with <ldap-name>` button.

1.  Enter the LDAP credentials, and log in.

### Troubleshooting

It is likely that the Dex LDAP connector configuration is not quite right from the start. In that case, you need to be able to debug the problem and iterate on it. The Dex log output contains helpful error messages as indicated by the following examples.

#### Errors during Dex startup

If the Dex configuration fragment provided results in an invalid Dex config, Dex does not properly start up. In that case, reviewing the Dex logs will provide error details. Use the following command to retrieve the Dex logs:

```bash
kubectl logs -f dex-66675fcb7c-snxb8  -n kommander
```

You may see an error similar to the following:

```bash
error parse config file /etc/dex/cfg/config.yaml: error unmarshaling JSON: parse connector config: illegal base64 data at input byte 0
```

Another reason for Dex not starting up correctly is that `https://<YOUR-CLUSTER-HOST>/token` throws a 5xx HTTP error response after timing out.

#### Errors upon login

Most problems with the Dex LDAP connector configuration become apparent only after a login attempt. A login failing from misconfiguration will result in an error page showing only `Internal Server Error` and `Login error`. You can then usually find the root cause by reading the Dex log, as shown in the following example:

```bash
kubectl logs -f dex-5d55b6b94b-9pm2d -n kommander
```

You can look for output similar to this example:

```bash
[...]
time="2019-07-29T13:03:57Z" level=error msg="Failed to login user: failed to connect: LDAP Result Code 200 \"Network Error\": dial tcp: lookup freeipa.example.com on 10.255.0.10:53: no such host"
```

Here, the directory's DNS name was misconfigured, which should be easy to address.

A more difficult problem occurs when a login through Dex through LDAP fails because Dex was not able to find the specified user unambiguously in the directory. That could be the result of an invalid LDAP user search configuration. Here's an example error message from the Dex log:

```text
time="2019-07-29T14:21:27Z" level=info msg="performing ldap search cn=users,cn=compat,dc=demo1,dc=freeipa,dc=org sub (&(objectClass=posixAccount)(uid=employee))"
time="2019-07-29T14:21:27Z" level=error msg="Failed to login user: ldap: filter returned multiple (2) results: \"(&(objectClass=posixAccount)(uid=employee))\""
```

Solving problems like this requires you to review the directory structure carefully. (Directory structures can be very different between different LDAP setups.) Then you must carefully assemble a user search configuration matching the directory structure.

Notably, with some directories, it can be hard to distinguish between the cases "properly configured, and user not found" (login fails in an expected way) and "not properly configured, and therefore user not found" (login fails in an unexpected way).

#### Example for successful login

For comparison, here are some sample log lines issued by Dex after successful login:

```text
time="2019-07-29T15:35:51Z" level=info msg="performing ldap search cn=accounts,dc=demo1,dc=freeipa,dc=org sub (&(objectClass=posixAccount)(uid=employee))"
time="2019-07-29T15:35:52Z" level=info msg="username \"employee\" mapped to entry uid=employee,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org"
time="2019-07-29T15:35:52Z" level=info msg="login successful: connector \"ldap\", username=\"\", email=\"employee@demo1.freeipa.org\", groups=[]"
```

[ldap-test-server]: https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/
[dex-ldap-connector]: https://github.com/dexidp/dex/blob/v2.22.0/Documentation/connectors/ldap.md
