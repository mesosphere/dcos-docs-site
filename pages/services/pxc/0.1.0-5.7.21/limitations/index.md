---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt: Understanding configuration limitations
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---

#include /services/include/limitations.tmpl


<!-- ## Configurations


The “disk” configuration value is denominated in MB. We recommend you set the configuration value `log_retention_bytes` to a value smaller than the indicated “disk” configuration. See the Configuring section for instructions for customizing these values.
 -->
## OpenID Connect and Apache Knox

OpenID Connect and Apache Knox are not supported.

## Non-root user based installation not supported

Non-root-user based installation is not supported in the current release.

## Supports manual restore processs

The process to restore PXC service is currently manual.
