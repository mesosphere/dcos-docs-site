---
layout: layout.pug
navigationTitle: Configuring DC/OS access for DC/OS Monitoring Service
title: Configuring DC/OS access for DC/OS Monitoring Service
menuWeight: 20
excerpt: Configuring DC/OS access for DC/OS Monitoring Service
render: mustache
model: ../data.yml
---

The {{ model.techName }} service is run on DC/OS clusters in either `permissive` or `strict` mode. DC/OS access controls must be used to restrict access to the {{ model.techName }} service when running on [strict](/1.13/security/ent/#security-modes) mode clusters. Configure the {{ model.techName }} service to authenticate itself using a certificate and to only grant permissions required by the service.

This page describes how to configure DC/OS access for {{ model.techName }} Service. Depending on your [security mode](/1.13/security/ent/#security-modes/), {{ model.techName }} Service requires [service authentication](/1.13/security/ent/service-auth/) for access to DC/OS.

| Security mode | Service Account |
|---------------|-----------------------|
| Disabled      | Not available   |
| Permissive    | Optional   |
| Strict        | Required |

If you install a service in `permissive` mode and do not specify a service account, Metronome and Marathon will act as if requests from this service is made by an account with the [superuser permission](/1.13/security/ent/perms-reference/#superuser).

**Prerequisites:**

- [DC/OS CLI installed](/1.13/cli/install/) and be logged in as a superuser.
- [Enterprise DC/OS CLI 0.4.14 or later installed](/1.13/cli/enterprise-cli/#ent-cli-install).
- If your [security mode](/1.13/security/ent/#security-modes/) is `permissive` or `strict`, you must [get the root cert](/1.13/security/ent/tls-ssl/get-cert/) before issuing the curl commands in this section.

# Create a Key Pair

In this step, a 2048-bit RSA public-private key pair is created using the Enterprise DC/OS CLI.

Create a public-private key pair and save each value into a separate file within the current directory.

```bash
dcos security org service-accounts keypair <private-key>.pem <public-key>.pem
```

<p class="message--note"><strong>NOTE: </strong>You can use the [DC/OS Secret Store](/1.13/security/ent/secrets/) to secure the key pair.</p>

# Create a Service Account

From a terminal prompt, create a service account named `{{ model.packageName }}-principal` and store its private certificate in a secret named `{{ model.packageName }}/service-private-key` using the following CLI commands.

```bash
dcos security org service-accounts keypair {{ model.packageName }}-private-key.pem {{ model.packageName }}-public-key.pem
dcos security org service-accounts create -p {{ model.packageName }}-public-key.pem -d "{{ model.packageName }} service account" {{ model.packageName }}-principal
dcos security secrets create-sa-secret --strict {{ model.packageName }}-private-key.pem {{ model.packageName }}-principal {{ model.packageName }}/service-private-key
```

# Assign service permissions

Grant `{{ model.packageName }}-principal` the permissions required to run the {{ model.techName }} service using the following commands.

```bash
dcos security org users grant {{ model.packageName }}-principal dcos:adminrouter:ops:ca:rw full
dcos security org users grant {{ model.packageName }}-principal dcos:adminrouter:ops:ca:ro full
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:agent:framework:role:slave_public read
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:slave_public read
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:slave_public/{{ model.packageName }}-role read
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:framework:role:slave_public/{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:reservation:principal:{{ model.packageName }}-principal delete
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:reservation:role:{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:reservation:role:slave_public/{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:task:user:nobody create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:volume:principal:{{ model.packageName }}-principal delete
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:volume:role:{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:mesos:master:volume:role:slave_public/{{ model.packageName }}-role create
dcos security org users grant {{ model.packageName }}-principal dcos:secrets:default:/{{ model.packageName }}/\* full
dcos security org users grant {{ model.packageName }}-principal dcos:secrets:list:default:/{{ model.packageName }} read
```

# Create a Configuration file

Create a custom options file that is used to install {{ model.techName }} service and save the file as (`options.json`).

```json
{
  "service": {
    "service_account": "{{ model.packageName }}-principal",
    "service_account_secret": "{{ model.packageName }}/service-private-key"
  }
}
```

# Install {{ model.techName }} service

Now, install {{ model.techName }} service using the following command.

```bash
dcos package install {{ model.packageName }} --options=options.json
```