---
layout: layout.pug
navigationTitle:  Managing permissions
title: Managing permissions
menuWeight: 1
excerpt:

enterprise: true
---



# About permissions

DC/OS provides access control lists (ACLs) that allow you to define permissions. ACLs can be applied to users and groups. DC/OS ACLs can be grouped into three main categories, which correspond to the first two elements in the ACL itself.

<table class="table">
  <tr>
    <th>
      Category
    </th>
    <th>
      Base ACL
    </th>
    <th>
      Discussion
    </th>
  </tr>
  <tr>
    <td>
      superuser
    </td>
    <td>
      <code>dcos:superuser</code>
    </td>
    <td>
      If authentication is enabled, at least one user must have the <code>dcos:superuser</code> ACL at any given time. An initial account with the <code>dcos:superuser</code> ACL is created during installation. Members of the <code>superuser</code> group inherit the <code>dcos:superuser</code> ACL. Users with the <code>dcos:superuser</code> ACL have full access rights across the DC/OS cluster.
    </td>
  </tr>
  <tr>
    <td>
      Admin Router
    </td>
    <td>
      <code>dcos:adminrouter:*</code>
    </td>
    <td>
      The Admin Router proxies access to all DC/OS resources. It either allows access or it does not. The first part of the Admin Router ACL identifies the DC/OS resource. The second part defines the permission. Only <code>full</code> is accepted as a permission for Admin Router resources. 
    </td>
  </tr>
  <tr>
    <td>
      Marathon
    </td>
    <td>
      <code>dcos:service:marathon:*</code>
    </td>
    <td>
      Once the Admin Router allows requests through to Marathon, Marathon then begins to enforce its own set of permissions, which are finer-grained. In addition to defining whether or not a user has access to a Marathon resource, you can define the type of access the user has. The first part of the Marathon ACL identifies the Marathon resource. The second part defines the permission: <code>full</code>, <code>create</code>, <code>read</code>, <code>update</code>, or <code>delete</code>. Because requests must pass through the Admin Router first, you must give the permission in Admin Router as well as in Marathon to allow the traffic.
    </td>
  </tr>
</table>

# Defining permissions in the web interface

Within the DC/OS web interface, you can define permissions on a per-user basis or you can apply them to an entire group at once. Use the **Advanced ACLs** tab to define your permissions. It can be accessed in either of the following ways.

* To define permissions for a user, click the name of the user in the **System** -> **Organization** -> **Users** tab.

* To define permissions for a group, click the name of the group in the **System** -> **Organization** -> **Groups** tab. 

**Tip**: If you have more than a handful of users, groups may make it easier to define and manage your permissions. 

The sections that follow discuss in detail the values that can be entered into the **Resource** and **Permissions** boxes for Admin Router and Marathon ACLs. 

Once you have entered the desired permission, click **Add Rule**. 

# Admin Router resource identifiers
    
<table class="table">
  <tr>
    <th>
      Resource identifier
    </th>
        
    <th>
      Discussion
    </th>
  </tr>
      
  <tr>
    <td>
      <code>dcos:adminrouter:package</code>
    </td>
    <td>
        This resource controls access to the DC/OS packaging API. Users with access can install DC/OS services from the DC/OS package repository.
    </td>
  </tr>
      
  <tr>
    <td>
      <code>dcos:adminrouter:ops:mesos</code>
    </td>
    <td>
        This resource controls access to the Mesos UI. Users with access can navigate to the Mesos UI.
    </td>
  </tr>
      
  <tr>
    <td>
      <code>dcos:adminrouter:ops:exhibitor</code>
    <td>
        This resource controls access to the Exhibitor UI.
    </td>
  </tr>    
    
  <tr>
    <td>
      <code>dcos:adminrouter:ops:slave</code>
    </td>
    <td>
        This resource controls access to Admin Router's agent endpoint.
    </td>
  </tr>
        
  <tr>
    <td>
      <code>dcos:adminrouter:service:marathon</code>
    </td>
    <td>
        This resource controls access to the DC/OS Marathon instance. For example, you can grant a user access to <code>http:///service/marathon</code>.
    </td>
  </tr>
        
  <tr>
    <td>
      <code>dcos:adminrouter:service:&lt;service-name&gt;</code>
    </td>
    <td>
        This resource controls access to installed DC/OS Services.
    </td>
  </tr>
        
  <tr>
    <td>
      <code>dcos:superuser</code>
    </td>
    <td>
      User or groups with <code>full</code> permission to the <code>dcos:superuser</code> resource have full access to all DC/OS resources as well as the ability to manage users, groups, permissions, and LDAP configuration settings.
    </td>
  </tr>
