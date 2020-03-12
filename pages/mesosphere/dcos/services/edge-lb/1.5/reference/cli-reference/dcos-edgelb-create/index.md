---
layout: layout.pug
navigationTitle: dcos edge-lb create
title: dcos edge-lb create
menuWeight: 9
excerpt: Reference for the dcos edge-lb create command
enterprise: true
---

Use this command to create a single pool given a pool configuration file written in JSON.

## Usage

```bash
dcos edgelb create <pool-file> [options]
```

## Options

| Name, shorthand | Description    |
|-----------------|----------------|
| `--help, -h`    | Display usage information. |
| `--verbose, -v` | Enable additional logging of requests and responses. |
| `--name="<name>"` | Specify the name of the service instance to query. |
| `--json`  | Show unparsed JSON response. |

## Permissions
To create a new Edge-LB pool, the Edge-LB service account or user account must have the following permission:

```
dcos:adminrouter:service:edgelb:/v2/pools full
```

If you are working with the API specification for v1, the permissions required are:

```
dcos:adminrouter:service:edgelb:/v1/loadbalancers
```

## Examples
To deploy the `ping-lb.json` pool configuration file to create the `ping-lb` pool instance, you would use the command:

```bash
dcos edgelb create ping-lb.json
```

To see detailed logging information when deploying the `ping-lb.json` pool configuration file, you would use the command:

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
