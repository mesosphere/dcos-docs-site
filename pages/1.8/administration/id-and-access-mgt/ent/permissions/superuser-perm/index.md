---
layout: layout.pug
navigationTitle:  Superuser permission
title: Superuser permission
menuWeight: 300
excerpt: >
  This topic discusses the superuser
  permission, which is available in all
  security modes and gives a user full
  rights all across the DC/OS cluster.
beta: true
enterprise: true
---


The `superuser` permission is available in all [security modes](/1.8/administration/installing/ent/custom/configuration-parameters/#security).


<table class="table">
  <tr>
    <th>
      Resource
    </th>
    <th>
      Action
    </th>
    <th>
      Discussion
    </th>
  </tr>
  <tr>
    <td>
      <code>dcos:superuser</code>
    </td>
    <td>
      <code>full</code>
    </td>
    <td>
      Users with the <code>dcos:superuser</code> permission have full access rights across the DC/OS cluster. Members of the <code>superusers</code> group automatically inherit the <code>dcos:superuser</code> permission. During installation, the initial user account is added to the <code>superusers</code> group. At least one user must have the <code>dcos:superuser</code> permission at any given time. <b>Tip:</b> We recommend adding users to the <code>superusers</code> group rather than assigning them the <code>superuser</code> permission. This will make it easier for you to keep track of the users with this permission.
    </td>
  </tr>
</table>