</table>
**Note**: The permission for Admin Router resources is always `full`.

    
# Marathon resource identifiers
    
Marathon resource identifiers follow this schema: `dcos:service:marathon:{service name}:services/{group id}`
    
Restrictions apply to applications and application groups in one service. Valid actions for a path are: `create`, `read`, `update`, `delete`. A shortcut for all actions is `full`.
    
Since you can have multiple Marathons installed in your cluster, you can define rules for every service separately. The `service name` must be RFC 3986 (URI) compliant and is passed to Marathon via the `--framework_name` command line argument.
    
The `group id` is the ID of the group in Marathon. Applications and Application Groups in Marathon build a tree. Each can be identified via their path from the root group, e.g. `/production/frontend/webserver`. An ACL rule will grant access to the entire subtree rooted at the path represented by the resource identifier. For example, if a user is granted create permission on `/production`, then they are allowed to create an app named `/production/frontend/webserver`.
    
Examples:
    
<table class="table">
  <tr>
    <th>
      Resource identifier
    </th>
        
    <th>
      Discussion
    </th>
  </tr>
      
  <tr>
    <td>
      <code>dcos:service:marathon:marathon</code>
    </td>
    <td>
      This resource controls access to all apps managed by DC/OS Marathon.
    </td>
  </tr>
 
  <tr>
    <td>
      <code>dcos:service:marathon:marathon-user</code>
    </td>
    <td>
      This resource controls access to all apps managed by the installed Marathon service <code>marathon-user</code>.
    </td>
  </tr>
        
  <tr>
    <td>
      <code>dcos:service:marathon:marathon:services/service-group</code>
    </td>
    <td>
      This resource restricts group access to the group <code>service-group</code> in DC/OS Marathon instance.
    </td>
  </tr>
      
  <tr>
    <td>
      <code>dcos:service:marathon:marathon-user:services/service-group</code>
    </td>
    <td>
      This resource controls group access to an installed Marathon instance <code>marathon-user</code>.
    </td>
  </tr>
        
  <tr>
    <td>
      <code>dcos:service:marathon:marathon:services/group1/group2</code>
    </td>
    <td>
      This resource restricts group access to the group <code>/group1/group2</code> in DC/OS Marathon instance.
    </td>
  </tr>
</table>
    
**Important**: After creating a service level rule, make sure the related group exists in the Marathon instance. Users with limited access rights will only see applications and groups according to the defined ACLs.

# Examples

## Granting user access to Marathon

This example shows how to allow a user access to Marathon.

1.  Click **System** -> **Organization** -> **Users**.

2.  Click on the name of the user that you want to allow access to.

3.  Click **Advanced ACLs**.

4.  Enter `dcos:adminrouter:service:marathon` in the **Resource** box. 

5.  Enter `full` in the **Permission** box.

6.  Click **Add Rule**.

7.  Enter `dcos:service:marathon:marathon` in the **Resource** box.  

8.  Enter `full` in the **Permission** box.

9.  Click **Add Rule**.

10. Log out and log back on as this user to confirm access. 


## Grant user access to install packages

In this example, a user named Ted is granted access to install services from the DC/OS package repository.

1.  Click on the **System** and then the **Organization** tab.

2.  From the **Groups** tab click **New Group**.

3.  Enter `DC/OS package` for Group name and click **Create**.
    
4.  Open the DC/OS package group.
    
5.  From the **Advanced ACLs** tab, enter Resource `dcos:adminrouter:package`, Permission `full`, and click **Add Rule**.
        
6.  From the **Members** tab, select Ted from the dropdown menu.
    
7.  Click **Close** to save the changes.

8.  Log in to the CLI as Ted.
    
        dcos package install kafka
        52.26.144.2's username: ted
        ted@52.26.144.2's password: 
        [core.dcos_acs_token]: set to 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJ0ZWQiLCJleHAiOiIxNDYwNDE1NjY0In0.IGk3OOPCpoEUTnaY-V4OMJ1DOGl8YWau8Hd4uedc5lI'
        This will install Apache Kafka DC/OS Service.
        Continue installing? [yes/no]

