---
layout: layout.pug
navigationTitle: How-To Guides
excerpt: Optional operations
title: How-To Guides
menuWeight: 120
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

## Deploying a secure Elastic service

## 1. Specify the name and settings for your Elastic and Kibana services

The names will be used in subsequent commands. If you have an existing Elastic or Kibana configuration JSON file, the values should match.

```bash
service_name="elastic"
kibana_service_name="kibana"
service_account_name="${service_name}-service-account"
secret_name="${service_name}-secret"
virtual_network_enabled=true
transport_encryption_enabled=true
xpack_security_enabled=true
elastic_options_file="elastic.json"
kibana_options_file="kibana.json"
```

HTTPS will be used either if `elasticsearch.xpack_security_enabled` or `service.security.transport_encryption.enabled` is `true`.

```bash
protocol="$([ "${transport_encryption_enabled}" == "true" ] || [ "${xpack_security_enabled}" == "true" ] && echo "https" || echo "http")"
kibana_elasticsearch_tls="$([ "${protocol}" == "https" ] && echo "true" || echo "false")"
```

## 2. Install Enterprise DC/OS CLI

```bash
dcos package install --yes dcos-enterprise-cli
```

## 3. Create keypair

This will create the `elastic.private.pem` and `elastic.public.pem` files. This step is not necessary if you already have a service account set up.

```bash
dcos security org service-accounts keypair elastic.private.pem elastic.public.pem
```

## 4. Create service account

This step is not necessary if you already have a service account set up for the Elastic service.

```bash
dcos security org service-accounts create -p elastic.public.pem -d "${service_name} service account" "${service_account_name}"
```

## 5. Create secret

This step is not necessary if you already have a secret set up for the Elastic service.

```bash
dcos security secrets create-sa-secret elastic.private.pem "${service_account_name}" "${secret_name}"
```

## 6. Grant necessary permissions to the service account

