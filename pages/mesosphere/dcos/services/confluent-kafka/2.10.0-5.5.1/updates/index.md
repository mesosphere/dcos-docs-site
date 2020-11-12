---
layout: layout.pug
navigationTitle: Updating 
excerpt: Updating Confluent Kafka
title: Updating Confluent Kafka
menuWeight: 140
model: /mesosphere/dcos/services/confluent-kafka/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/update.tmpl

## Upgrading from Portworx Confluent Kafka
Customers who are using Portworx flavour of Confluent Kafka should follow these steps to migrate and upgrade to DC/OS Confluent Kafka.

1. Take a backup of the configuration of existing running service
```bash
dcos confluent-kafka --name=<name-of-service> describe > options-backup.json
```

2. Uninstall the service either from UI or dcos cli using
```bash
dcos package uninstall --app-id=<service-name> confluent-kafka
```

3. Create a file `confluent-kafka.json` with external volumes options enabled.
```json
{
  "service": {
    "community": false,
      "user": "root"
   },
    "brokers": {
      "external_volume": {
        "enabled": true,
           "volume_name": "kafkaVolume",
           "volume_driver_options": "",
           "volume_path": "kafka-broker-data",
        }
      }
    }
```
<p class="message--important"><strong>IMPORTANT: </strong>Confluent Kafka will be installed with default parameter values. If you have different values in your backup configuration, please include them in the above `confluent-kafka.json` file as well to avoid service config related issues. The service will pick up the existing volumes named `kafkaVolume`. If your volume name is different, please change it in the above config to avoid creating new volumes with provided names.</p>

4. Install the service
```bash
dcos package install confluent-kafka --options=confluent-kafka.json
```

5. Verify all the topics are migrated successfully. 


## Upgrading from 4.1.2 to 5.1.2(or higher)
  
* The `inter_broker_protocol_version` now defaults to the newer, `2.1`. This has a few implications, as described below:

  - Confluent 4.1.2 supports `inter_broker_protocol_version`: `1.1` maximum, and by default it is set to `1.0`.
  - Confluent 5.1.2 supports `inter_broker_protocol_version`s up to `2.1`. 
  - Confluent 5.3.0 supports `inter_broker_protocol_version`s up to `2.3`.
  - Confluent 5.4.0 supports `inter_broker_protocol_version`s up to `2.4`.
  - If you haven't specified a `inter_broker_protocol_version` in your options file, the new default will be used and changed to `2.1`.

To avoid any downtime, during the upgrade, some Kafka nodes will be on Confluent 4.1.2 using `inter_broker_protocol_version` `1.0` and others will be on Kafka 5.1.2 using protocol `2.1`.

To avoid any potential downtime caused by this, change the protocol version used when upgrading Confluent.

1. Set up CLI to connect to a soak cluster.
1. Update your `options_file.json` with the following contents:

	```
	{
		"service": {
			"community": false
		},
		"kafka": {
			...
			"inter_broker_protocol_version": "1.0"
			...
		}
		...
	}
		```

1. And update your service like so:

	```
	~$ dcos package install --cli --yes {{ model.packageName }}
	~$ dcos {{ model.packageName }} --name={{ model.serviceName }} update start \
		--package-version=2.9.1-5.4.0 \
		--options=options_file.json
	```
