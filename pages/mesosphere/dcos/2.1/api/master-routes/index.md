---
layout: layout.pug
navigationTitle:  Master Routes
title: Master Routes
menuWeight: 10
excerpt: Admin Router running on DC/OS master nodes
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---
The Admin Router runs on DC/OS master nodes. It exposes the API routes shown below. Admin Router listens on port `80` (HTTP) and `443` (HTTPS).

For more detail about how API routing works, see [DC/OS API Reference](/mesosphere/dcos/2.0/api/).



[ngindox api='/mesosphere/dcos/2.0/api/nginx.master.yaml']
