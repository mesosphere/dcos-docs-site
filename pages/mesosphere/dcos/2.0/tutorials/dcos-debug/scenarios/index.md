---
layout: layout.pug
navigationTitle:  Practice Deployment Debugging Scenarios on DC/OS
title: Practice Deployment Debugging Scenarios on DC/OS
excerpt: Tutorial - Practicing some debugging scenarios
render: mustache
model: /mesosphere/dcos/2.0/data.yml
menuWeight: 31
---
#include /mesosphere/dcos/include/tutorial-disclaimer.tmpl

<!-- IV. Hands On Examples Section -->

<a name=hands-on></a>

# Practice Deployment Debugging on DC/OS

In this section, there are three basic debugging scenarios to practice. We encourage you to try to debug these scenarios without the solution before skipping to the solution.

## Prerequisites

- Running [DC/OS cluster](/mesosphere/dcos/2.0/installing/)
    - 4 private agent nodes
    - 1 public agent node
- Configured [DC/OS CLI](/mesosphere/dcos/2.0/cli/install/)

Note that these exercises require a running [DC/OS cluster](/mesosphere/dcos/2.0/installing/) and a configured [DC/OS CLI](/mesosphere/dcos/2.0/cli/install/). We are also using a cluster with 4 private agents and 1 public agent **that has not been running any prior workloads**. Of course then, your results may vary if using an alternative cluster setup.

