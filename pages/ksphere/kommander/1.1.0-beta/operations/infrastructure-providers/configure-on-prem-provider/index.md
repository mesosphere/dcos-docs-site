---
layout: layout.pug
navigationTitle: Configure an On-Premises provider
title: On-Premises Infrastrucutre Provider
excerpt: Configuring an On-Premises infrastructure provider
---

When creating an On-Premise provider, you need a private SSH key.

### Configure an On Premise provider

Select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Infrastructure Providers** and click the **Add Infrastructure Provider** button.

![Adding an Infrastructure Provider](/ksphere/kommander/1.1.0-beta/img/empty-infrastructure-providers.png)
<br />_Adding an Infrastructure Provider_

![Add Infrastructure Provider Form](/ksphere/kommander/1.1.0-beta/img/add-infrastructure-provider.png)
<br />_Add Infrastructure Provider Form_

Select "On-Premises"

- Enter a name for your infrastructure provider for later reference.
- Fill in Private SSH Key with the key used to access your infrastructure.
- Click **Verify and Save** to verify the credentials are valid and to save your provider.

![On Premise Provider Form with values](/ksphere/kommander/1.1.0-beta/img/On-prem-provider-with-values.png)
<br />_On-Premise Provider Form with values_

After the provider is created, its display name or private SSH key can be updated.
