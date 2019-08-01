---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 90
excerpt: Limitations of JupyterLab on the DC/OS platform
featureMaturity:
enterprise: false
model: /mesosphere/dcos/services/beta-jupyter/data.yml
render: mustache
---

# Known Limitations

* Avoid using the host network (i.e., disabling the default CNI support) with OpenID Connect configurations as containers running on the same agent can bypass Authentication and Authorization checks.
* Multiple notebooks exposed via marathon_lb having the same prefix (e.g., jupyter-notebook and jupyter-notebook-user1) might conflict during marathon_lb routing. We recommend using Marathon folders to separate different notebooks into to their own unique namespace, for example, `/jupyter-notebook, /dev/jupyter-notebook` and `/prod/jupyter-notebook`.
