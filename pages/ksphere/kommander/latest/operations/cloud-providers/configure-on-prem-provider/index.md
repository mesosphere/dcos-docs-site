---
layout: layout.pug
navigationTitle: Configure an On Premises provider
title: On Premises provider
beta: true
excerpt: Configuring an On Premises provider
---

### Configure an On Premise provider

Select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Cloud Providers** and select the **Add Cloud Provider** button.

![Add Cloud Provider](/ksphere/kommander/img/add-cloud-provider.png)

When creating an On Premise provider, you need a private SSH key.

- Select a name for your cloud provider for later reference. Consider choosing a name that matches the AWS user.
- Fill in Private SSH Key with the key used to access your infrastructure.
- Click **Verify** and **Save** to verify the credentials are valid and to save your provider.

![On Premise Provider Form with values](/ksphere/kommander/img/On-prem-provider-with-values.png)

Figure 1 - On Premise Provider Form with values

After the provider is created, the Provider’s display name or credentials can be updated.
