---
layout: layout.pug
navigationTitle:  User service permissions
title: User service permissions
menuWeight: 600
excerpt: >
  This topic details the permissions
  enforced by the Marathon and Metronome
  services, which control access to user
  services and jobs. These permissions are
  only enforced in permissive and strict
  security modes.
preview: true
enterprise: true
---

# About the user service permissions

User service permissions allow you to achieve fine-grained control of services and jobs in `strict` and `permissive` [security modes](/1.8/administration/installing/ent/custom/configuration-parameters/#security). They are ignored in `disabled` mode.


# <a name="marathon"></a>Marathon permissions reference

Marathon permissions affect a user's ability to access services from the DC/OS web interface, the CLI, and the Marathon API. 

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
    <td width="70%">
      <code>dcos:service:marathon:marathon:services:/[<i>service-group</i>]</code>
    </td>
    <td>
      <code>create</code> <code>read</code> <code>update</code> <code>delete</code> <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Controls access to services launched by the native Marathon instance.  Provide the name of the service group, prepended with a forward slash. If it is nested inside of one or more service groups, also provide the parent group or groups, e.g., <code>/group1/group2</code>. You can omit the name of the service group to give the user access to any service group. Examples:<br/>
    &#x25cf; <code>dcos:service:marathon:marathon:services:/</code> can access services inside of any service group as well as services not inside of a service group.<br/>
    &#x25cf; <code>dcos:service:marathon:marathon:services:/parent/child</code> can access services inside of the <code>/parent/child</code> group and any groups inside of this group. Cannot access services inside of the <code>/parent</code> service group.<br/>
    <br/>
    See <a href="/1.8/administration/id-and-access-mgt/ent/permissions/service-groups/">Controlling user access to services</a> for more details on working with service groups.
    </td>
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
    <td width="55%">
      <code>dcos:service:marathon:marathon:admin:config</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Protects the <b>GET /v2/info</b> Marathon endpoint. Refer to the <a href="http://mesosphere.github.io/marathon/docs/rest-api.html#get-v2-info">Marathon documentation</a> for more information about this endpoint.</td>
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
    <td width="55%">
      <code>dcos:service:marathon:marathon:admin:leader</code>
    </td>
    <td>
      <code>read</code> <code>update</code> <code>full</code>
    </td>
  </tr>
  <tr>
  <td colspan="2">Protects the <b>GET/DELETE /v2/leader</b> Marathon endpoint. Refer to the <a href="http://mesosphere.github.io/marathon/docs/rest-api.html#server-info">Marathon documentation</a> for more information about this endpoint. <b>Tip:</b> The <code>full</code> action gives a user or group of users all of the possible actions.</td>
  </tr> 
</table>

<table class="table">
  <tr>
    <th>
      Resource
    </th>
    <th>
      Action
    </th>
  </tr>
  <tr>
    <td width="55%">
      <code>dcos:service:marathon:marathon:admin:events</code>
    </td>
    <td>
      <code>read</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Users with this permission can view the Marathon events that are available from the following endpoints:<br/>
    &#x25cf; <b>GET v2/events</b> (event stream)<br/>
    &#x25cf; <b>GET/POST/DELETE /v2/eventSubscriptions</b> 
    </td>
  </tr>
</table>




# <a name="metronome"></a>Metronome permissions reference

Marathon permissions affect a user's ability to access jobs from the DC/OS web interface, the CLI, and the Marathon API. 

<table class="table">
  <tr>
    <th>
      Resource
    </th>
    <th>
      Action
    </th>
  </tr>
  <tr>
    <td width="60%">
      <code>dcos:service:metronome:metronome:jobs[:<i>job_group</i>]</code>
    </td>
    <td>
      <code>full</code> <code>create</code> <code>read</code> <code>update</code> <code>delete</code>
    </td>
  <tr>
    <td colspan="2">
      Protects access to jobs. Provide the path to the job. To denote a hierarchy in the path, use a period as a separator. You can omit the name of the job group to give the user access to any job group. Examples:<br/>
      &#x25cf; <code>dcos:service:metronome:metronome:jobs</code> can access jobs inside of any job group.<br/>
      &#x25cf; <code>dcos:service:metronome:metronome:jobs:parent.child</code> can access services inside of the <code>parent.child</code> job group and any groups inside of this group. Cannot access jobs inside of the <code>parent</code> job group.<br/>
      See <a href="/1.8/administration/id-and-access-mgt/ent/permissions/job-groups/">Controlling user access to jobs</a> for more details on working with job groups.<br/>
      <b>Tip:</b> The <code>full</code> action gives a user or group of users all of the possible actions.
    </td>
  </tr>
</table>

  
