---
layout: layout.pug
navigationTitle: Command-line interface (CLI)
title: Edge-LB command-line interface
menuWeight: 82
excerpt: Provides usage and reference information for Edge-LB commands
enterprise: true
---

You can use the Edge-LB command-line interface (CLI) commands and subcommands to configure and manage your Edge-LB load balancer instances from a shell terminal or programmatically.

# Adding the Edge-LB command-line interface package
In most cases, you add the Edge-LB command-line interface (CLI) as part of your initial installation of the Edge-LB API server and Edge-LB pool packages when you are preparing to deploy Edge-LB load balancing. However, one of the key benefits of running containerized services is that they can be placed anywhere in the cluster.

Because you can deploy packages anywhere on the cluster, you might find that you need to install the Edge-LB command-line interface (CLI) on additional computers for other administrators. To simplify access to the Edge-LB command-line programs, you can install the CLI as a separate package by running the following command:

```bash
dcos package install --cli edgelb --yes
```

After the CLI package is installed, you can use the Edge-LB commands to manage Edge-LB load balancer pools and load balancing activity.

# dcos edgelb
Use this command to return information about a specified Edge-LB service instance or as the **parent command** to performing Edge-LB administrative and pool configuration operations from the command-line.

### Usage

```bash
dcos edgelb [options] <command> [<args>]
```

### Options
The following general purpose options can be added to most `dcos edgelb` commands.

| Name, shorthand  | Description |
|------------------|-------------|
| `--help, -h`     | Display usage information. |
| `--verbose, -v`  | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the Edge-LB service instance to query. |

### Permissions
Depending on the operation you want to perform, the Edge-LB service account or user account that manages Edge-LB pools might need specific permissions. For operations that require read access to an Edge-LB pool, the service or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/pools/<pool-name>
```

# dcos edgelb cleanup
Use this command to list and remove all Amazon Web Services (AWS) Elastic Load Balancer (ELB) instances that remain after Edge-LB has been uninstalled from a DC/OS cluster.

### Usage

```bash
dcos edgelb cleanup [options]
```

### Options

| Name, shorthand | Description |
|---------|-------------|
| `--yes` | Remove Elastic Load Balancers without prompting for confirmation. |
| `--apiserver-app-id=APISERVER-APP-ID` | Specify the Marathon application ID of the Edge-LB API server associated with the AWS Elastic Load Balancer. |
| `--pool-name=POOL-NAME` | Edge-LB pool name. You can specify multiple pool names separated by commas (,). |
| `--elb-name=ELB-NAME` | Specify the Elastic Load Balancer name. |
| `--force` | Force the removal of the Elastic Load Balancers. |
| `--help, -h`    | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |

### Permissions
To remove the Elastic Load Balancer framework that was created by Edge-LB when deployed on AWS instances, the Edge-LB service account or user account must have the following permissions:

```
dcos:adminrouter:service:marathon full
dcos:adminrouter:package full
dcos:adminrouter:service:edgelb full
```

### Example
After uninstalling Edge-LB packages, you can use the following command to remove remnants of the Elastic load balancer deployed on AWS instances:

```bash
dcos edgelb cleanup --yes
```

The command returns information similar to the following:

```
cluster_id :3dcbca3e-f810-489b-a36e-f538fcb9d562
  ELB NAME                          CLUSTER ID  APISERVER APP ID  POOL NAME  ORIGINAL ELB NAME
  dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG
1 ELBs will be deleted
Begin to delete ELB dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG
[dcos-edgelb:48744] INFO[2019-04-15T22:53:56.432257+08:00] deleting the listener                         arn=0xc0000a0bc8 src="awslb/awslb.go:1296"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:56.841851+08:00] deleted the listener                          arn=0xc0000a0bc8 src="awslb/awslb.go:1321"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:56.841956+08:00] deleting the target group                     arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:targetgroup/test-hqch2/3e918f45757c33c0" src="awslb/awslb.go:1265"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:57.152635+08:00] deleted the target group                      arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:targetgroup/test-hqch2/3e918f45757c33c0" src="awslb/awslb.go:1288"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:57.455911+08:00] deleting the elastic load balancer            arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:loadbalancer/net/dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG/d69fa56632d59f2f" src="awslb/awslb.go:1237"
[dcos-edgelb:48744] INFO[2019-04-15T22:53:57.967195+08:00] deleted the elastic load balancer             arn="arn:aws:elasticloadbalancing:us-east-1:273854932432:loadbalancer/net/dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG/d69fa56632d59f2f" src="awslb/awslb.go:1258"
Deleted ELB dcos-lb-GxuaBjPhx-Q8ayl-LwW1-HJG
1/1 ELBs are deleted
```

For additional information about deleting Edge-LB pools and uninstalling Edge-LB packages, see [Uninstalling Edge-LB](../../how-to-tasks/uninstalling/).

# dcos edgelb create
Use this command to create a single pool given a pool configuration file written in JSON.

### Usage

```bash
dcos edgelb create <pool-file> [options]
```

### Options

| Name, shorthand | Description    |
|-----------------|----------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--json`  | Show unparsed JSON response. |

