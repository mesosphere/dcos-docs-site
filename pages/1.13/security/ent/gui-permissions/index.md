---
layout: layout.pug
navigationTitle:  Granting Access to the UI
title: Granting Access to the UI
menuWeight: 10
excerpt: Granting access to the DC/OS UI
render: mustache
model: /data.yml
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


By default, a [new user](/1.13/security/ent/users-groups/) has no permissions and cannot view the [DC/OS UI](/1.13/gui/). You must grant users and groups access to each screen of the web interface.

<p class="message--important"><stribg>IMPORTANT: </strong> Only <a href="/1.13/security/ent/perms-reference/#superuser">superusers</a> can view the Dashboard, Nodes, and <strong>Cluster -> Overview</strong> tabs.</p>
