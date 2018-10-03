---
layout: layout.pug
navigationTitle: Visualization
title: Grafana and Prometheus Expression Browser
menuWeight: 45
excerpt: DC/OS Prometheus Service Expression Browser
featureMaturity:
enterprise: false
---


# Visualization
  1. DC/OS Grafana
  2. DC/OS Prometheus Expression Browser

### DC/OS Grafana :

  DC/OS Grafana supports Prometheus for dashboarding and querying.

### Prerequisite

  1. Install Grafana from either the DC/OS catalogue or the CLI.
  1. Install Prometheus service either from the DC/OS catalogue or the CLI.
  1. Ensure that your Prometheus service and Grafana service are up and running before you proceed further.


### Accessing Grafana and Creating Prometheus Data Source:

### Create a Prometheus data source:

1. Navigate to Grafana site with `http://<public ip of your cluster >:13000`

1. Log in with default login "admin" / "admin".

1. Click on the Grafana logo to open the sidebar menu.

1. Click on "Data Sources" in the sidebar.

1. Click on "Add New".

1. Select "Prometheus" as the type.

1. Set the appropriate Prometheus server end point (for example, http://prometheus.prometheus.14lb.thisdcos.directory:9090)

1. Adjust other data source settings as desired (for example, turning the proxy access off).

1. Click "Add" to save the new data source.

### Creating a Prometheus graph

1. Click on **Home -> Dashboard-> New Dashboard -> Panel Title -> Edit**. Change the Panel Title and description.
1. Under the "Metrics" tab, select your Prometheus data source (bottom right).
1. Enter any Prometheus expression into the "Query" field, while using the "Metric" field to lookup metrics via autocompletion.
1. To format the legend names of time series, use the "Legend format" input.

### Prometheus Expression Browser

  The DC/OS Prometheus Service has an expression browser that may be accessed from outside the cluster. The expression browser is available at `/graph` on the Prometheus server, allowing you to enter any expression and see its result, either in a table or graphed over time.

This is primarily useful for ad-hoc queries and debugging. The Prometheus expression browser should be accessed via Edge-LB.
