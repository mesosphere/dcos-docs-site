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


## Upgrading from 4.1.2 to 5.1.2
  
* The `inter_broker_protocol_version` now defaults to the newer, `2.1`. This has a few implications, as described below:

  - Confluent 4.1.2 supports `inter_broker_protocol_version`: `1.1` maximum, and by default it is set to `1.0`.
  - Confluent 5.1.2 supports `inter_broker_protocol_version`s up to `2.1`. 
  - If you haven't specified a `inter_broker_protocol_version` in your options file, the new default will be used and changed to `2.1`.

To avoid any downtime, during the upgrade, some Kafka nodes will be on Confluent 4.1.2 using `inter_broker_protocol_version` `1.0` and others will be on Kafka 5.1.2 using protocol `2.1`.

To avoid any potential downtime caused by this, change the protocol version used when upgrading Confluent.

- Set up CLI to connect to a soak cluster
- Update your `options_file.json` with the following contents:
  ```
  {
	  ...
	  "kafka": {
		  ...
		  "inter_broker_protocol_version": "1.0"
		  ...
	  }
	  ...
  }
	  ```

- And update your service like so:
 ```
 ~$ dcos package install --cli --yes {{ model.packageName }}
 ~$ dcos {{ model.packageName }} --name={{ model.serviceName }} update start \
	 --package-version=2.6.0-5.1.2 \
	 --options=options_file.json
```
