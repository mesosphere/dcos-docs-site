---
layout: layout.pug
navigationTitle: Command-line interface (CLI)
title: Edge-LB command-line interface
menuWeight: 82
excerpt: Provides usage and reference information for Edge-LB commands
enterprise: true
---

You can use the Edge-LB command-line interface (CLI) commands and subcommands to configure and manage your Edge-LB load balancer instances from a shell terminal or programmatically.

# dcos edgelb
Use this command to return information about a specified Edge-LB service instance or as the **parent command** to performing Edge-LB administrative and pool configuration operations from the command-line.

### Usage

```bash
dcos edgelb [<flags>] [OPTIONS] [<arguments> ...]
```

### Options

| Name, shorthand       | Description |
|----------|-------------|
| `--help, h`   | Display usage information. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the Edge-LB service instance to query. |

### Permissions
Depending on the operation you want to perform, the Edge-LB service account or user account that manages Edge-LB pools might need specific permissions. For operations that require read access to an Edge-LB pool, the service or user account must have the following permission:

<code>
dcos:adminrouter:service:edgelb:/pools/<POOL-NAME>
</code>

# dcos edgelb create
Use this command to create a single pool given a definition file written in JSON or YAML.

### Usage

```bash
dcos edgelb create [<flags>] <pool-file>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json`  | Show unparsed JSON response. |

### Permissions
To create a new Edge-LB pool, the Edge-LB service account or user account must have the following permission:

<code>
dcos:adminrouter:service:edgelb:/v2/pools full
</code>

If you are working with the API specification for v1, the permissions required are:

<code>
dcos:adminrouter:service:edgelb:/v1/loadbalancers
</code>

### Examples

After launching a service and creating a [pool configuration file](/services/edge-lb/reference/pool-configuration-reference), you can use the following command to deploy it:

`dcos edgelb create <pool-configuration-file>`

For example, to create a new Edge-LB pool that uses the customized configuration file `my-edgelb-options`:

`dcos edgelb create my-edge-lb-options`

For additional examples of pool configuration, see [Tutorials](/services/edge-lb/tutorials/).

# dcos edgelb delete
Use this command to delete an existing pool and uninstall the deployed load balancers.

### Usage

```bash
dcos edgelb delete <pool-name>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

### Permissions
To delete an existing pool and uninstall the deployed load balancers, the Edge-LB service account or user account must have the following permission for a specified pool:

`dcos:adminrouter:service:edgelb:/v2/pools/<POOL-NAME> full`

### Examples
To delete an existing Edge-LB pool named `aqua01` and uninstall the deployed load balancer instances for this pool:

`dcos edgelb delete aqua01`

# dcos edgelb endpoints
Use this command to return a list of all endpoints for a pool. You can also use this command to find the internal IP address and ports for a pool.

### Usage

```bash
dcos edgelb endpoints [<flags>] <pool-name>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb lb-config
Use this command to show the running load-balancer config associated with the pool. You can view the active load balancer configuration for all load balancers in a pool.

### Usage

```bash
dcos edgelb lb-config [<flags>] <pool-name>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--raw` | Show unparsed load-balancer config. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb list
Use this command to return a list of pool configuration names and a summary of all configured pools.

### Usage

```bash
dcos edgelb list [<flags>]
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

### Permissions
To list Edge-LB pool information, the Edge-LB service account or user account must have the following permission:

<code>
dcos:adminrouter:service:edgelb:/config full
</code>

### Examples
To list detailed Edge-LB pool configuration information for all Edge-LB pool instances:

`dcos edgelb list --verbose`

To list detailed Edge-LB pool configuration information for the `sanfrancisco05` Edge-LB pool instance:

`dcos edgelb list --name sanfrancisco05 --verbose`

# dcos edgelb ping
Use this command to test the readiness of the Edge-LB API server. A successful result is the string `pong`. This command will return an HTTP error if the API is not yet available.

### Usage

```bash
dcos edgelb ping
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

### Permissions
To test Edge-LB connectivity by sending a `ping` request, the Edge-LB service account or user account must have the following permission:

<code>
dcos:adminrouter:service:edgelb:/ping full
</code>

### Examples
To test the connection to the `sanfrancisco05` Edge-LB pool by sending a `ping` request:

`dcos edgelb ping --name sanfrancisco05`

# dcos edgelb show
Use this command to show the pool definition for a given pool name. If you don't specify a pool name, the command returns information for all pool configurations.

You can also use this command to convert YAML files to their equivalent JSON format. Edge-LB accepts configuration files in either YAML or JSON format. Because the YAML file format is intended for deprecation in favor or JSON format, however, you should use JSON and migrate any previous configuration settings from YAML format to their equivalent JSON format. 

### Usage

```bash
dcos edgelb show [<flags>] [<pool-name>]
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--reference` | Display the configuration reference. |
| `--convert-to-json=<pool-file>` | Converts local YAML file to JSON. |
| `--json` | Show unparsed JSON response. |

<!--### Permissions-->

### Examples
To convert a YAML configuration file to JSON and output the results to standard output (`stdout`), run the following command:

`dcos edgelb show --convert-to-json=/path/to/yaml`

# dcos edgelb status
Use this command to return a list of the load balancer task information associated with a pool. For example, you can run this command to return the agent IP address and task ID for a specified Edge-LB pool. 

### Usage

```bash
dcos edgelb status [<flags>] <pool-name>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--task-ids` | Only Display the task ids. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template create
Use this command to create a custom configuration template for a pool of load balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template create <pool-name> <template-file>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template delete
Use this command to revert a custom configuration template to its default value.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template delete <pool-name>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template show
Use this command to shows the load balancer configuration template for an individual pool. If you don't specify a pool name, the command returns information for the default template.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template show [<pool-name>]
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template update
Use this command to update a custom configuration template for a pool of load balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template update <pool-name> <template-file>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb update
Use this command to upload a new pool configuration file to the Edge-LB `apiserver`, updating the running pool of load balancers.

### Usage

```bash
dcos edgelb update [<flags>] <pool-file>
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

### Permissions
To update an existing pool, the Edge-LB service account or user account must have the following permissions for a specified pool:

<code>
dcos:adminrouter:service:edgelb:/v2/pools/<POOL-NAME> full
dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME> full
</code>

If you are working with the API specification for v1, the permissions required are:

<code>
dcos:adminrouter:service:edgelb:/v1/loadbalancers/<POOL-NAME>
dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<POOL-NAME>
</code>

### Examples

You can update a pool's configuration with the following command:

`dcos edgelb update <pool-configuration-file>`

For example, if you want to update a pool to use the `mysampleconfig` pool configuration file:

`dcos edgelb update mysampleconfig`

# dcos edgelb version
Use this command to display the current Edge-LB version you have installed.

### Usage

```bash
dcos edgelb [<flags>] version
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->
