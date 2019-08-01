---
layout: layout.pug
navigationTitle: Configuring DC/OS access for Beta Mesosphere Jupyter Service
title: Configuring DC/OS access for Beta Mesosphere Jupyter Service 
menuWeight: 5
excerpt: How to use JupyterLab with DC/OS
featureMaturity:
enterprise: false
model: /services/beta-jupyter/data.yml
render: mustache
---

# Prerequisites

Required:

- A running DC/OS 1.11 (or later) cluster with {{ model.install.minNodeCount }} ({{ model.install.nodeDescription }})
- [DC/OS CLI](/mesosphere/dcos/latest/cli/install/) installed
- [Marathon-LB](/mesosphere/dcos/services/marathon-lb/)

# Installing {{ model.techName }}

To install {{ model.techShortName }} for  DC/OS, simply run 

```bash
dcos package install {{ model.packageName }} --options=options.json
```

or install it [via the Universe page](/mesosphere/dcos/latest/gui/catalog/) in our DC/OS UI.

{{ model.techShortName }} requires Marathon-LB and one public agent under which it can be reached. Make sure you specify the public agents `vhost` during installation time.

# Authenticating to your {{ model.techShortName }} instance

You can run multiple installations of {{ model.techShortName }} by changing the `Service Name` during installation. Each instance can have different authentication mechanisms configured.

## Password Authentication

The default {{ model.techShortName }} Notebook password is set to `{{ model.techPassword }}-<Marathon-App-Prefix>`. For example, with Marathon App ID `/foo/bar/app`, it maps to the password: `{{ model.techPassword }}-foo-bar`.

If you are in the main DC/OS space, the password defaults to `{{ model.techPassword }}`.

## Custom Password

You can override the default password under `Environment` in the `Jupyter_Password` field.

## OIDC and Windows Integrated 

You can authenticate with AD FS 4.0 (Windows Server 2016). The OpenID Connect flow will be triggered if both `OIDC_DISCOVERY_URI` and `OIDC_CLIENT_ID` are set, since they are the minimal options.

You can choose to enable OpenID Connect authentication. For (optional) authorization you can specify either an email adress: `OIDC_EMAIL` or User Principal Name (UPN) on Windows: `OIDC_UPN`

See the [installation](/mesosphere/dcos/services/beta-jupyter/installing/) documentation for more in-depth instructions and configuration options.
