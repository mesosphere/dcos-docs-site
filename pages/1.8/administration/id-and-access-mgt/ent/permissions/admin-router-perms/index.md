---
layout: layout.pug
navigationTitle:  Admin Router permissions
title: Admin Router permissions
menuWeight: 400
excerpt: >
  This topic details the permissions that
  the Admin Router enforces. Admin Router
  enforces these permissions in all
  security modes.
preview: true
enterprise: true
---


The Admin Router enforces its permissions in all security modes. These coarse-grained permissions often affect access to services started by systemd. They also control access to specific tabs of the DC/OS web interface.

The following tables identify and discuss each of the Admin Router permissions. 


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
      <code>dcos:adminrouter:ops:ca:ro</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Grants a user access to the read-only endpoints of the <a href="/1.8/administration/tls-ssl/ent/#api">DC/OS Certificate Authority API</a> and the read-only <code>dcos security cluster ca</code> commands of the <a href="/1.8/usage/cli/enterprise-cli/">DC/OS Enterprise CLI</a>.
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
    <td>
      <code>dcos:adminrouter:ops:ca:rw</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
    Grants a user access to all endpoints of the <a href="/1.8/administration/tls-ssl/ent/#api">DC/OS Certificate Authority API</a> and all of the <code>dcos security cluster ca</code> commands of the <a href="/1.8/usage/cli/enterprise-cli/">DC/OS Enterprise CLI</a>.
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
    <td>
      <code>dcos:adminrouter:ops:exhibitor</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Grants a user access to the Exhibitor UI/API. This will allow them to remove ZooKeeper state after uninstalling a service.
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
    <td>
      <code>dcos:adminrouter:ops:historyservice</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Controls the ability to view the contents of the <b>Dashboard</b> and <b>Nodes</b> tabs in the DC/OS web interface. This permission also controls access to the <a href="http://mesos.apache.org/documentation/latest/endpoints/slave/state/">History Service API</a>, which gives a user read-only access to all task information across the cluster, so it should be granted with care.
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
    <td>
      <code>dcos:adminrouter:ops:mesos</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Allows access to:<br/>
      &#x25cf; <b>Mesos master UI and API:</b> in <code>disabled</code> and <code>permissive</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security modes</a>, the user can view basic information about any task. While the user cannot directly modify app definitions or kill tasks, they can shut down frameworks, set quota/weights/reservations/volumes, or register new Mesos frameworks. To restrict a user's access, you must upgrade to <code>strict</code> mode, where the additional <a href="/1.8/administration/id-and-access-mgt/ent/permissions/master-agent-perms/">Mesos permissions</a> allow more granular controls.<br/>
      &#x25cf; <b>Tasks tab of the DC/OS web interface:</b> allows a user read-only access. In <code>disabled</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a>, the user will be able to see the <b>Tasks</b> tab of any service. However, the user will need explicit <a href="/1.8/administration/id-and-access-mgt/ent/permissions/user-service-perms/#metronome">user service permissions</a> to view the <b>Tasks</b> tab of jobs. In <code>permissive</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a>, the user will also need <a href="/1.8/administration/id-and-access-mgt/ent/permissions/user-service-perms/">user service permissions</a> to view the <b>Tasks</b> tab. In <code>strict</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a>, the user will also need <a href="/1.8/administration/id-and-access-mgt/ent/permissions/master-agent-perms/">Mesos permissions</a> to view the <b>Tasks</b> tab.<br/>
      &#x25cf; <code>dcos task</code> <b>command of the <a href="/1.8/usage/cli/command-reference/">DC/OS CLI</a>:</b> allows you to list tasks and retrieve task information such as sandbox data.
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
    <td>
      <code>dcos:adminrouter:ops:mesos-dns</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Controls access to the <a href="/1.8/usage/service-discovery/mesos-dns/mesos-dns-api/">Mesos DNS API</a>. This permission does not affect any part of the DC/OS web interface, nor does it control any set of DC/OS CLI commands.
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
    <td>
      <code>dcos:adminrouter:ops:metadata</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Grants access to all of the following endpoints, each of which serves up a different metadata file.<br/>
     &#x25cf; <code>/metadata</code>: DC/OS version, master IP address<br/>
     &#x25cf; <code>/dcos-metadata/bootstrap-config.json</code>: security-related information such as the <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a> of the cluster<br/>
     &#x25cf; <code>/pkgpanda/active.buildinfo.full.json</code>: SHAs of the packages
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
    <td>
      <code>dcos:adminrouter:ops:networking</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Grants access to network metrics from either the <b>Networking</b> tab of the DC/OS web interface or the Networking API.
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
    <td>
      <code>dcos:adminrouter:ops:slave</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Allows access to:<br/>
      &#x25cf; <b>Mesos master UI and API:</b> in <code>disabled</code> and <code>permissive</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security modes</a>, the user can view basic information about any task. While the user cannot directly modify app definitions or kill tasks, they can shut down frameworks, set quota/weights/reservations/volumes, or register new Mesos frameworks. To restrict a user's access, you must upgrade to <code>strict</code> mode, where the additional <a href="/1.8/administration/id-and-access-mgt/ent/permissions/master-agent-perms/">Mesos permissions</a> allow more granular controls.<br/>
      &#x25cf; <b>Tasks tab of the DC/OS web interface:</b> allows a user read-only access. In <code>disabled</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a>, the user will be able to see the <b>Tasks</b> tab of any service or job. In <code>permissive</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a>, the user will need <a href="/1.8/administration/id-and-access-mgt/ent/permissions/user-service-perms/">user service permissions</a> to view the <b>Tasks</b> tab. In <code>strict</code> <a href="/1.8/administration/installing/ent/custom/configuration-parameters/#security">security mode</a>, the user will need <a href="/1.8/administration/id-and-access-mgt/ent/permissions/master-agent-perms/">Mesos permissions</a> to view the <b>Tasks</b> tab.<br/>
      &#x25cf; <code>dcos task</code> <b>command of the <a href="/1.8/usage/cli/command-reference/">DC/OS CLI</a>:</b> allows you to list tasks and retrieve task information such as sandbox data. 
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
    <td>
      <code>dcos:adminrouter:ops:system-health</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     This permission controls access to the <code>hostname:<adminrouter_port>/system/health/v1</code> endpoint, which is used to populate the component health page of the web interface.
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
    <td>
      <code>dcos:adminrouter:package</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Provides access to packages and package repos from the <b>Universe</b> tab of the DC/OS web interface, the <code>dcos package</code> commands of the <a href="/1.8/usage/cli/">DC/OS CLI</a>, and the <a href="https://github.com/dcos/cosmos/blob/master/README.md">Cosmos API</a>. Toggles the view of the <b>Universe</b> tab in the DC/OS web interface on and off. Users with this permission should be highly trusted. Not only can such users install any package, they can change the location of the Universe. A bad actor with this permission could point to a repo containing malware or other malicious executables. 
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
    <td>
      <code>dcos:adminrouter:service:marathon</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Controls the ability to access the native Marathon instance via:<br/>
     &#x25cf; The <b>Services</b> tab of the DC/OS web interface. This permission toggles the view of the <b>Services</b> tab in the DC/OS web interface on and off.<br/>
     &#x25cf; The <code>dcos marathon</code> commands of the <a href="/1.8/usage/cli/">DC/OS CLI</a>.<br/>
     &#x25cf; The <a href="/1.8/usage/managing-services/rest-api/">Marathon API</a>.<br/>
     In <code>disabled</code> mode, this permission does not just grant access to the native Marathon instance, it also grants access to the Marathon services. In <code>permissive</code> and <code>strict</code> modes, the user will need this permission as well as <a href="/1.8/administration/id-and-access-mgt/ent/permissions/user-service-perms/#marathon">user service permissions</a> to access the services.
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
    <td>
      <code>dcos:adminrouter:service:metronome</code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Controls the ability to access the Metronome instance via:<br/>
     &#x25cf; The <b>Jobs</b> tab of the DC/OS web interface. This permission toggles the view of the <b>Jobs</b> tab in the DC/OS web interface on and off.<br/>
     &#x25cf; The <code>dcos job</code> commands of the <a href="/1.8/usage/cli/">DC/OS CLI</a>.<br/>
     &#x25cf; The <a href="/1.8/usage/managing-services/rest-api/">Metronome API</a>.<br/>
     In <code>disabled</code> mode, this permission does not just grant access to the Metronome instance, it also grants access to the Metronome jobs. In <code>permissive</code> and <code>strict</code> modes, the user will need this permission as well as <a href="/1.8/administration/id-and-access-mgt/ent/permissions/user-service-perms/#metronome">user service permissions</a> to access the jobs.
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
    <td>
      <code>dcos:adminrouter:service:<i>service-name</i></code>
    </td>
    <td>
      <code>full</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
     Controls the ability to access the UI or the API of a service at the following path: <code>http[s]://<i>cluster-url</i>/service/<i>service-name</i></code>. The service must include the following in its app definition<br/>
      <code>"labels": {</code><br/>
      &nbsp;&nbsp;&nbsp;&nbsp;<code>"DCOS_SERVICE_NAME": "<i>service-name</i>",</code><br/>
      &nbsp;&nbsp;&nbsp;&nbsp;<code>"DCOS_SERVICE_PORT_INDEX": "0",</code><br/>
      &nbsp;&nbsp;&nbsp;&nbsp;<code>"DCOS_SERVICE_SCHEME": "http"</code><br/>
      <code>}</code><br/>
      Replace <code><i>service-name</i></code> in the permission string with the value provided for <code>"DCOS_SERVICE_NAME"</code> in the app definition.
    </td>
  </tr>
</table>



