---
layout: layout.pug
navigationTitle: Regular user accounts
title: Regular user accounts
excerpt: Managing regular user accounts
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

By default no regular user account exists in DC/OS. The only way to add regular user accounts is via the DC/OS [Identity and Access Management (IAM) API](/1.13/security/oss/iam-api/).

**NOTE**: Currently, regular users cannot log in to DC/OS via the web interface.

# Manage regular user accounts via the IAM API

The DC/OS [IAM API](/1.13/security/oss/iam-api/) allows for managing the full life-cycle of regular user accounts.

## Obtain a DC/OS authentication token

**Prerequisite:**
- [DC/OS CLI](/1.13/cli/)

To interact with the IAM users API, it is required to authenticate first against the DC/OS cluster. This example assumes that a valid DC/OS authentication token has been obtained by logging in first as an [external user](/1.13/security/oss/managing-users/external-users/) via the [DC/OS CLI](/1.13/cli/). The token can then be exported into the environment.

```bash
export TOKEN=$(dcos config show core.dcos_acs_token)
```

## Add regular user accounts via the IAM API

To add a regular user account replace `<username>` and `<password>` with the corresponding values and execute the following command:

```bash
curl -ki -X PUT https://<host-ip>/acs/api/v1/users/<username> -d '{"password": "<password>"}' -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

**NOTE**: Passwords must be at least 5 characters long.

## Update regular user accounts via the IAM API

To add a regular user account replace `<username>` and `<new-password>` with the corresponding values and execute the following command:

```bash
curl -ki -X PATCH https://<host-ip>/acs/api/v1/users/<username> -d '{"password": "<new-password>"}' -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

## Delete regular user accounts via the IAM API

To delete a regular user account replace `<username>` with the corresponding value and execute the following command:

```bash
curl -ki -X DELETE https://<host-ip>/acs/api/v1/users/<username> -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

# Log in regular users via the DC/OS CLI 

**Prerequisite:**
- [DC/OS CLI](/1.13/cli/)


Using the [DC/OS CLI](/1.13/cli/) one can log in as regular DC/OS user by specifying the `dcos-users` login provider.

To log in to the DC/OS CLI, enter the [auth login](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/) command:

```bash
dcos auth login --provider=dcos-users --username=<username> --password=<password>
```

# Switch users 

To switch users, you must log out of the current user and then back in as the new user.

## From the DC/OS CLI

To log out of the DC/OS CLI, enter the command:

```bash
dcos config unset core.dcos_acs_token
Removed [core.dcos_acs_token]
```

You can now log in as another user.
