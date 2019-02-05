---
layout: layout.pug
title: Problems
navigationTitle:  Problems
excerpt: Tutorial - Troubleshooting issues on DC/OS deployments
menuWeight: 1
---

<!-- I. Problems Section -->
#include /include/tutorial-disclaimer.tmpl

<a name="problems"></a>

# Problems with Application Deployment

Some of the problems that may need troubleshooting on DC/OS include applications:

- Not deploying at all
- Deploying very slowly
- Deploying but do not start correctly (or behave incorrectly)
- Restarting repeatedly
- Not being reachable inside (or outside) of the DC/OS cluster

DC/OS consists of [a number of different components](https://docs.mesosphere.com/1.12/overview/architecture/components/) - most notably [Apache Mesos](http://mesos.apache.org/) and [Marathon](https://mesosphere.github.io/marathon/). As any of these components could be involved in the issue you are encountering, it can be difficult to even locate the component causing your issue. Accordingly, this tutorial aims to cover several types of such issues.

Of course, there are a several other categories of problems that can affect your cluster besides application-related failures; networking problems, DC/OS installation issues, and DC/OS internal configuration issues could each be causing issues on your cluster. Although these are out of scope for this tutorial, we encourage you to reach out via our [Community channels](https://dcos.io/community/) with ideas and feedback.
