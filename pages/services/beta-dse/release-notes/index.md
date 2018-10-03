---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

## Version 1.1.8-5.1.2-beta

### Documentation
[DSE Service Guide 1.1.8-5.1.2](https://gist.github.com/NimaVaziri/7da71cf88a2fda04297de208de311b32)

### Breaking Changes
- Separates OpsCenter into a separate package (therefore upgrading from DSE 1.1.7-5.0.7 is not
supported)

### Improvements
- Updates DSE from 5.0.7 to 5.1.2
- Updates DSE Opscenter from 6.0.8 to 6.1.2
- Updates to [dcos-commons 0.30.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.30.0)
- Update minDcosVersion from 1.8 to 1.9
- Adds support for strict mode
- Adds log level modification for scheduler
- Add log level code to dse-opscenter service
- Adds custom DSE node replace logic
- Adds support for foldered service name
- Allows user to use a separate volume for commit log data
- Exposes additional LDAP options

## Version 1.1.7-5.0.7-beta

* Upgraded dcos-commons to 0.20.1
* Added CNI / virtual network support
* Ability to specify service principal and user
* Reduced dse node mem and heap defaults from 32G/16G to 8G/4G
* Added deploy and recovery plan health checks
* Updated pre-install notes

