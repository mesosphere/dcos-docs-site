---
layout: layout.pug
navigationTitle:
excerpt:
title: How-To Guides
menuWeight: 120
model: /services/elastic/data.yml
render: mustache
---

# Expose Kibana using Edge-LB

## 1. Install Edge-LB

First, check if Edge-LB is available on your DC/OS cluster by running:

```bash
dcos package search edgelb
```

The output should look something like:

```text
$ dcos package search edgelb
NAME         VERSION  SELECTED  FRAMEWORK  DESCRIPTION
edgelb       v1.3.0   True      False      EdgeLB on DC/OS
edgelb-pool  v1.3.0   True      True       EdgeLB Pool on DC/OS
```

If it does, you can skip the `dcos package repo add` commands below.

*Otherwise*, if you see a `No packages found` message you'll need to add a couple of package repositories to your cluster. For information about the current Edge-LB version support and compatibility, see the [Edge-LB documentation](/services/edge-lb/) and the [Certified packages and DC/OS versions](/version-policy/#certified-packages-and-dcos-versions/) to compatibility matrix.

```bash
dcos package repo add edgelb https://<insert download link>/stub-universe-edgelb.json

dcos package repo add edgelb-pool https://<insert download link>/stub-universe-edgelb-pool.json
```

Now install Edge-LB with:

```bash
dcos package install edgelb
```

For more information about installing and configuring Edge-LB, see the installation instructions in the [Edge-LB documentation](/services/edge-lb/).
<!-- [Edge-LB installation instructions](/services/edge-lb/getting-started/installing/). -->

The installation will take a moment. You can determine if Edge-LB is installed and has been deployed successfully by running the following command:

```bash
dcos edgelb --name edgelb ping
```

An output of `pong` means that Edge-LB is ready.

## 2. Create an Edge-LB pool for Kibana

The following command will create an Edge-LB pool task running on one of your DC/OS cluster's public agents, which will allow Kibana to be accessed from outside the cluster network, given that the selected port on the agent machine is open.

In this example, we'll expose a Kibana service named `/production/kibana` through HTTP, on port `80`. It will be accessible on `http://$public_agent_ip_or_url:80`.

Note that in this example:
- the Edge-LB pool that will be created is named `kibana`
- its backend name is `kibana-backend`

It is not a requirement that these match any configuration options related to the actual Kibana service, so one could name them differently.

The pool fields that actually map to the actual Kibana service are under `haproxy.backends`:
- `rewriteHttp.path.fromPath` should match the Kibana Marathon app service path
- `services.endpoint.portName` should match the Kibana Marathon app port name
- `services.marathon.serviceID` should match the Kibana service name

Let's get the remaining configuration parameters that will map the Edge-LB pool to the actual Kibana service. We'll use them in the pool configuration. Make sure to use a different name or port based on your needs.

```bash
kibana_service_name="/production/kibana"
kibana_proxy_port=80
kibana_service_path="/service/${kibana_service_name}"
kibana_port_name="$(dcos marathon app show "${kibana_service_name}" | jq -r '.portDefinitions[0].name')"
```

```bash
echo "{
  \"apiVersion\": \"V2\",
  \"role\": \"slave_public\",
  \"name\": \"kibana\",
  \"count\": 1,
  \"haproxy\": {
    \"stats\": {
      \"bindPort\": 9090
    },
    \"frontends\": [
      {
        \"bindPort\": ${kibana_proxy_port},
        \"linkBackend\": {
          \"defaultBackend\": \"kibana-backend\"
        },
        \"protocol\": \"HTTP\"
      }
    ],
    \"backends\": [
      {
        \"name\": \"kibana-backend\",
        \"protocol\": \"HTTP\",
        \"rewriteHttp\": {
          \"path\": {
            \"fromPath\": \"${kibana_service_path}\",
            \"toPath\": \"/\"
          }
        },
        \"services\": [
          {
            \"marathon\": {
              \"serviceID\": \"${kibana_service_name}\"
            },
            \"endpoint\": {
              \"portName\": \"${kibana_port_name}\"
            }
          }
        ]
      }
    ]
  }
}" > kibana_pool.json
```

Which will end up looking like:

`kibana_pool.json`
```json
{
  "apiVersion": "V2",
  "role": "slave_public",
  "name": "kibana",
  "count": 1,
  "haproxy": {
    "stats": {
      "bindPort": 9090
    },
    "frontends": [
      {
        "bindPort": 80,
        "linkBackend": {
          "defaultBackend": "kibana-backend"
        },
        "protocol": "HTTP"
      }
    ],
    "backends": [
      {
        "name": "kibana-backend",
        "protocol": "HTTP",
        "rewriteHttp": {
          "path": {
            "fromPath": "/service//production/kibana",
            "toPath": "/"
          }
        },
        "services": [
          {
            "marathon": {
              "serviceID": "/production/kibana"
            },
            "endpoint": {
              "portName": "kibana"
            }
          }
        ]
      }
    ]
  }
}
```

Now you can install the Kibana Edge-LB pool with:

```bash
dcos edgelb create kibana_pool.json
```

Again, installation will take a moment. If `TASK_RUNNING` appears in the output of the following command it means that the pool is up and running.

```bash
dcos edgelb status kibana
```

At this point, Kibana should already be accessible through `http://$public_agent_ip_or_url:80`.

## 3. Accessing Kibana

If you only have one public agent and you know its IP address, it should be easy to access Kibana. If not, there's a few commands that might help you out.

### Get IP address of public agent running Kibana pool

This step requires that you have SSH access to the DC/OS cluster nodes. Make sure you do before proceding.

Here we're using the `kibana` pool name in the `dcos edgelb status` command. If you named the pool something else make sure to use it instead.

```bash
agent_private_ip="$(dcos edgelb status kibana --json | jq -r '.[0].status.containerStatus.networkInfos[0].ipAddresses[0].ipAddress')"
agent_public_ip="$(dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --private-ip="${agent_private_ip}" "curl -s ifconfig.co")"
```
### Authenticate with Kibana

Now that we have the public agent IP address where the Edge-LB Kibana pool task is running we should be able to access Kibana.

If Kibana has X-Pack Security enabled you'll first need access `http://$public_agent_ip_or_address/login` to authenticate with the Kibana server. Use credentials that are stored in your Elasticsearch cluster.

```bash
kibana_url="http://${agent_public_ip}"
```

```bash
kibana_login_url="${kibana_url}/login"
```

```bash
command -v xdg-open && xdg-open "${kibana_login_url}" || open "${kibana_login_url}"
```

*After authenticating*, or if Kibana doesn't have X-Pack Security enabled, Kibana should be available at `http://$public_agent_ip_or_url/service/kibana/app/kibana`.

```bash
kibana_authenticated_url="${kibana_url}/service/${kibana_service_name}/app/kibana"
```

```bash
command -v xdg-open && xdg-open "${kibana_authenticated_url}" || open "${kibana_authenticated_url}"
```
