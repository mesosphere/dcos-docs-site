---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 90
excerpt: Preserving your application in case of termination and relaunch
render: mustache
model: /1.14/data.yml
enterprise: false
---

DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. This section will show you how to create stateful applications to preserve your application in case of termination and relaunch.

<div class="grid">
<a class="grid__item" href="/services/storage/latest/">
<div class="grid__header__wrapper"><h3 class="grid__header">NEW! DC/OS Storage Service</h3></div>
<div class="grid__desc__wrapper"><p class="grid__desc">Announcing the DC/OS Storage Service to manage the volumes, volume profiles, volume providers, and storage devices in the DC/OS cluster. The DSS serves as the brain of the storage support system by collecting storage related information from various components in the cluster, keeping track of their states, and acting on user requests. Click to go to the DC/OS Storage Service section. </p></div>
<div class="grid__link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
</a>
</div>