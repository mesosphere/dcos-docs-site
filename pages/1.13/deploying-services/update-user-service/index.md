---
layout: layout.pug
navigationTitle:  Updating a User-Created Service
title: Updating a User-Created Service
menuWeight: 3
excerpt: Updating the configuration of a deployed app

enterprise: false
---


You can easily view and update the configuration of a deployed app by using the `dcos marathon` command.

The process for updating packages from the [DC/OS Catalog](/1.13/gui/catalog/) is different. For more information, see the [documentation](/1.13/deploying-services/config-universe-service/).

# Update all Environment Variables

Use the `dcos marathon app update` command from the DC/OS CLI to update any aspect of your service's JSON service definition. For instance, follow the instructions below to update the environment variable ([`env` field][1]) of the service definition.

```bash
dcos marathon app update test-app env='{"APISERVER_PORT":"25502"}'
```

This will replace the entire `env` field with the new value specified. Run the command below to see the result of your update:

```bash
dcos marathon app show test-app | jq '.env'
```

## Using a JSON File

The [`env` field][1] can also be updated by specifying a JSON file in a command argument.

1. Save the existing environment variables to a file:

```bash
dcos marathon app show test-app | jq .env >env_vars.json
```

The file will contain the JSON for the `env` field:

```json
{ "SCHEDULER_DRIVER_PORT": "25501", }
```

2. Edit the `env_vars.json` file. Make the JSON a valid object by enclosing the file contents with `{ "env" :}` and add your update:

```json
{ "env" : { "APISERVER_PORT" : "25502", "SCHEDULER_DRIVER_PORT" : "25501" } }
```

3. Specify this CLI command with the JSON file specified:

```bash
dcos marathon app update test-app < env_vars.json
```

4. View the results of your update:

```bash
dcos marathon app show test-app | jq '.env'
```

 [1]: /1.13/cli/
