---
layout: layout.pug
title: Managing permissions
menuWeight: 1
excerpt: ""
featureMaturity: preview
enterprise: 'yes'
navigationTitle:  Managing permissions
---


# About permissions

The permissions of Enterprise DC/OS allow you to control access by resource and sometimes by operation (create, read, update, delete). The number of permissions enforced increases as you move from `disabled` to `permissive` and from `permissive` to `strict` [security modes](/1.8/administration/installing/custom/configuration-parameters/#security). `permissive` security mode provides finer-grained controls and `strict` security mode provides the finest-grained controls. See the following table for details.

<table class="table" STYLE="margin-bottom: 30px;">
  <tr>
    <th>Permission category</th>
    <th>Enforcer</th>
    <th>Enforced in</th>
  </tr>
  <tr>
    <td><a href="/1.8/administration/id-and-access-mgt/permissions/superuser-perm/">Superuser</a></td>
    <td>All</td>
    <td>All security modes</td>
  </tr>
  <tr>
    <td><a href="/1.8/administration/id-and-access-mgt/permissions/admin-router-perms/">Admin Router</a></td>
    <td>Admin Router</td>
    <td>All security modes</td>
  </tr>
  <tr>
    <td><a href="/1.8/administration/id-and-access-mgt/permissions/secrets-perms/">Secret Store service</a></td>
    <td>Secret Store service</td>
    <td>All security modes</td>
  </tr>
  <tr>
    <td><a href="/1.8/administration/id-and-access-mgt/permissions/user-service-perms/">User service</a></td>
    <td>Native Marathon and Metronome</td>
    <td><code>permissive</code> and <code>strict</code> security modes</td>
  </tr>
  <tr>
    <td><a href="/1.8/administration/id-and-access-mgt/permissions/master-agent-perms/">Mesos master and agent</a></td>
    <td>Mesos master and agent</td>
    <td><code>strict</code> security mode</td>
  </tr>

</table>

Permissions can be applied to users and groups using either the DC/OS web interface or the [IAM API](/1.8/administration/id-and-access-mgt/iam-api/).


In addition to complete reference information about all of the possible permissions, this section contains step-by-step instructions for common use cases.

- [How to grant users access to different tabs of the DC/OS web interface](/1.8/administration/id-and-access-mgt/permissions/quickstart/).
- How to restrict user access to [services](/1.8/administration/id-and-access-mgt/permissions/service-groups/) and [jobs](/1.8/administration/id-and-access-mgt/permissions/job-groups/): feature only available in `strict` and `permissive` mode.
- [General procedure for assigning permissions](/1.8/administration/id-and-access-mgt/permissions/assigning-perms/).
- [Step-by-step tutorial for sample use case](/1.8/administration/id-and-access-mgt/restrict-service-access/): tutorial only applies to `permissive` mode.

