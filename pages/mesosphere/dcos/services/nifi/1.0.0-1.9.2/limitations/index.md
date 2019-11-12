---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration limitations
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/nifi/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl

## Configurations

The “disk” configuration value is denominated in MB. We recommend that you set the configuration value `log_retention_bytes` to a value smaller than the indicated “disk” configuration. See the section on [installing with custom configurations](../configuration/#installing-with-custom-configuration/) for instructions for customizing these values.

## Legacy User Support

Legacy Authorized Users File is not supported.

## LDAP Integration, OpenID Connect and Apache Knox

LDAP integration, OpenID Connect and Apache Knox are not supported.


## Installation Limitations

The minimum memory requirement for DC/OS {{ model.techName }} installation is {{ model.install.minMemory }}. DC/OS {{ model.techName }} installation will take time since the size of DC/OS {{ model.techName }} application is approximately 1.10GB. The approximate installation time required would be around 20~25 minutes for a two node cluster.
