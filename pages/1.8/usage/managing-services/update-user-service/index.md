---
layout: layout.pug
navigationTitle:  Updating a User-Created Service
title: Updating a User-Created Service
menuWeight: 3
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


The [DC/OS CLI][1] Marathon sub-command allows you to easily view and update the configuration of existing services that you have created.

**Note:** The process for updating packages from the [DC/OS Universe](/1.8/usage/webinterface/#universe) is different. Visit the [Managing Services](/1.8/usage/managing-services/config-universe-service/) section for more information.

## Update an Environment Variable

Use the `dcos marathon app update` command from the DC/OS CLI to update any aspect of your service's JSON service definition. For instance, follow the instructions below to update the environment variable (`env` field) of the service definition.

A single element of the [`env` field][2] can be updated by specifying a JSON string in a command argument.

```bash
dcos marathon app update test-app env='{"APISERVER_PORT":"25502"}'
```

Now, run the command below to see the result of your update:

```bash
dcos marathon app show test-app | jq '.env'
```

## Update all Environment Variables

The entire [`env` field][1] can also be updated by specifying a JSON file in a command argument.

First, save the existing environment variables to a file:

```bash
dcos marathon app show test-app | jq '{env}' > env_vars.json
```

The file will contain the JSON for the `env` field:

```json
{ "env" : { "SCHEDULER_DRIVER_PORT" : "25501" } }
```

Now edit the `env_vars.json` file and add your updated env variables:

```json
{ "env" : { "APISERVER_PORT" : "25502", "SCHEDULER_DRIVER_PORT" : "25501" } }
```

Specify this CLI command with the JSON file specified:

```bash
dcos marathon app update test-app < env_vars.json
```

View the results of your update:

```bash
dcos marathon app show test-app | jq '.env'
```

 [1]: /1.8/usage/cli/
 [2]: https://mesosphere.github.io/marathon/docs/task-environment-vars.html
