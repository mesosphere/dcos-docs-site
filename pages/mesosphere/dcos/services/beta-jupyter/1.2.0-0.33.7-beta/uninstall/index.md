---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 90
excerpt: Uninstalling JupyterLab
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/beta-jupyter/data.yml
render: mustache
---


# Uninstalling {{ model.techName }}

<p class="message--warning"><strong>WARNING: </strong>If you uninstall your service, any persistent data will be automatically removed from the agent where it was deployed.</p>

If your service name was (for example) `/{{ model.packageName }}-notebook`, use the following commands to shut down and delete your {{ model.techName }} service:

```bash
$ dcos package uninstall {{ model.packageName }} --app-id=/{{ model.packageName  }}-notebook
Uninstalled package [{{ model.packageName }}] version [1.1.1-0.33.4]
Service uninstalled. Note that any persisting data will be automatically removed from the agent where the service was deployed.
```
