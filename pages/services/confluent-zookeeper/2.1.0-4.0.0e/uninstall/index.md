---
layout: layout.pug
navigationTitle:
excerpt:
title: Uninstall
menuWeight: 30

model: /services/confluent-zookeeper/data.yml
render: mustache
---

<!-- Imported from git@github.com:mesosphere/dcos-zookeeper.git:update-docs -->

<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

### DC/OS 1.10

If you are using DC/OS 1.10 and the installed service has a version greater than 2.0.0-x:

1. Uninstall the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=<instancename> {{ model.packageName }}`.

For example, to uninstall an {{ model.techName }} instance named `{{ model.serviceName }}-dev`, run:

```shell
dcos package uninstall --app-id={{ model.packageName }}-dev {{ model.packageName }}
```

### Older versions

If you are running DC/OS 1.9 or older, or a version of the service that is older than 2.0.0-x, follow these steps:

1. Stop the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=<instancename> {{ model.packageName }}`.
   For example, `dcos package uninstall --app-id={{ model.serviceName }}-dev {{ model.packageName }}`.
1. Clean up remaining reserved resources with the framework cleaner script, `janitor.py`. See the [DC/OS documentation](/latest/deploying-services/uninstall/#framework-cleaner) for more information about the framework cleaner script.

For example, to uninstall an {{ model.techName }} instance named `{{ model.serviceName }}-dev`, run:

```shell
MY_SERVICE_NAME={{ model.serviceName }}-dev
dcos package uninstall --app-id=$MY_SERVICE_NAME {{ model.serviceName }}`.
dcos node ssh --master-proxy --leader "docker run mesosphere/janitor /janitor.py \
    -r $MY_SERVICE_NAME-role \
    -p $MY_SERVICE_NAME-principal \
    -z dcos-service-$MY_SERVICE_NAME"
```

<!-- END DUPLICATE BLOCK -->
