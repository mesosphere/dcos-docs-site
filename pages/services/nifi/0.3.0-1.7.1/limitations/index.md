---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration limitations
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---

#include /services/include/limitations.tmpl

## Configurations

The “disk” configuration value is denominated in MB. We recommend you set the configuration value log_retention_bytes to a value smaller than the indicated “disk” configuration. See the Configuring section for instructions for customizing these values.

## Legacy User Support

Legacy Authorized Users File is not supported.

## LDAP Integration, OpenID Connect and Apache Knox

LDAP integration, OpenID Connect and Apache Knox is not supported.


## Installation Limitations

The minimum memory requirement for DC/OS {{ model.techName }} installation is {{ model.install.minMemory }}. DC/OS {{model.techName }} installation will take time since the DC/OS {{model.techName }} application is approximately 1.10GB. The approximate installation time required would be around 20~25 minutes for a two node cluster.
