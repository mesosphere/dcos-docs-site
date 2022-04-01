---
layout: layout.pug
navigationTitle: Viewing insight items
title: Viewing insight items
excerpt: Viewing and troubleshooting insight items
menuWeight: 30
beta: false
enterprise: false
techPreview: true
---
<p class="message--note"><strong>NOTE: </strong>Insights are refreshed on a 72-hour basis.</p>

Select one of your workspaces to get started viewing your insight items. From a Workspace Dashboard, the Insights table, below the workspace summary cards, displays the most recent Insights. You can toggle the view between Critical, Warning, Notices, and View All for a summary of insights.

For the full DKP Insights dashboard, select Insights from the sidebar menu. From the Insights dashboard, we provide several different ways you can filter the insight items you want to view:

- Use the search dialog to search by description keyword.
- Toggle your view by the following insight types:

  - All types
  - Availability
  - Best Practies
  - Configuration
  - Cost
  - Performance
  - Security
  - Upgrade
  - Environement
- Select All Clusters or an individual cluster.
- Select All Projects or an individual project.
- Toggle between All, Critical, Warning, and Notices.

To clear filters and reset your view all insight items, select Clear All.

Usage tips:

- To flag individual insights as useful, select the thumbs-up icon. This notifys the Insights Engine that you find this type of insight useful and helps customize your expereince over time.
- For an insight item that is not useful, select the vertical 3-dot menu for that insight item and select Snooze. This only snoozes the individual insight; if this issue recurrs, a new insight item displays in the table.
- Under the description and if applicable, we provide you links to Grafana and the Kubernetes Dashboard so that you can dig deeper into the insight item.
