---
layout: layout.pug
title: Provisioning custom services
menuWeight: 100
excerpt: >
  This section details how to configure a
  custom service that requires
  authentication with a service account
  and how to request and refresh its
  token.
featureMaturity: preview
enterprise: 'yes'
navigationTitle:  Provisioning custom services
---





# About custom service authentication

This section details how to configure a custom service that [requires authentication](/docs/1.8/administration/id-and-access-mgt/service-auth/) with a service account and how to request and refresh its token.

1. [Create a key pair.](#create-a-keypair)
1. [Create a service account.](#create-a-service-account)
1. [Provision the service account with the necessary permissions.](#give-perms)
1. [Generate a service login token.](#gen-jwt)
1. [Request an authentication token.](#req-auth-tok)
1. [Pass the authentication token in subsequent requests.](#pass-tok)
1. [Refresh the authentication token.](#refresh-tok)

**Note:** In the following procedures, we will use `service-acct` as the name of the service account, `private-key.pem` as the name of the file containing the private key, and `public-key.pem` as the name of the file containing the public key. Please keep in mind that each file and service account must have a unique name. For this reason, we encourage you to replace the names in this tutorial with more descriptive ones.

**Prerequisites:** 

- If your [security mode](/docs/1.8/administration/installing/custom/configuration-parameters/#security) is `permissive` or `strict`, you must follow the steps in [Obtaining and passing the DC/OS certificate in curl requests](/docs/1.8/administration/tls-ssl/get-cert/) before issuing the curl commands in this section. If your [security mode](/docs/1.8/administration/installing/custom/configuration-parameters/#security) is `disabled`, you must delete `--cacert dcos-ca.crt` from the commands before issuing them.

- The following procedures contain curl commands that use variables set by the DC/OS CLI. You must have the DC/OS CLI installed and be logged into the CLI as a superuser to set the variables and execute these commands successfully.


# <a name="create-a-keypair"></a>Create a key pair


First, you'll need to generate a 2048-bit RSA public-private key pair. While you can use any tool to accomplish this, the Enterprise DC/OS CLI is the most convenient because it returns the keys in the exact format required.

**Prerequisite:** You must have the [DC/OS CLI installed](/docs/1.8/usage/cli/install/).

1.  If you have not already installed the Enterprise DC/OS CLI, use the following command to do so.

    ```bash
    dcos package install dcos-enterprise-cli
    ```

1.  Use the following command to create a public-private key pair and save each value into a separate file within the current directory.

    ```bash
    dcos security org service-accounts keypair private-key.pem public-key.pem
    ```
    
1. Type `ls` to view the two new files created by the command. You may also want to open the files themselves and verify their contents.

   **Important:** Since the private key of this pair will allow someone to authenticate to DC/OS, you should take care to store it in a secure place. You can use the [DC/OS Secret Store](/docs/1.8/administration/secrets/) or another tool of your choice to secure this value. 

1. Continue to the [next section](#create-a-service-account).


# <a name="create-a-service-account"></a>Create a service account

Once you have your public-private key pair, you can create a service account by passing your public key in a `PUT` request to the `users` endpoint of the [IAM API](/docs/1.8/administration/id-and-access-mgt/iam-api/). In this request, you will also assign your service account an ID. A curl sample follows. 

```bash
navigationTitle:  Provisioning custom services
curl -X PUT --cacert dcos-ca.crt $(dcos config show core.dcos_url)/acs/api/v1/users/service-acct -d '{"public_key":"-----BEGIN PUBLIC KEY-----\nMIIBIj...IDAQAB\n-----END PUBLIC KEY-----"}' -H "Content-type: application/json" -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

Continue to the [next section](#give-perms).


# <a name="give-perms"></a>Provision the service account with the necessary permissions

When first testing the service account, we recommend giving it the `docs:superuser` permission. This will allow you to rule out any functional issues that might be caused by incorrect permissions. 

The following curl will give your new service account the `dcos:superuser` permission.

```bash
curl -X PUT --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/acls/dcos:superuser/users/service-acct/full
```

Once you have your service running properly under `dcos:superuser` you should remove the `dcos:superuser` permission and give your service only the permissions that it needs. These permissions will vary according to your [security mode](/docs/1.8/administration/installing/custom/configuration-parameters/#security) and the resources that your service needs to access.

If your service includes a scheduler and you are running in `strict` [security mode](/docs/1.8/administration/installing/custom/configuration-parameters/#security), your service will need **at least** the following. 

- **Scheduler service minimum permissions:** 
     <table>
       <tr>
         <th>Resource</th>
         <th>Action</th>
       </tr>
       <tr>
         <td><code>dcos:mesos:master:framework:role[:<i>role-name</i>]</code>
         </td>
         <td><code>create</code></td>
       </tr>
       <tr>
         <td><code>dcos:mesos:master:task:user[:<i>linux-user-name</i>]</code></td>
         <td><code>create</code></td>
       </tr>
     </table>

- **Additional permissions for scheduler services that need to make reservations:**
     <table>
       <tr>
         <th>Resource</th>
         <th>Action</th>
       </tr>
       <tr>
         <td><code>dcos:mesos:master:reservation:role[:<i>role-name</i>]</code>
         </td>
         <td><code>create</code></td>
       </tr>
       <tr>
         <td><code>dcos:mesos:master:reservation:principal[:<i>service-account-id</i>]</code></td>
         <td><code>delete</code></td>
       </tr>
     </table>

- **Additional permissions for scheduler services that need to use local persistent volumes:**
     <table>
       <tr>
         <th>Resource</th>
         <th>Action</th>
       </tr>
       <tr>
         <td><code>dcos:mesos:master:volume:role[:<i>role-name</i>]</code>
         </td>
         <td><code>create</code></td>
       </tr>
       <tr>
         <td><code>dcos:mesos:master:volume:principal[:<i>service-account-id</i>]</code></td>
         <td><code>delete</code></td>
       </tr>
     </table>

See [Assigning permissions](/docs/1.8/administration/id-and-access-mgt/permissions/assigning-perms/) for information on the mechanics of assigning the permissions. 

Beyond the above, you must review the permissions reference information located in the following sections.

- [Admin Router permissions](/docs/1.8/administration/id-and-access-mgt/permissions/admin-router-perms/)
- [User service permissions](/docs/1.8/administration/id-and-access-mgt/permissions/user-service-perms/)
- [Secret Store service permissions](/docs/1.8/administration/id-and-access-mgt/permissions/secrets-perms/)
- [Mesos master and agent permissions (strict mode only)](/docs/1.8/administration/id-and-access-mgt/permissions/master-agent-perms/)

In addition to studying the reference documentation, review the [logs](/docs/1.8/administration/logging/). After removing the `dcos:superuser` permission, SSH into each master. Replace `<service-account-id>` with the actual ID of your service account and then issue the following command.  

```bash
journalctl -u "dcos-*" |grep "audit" |grep "<service-account-id>" |grep "deny"
```

It will return a list of the audit logs generated when your service was denied access due to insufficient permissions or a bad token. The rejection messages should include the permission that was missing. You may need to repeat this process several times to determine the full list of permissions that your service needs.

If this command does not return the expected results, you may want to try the following. 

```bash
journalctl -u "dcos-*" |grep "audit" |grep "deny"
```

The above command may be necessary in cases where the service account ID could not be derived from the token. 

Continue to the [next section](#gen-jwt).


# <a name="gen-jwt"></a>Generate a service login token

Services must be able to generate service login tokens periodically to refresh their authentication token. 

The payload of the [JSON Web Token (JWT)](https://jwt.io/introduction/) must include your service account ID as the value of `uid`. You can also specify an expiration time as the integer value of `exp` (optional). This value should be a Unix timestamp. By default, the service login token expires in five days. We recommend setting a shorter expiration time on your service login token for more secure operations. The exchange of the service login token for the longer-lived authentication token should not take very long. Once the exchange has occurred, you do not need the service login token anymore. 

[Numerous libraries](https://jwt.io/) exist to generate JWTs. Below, we use the [PyJWT](https://github.com/jpadilla/pyjwt) library for a very simple example in Python. 

```python
import jwt
token = jwt.encode({'uid': 'service-acct'}, 'private-key', algorithm='RS256')
print token
```

While you must supply your private key to the function, the function uses it only to sign the JWT and does not pass it to DC/OS.

You can save the above code snippet in a `py` file and run this from the command line to obtain your token. First, install PyJWT and the cryptography library as follows.

- `pip install PyJWT`
- `pip install cryptography`

Then, replace `private-key` with your private key.

For more information about setting an expiration time for your token using the PyJWT library, reference the [PyJWT documentation](https://pyjwt.readthedocs.io/en/latest/usage.html).

Continue to the [next section](#req-auth-token).


# <a name="req-auth-tok"></a>Request an authentication token

Once the service has generated a service login token, it can pass the service login token in a `POST` request to the `/auth/login` endpoint of the IAM API. The following curl example shows a sample `POST` request.

```bash
curl -X POST --cacert dcos-ca.crt $(dcos config show core.dcos_url)/acs/api/v1/auth/login -d '{"uid":"service-acct","token":"service-login-token"}' -H "Content-type: application/json"
```

After using the public key stored in the service account to check the signature on the JWT, the IAM API passes back an authentication token which your service can use in all subsequent requests.

Continue to the [next section](#pass-tok).


# <a name="pass-tok"></a>Pass the authentication token in subsequent requests

Once the service has gained a valid authentication token, it should pass this value in subsequent requests to DC/OS, Marathon, and Mesos endpoints. These endpoints will expect to find the token in  the `Authorization` field of the HTTP header, as shown below. 

```http
Authorization: token=eyJhb...RceLuv
```

Continue to the [next section](#refresh-tok).


# <a name="refresh-tok"></a>Refreshing the authentication token

By default, authentication tokens expire after five days. Your service will need to renew its token either before or after it expires. The token itself contains the expiration, so your service can use this information to proactively refresh the token. Alternatively, you can wait to get a `401` from DC/OS and then refresh it.

The process for refreshing the token follows.

1. [Generate a service login token](#gen-jwt)
2. [Request an authentication token](#req-auth-tok)