Check the DC/OS [permissions reference documentation](https://docs.d2iq.com/mesosphere/dcos/1.13/security/ent/perms-reference/) if you'd like to set permissions more granularly.

```bash
dcos security org groups add_user superusers "${service_account_name}"
```

## 7. Create Elastic configuration file

This step is not necessary if you already have a configuration file for Elastic, but make sure to verify it on the next step.

```bash
cat <<EOF > "${elastic_options_file}"
{
  "service": {
    "name": "${service_name}",
    "service_account": "${service_account_name}",
    "service_account_secret": "${secret_name}",
    "virtual_network_enabled": ${virtual_network_enabled},
    "virtual_network_name": "dcos",
    "security": {
      "transport_encryption": {
        "enabled": ${transport_encryption_enabled}
      }
    }
  },
  "elasticsearch": {
    "xpack_security_enabled": ${xpack_security_enabled}
  }
}
EOF
```

## 8. The Elastic configuration file should look something like the following

```bash
cat "${elastic_options_file}"
```

```json
{
  "service": {
    "name": "elastic",
    "service_account": "elastic-service-account",
    "service_account_secret": "elastic-secret",
    "virtual_network_enabled": true,
    "virtual_network_name": "dcos",
    "security": {
      "transport_encryption": {
        "enabled": true
      }
    }
  },
  "elasticsearch": {
    "xpack_security_enabled": true
  }
}
```

## 9. Install Elastic with given configuration

```bash
dcos package install --yes elastic --options="${elastic_options_file}"
```

## 10. Wait for all pods to be `RUNNING`

```bash
dcos elastic --name "${service_name}" pod status
```

## 11. Get `master-0-node` task ID and coordinator VIP endpoint

```bash
master_0_task_id="$(dcos elastic --name="${service_name}" pod info master-0 | jq -r '.[0].info.taskId.value')"
master_0_task_dns="$(dcos elastic --name="${service_name}" endpoints master-http | jq -r '.dns[0]')"
coordinator_vip="$(dcos elastic --name="${service_name}" endpoints coordinator-http | jq -r '.vip')"
```

## 12. Set up initial passwords

```bash
dcos task exec "${master_0_task_id}" bash -c "
  set -x
  export JAVA_HOME=\$(ls -d \${MESOS_SANDBOX}/jdk*)
  ELASTICSEARCH_PATH=\$(ls -d \${MESOS_SANDBOX}/elasticsearch-*/)
  \${ELASTICSEARCH_PATH}/bin/elasticsearch-setup-passwords auto --batch --verbose --url ${protocol}://${master_0_task_dns}
" | tee -a elasticsearch_setup_passwords_output.txt
```

## 13. Extract initial credentials

```bash
elastic_password=$(grep 'PASSWORD elastic' elasticsearch_setup_passwords_output.txt | awk -F' = ' '{print $2}' | tail -n1)
kibana_password=$(grep 'PASSWORD kibana' elasticsearch_setup_passwords_output.txt | awk -F' = ' '{print $2}' | tail -n1)
```

## 14. Configure Elastic with initial credentials

```bash
dcos elastic --name "${service_name}" update start --options=<(echo "{
  \"elasticsearch\": {\"health_user_password\": \"${elastic_password}\"}
}")
```

## 15. Wait for the update to `COMPLETE`

```bash
dcos elastic --name "${service_name}" update status
```

## 16. Get `master-0-node` task ID again

After the update completes a new `master-0-node` task will be running. Let's get the task ID for it.

```bash
master_0_task_id="$(dcos elastic --name="${service_name}" pod info master-0 | jq -r '.[0].info.taskId.value')"
```

## 17. Test access with credentials

The Elasticsearch cluster should be available now given that requests include credentials.

```bash
dcos task exec "${master_0_task_id}" \
     /opt/mesosphere/bin/curl -si \
     -u "elastic:${elastic_password}" \
     -H 'Content-type: application/json' \
     "${protocol}://${coordinator_vip}/_cluster/health?pretty"
```

## 18. Create Kibana configuration file

This step is not necessary if you already have a configuration file for Kibana, but make sure to verify it on the next step. It is important that the password setting is configured with the Kibana password returned from the "set up initial passwords" step above.

```bash
cat <<EOF > "${kibana_options_file}"
{
  "service": {
    "name": "${kibana_service_name}"
  },
  "kibana": {
    "elasticsearch_tls": ${kibana_elasticsearch_tls},
    "elasticsearch_url": "${protocol}://${coordinator_vip}",
    "password": "${kibana_password}"
  }
}
EOF
```

## 19. The Kibana configuration file should look something like the following

```bash
cat "${kibana_options_file}"
```

```json
{
  "service": {
    "name": "kibana"
  },
  "kibana": {
    "elasticsearch_tls": true,
    "elasticsearch_url": "https://coordinator.elastic.l4lb.thisdcos.directory:9200",
    "password": "..."
  }
}
```

## 20. Install Kibana with given configuration

```bash
dcos package install kibana --yes --options="${kibana_options_file}"
```

## 21. Wait for Kibana to finish deploying

The following command will output `1` when that happens.

```bash
dcos marathon app show "${kibana_service_name}" | jq -r '.tasksHealthy'
```

## (Optional) Verify the current license

This should be a new Elasticsearch installation, so the cluster will be running under a "basic" license unless it was changed. You might want to [install an actual license](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/update-license.html). In this guide we will start a [trial license](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/start-trial.html).

```bash
dcos task exec "${master_0_task_id}" \
     /opt/mesosphere/bin/curl -si \
     -u "elastic:${elastic_password}" \
     -H 'Content-type: application/json' \
     "${protocol}://${master_0_task_dns}/_xpack/license?pretty"
```

## (Optional) Start trial license

```bash
dcos task exec "${master_0_task_id}" \
     /opt/mesosphere/bin/curl -si \
     -XPOST \
     -u "elastic:${elastic_password}" \
     -H 'Content-type: application/json' \
     "${protocol}://${coordinator_vip}/_xpack/license/start_trial?acknowledge=true&pretty"
```

That's it! Assuming all steps worked, you should have a secure deployment of Elasticsearch and Kibana. From here you can use the [Elasticsearch APIs](https://www.elastic.co/guide/en/elasticsearch/reference/7.3/security-api.html) to change passwords, manage users, permissions and roles.

If you change passwords, don't forget to update the Elastic service with the health-check credentials like it was done in the "Configure Elastic with initial credentials" step.

For more details check out the [Elasticsearch security documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-security.html).

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

**Otherwise**, if you see a `No packages found` message, add a couple of package repositories to your cluster. For information about the current Edge-LB version support and compatibility, see the [Edge-LB documentation](/mesosphere/dcos/services/edge-lb/latest/) and the [Certified packages and DC/OS versions](/mesosphere/dcos/version-policy/#certified-packages-and-dcos-versions/) to compatibility matrix.

Use commands similar to the following to install the Edge-LB packages:

```bash
dcos package repo add edgelb https://downloads.mesosphere.com/edgelb/v1.3.1/assets/stub-universe-edgelb.json

dcos package repo add edgelb-pool https://downloads.mesosphere.com/edgelb-pool/v1.3.1/assets/stub-universe-edgelb-pool.json
```

Now install Edge-LB with:

```bash
dcos package install edgelb
```

For more information about installing and configuring Edge-LB, see the installation instructions in the [Edge-LB documentation](/mesosphere/dcos/services/edge-lb/latest/).
<!-- [Edge-LB installation instructions](/mesosphere/dcos/services/edge-lb/getting-started/installing/). -->

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

It is not a requirement that these match any configuration options related to the actual Kibana service, so you could name them differently.

The pool fields that actually map to the actual Kibana service are under `haproxy.backends`:
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

Again, installation will take a moment. If `TASK_RUNNING` appears in the output of the following command, it means that the pool is up and running.

```bash
dcos edgelb status kibana
```

At this point, Kibana should already be accessible through `http://$public_agent_ip_or_url:80`.

## 3. Accessing Kibana

If you only have one public agent and you know its IP address, it should be easy to access Kibana. If not, there are a few commands that might help.

### Get IP address of public agent running Kibana pool

This step requires that you have SSH access to the DC/OS cluster nodes. Make sure you do before proceeding.

Here we're using the `kibana` pool name in the `dcos edgelb status` command. If you named the pool something else, make sure to use it instead.

```bash
agent_private_ip="$(dcos edgelb status kibana --json | jq -r '.[0].status.containerStatus.networkInfos[0].ipAddresses[0].ipAddress')"
agent_public_ip="$(dcos node ssh --option StrictHostKeyChecking=no --option LogLevel=quiet --master-proxy --private-ip="${agent_private_ip}" "curl -s ifconfig.co")"
```
### Authenticate with Kibana

Now that we have the public agent IP address where the Edge-LB Kibana pool task is running, we should be able to access Kibana.

If Kibana has X-Pack Security enabled, you'll first need to access `http://$public_agent_ip_or_address/login` to authenticate with the Kibana server. Use credentials that are stored in your Elasticsearch cluster.

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
