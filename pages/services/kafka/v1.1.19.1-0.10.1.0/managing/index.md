---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kafka-service -->



# Add a Broker

Increase the `BROKER_COUNT` value via the DC/OS GUI as in any other configuration update.

# Upgrade Software

1.  In the DC/OS GUI, destroy the Kafka scheduler to be updated.

1.  Verify that you no longer see it in the DC/OS GUI.

1.  If you are using the DC/OS Enterprise Edition, create an JSON options file with your latest configuration and set your plan strategy to "STAGE"

        {
            "service": {
                "phase_strategy": "STAGE"
            }
        }


1.  Install the latest version of Kafka:

        dcos package install kafka -—options=options.json


1.  Roll out the new version of Kafka in the same way as a configuration update is rolled out. See Configuration Update Plans.
