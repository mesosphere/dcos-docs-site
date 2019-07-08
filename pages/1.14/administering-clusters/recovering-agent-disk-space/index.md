---
layout: layout.pug
navigationTitle:  Recovering Agent Disk Space
title: Recovering Agent Disk Space
menuWeight: 900
excerpt: Recovering space on an agent node volume
enterprise: false
render: mustache
model: /1.14/data.yml
---

If tasks fill up the reserved volume of an agent node, there are a few options to recover space:

- Check each component's health and restart each component.

- If the work directory is on a separate volume (as recommended in [Agent nodes](/1.14/installing/production/system-requirements/#agent-nodes), then you can empty this volume and restart the agent.

If neither of these approaches work, you may need to re-image the node.
