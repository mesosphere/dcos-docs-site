---
layout: layout.pug
navigationTitle: Application Metadata
title: Application Metadata
beta: true
menuWeight: 40
excerpt: To display more information about custom applications in the UI, define a metadata.yaml file for each application in the git repository.
---
You can define how custom applications display in the Kommander UI by defining a `metadata.yaml` file for each application in your git repository. You must define this file at `services/<application>/metadata.yaml` for it to process correctly.

You can define the following fields:

| Field       | Default              | Description                                                                                     |
| ----------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| displayName | falls back to App ID | Display name of the application for the UI.                                                     |
| description | ""                   | Short description, should be a sentence or two, displayed in the UI on the application card.    |
| category    | general              | 1 or more categories for this application. Categories are used to group applications in the UI. |
| overview    |                      | Markdown overview used on the application detail page in the UI.                                |
| icon        |                      | Base64 encoded icon SVG file used for application logos in the UI.                              |
| scope       |                      |                                                                                                 |

None of these fields are required for the application to display in the UI.

Here is an example `metadata.yaml` file:

```yaml
displayName: Prometheus Monitoring Stack
description: Stack of applications that collect metrics and provides visualization and alerting capabilities. Includes Prometheus, Prometheus Alertmanager and Grafana.
category:
  - monitoring
overview: >
  # Overview
  A stack of applications that collects metrics and provides visualization and alerting capabilities. Includes Prometheus, Prometheus Alertmanager and Grafana.

  ## Dashboards
  By deploying the Prometheus Monitoring Stack, the following platform applications and their respective dashboards are deployed. After deployment to clusters in a workspace, the dashboards are available to access from a respective cluster's detail page.

  ### Prometheus

  A software application for event monitoring and alerting. It records real-time metrics in a time series database built using a HTTP pull model, with flexible and real-time alerting.

  - [Prometheus Documentation - Overview](https://prometheus.io/docs/introduction/overview/)

  ### Prometheus Alertmanager
  A Prometheus component that enables you to configure and manage alerts sent by the Prometheus server and to route them to notification, paging, and automation systems.

  - [Prometheus Alertmanager Documentation - Overview](https://prometheus.io/docs/alerting/latest/alertmanager/)

  ### Grafana
  A monitoring dashboard from Grafana that can be used to visualize metrics collected by Prometheus.

  - [Grafana Documentation](https://grafana.com/docs/)
icon: PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMDAgMzAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNMTUwIDUwQzk0LjggNTAgNTAgOTQuOCA1MCAxNTBzNDQuOCAxMDAgMTAwIDEwMCAxMDAtNDQuOCAxMDAtMTAwUzIwNS4yIDUwIDE1MCA1MHptMCAxODcuMmMtMTUuNyAwLTI4LjUtMTAuNS0yOC41LTIzLjRoNTYuOWMuMSAxMi45LTEyLjcgMjMuNC0yOC40IDIzLjR6bTQ3LTMxLjJoLTk0di0xN2g5NHYxN3ptLS4zLTI1LjloLTkzLjRjLS4zLS40LS42LS43LS45LTEuMS05LjYtMTEuNy0xMS45LTE3LjgtMTQuMS0yNCAwLS4yIDExLjcgMi40IDIwIDQuMyAwIDAgNC4zIDEgMTAuNSAyLjEtNi03LTkuNi0xNi05LjYtMjUuMSAwLTIwIDE1LjQtMzcuNiA5LjgtNTEuNyA1LjQuNCAxMS4yIDExLjQgMTEuNiAyOC41IDUuNy03LjkgOC4xLTIyLjQgOC4xLTMxLjMgMC05LjIgNi4xLTE5LjkgMTIuMS0yMC4yLTUuNCA4LjkgMS40IDE2LjUgNy40IDM1LjUgMi4zIDcuMSAyIDE5LjEgMy43IDI2LjcuNi0xNS44IDMuMy0zOC44IDEzLjMtNDYuNy00LjQgMTAgLjcgMjIuNSA0LjEgMjguNSA1LjYgOS43IDkgMTcuMSA5IDMxIDAgOS4zLTMuNCAxOC4xLTkuMyAyNSA2LjYtMS4yIDExLjItMi40IDExLjItMi40bDIxLjQtNC4yYy4xIDAtMyAxMi44LTE0LjkgMjUuMXoiIHN0eWxlPSJmaWxsOiNmODQzMTEiLz48L3N2Zz4=

```
