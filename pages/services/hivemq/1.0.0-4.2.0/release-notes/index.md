---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:
enterprise: false
---

# Version 1.0.0-4.2.0

Initial release. This service provides the following features:

- HiveMQ version 4.2.0
- Rolling upgrade / configuration changes: Uses the recommended upgrade strategy for configuration changes and upgrades
- TLS support: initially supports TLS using a single secret for
  - MQTT listener
  - MQTT WebSocket listener
  - cluster transport
  - control center
- Monitoring integration