### Permissions
To create a new Edge-LB pool, the Edge-LB service account or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/v2/pools full
```

If you are working with the API specification for v1, the permissions required are:

```
dcos:adminrouter:service:edgelb:/v1/loadbalancers
```

### Examples

To deploy the `ping-lb.json` pool configuration file to create the `ping-lb` pool instance, you would run the following command:

```bash
dcos edgelb create ping-lb.json
```

To see detailed logging information when deploying the `ping-lb.json` pool configuration file, you would run the following command:

```bash
dcos edgelb create ping-lb.json --verbose
```

With the `--verbose` option, the command returns information similar to the following:

```bash
Using provided envvar DCOS_ACS_TOKEN for config value core.dcos_acs_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNTY1NjI5NzQ5fQ.fpTMGfpzYQFAC880mCIA7H-THaPWxGQ7VEH8SA62Du8e7S63g5i7NhDeJo3G_CTjytpXNfeCo7n3zV7qod-nIe6WU4xa7ntG385eRwUmUNQ2eqlUjikwNDqhF9crd3EfKHELKA1Cj2sF5BB8ZlrXT_2LShflhdEmDWTB39xDKfk1FjXGGGVYz8WByK0JpYT_d_gjaZUUAGd__oI49J0xe5tPcoJZDMQBbW3ZqiTvAi2494Bdv9kWESXBSdUpA8czChgwR5S3YYOQfxq7q08Ls_eW5ZvDdgWodt3IwK7wBvpkG2jRs-QwJp4uSf29eAU8UOKNHvZD2EpMDVKpIfZJ9g
Using provided envvar DCOS_ACS_TOKEN for config value core.dcos_acs_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNTY1NjI5NzQ5fQ.fpTMGfpzYQFAC880mCIA7H-THaPWxGQ7VEH8SA62Du8e7S63g5i7NhDeJo3G_CTjytpXNfeCo7n3zV7qod-nIe6WU4xa7ntG385eRwUmUNQ2eqlUjikwNDqhF9crd3EfKHELKA1Cj2sF5BB8ZlrXT_2LShflhdEmDWTB39xDKfk1FjXGGGVYz8WByK0JpYT_d_gjaZUUAGd__oI49J0xe5tPcoJZDMQBbW3ZqiTvAi2494Bdv9kWESXBSdUpA8czChgwR5S3YYOQfxq7q08Ls_eW5ZvDdgWodt3IwK7wBvpkG2jRs-QwJp4uSf29eAU8UOKNHvZD2EpMDVKpIfZJ9g
Using provided envvar DCOS_URL for config value core.dcos_url=http://sidebet-elasticloa-1eczlth9vickm-865389251.us-west-2.elb.amazonaws.com
Successfully created ping-lb. Check "dcos edgelb show ping-lb" or "dcos edgelb status ping-lb" for deployment status
```

For more examples of pool configuration files, see [Getting started with Edge-LB](../../getting-started/) and [Tutorials](../../tutorials).

# dcos edgelb delete
Use this command to delete an existing pool and uninstall the deployed load balancers.

### Usage

```bash
dcos edgelb delete <pool-name> [options]
```

### Options

| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |

### Permissions
To delete an existing pool and uninstall the deployed load balancers, the Edge-LB service account or user account must have the following permission for a specified pool:

```
dcos:adminrouter:service:edgelb:/v2/pools/<pool-name> full
```

### Examples
To delete the Edge-LB pool named `pubs-multi-lb`, you would run the following command:

```bash
dcos edgelb delete pubs-multi-lb
```

If the pool name you specified is currently deployed, the command returns information similar to the following:

```bash
Successfully deleted pubs-delete-lb. Check the DC/OS web UI for pool uninstall status.
```

To see detailed logging information when deleting the `pubs-multi-lb` pool file, you would run the following command:

```bash
dcos edgelb delete pubs-multi-lb --verbose
```

# dcos edgelb diagnostic
Use the `dcos edgelb diagnostic` command to collect diagnostic information for Edge-LB pools and package the diagnostics in a support bundle for troubleshooting and analysis.

### Usage

```bash
dcos edgelb diagnostic [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--bundles-dir=BUNDLES-DIR` | Specify the folder under which the diagnostic bundle will be located. You can specify the directory using an absolute or relative path. By default, the current directory is used. |
| `--pool-names=POOL-NAMES` | List pools, separated by commas (,), for which diagnostics data should be collected. For example, pool_name1,pool_name2. By default, all pools are included. |
| `--help, -h`   | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |

### Permissions
To create a diagnostic bundle for Edge-LB pools, the Edge-LB service account or user account must have the following permission for a specified pool:

```
dcos:adminrouter:service:edgelb:/v2/pools full
```

### Examples
To collect diagnostic bundles for all Edge-LB pools, run the following command:

```bash
dcos edgelb diagnostic
```

To collect diagnostic bundles for specific Edge-LB pools, include the pool names in a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb,roma-edge-lb,hk-edgelb
```

This command generates diagnostic bundle with the logs files from the `sf-edgelb`, `roma-edgelb`, and `hk-edgelb` pools pools and saves it in the current working directory.

To collect diagnostic bundles for a specific Edge-LB pool and place the file in a specific directory instead of the current working directory, run a command similar to the following:

```bash
dcos edgelb diagnostic --pool-names=sf-edgelb --bundles-dir=/usr/share/mydiag
```

This command generates a diagnostic bundle for the `sf-edgelb` pool and places the resulting file in the `/usr/share/mydiag` directory on the local computer.

# dcos edgelb endpoints
Use this command to return a list of all endpoints for a pool. You can also use this command to find the internal IP address and ports for a pool.

### Usage

```bash
dcos edgelb endpoints <pool-name> [options]
```

### Options

| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--json`          | Show unparsed JSON response. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb ingresslb

Use this command to return a list of all inbound (ingress) endpoints for a specified load balancing pool.

# Usage

```bash
dcos edgelb ingresslb <pool-name> [options]
```

# Options

| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--json`          | Show unparsed JSON response. |

<!--### Permissions -->

### Examples

To list the load balancing ingress endpoints for the Edge-LB pool named `paris-prod-lb`, you would run the following command:

```bash
dcos edgelb ingresslb paris-prod-lb
```
<!--
The command returns information similar to the following:

```bash
  NAME      APIVERSION  COUNT  ROLE          PORTS
  ping-lb   V2          5      slave_public
  multi-lb  V2          1      slave_public
```
-->

# dcos edgelb lb-config
Use this command to show the running loa balancer configuration associated with the pool. You can view the active load balancer configuration for all load balancers in a pool.

### Usage

```bash
dcos edgelb lb-config <pool-name> [options]
```

### Options

| Name, shorthand   | Description |
|-------------------|-------------|
| `--help, -h`      | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--raw`           | Show unparsed load balancer configuration. |

<!-- ### Permissions -->

### Examples

The following command displays the load balancer configuration settings for the `ping-lb` pool:

```bash
dcos edgelb lb-config ping-lb
```

The command displays the `haproxy` load balancer template with content similar to the following:

```bash
global
  # Do not enable as haproxy works under a supervisor and must not fork into
  # the background:
  # daemon
  log /dev/log local0
  spread-checks 5
  max-spread-checks 15000
  maxconn 50000
  tune.ssl.default-dh-param 2048
  ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:!aNULL:!MD5:!DSS
  ssl-default-bind-options no-sslv3 no-tlsv10 no-tls-tickets
  ssl-default-server-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:!aNULL:!MD5:!DSS
  ssl-default-server-options no-sslv3 no-tlsv10 no-tls-tickets
  # Required to provide seamless reloads. The supervisor config for haproxy
  # adds '-W' option to enable master-worker model:
  stats socket /var/run/haproxy/socket expose-fd listeners
  server-state-file global
  server-state-base /var/state/haproxy/
  lua-load "$LBWORKDIR/haproxy/lua/getpids.lua"
  lua-load "$LBWORKDIR/haproxy/lua/getconfig.lua"
  lua-load "$LBWORKDIR/haproxy/lua/getmaps.lua"
  lua-load "$LBWORKDIR/haproxy/lua/signalmlb.lua"
defaults
  load-server-state-from-file global
  log               global
  retries                   3
  backlog               10000
  maxconn               10000
  timeout connect          3s
  timeout client          30s
  timeout server          30s
  timeout tunnel        3600s
  timeout http-keep-alive  1s
  timeout http-request    15s
  timeout queue           30s
  timeout tarpit          60s
  option            dontlognull
  option            http-server-close
  option            redispatch
  default-server resolve-prefer ipv4
  default-server init-addr last,libc,none
resolvers default_resolvers
  nameserver ns1 198.51.100.1:53
  nameserver ns2 198.51.100.2:53
  nameserver ns3 198.51.100.3:53
  hold valid           2s
  hold other           2s
  hold refused         2s
  hold nx              2s
  hold timeout         2s
  hold valid           2s
listen stats
  bind 0.0.0.0:$HAPROXY_STATS_PORT
  balance
  mode http
  stats enable
  monitor-uri /_haproxy_health_check
  acl getpid path /_haproxy_getpids
  http-request use-service lua.getpids if getpid
  acl getvhostmap path /_haproxy_getvhostmap
  http-request use-service lua.getvhostmap if getvhostmap
  acl getappmap path /_haproxy_getappmap
  http-request use-service lua.getappmap if getappmap
  acl getconfig path /_haproxy_getconfig
  http-request use-service lua.getconfig if getconfig
  acl signalmlbhup path /_mlb_signal/hup
  http-request use-service lua.signalmlbhup if signalmlbhup
  acl signalmlbusr1 path /_mlb_signal/usr1
  http-request use-service lua.signalmlbusr1 if signalmlbusr1
  frontend frontend_0.0.0.0_15001
    bind 0.0.0.0:15001
      mode http
      option httplog
      default_backend ping-backend
  backend ping-backend
    balance roundrobin
      mode http
          option forwardfor
          http-request set-header X-Forwarded-Port %[dst_port]
          http-request add-header X-Forwarded-Proto https if { ssl_fc }
            server agentip_10.0.1.128_10006 10.0.1.128:10006 check
```

# dcos edgelb list
Use this command to return a list of pool configuration names and a summary of all configured pools.

### Usage

```bash
dcos edgelb list [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

### Permissions
To list Edge-LB pool information, the Edge-LB service account or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/config full
```

### Examples

To list basic information about the Edge-LB pools currently deployed, you would run the following command:

```bash
dcos edgelb list
```

The command returns information similar to the following:

```bash
  NAME      APIVERSION  COUNT  ROLE          PORTS
  ping-lb   V2          5      slave_public
  multi-lb  V2          1      slave_public
```

To list detailed Edge-LB pool configuration information for the `sanfrancisco05` Edge-LB pool instance, you would run the following command:

```bash
dcos edgelb list --name sanfrancisco05 --verbose
```

# dcos edgelb ping
Use this command to test the readiness of the Edge-LB API server. A successful result is the string `pong`. This command will return an HTTP error if the API is not yet available.

### Usage

```bash
dcos edgelb ping [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

### Permissions
To test Edge-LB connectivity by sending a `ping` request, the Edge-LB service account or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/ping full
```

### Examples
To test the connection to the Edge-LB API server, run the following command:

```bash
dcos edgelb ping
```

If the connection is successful, the command returns the following:

```bash
pong
```

# dcos edgelb show
Use this command to show the pool definition for a given pool name. If you don't specify a pool name, the command returns information for all pool configurations.

You can also use this command to convert YAML files to their equivalent JSON format. If you have configuration files previously written using YAML, you should use this command to convert the configuration settings to their equivalent JSON format.

### Usage

```bash
dcos edgelb show <pool-name> [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--reference` | Display the configuration reference. |
| `--convert-to-json=<pool-file>` | Converts local YAML file to JSON. |
| `--json` | Show unparsed JSON response. |

<!--### Permissions-->

### Examples
To display the pool definition information for the ping-lb Edge-LB pool, run the following command:

```bash
dcos edgelb show ping-lb
```

The command returns information similar to the following:

```bash
Summary:
  NAME         ping-lb
  APIVERSION   V2
  COUNT        5
  ROLE         slave_public
  CONSTRAINTS  hostname:UNIQUE
  STATSPORT    0

Frontends:
  NAME                    PORT   PROTOCOL
  frontend_0.0.0.0_15001  15001  HTTP

Backends:
  FRONTEND                NAME          PROTOCOL  BALANCE
  frontend_0.0.0.0_15001  ping-backend  HTTP      roundrobin

Marathon Services:
  BACKEND       TYPE     SERVICE  CONTAINER  PORT       CHECK
  ping-backend  AUTO_IP  /ping               pong-port  enabled

Mesos Services:
  BACKEND  TYPE  FRAMEWORK  TASK  PORT  CHECK
```

To convert a YAML configuration file to JSON and output the results to standard output (`stdout`), run the following command:

```bash
dcos edgelb show --convert-to-json=/path/to/yaml
```

# dcos edgelb status
Use this command to return a list of the load balancer task information associated with a pool. For example, you can run this command to return the agent IP address and task ID for a specified Edge-LB pool.

### Usage

```bash
dcos edgelb status <pool-name> [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--task-ids` | Display only the task identifiers. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template create
Use this command to create a custom configuration template for a pool of load balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template create <pool-name> <template-file> [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`   | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

<!-- ### Permissions -->

### Examples
For an example that illustrates creating a customized template, see [Customizing Edge-LB templates](../../tutorials/customizing-templates).

# dcos edgelb template delete
Use this command to revert a custom configuration template to its default value.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template delete <pool-name> [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template show
Use this command to shows the load balancer configuration template for an individual pool. If you don't specify a pool name, the command returns information for the default template.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template show <pool-name> [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

<!-- ### Permissions -->

<!-- ### Examples -->

# dcos edgelb template update
Use this command to update a custom configuration template for a pool of load balancers.

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

### Usage

```bash
dcos edgelb template update <pool-name> <template-file> [options]
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

<!-- ### Permissions -->

### Examples
For an example that illustrates updating a customized template, see [Customizing Edge-LB templates](../../tutorials/customizing-templates).

# dcos edgelb update
Use this command to upload a new pool configuration file to the Edge-LB `apiserver`, updating the running pool of load balancers.

### Usage

```bash
dcos edgelb update [options] <pool-file>
```

### Options

| Name, shorthand       | Description |
|-----------------------|-------------|
| `--help, -h`          | Display usage information. |
| `--verbose, -v`       | Enable additional logging of requests and responses. |
| `--name="<name>"`     | Specify the name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

### Permissions
To update an existing pool, the Edge-LB service account or user account must have the following permissions for a specified pool:

```
dcos:adminrouter:service:edgelb:/v2/pools/<pool-name> full
dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<pool-name> full
```

If you are working with the API specification for v1, the permissions required are:

```
dcos:adminrouter:service:edgelb:/v1/loadbalancers/<pool-name>
dcos:service:marathon:marathon:services:/dcos-edgelb/pools/<pool-name>
```

### Examples

To update the pool configuration settings for an existing Edge-LB pool, you would run a command similar to the following:

```bash
dcos edgelb update <pool-configuration-file>
```

For example, if you want to update a pool to use the `mysampleconfig` pool configuration file:

```bash
dcos edgelb update mysampleconfig
```

# dcos edgelb version
Use this command to display the current Edge-LB version you have installed.

### Usage

```bash
dcos edgelb [options] version
```

### Options

| Name, shorthand | Description |
|-----------------|-------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v`   | Enable additional logging of requests and responses. |
| `--name="<name>"`   | Specify the name of the service instance to query. |

<!-- ### Permissions -->

### Examples

To display version information for the Edge-LB API server and pool if you have an Edge-LB service instance named `edgelb-eu`, you would run the following command:

```bash
dcos edgelb --name="edgelb-eu" version
```

The command returns information similar to the following:

```bash
client = v1.4.0
server = v1.4.0
```