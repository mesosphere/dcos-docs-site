---
layout: layout.pug
navigationTitle:  Agent Routes
title: Agent Routes
menuWeight: 11
excerpt: Admin Router  running on DC/OS agent nodes.

---
Admin Router Agent runs on DC/OS agent nodes. It exposes the following API routes.

-   Admin Router Agent listens on port `61001` (HTTP).

-   DC/OS Enterprise adds optional SSL encryption of component communication, in which case Admin Router Agent also listens on port `61002` (HTTPS).

For more detail about how API routing works, see [DC/OS API Reference](/1.13/api/).

[ngindox api='/1.12/api/nginx.agent.yaml']
