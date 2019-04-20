---
layout: layout.pug
navigationTitle:  Edge-LB Permissions
title: Edge-LB Permissions
menuWeight: 50
excerpt:

enterprise: false
---

Service account and user permissions required to use the Edge-LB package.

Edge-LB is installed as a DC/OS service, not as a built-in component. Superuser permissions (`dcos:superuser`) or the user or group permissions listed below are required to use Edge-LB.

# Permission Considerations

- Superuser permissions allow a user to manage all Edge-LB pools. Use this option if you do not need to configure fine-grained access.
- Grant a user or group the permissions below for finer grained access to the Edge-LB pools. Using this method, you can restrict service accounts to have access to pools you specify.

# Install Permissions

In order to install Edge-LB, the user must have the following permissions:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:adminrouter:service:marathon`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`

# Service Account Permissions

In order for Edge-LB to operate, it must be configured to use a [service account](/services/edge-lb/0.1/installing/#create-a-service-account/) with the following permissions:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:marathon`
- `dcos:service:marathon:marathon:services:/dcos-edgelb`
- `dcos:adminrouter:service:dcos-edgelb/pools`
- `dcos:service:marathon:marathon:services:/dcos-edgelb/pools`

# Multitenant Usage Permissions

To grant limited permission to manage only a single Edge-LB pool, the user must have the following permissions:

- `dcos:adminrouter:package`
- `dcos:adminrouter:service:edgelb`
- `dcos:adminrouter:service:marathon`
- `dcos:adminrouter:service:dcos-edgelb/pools/<pool-name>`
- `dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<pool-name>`
