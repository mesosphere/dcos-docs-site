---
layout: layout.pug
navigationTitle: Configure an Azure Cloud Provider
title: Azure Static Credentials
beta: true
excerpt: Configuring an Azure Cloud Provider
---

### Configuring an Azure cloud provider

Before you configure an Azure Cloud provider it's necessary to [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

#### Create a new set of credentials using CLI commands

To begin, you need a valid Azure account with credentials configured. You must be authorized as a Contributor in your Azure account and assign roles to a user. The following commands create an active directory service principal, to delegate to Kommander, for creating Konvoy clusters:

```
az login
```

```
az role assignment cerate --assignee YOUR_USER_LOGIN --role "User Access Administrator"
```

Determine the `SUBSCRIPTION_ID` of your account, named `id` in the output of the following command:

```
az account show
```

Create the service principal for the provider:

```
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

The command returns data needed to create the secret:

```
{
  "appId": "APP_ID",
  "displayName": "name",
  "name": "http://name",
  "password": "PASSWORD",
  "tenant": "TENANT"
}
```

#### Fill out the Add Cloud Provider form

In Kommander, select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Cloud Providers** and select the **Add Cloud Provider** button.

![Add Cloud Provider](/ksphere/kommander/img/add-cloud-provider.png)

- Select a name for your cloud provider for later reference. Consider choosing a name that matches the AWS user.
- Fill in Client ID with the `APP_ID` value.
- Fill in Client Secret with the `PASSWORD` value.
- Fill in Tenant ID with the `TENANT` value.
- Fill in Subscription ID with the `SUBSCRIPTION_ID` value.
- Select **Verify** and **Save** to verify the credentials are valid and to save your provider.

![Azure Cloud Provider Form with values](/ksphere/kommander/img/Azure-Cloud-provider-with-values.png)

Figure 8 - Azure Cloud Provider Form with values

After the provider is created, a Cloud Provider’s display name or credentials can be updated.

