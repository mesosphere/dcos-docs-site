---
layout: layout.pug
navigationTitle: Visualization 
title: Grafana and Prometheus Expression Browser 
menuWeight: 90
excerpt: DC/OS Prometheus Service HTTP API Reference
featureMaturity:
enterprise: false
---


# Visualization
  1. DC/OS Grafana
  2. DC/OS Prometheus Expression Browser

### DC/OS Grafana :

  DC/OS Grafana supports prometheus for dashboarding and querying.

### Prerequisite

  1. Install Grafana from either DC/OS catalogue or CLI
  2. Install Prometheus service either from DC/OS catalogue or CLI
  3. Ensure your prometheus service and grafana service are up and running before you proceed further.


### Accessing Grafana and Creating Prometheus Data Source :

### Create a Prometheus data source:

1. Navigate to grafana site with http://<public ip of your cluster >:13000

2. login with default login with "admin" / "admin".

3. Click on the Grafana logo to open the sidebar menu.

4. Click on "Data Sources" in the sidebar.

5. Click on "Add New".

6. Select "Prometheus" as the type.

7. Set the appropriate Prometheus server end point (for example, http://prometheus.prometheus.14lb.thisdcos.directory:9090)

8. Adjust other data source settings as desired (for example, turning the proxy access off).

9. Click "Add" to save the new data source.

### Creating a Prometheus graph

   1.Click on Home -> Dashboard-> New Dashboard -> Panel Title -> Edit , Change the Panel Title , description.

   2.Under the "Metrics" tab, select your Prometheus data source (bottom right).

   3.Enter any Prometheus expression into the "Query" field, while using the "Metric" field to lookup metrics via autocompletion.

   4.To format the legend names of time series, use the "Legend format" input. 

    
### Prometheus Expression Browser :

  The DC/OS Prometheus Service have exppression browser that may be accessed from outside the cluster.

  The expression browser is available at /graph on the Prometheus server, allowing you to enter any expression and see its result either in a table or graphed over time.

  This is primarily useful for ad-hoc queries and debugging, prometheus expression browser would require to be accessed via Edge-LB.
