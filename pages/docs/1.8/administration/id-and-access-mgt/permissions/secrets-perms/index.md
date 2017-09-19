---
layout: layout.pug
title: Secret Store service permissions
menuWeight: 500
excerpt: >
  This topic details the permissions
  enforced by the Secret Store service,
  which control the ability of users to
  create, read, update, and delete secrets
  using either the Secrets API or
  Enterprise DC/OS CLI. The Secret Store
  enforces these in all security modes.
featureMaturity: preview
enterprise: true
navigationTitle:  Secret Store service permissions
---




# About Secret Store service permissions

The Secret Store service permissions control the ability of users to create, read, update, and delete secrets using either the [Secrets API](/docs/1.8/administration/secrets/secrets-api/) or the `dcos security secrets` commands of the [Enterprise DC/OS CLI](/docs/1.8/usage/cli/enterprise-cli/). These permissions are available in all [security modes](/docs/1.8/administration/installing/custom/configuration-parameters/#security).

**Note:** The Secret Store service permissions do not affect access to secrets from the DC/OS web interface. At present, only users with the `dcos:superuser` permission can view or modify secrets from the DC/OS web interface.


<table class="table" STYLE="margin-bottom: 30px;">
  <tr>
    <th>
      Resource
    </th>
    <th>
      Action
    </th>
  </tr>
  <tr>
    <td>
      <code>dcos:secrets:list:default:/[<i>path</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Allows a user to view the names of the secrets within the designated path. At a minimum, you must include <code>dcos:secrets:list:default:/</code>, which allows the user to view the names of all secrets. To restrict the view to just the secrets inside a path, use <code>dcos:secrets:list:default:/<i>path</i></code>. </td>  
  </tr>
</table>


<table class="table" STYLE="margin-bottom: 30px;">
  <tr>
    <th>
      Resource
    </th>
    <th>
      Action
    </th>
  </tr>
  <tr>
    <td>
      <code>dcos:secrets:default:[<i>path-name</i>/]secret-name</code>
    </td>
    <td>
      <code>create</code><code>read</code><code>update</code><code>delete</code><code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Controls a user's ability to access an individual secret. You must specify the name of the secret and the path, if any exists. The degree of access that the user has over the secret depends upon the <code>action</code> value. The <code>full</code> action gives the user all of the available actions.</td>
  </tr>
</table>
