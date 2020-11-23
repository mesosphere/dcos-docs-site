---
layout: layout.pug
beta: false
navigationTitle: Configure an Azure Provider
title: Azure Infrastructure Provider with Static Credentials
excerpt: Configuring an Azure Infrastructure Provider
---

### Configuring an Azure infrastructure provider

Before you configure an Azure Infrastructure Provider you must [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

#### Create a new set of credentials using CLI commands

Before you begin, you need the following:

- A valid Azure account with configured credentials.
- You must be authorized as a Contributor on your Azure account, with the ability to assign roles to a user.

The following commands create an active directory service principal, which you delegate to Kommander, for creating Konvoy clusters:

```
az login
```

Determine the `SUBSCRIPTION_ID` of your account, named `id` in the output of the following command:

```
az account show
```

```json
{
  "environmentName": "AzureCloud",
  "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "isDefault": true,
  "name": "ACME Enterprises Subscription",
  "state": "Enabled",
  "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "user": { "name": "user@azureacme.onmicrosoft.com", "type": "user" }
}
```

Create the service principal for the provider. Ensure that you replace `SUBSCRIPTION_ID` with the `id` from the previous command output.

```
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

The command returns data needed to create your infrastructure provider:

```
{
  "appId": "APP_ID",
  "displayName": "name",
  "name": "http://name",
  "password": "PASSWORD",
  "tenant": "TENANT"
}
```

Next, assign the service principal the role of `User Access Administrator`. Replace `APP_ID` with the `appId` value from the output of the previous command:

```
az role assignment create --assignee "APP_ID" --role "User Access Administrator"
```

#### Fill out the Add Infrastructure Provider form

In Kommander, select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Infrastructure Providers** and click the **Add Infrastructure Provider** button.

![Adding an Infrastructure Provider](/dkp/kommander/1.3/img/empty-infrastructure-providers.png)
<br />_Adding an Infrastructure Provider_

![Add Azure Infrastructure Provider Form](/dkp/kommander/1.3/img/add-azure-infrastructure-provider.png)
<br />_Add Azure Infrastructure Provider Form_

- Enter a name for your infrastructure provider. Select a name that matches the Azure user.
- Use the values assigned when you created the service principal above:
  - Fill in Client ID with the `APP_ID` value.
  - Fill in Client Secret with the `PASSWORD` value.
  - Fill in Tenant ID with the `TENANT` value.
  - Fill in Subscription ID with the `SUBSCRIPTION_ID` value.
- Select **Verify and Save** to verify the credentials are valid and to save your provider.

![Azure Infrastructure Provider Form with values](/dkp/kommander/1.3/img/Azure-Infrastructure-provider-with-values.png)
<br />_Azure Infrastructure Provider Form with values_

After the infrastructure provider is created, its display name or credentials can be updated.
