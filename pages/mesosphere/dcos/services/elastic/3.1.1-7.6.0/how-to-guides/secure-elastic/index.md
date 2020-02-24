---
layout: layout.pug
navigationTitle: Secure Elastic services    
excerpt: Deploying secure Elastic services
title: Secure Elastic Services
menuWeight: 10
model: /mesosphere/dcos/services/elastic/data.yml
render: mustache
---

# Deploying a secure {{ model.techName }} service

1. Specify the name and settings for your {{ model.techName }} and Kibana services. The names will be used in subsequent commands. If you have an existing {{ model.techName }} or Kibana configuration JSON file, the values should match.

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

    ```bash
    protocol="$([ "${transport_encryption_enabled}" == "true" ] || [ "${xpack_security_enabled}" == "true" ] && echo "https" || echo "http")"
    kibana_elasticsearch_tls="$([ "${protocol}" == "https" ] && echo "true" || echo "false")"
    ```
    <p class="message--note"><strong>NOTE: </strong>HTTPS will be used either if <tt>elasticsearch.xpack_security_enabled</tt> or <tt>service.security.transport_encryption.enabled</tt> is <tt>true</tt>.</p>

1. Install Enterprise DC/OS CLI

    ```bash
    dcos package install --yes dcos-enterprise-cli
    ```

1. Create keypair. This will create the `elastic.private.pem` and `elastic.public.pem` files. This step is not necessary if you already have a service account set up.

    ```bash
    dcos security org service-accounts keypair elastic.private.pem elastic.public.pem
    ```

1. Create service account. This step is not necessary if you already have a service account set up for the {{ model.techName }} service.

    ```bash
    dcos security org service-accounts create -p elastic.public.pem -d "${service_name} service account" "${service_account_name}"
    ```

1. Create secret. This step is not necessary if you already have a secret set up for the {{ model.techName }} service.

    ```bash
    dcos security secrets create-sa-secret elastic.private.pem "${service_account_name}" "${secret_name}"
    ```

1. Grant necessary permissions to the service account. Check the DC/OS [permissions reference documentation](https://docs.d2iq.com/mesosphere/dcos/1.13/security/ent/perms-reference/) if you'd like to set permissions more granularly.

    ```bash
    dcos security org groups add_user superusers "${service_account_name}"
    ```

1. Create {{ model.techName }} configuration file. This step is not necessary if you already have a configuration file for {{ model.techName }}, but make sure to verify it on the next step.

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

1. The {{ model.techName }} configuration file should look something like the following:

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

1. Install {{ model.techName }} with the given configuration:

    ```bash
    dcos package install --yes elastic --options="${elastic_options_file}"
    ```

1. Wait for all pods to be `RUNNING`.

    ```bash
    dcos elastic --name "${service_name}" pod status
    ```

1. Get `master-0-node` task ID and coordinator VIP endpoint.

    ```bash
    master_0_task_id="$(dcos elastic --name="${service_name}" pod info master-0 | jq -r '.[0].info.taskId.value')"
    master_0_task_dns="$(dcos elastic --name="${service_name}" endpoints master-http | jq -r '.dns[0]')"
    coordinator_vip="$(dcos elastic --name="${service_name}" endpoints coordinator-http | jq -r '.vip')"
    ```

1. Set up initial passwords.

    ```bash
    dcos task exec "${master_0_task_id}" bash -c "
      set -x
      export JAVA_HOME=\$(ls -d \${MESOS_SANDBOX}/jdk*)
      ELASTICSEARCH_PATH=\$(ls -d \${MESOS_SANDBOX}/elasticsearch-*/)
      \${ELASTICSEARCH_PATH}/bin/elasticsearch-setup-passwords auto --batch --verbose --url ${protocol}://${master_0_task_dns}
    " | tee -a elasticsearch_setup_passwords_output.txt
    ```

1. Extract initial credentials.

    ```bash
    elastic_password=$(grep 'PASSWORD elastic' elasticsearch_setup_passwords_output.txt | awk -F' = ' '{print $2}' | tail -n1)
    kibana_password=$(grep 'PASSWORD kibana' elasticsearch_setup_passwords_output.txt | awk -F' = ' '{print $2}' | tail -n1)
    ```

1. Configure {{ model.techName }} with initial credentials.

    ```bash
    dcos elastic --name "${service_name}" update start --options=<(echo "{
      \"elasticsearch\": {\"health_user_password\": \"${elastic_password}\"}
    }")
    ```

1. Wait for the update to complete.

    ```bash
    dcos elastic --name "${service_name}" update status
    ```

1. Get `master-0-node` task ID again. After the update completes, a new `master-0-node` task will be running. Let's get the task ID for it.

    ```bash
    master_0_task_id="$(dcos elastic --name="${service_name}" pod info master-0 | jq -r '.[0].info.taskId.value')"
    ```

1. Test access with credentials. The Elasticsearch cluster should be available now, given that requests include credentials.

    ```bash
    dcos task exec "${master_0_task_id}" \
        /opt/mesosphere/bin/curl -si \
        -u "elastic:${elastic_password}" \
        -H 'Content-type: application/json' \
        "${protocol}://${coordinator_vip}/_cluster/health?pretty"
    ```

1. Create Kibana configuration file. This step is not necessary if you already have a configuration file for Kibana, but make sure to verify it on the next step. It is important that the password setting is configured with the Kibana password returned from the "set up initial passwords" step above.

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

    The Kibana configuration file should look something like the following

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

1. Install Kibana with given configuration:

    ```bash
    dcos package install kibana --yes --options="${kibana_options_file}"
    ```

1. Wait for Kibana to finish deploying. The following command will output `1` when that happens.

    ```bash
    dcos marathon app show "${kibana_service_name}" | jq -r '.tasksHealthy'
    ```

## (Optional) Verify the current license

This should be a new Elasticsearch installation, so the cluster will be running under a "basic" license unless it was changed. You might want to [install an actual license](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/update-license.html). In this guide we will start a [trial license](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/start-trial.html).

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

That's it! Assuming all steps worked, you should have a secure deployment of Elasticsearch and Kibana. From here you can use the [Elasticsearch APIs](https://www.elastic.co/guide/en/elasticsearch/reference/7.6/security-api.html) to change passwords, manage users, permissions and roles.

If you change passwords, don't forget to update the {{ model.techName }} service with the health-check credentials as was done in the "Configure {{ model.techName }} with initial credentials" step.

For more details check out the [Elasticsearch security documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-security.html).


