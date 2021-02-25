---
layout: layout.pug
navigationTitle: Host Volume 
excerpt: Mounting Host Volume into DC/OS Data Science Engine
title: Host Volume
menuWeight: 7
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
---

This section will guide you to the process of mounting host volume into {{ model.techName }} and also providing User ID or Group ID to match necessary permissions.

# Service Configurations

Assuming that there is a volume on the host `/path/to/data` where your data resides and ownership of this volume is `1000:1000` that means User ID is 1000 and Group ID is also 1000.

**NOTE:** You must decide the User/Group ID while initially installing the service, especially the User ID. You will not be able to change it for a running service.

To mount this volume into the service, configure it as follows:

```json
{
  "storage": {
    "host_path": {
      "enabled": true,
      "container_path": "mydata",
      "path": "/path/to/data"
    }
  },
  "service": {
    "user_id": 1000,
    "group_id": 1000
  }
}
```

This will make `/path/to/data` available at `/mnt/mesos/sandbox/mydata` in the service.
