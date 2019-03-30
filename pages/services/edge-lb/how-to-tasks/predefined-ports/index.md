---
layout: layout.pug
navigationTitle: Exposing tasks using pre-assigned ports
title: Exposing tasks using pre-assigned ports
menuWeight: 30
excerpt: How to expose tasks using a pre-assigned port for Edge-LB load balancing
enterprise: true
---
You can expose tasks for load balancing using a pre-assigned port or by assigning a port dynamically.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Exposing a task without pre-assigned ports

This feature allows you to expose task without a Mesos-assigned port.

Prior to this feature, Edge-LB only exposed task that have ports assigned by mesos. Its not a requirement for Mesos tasks to have port assigned always. By leveraging this feature, when there is no port assigned for task, an operator can specify a port in the pool config to expose that task.