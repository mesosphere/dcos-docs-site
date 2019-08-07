---
layout: layout.pug
navigationTitle: Uninstall
excerpt: Deleting your instance of DC/OS Data Science Engine
title: Uninstall
menuWeight: 90
enterprise: true
model: /services/data-science-engine/data.yml
render: mustache
---
To uninstall {{ model.techName }}, run the following command:

```bash
dcos package uninstall --app-id=<app-id> {{ model.packageName }}
```

