---
layout: layout.pug
navigationTitle:  Mesos master and agent permissions
title: Mesos master and agent permissions
menuWeight: 700
excerpt: >
  This topic details the permissions
  enforced by the Mesos master and Mesos
  agent. They enforce these permissions
  only in strict security mode.
preview: true
enterprise: true
---


# About Mesos master and agent permissions

The Mesos master and agent permissions provide very fine-grained controls and are available only in the `strict` [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security). In any other security mode, these permissions will be ignored. 


# Master permissions

The master permissions protect objects and data accessible from the Mesos master nodes.

<a name="master-endpoint"></a>
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
      <code>dcos:mesos:master:endpoint:path[:<i>path</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Grants a user permission to access particular <a href="http://mesos.apache.org/documentation/latest/authorization/">Mesos endpoints</a> that are not otherwise protected. The full list follows:<br/>
    &#x25cf; <b>/logging/toggle</b><br/>
    &#x25cf; <b>/metrics/snapshot</b><br/>
    &#x25cf; <b>/files/debug</b>
    </td>
  </tr>
</table>

<a name="master-executor"></a>
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
      <code>dcos:mesos:master:executor:app_id[:<i>service-or-job-group</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a user permission to view information about executors running in any service/job group or within a specified service/job group. See the <a href="https://mesos.apache.org/documentation/latest/app-framework-development-guide/">Apache Mesos documentation</a> for more information about executors.<br/>
    <b>Important:</b> When referencing a job group in a user service permission, you use <code>.</code> as a separator and do not include a prefatory separator. To reference a job group in a Mesos permission, you must use <code>/</code> as a separator and include a prefatory separator.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:executor:app_id</code> can view information about executors running in any service or job group.<br/>
    &#x25cf; <code>dcos:mesos:master:executor:app_id:/dev/tweeter</code> can view information about executors running in the <code>/dev/tweeter</code> job/service group or any of its subdirectories.</td>
  </tr>
</table>

<a name="master-flags"></a>
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
      <code>dcos:mesos:master:flags</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to view every master's flag configuration. See the <a href="https://mesos.apache.org/documentation/latest/endpoints/master/flags/">Apache Mesos documentation</a> for more information.
    </td>
  </tr>
</table>

<a name="master-framework-princ"></a>
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
      <code>dcos:mesos:master:framework:principal[:<i>service_account_id</i>]</code>
    </td>
    <td>
      <code>delete</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a user permission to <a href="http://mesos.apache.org/documentation/latest/endpoints/master/teardown/">tear down</a> a framework that was registered under the specified service account ID. This may be necessary in situations where the framework fails to clean up after itself, such as after an irrecoverable scheduler crash.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:framework:principal</code> can tear down frameworks registered under any service account ID.<br/>
    &#x25cf; <code>dcos:mesos:master:framework:principal:my_service</code> can tear down a framework that registered using the <code>my_service</code> service account ID.</td>
  </tr>
</table> 

<a name="master-framework-role"></a>
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
      <code>dcos:mesos:master:framework:role[:<i>role_name</i>]</code>
    </td>
    <td>
      <code>create</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a service account permission to register as a Mesos framework (called a 'scheduler service' in DC/OS) with a specific Mesos role or with any role. See the <a href="http://mesos.apache.org/documentation/latest/roles/">Apache Mesos documentation</a> for more information about roles.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:framework:role</code> can register with any role.<br/>
    &#x25cf; <code>dcos:mesos:master:framework:role:*</code> can register with Mesos default role.<br/>
    &#x25cf; <code>dcos:mesos:master:framework:role:hdfs</code> can register a service under the <code>hdfs</code> role.
    </td>
  </tr>
</table>

<a name="master-log"></a>
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
      <code>dcos:mesos:master:log</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a user permission to read or download the Mesos master log. See the <a href="https://mesos.apache.org/documentation/latest/logging/">Apache Mesos documentation</a> for more information.</td>
  </tr>
</table>

<a name="master-quota"></a>
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
      <code>dcos:mesos:master:quota:role[:<i>role_name</i>]</code>
    </td>
    <td>
      <code>read</code> <code>update</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a user permission to read or update the resource quota for a specific Mesos role or any role. See the <a href="http://mesos.apache.org/documentation/latest/quota/">Apache Mesos documentation</a> for more information about quotas.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:quota:role</code> can read or update the resource quota of any role.<br/>
    &#x25cf; <code>dcos:mesos:master:quota:role:kafka</code> can read or update the resource quota of the service registered with the <code>kafka</code> role.
    </td>
  </tr>
</table>

<a name="master-reservation-princ"></a>
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
      <code>dcos:mesos:master:reservation:principal[:<i>service_account_id</i>]</code>
    </td>
    <td>
      <code>delete</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Grants a user or service account permission to unreserve resources that were reserved by the given principal, i.e., service account. This may be necessary in situations where the framework fails to clean up after itself, such as after an irrecoverable scheduler crash. See the <a href="http://mesos.apache.org/documentation/latest/reservation/">Apache Mesos documentation</a> for more information about reservations.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:reservation:principal</code> can unreserve resources reserved by any principal, i.e., service account.<br/>
    &#x25cf; <code>dcos:mesos:master:reservation:principal:my_service</code> can unreserve resources reserved by the <code>my_service</code> principal, i.e., service account.
    </td>
  </tr>
</table>

<a name="master-reservation-role"></a>
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
      <code>dcos:mesos:master:reservation:role[:<i>role_name</i>]</code>
    </td>
    <td>
      <code>create</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Grants a user or service account permission to create a reservation for the given Mesos role. See the <a href="http://mesos.apache.org/documentation/latest/reservation/">Apache Mesos documentation</a> for more information about reservations.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:reservation:role</code> can create a reservation for any role.<br/>
    &#x25cf; <code>dcos:mesos:master:reservation:role:cassandra</code> can create a reservation for a service registered with the <code>cassandra</code> role.
    </td>
  </tr>
</table>

<a name="master-task-appid"></a>
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
      <code>dcos:mesos:master:task:app_id[:<i>service-or-job-group</i>]</code>
    </td>
    <td>
      <code>create</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Grants a service account permission to execute tasks in any service/job group or within a specified service/job group.<br/>
    <b>Important:</b> When referencing a job group in a user service permission, you use <code>.</code> as a separator and do not include a prefatory separator. To reference a job group in a Mesos permission, you must use <code>/</code> as a separator and include a prefatory separator.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:task:app_id</code> can execute tasks in any service or job group.<br/>
    &#x25cf; <code>dcos:mesos:master:task:app_id:/dev/tweeter</code> can execute tasks in the <code>/dev/tweeter</code> job/service group or any of its subdirectories.
    </td>
  </tr>
</table>

<a name="master-task-user"></a>
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
      <code>dcos:mesos:master:task:user[:<i>linux_user_name</i>]</code>
    </td>
    <td>
      <code>create</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a service account permission to run tasks as a specified Linux user. See the following for some examples:<br/>
      &#x25cf; <code>dcos:mesos:master:task:user</code> can run tasks as any Linux user.<br/>
      &#x25cf; <code>dcos:mesos:master:task:user:root</code> can run tasks as the <code>root</code> Linux user.
    </td>
  </tr>
</table>
    
<a name="master-vol-princ"></a>
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
      <code>dcos:mesos:master:volume:principal[:<i>service_account_id</i>]</code>
    </td>
    <td>
      <code>delete</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a user or service account permission to destroy a volume. You can optionally specify the ID of the service account used to create the volume to restrict this permission further. This may be necessary in situations where the framework fails to clean up after itself, such as after an irrecoverable scheduler crash.<br/>
    Examples:<br/>
    &#x25cf; <code>dcos:mesos:master:volume:principal</code> can destroy a volume created by any service or user.<br/>
    &#x25cf; <code>dcos:mesos:master:volume:principal:my_service</code> can destroy a volume created by the <code>my_service</code> service account.</td>
  </tr>
</table>

<a name="master-vol-role"></a>
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
      <code>dcos:mesos:master:volume:role[:<i>role_name</i>]</code>
    </td>
    <td>
      <code>create</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user or service account permission to create a volume for the given Mesos role.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:master:volume:role</code> can create a volume for any role.<br/>
      &#x25cf; <code>dcos:mesos:master:volume:role:hdfs</code> can create a volume for a service registered with the <code>hdfs</code> role.
    </td>
  </tr>
</table>

<a name="master-weight"></a>
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
      <code>dcos:mesos:master:weight:role[:<i>role_name</i>]</code>
    </td>
    <td>
      <code>read</code> <code>update</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to read or update the weight for a given Mesos role. See the <a href="http://mesos.apache.org/documentation/latest/weights/">Apache Mesos documentation</a> for more information about weights.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:master:weight:role</code> can read or update the weight of any role.<br/>
      &#x25cf; <code>dcos:mesos:master:weight:role:arangodb3</code> can read or update the weight for a service registered with the <code>arangodb3</code> role.
    </td>
  </tr> 
</table>



# Agent permissions

The agent permissions protect objects and data accessible from the Mesos agent nodes.

<a name="agent-endpoint"></a>
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
      <code>dcos:mesos:agent:endpoint:path[:<i>endpoint</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to access particular <a href="http://mesos.apache.org/documentation/latest/authorization/">Mesos endpoints</a> that are not otherwise protected.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:agent:endpoint:path</code> grants access to the <b>/logging/toggle</b>, <b>/metrics/snapshot</b>`, <b>/files/debug</b>, <b>/containers</b>, and <b>/monitor/statistics</b> endpoints on agents.<br/>
      &#x25cf; <code>dcos:mesos:agent:endpoint:path:/logging/toggle</code> grants access to the <b>/logging/toggle</b> endpoint.<br/>
      &#x25cf; <code>dcos:mesos:agent:endpoint:path:/metrics/snapshot</code> grants access to the <b>/metrics/snapshot</b> endpoint.<br/>
      &#x25cf; <code>dcos:mesos:agent:endpoint:path:/files/debug</code> grants access to the <b>/files/debug</b> endpoint.<br/>
      &#x25cf; <code>dcos:mesos:agent:endpoint:path:/containers</code> grants access to the <b>/containers</b> endpoint.<br/>
      &#x25cf; <code>dcos:mesos:agent:endpoint:path:/monitor/statistics</code> grants access to the <b>/monitor/statistics</b> endpoint.
    </td>
  </tr>
</table>

<a name="agent-executor"></a>
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
      <code>dcos:mesos:agent:executor:app_id[:<i>service-or-job-group</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to view information about executors running in any service/job group or within a specified service/job group. See the <a href="http://mesos.apache.org/documentation/latest/architecture/">Apache Mesos documentation</a> for more information about executors.<br/>
      <b>Important:</b> When referencing a job group in a user service permission, you use <code>.</code> as a separator and do not include a prefatory separator. To reference a job group in a Mesos permission, you must use <code>/</code> as a separator and include a prefatory separator.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:agent:executor:app_id</code> can view information about executors running in any service or job group.<br/>
      &#x25cf; <code>dcos:mesos:agent:executor:app_id:/dev/tweeter</code> can view information about executors running in the <code>/dev/tweeter</code> job/service group or any of its subdirectories.
    </td>
  </tr>
</table>

<a name="agent-flags"></a>
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
      <code>dcos:mesos:agent:flags</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to view every agent's flag configuration. See the <a href="http://mesos.apache.org/documentation/latest/endpoints/slave/flags/">Apache Mesos documentation</a> for more information.
    </td>
  </tr>
</table>

<a name="agent-framework"></a>
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
      <code>dcos:mesos:agent:framework:role[:<i>role_name</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to view information about frameworks (called 'scheduler services' in DC/OS) registered with a particular role, as well as their tasks, if the framework does not support <code>app_id</code> namespaces, i.e., service/job groups.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:agent:framework:role</code> can view information about any service.<br/>
      &#x25cf; <code>dcos:mesos:agent:framework:role:*</code> can view information about services registered with the Mesos default role.<br/>
      &#x25cf; <code>dcos:mesos:agent:framework:role:hdfs</code> can view information about services registered under the <code>hdfs</code> role.
    </td>
  </tr>
</table>

<a name="agent-log"></a>
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
      <code>dcos:mesos:agent:log</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Grants a user permission to read or download the Mesos agent log. See the <a href="https://mesos.apache.org/documentation/latest/logging/">Apache Mesos documentation</a> for more information.</td>
  </tr>
</table>

<a name="agent-sandbox"></a>
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
      <code>dcos:mesos:agent:sandbox:app_id[:<i>service-or-job-group</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to browse the sandbox and view logs of tasks running in any service/job group or within a specified service/job group.<br/>
      <b>Important:</b> When referencing a job group in a user service permission, you use <code>.</code> as a separator and do not include a prefatory separator. To reference a job group in a Mesos permission, you must use <code>/</code> as a separator and include a prefatory separator.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:agent:sandbox:app_id</code> can browse the sandbox and view the logs of tasks running in any service or job group.<br/>
      &#x25cf; <code>dcos:mesos:agent:sandbox:app_id:/dev/tweeter</code> can browse the sandbox and view the logs of tasks running in the <code>/dev/tweeter</code> job/service group or any of its subdirectories.
    </td>
  </tr>
</table>

<a name="agent-task"></a>
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
      <code>dcos:mesos:agent:task:app_id[:<i>service-or-job-group</i>]</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      Grants a user permission to view information about tasks running in any service/job group or within a specified service/job group. <br/>
      <b>Important:</b> When referencing a job group in a user service permission, you use <code>.</code> as a separator and do not include a prefatory separator. To reference a job group in a Mesos permission, you must use <code>/</code> as a separator and include a prefatory separator.<br/>
      Examples:<br/>
      &#x25cf; <code>dcos:mesos:agent:task:app_id</code> can view information about tasks running in any service or job group.<br/>
      &#x25cf; <code>dcos:mesos:agent:task:app_id:/dev/tweeter</code> can view information about tasks running in the <code>/dev/tweeter</code> job/service group or any of its subdirectories.
    </td>
  </tr>
</table>
