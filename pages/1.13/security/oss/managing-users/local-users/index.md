---
layout: layout.pug
navigationTitle: Local users
title: Local users
excerpt: Managing local DC/OS users
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

By default no local user exists in DC/OS.

# Add local users with the IAM API

Local users can currently only be added via the DC/OS [IAM API](/1.13/security/oss/iam-api/).

The IAM API allows for managing the full local user life-cycle:

- Login
- Create
- Update
- Delete

**NOTE**: Local users can currently not log in to DC/OS via the web interface.


# Log in local users via the DC/OS CLI 

**Prerequisite:**
- [DC/OS Enterprise CLI](/1.13/cli/enterprise-cli/)


Using the [DC/OS CLI](/1.13/cli) one can log in as local DC/OS user by specifying the `dcos-users` login provider.

To log in to the DC/OS CLI, enter the [auth login](/1.13/cli/command-reference/dcos-auth/dcos-auth-login/) command:

```bash
dcos auth login --provider=dcos-users --username=<username> --password=<password>
```

# Switch users 

To switch users, you must log out of the current user and then back in as the new user.

### From the DC/OS CLI

To log out of the DC/OS CLI, enter the command:

```bash
dcos config unset core.dcos_acs_token
Removed [core.dcos_acs_token]
```

You can now log in as another user.
