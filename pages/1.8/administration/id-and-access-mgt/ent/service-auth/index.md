---
layout: layout.pug
navigationTitle:  Service Accounts
title: Service Accounts
menuWeight: 4
excerpt:
preview: true
enterprise: true
---




# About service authentication

DC/OS Enterprise uses public-private key cryptography and [JSON web tokens (JWT)](https://jwt.io/introduction/) to authenticate services. Services required to authenticate must  create a public-private key pair and then create a service account with their public key. The service will then generate a JWT signed with their private key and pass this to DC/OS. DC/OS uses the public key in the service account to verify the service's signature, then returns a DC/OS authentication token signed by the Identity and Access Management Service. The service can use the DC/OS authentication token to gain access to the necessary resources.

Authentication tokens expire by default after five days. Services can use a variety of means to refresh their tokens. Ideally, a service should calculate the length of time until the token expires, which is embedded within the token itself, and request a new one before it expires. However, a service can also wait until it receives a `401` to request a new token. 


# About systemd-started services

In `strict` or `permissive` [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security), the DC/OS services that are started by systemd are automatically provisioned with the necessary credentials and permissions during the bootstrap sequence. You can review these service accounts from the **System** -> **Organization** -> **Service Accounts** tab of the DC/OS web interface. 

**Important:** Modifying the permissions of any of the automatically provisioned service accounts may cause the service to fail.


# <a name="user-service-auth"></a>About custom services

You may need to manually provision your custom service or script with a service account so that it can authenticate at runtime. This requirement varies according to your security mode, the origin of the service's requests, and the type of resource it needs to access. The following table details the circumstances under which a service requires an account.

<table class ="table" STYLE="margin-bottom: 30px;">
  <tr>
    <th>
      Requests originate from
    </th>
    <th>
      Service account required
    </th>
    <th>
      Service account optional
    </th>
  </tr>
  <tr>
    <td>
      Outside of the cluster
    </td>
    <td>
      All security modes
    </td>
    <td>
      N/A
    </td>
  </tr> 
  <tr>
    <td>
      Inside the cluster
    </td>
    <td>
      <code>strict</code> 
    </td>
    <td>
      <code>permissive</code>
  </tr>
</table>

For detailed instructions on how to set up a custom service or script with a service account, refer to [Provisioning custom services with service accounts](/1.8/administration/id-and-access-mgt/ent/service-auth/custom-service-auth/).


# <a name="universe-service-auth"></a>About services in the default Universe

Not all services in the default Universe can be provisioned with a service account. If a service requires a service account and cannot be provisioned with one, you won't be able to deploy the service. This requirement varies according to your [security mode](/1.8/administration/installing/ent/custom/configuration-parameters/#security).

The following table lists the Universe services that can be provisioned with service accounts. It also identifies when a service account is optional or required.

<table class="table" STYLE="margin-bottom: 25px;">
  <tr>
    <th>
      Service
    </th>
    <th>
      <code>disabled</code>
    </th>
    <th>
      <code>permissive</code>
    </th>
    <th>
      <code>strict</code>
    </th>
  </tr>
  <tr>
    <td>
      Cassandra
    </td>
    <td>
      Not possible
    </td>
    <td>
      Optional
    </td>
    <td>
      Required
    </td>
  </tr>
    <tr>
    <td>
      Confluent
    </td>
    <td>
      Not possible
    </td>
    <td>
      Optional
    </td>
    <td>
      N/A*
    </td>
  </tr>
  <tr>
    <td>
      HDFS
    </td>
    <td>
      Not possible
    </td>
    <td>
      Optional
    </td>
    <td>
      Required
    </td>
  </tr>
  <tr>
    <td>
      Kafka
    </td>
    <td>
      Not possible
    </td>
    <td>
      Optional
    </td>
    <td>
      Required
    </td>
  </tr>
  <tr>
    <td>
      Marathon-LB
    </td>
    <td>
      Optional
    </td>
    <td>
      Optional
    </td>
    <td>
      Required
    </td>
  </tr>
  <tr>
    <td>
      Spark
    </td>
    <td>
      Not possible
    </td>
    <td>
      Optional
    </td>
    <td>
      Required
    </td>
  </tr>
</table>

\* *These services cannot be deployed in `strict` mode at this time.*

If the service supports authentication in `permissive`, we encourage you to provision it with a service account. Otherwise, the service will default to running with the `superuser` permission. This will also make it easier to upgrade to `strict` mode in the future.

You may also want to provision Marathon-LB with a service account in `disabled` mode to make it easier to upgrade to `permissive` or `strict`.

Refer to the following sections for more details about how and when to provision each service with a service account.

- [Provisioning Cassandra](/1.8/administration/id-and-access-mgt/ent/service-auth/cass-auth/)
- [Provisioning Confluent](/services/confluent-kafka/confluent-auth/)
- [Provisioning HDFS](/1.8/administration/id-and-access-mgt/ent/service-auth/hdfs-auth/)
- [Provisioning Kafka](/1.8/administration/id-and-access-mgt/ent/service-auth/kafka-auth/)
- [Provisioning Marathon-LB](/1.8/administration/id-and-access-mgt/ent/service-auth/mlb-auth/)
- [Provisioning Spark](/1.8/administration/id-and-access-mgt/ent/service-auth/spark-auth/)
