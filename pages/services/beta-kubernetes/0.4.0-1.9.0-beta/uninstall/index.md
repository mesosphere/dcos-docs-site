---
post_title: Uninstall
menu_order: 30
feature_maturity: ""
enterprise: 'no'
---

<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

1. From the DC/OS CLI, enter `dcos package uninstall --app-id=kubernetes beta-kubernetes`.

For example, to uninstall a Beta Kubernetes instance named `beta-kubernetes-dev`, run:

```shell
dcos package uninstall --app-id=beta-kubernetes-dev beta-kubernetes
```
