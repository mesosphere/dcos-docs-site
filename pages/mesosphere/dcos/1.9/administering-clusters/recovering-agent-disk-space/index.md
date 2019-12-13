---
layout: layout.pug
navigationTitle:  Recovering Agent Disk Space
excerpt:
title: Recovering Agent Disk Space
menuWeight: 900
---

If tasks fill up the reserved volume of an agent node, there are a few options to recover space:

- Check each component's healthiness and restart each component.

- If the work directory is on a separate volume (as recommended in [Agent nodes](/mesosphere/dcos/1.9/installing/ent/custom/system-requirements/#agent-nodes)), then you can empty this volume and restart the agent.

If neither of these approaches work, you may need to re-image the node. 
