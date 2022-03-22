---
layout: layout.pug
navigationTitle: Access Documentation Archives
title: Access Documentation Archives
menuWeight: 1000
excerpt: access older versions of Konvoy documentation
enterprise: false
render: mustache
---
<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->
## Access archived versions of Konvoy documentation

In accordance with our [version policy][policy], we regularly archive older, unsupported versions of our Konvoy documentation. At this time, this includes documentation for Konvoy 1.5 and below. You can still access older versions of Konvoy documentation on our [public GitHub repo][repo], or by locally running a Docker image (experimental):

On your local machine, run:

```docker
docker run -p 5000:5000 -it mesosphere/archived_docs
```

After running this command, you will see:

```sh
   │   Serving!                                     │
   │                                                │
   │   - Local:            http://0.0.0.0:5000      │
```

where you can access the documentation for archived versions of Konvoy.

[policy]: ../version-policy/
[repo]: https://github.com/mesosphere/dcos-docs-site/tree/archive/pages/dkp/konvoy
