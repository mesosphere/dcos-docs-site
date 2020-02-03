---
layout: layout.pug
navigationTitle: Configure an AWS Cloud Provider with a User Role
title: AWS Role Credentials
beta: true
excerpt: Configure an AWS Cloud Provider with a User Role
---

### Configure an AWS Cloud Provider with a User Role

For more flexible credential configuration, we have a role-based authentication method with an optional External ID for third party access.

The user you delegate from your role must have a minimum set of permissions, which are documented on the (configure aws with static credentials)[/ksphere/kommander/latest/operations/cloud-providers/configure-aws-cloud-provider-static-credentials/#using-an-existing-user] page.

Refer to the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) for creating a role for an IAM User

In Kommander, select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Cloud Providers** and click the **Add Cloud Provider** button.

![Add Cloud Provider](/ksphere/kommander/img/add-cloud-provider.png)

- Select the Amazon Web Services (AWS) option from the Add Cloud Provider.
- Ensure "Static" is selected as the Authentication Method.
- Select a name for your cloud provider. Consider choosing a name that matches the AWS user.
- Enter the Role ARN.
- Optionally provide an External ID for third-party access. Refer to the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html) to use an External ID when granting access to a third party.

