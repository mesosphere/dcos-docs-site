---
layout: layout.pug
navigationTitle:  Uninstall
title: Uninstall
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---

<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->

### DC/OS 1.10 and above

If you are using DC/OS 1.10 and the installed service has a version greater than 2.0.0-x:

1. Uninstall the service. From the DC/OS CLI, enter `dcos package uninstall --app-id=<instancename> percona-mongo`.

For example, to uninstall a percona-mongo instance named `percona-mongo-dev`, run:

```shell
dcos package uninstall --app-id=percona-mongo-dev percona-mongo
```

<!-- END DUPLICATE BLOCK -->
