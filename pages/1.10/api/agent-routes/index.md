---
layout: layout.pug
navigationTitle:  Agent Routes
title: Agent Routes
menuWeight: 11
excerpt:
featureMaturity:
enterprise: false
---

Admin Router Agent runs on DC/OS agent nodes and exposes the following API routes.

Admin Router Agent listens on port `61001` (HTTP).

Enterprise DC/OS adds optional SSL encryption of component communication. So in `strict` and `permissive` security modes, Admin Router Agent also listens on port `61002` (HTTPS).

For more detail about how API routing works, see [DC/OS API Reference](/1.10/api/).

<br/>

[html-include src='/1.10/api/nginx.agent.html' init='NgindoxInit']
