---
layout: layout.pug
beta: false
navigationTitle: Configure an On-Premises provider
title: On-Premises Infrastructure Provider
excerpt: Configuring an On-Premises infrastructure provider
---

## Before you begin

This procedure requires that you have the following:

- A private SSH key.

## Configure the infrastructure provider

The following procedure describes how to configure an On-Premises infrastructure provider in Kommander.

1. Select the Workspace associated with the credentials you are adding.

1. Go to **Administration > Infrastructure Providers** and select the **Add Infrastructure Provider** button.

   ![Adding an Infrastructure Provider](/dkp/kommander/1.2/img/empty-infrastructure-providers.png)

   ![Add Infrastructure Provider Form](/dkp/kommander/1.2/img/add-infrastructure-provider.png)

1. Select **On-Premises**

   - Enter a name for your infrastructure provider for later reference.

   - Fill in **Private SSH Key** with the key used to access your infrastructure.

   - Select **Verify and Save** to verify the credentials are valid and to save your provider.

   ![On Premise Provider Form with values](/dkp/kommander/1.2/img/On-prem-provider-with-values.png)

   After the provider is created, its display name or private SSH key can be updated.
