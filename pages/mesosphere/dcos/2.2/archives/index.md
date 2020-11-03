---
layout: layout.pug
navigationTitle:  DC/OS Documentation Archives
title: DC/OS Documentation Archives
menuWeight: 1000
excerpt: finding older versions of DC/OS documentation
enterprise: false
render: mustache
model: /mesosphere/dcos/2.2/data.yml
---

# Access archived versions of DC/OS documentation 

In accordance with our [version policy](https://docs.d2iq.com/mesosphere/dcos/version-policy/), we regularly archive older, unsupported versions of our DC/OS documentation. At this time, this includes documentation for DC/OS 1.12 and below. You can still access older versions of DC/OS documentation on our [public github repo](https://github.com/mesosphere/dcos-docs-site/tree/archive/pages/mesosphere/dcos), or by locally running a Docker image (experimental):

On your local machine, run:

```
docker run -p 5000:5000 -it mesosphere/archived_docs  
```
After running this command, you will see:

   │   Serving!                                     │
   │                                                │
   │   - Local:            http://0.0.0.0:5000      │

where you can access the documentation for archived versions of DC/OS.