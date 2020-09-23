---
layout: layout.pug
navigationTitle: Configure an Azure Cloud Provider
title: Azure Static Credentials
excerpt: Configuring an Azure Cloud Provider
---

### Configuring an Azure cloud provider

Before you configure an Azure Cloud provider it's necessary to [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

#### Create a new set of credentials using CLI commands

To provision an Azure cluster, you need Azure credentials. Those can be obtained by:

- Having the Azure CLI installed and set up
- Having Contributor and User Access Administrator rights on Azure

The following commands create an active directory service principal, to delegate to Kommander, for creating Konvoy clusters:

```
az login
```

Determine the `SUBSCRIPTION_ID` of your account, named `id` in the output of the following command:

```
az account show
{
  "environmentName": "AzureCloud",
  "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "isDefault": true,
  "name": "ACME Enterprises Subscription",
  "state": "Enabled",
  "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "user": {
    "name": "user@azureacme.onmicrosoft.com",
    "type": "user"
  }
}
```

Create the service principal for the provide. Ensure you replace `SUBSCRIPTION_ID` with the `id` from the previous command output:

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

The service principal additionally needs to get the role `User Access Administrator` assigned. Replace `APP_ID` with the `appId` value from the output of the previous command:

```
az role assignment create --assignee "APP_ID" --role "User Access Administrator"
```

#### Fill out the Add Cloud Provider form

In Kommander, select the Workspace associated with the credentials you are adding.

Navigate to **Administration > Cloud Providers** and select the **Add Cloud Provider** button.

![Add Cloud Provider](/ksphere/kommander/1.0/img/add-cloud-provider.png)

- Select a name for your cloud provider for later reference. Consider choosing a name that matches the AWS user.
- Fill in `App ID` with the `APP_ID` value.
- Fill in `Password` with the `PASSWORD` value.
- Fill in `Tenant` with the `TENANT` value.
- Fill in `Subscription ID` with the `SUBSCRIPTION_ID` value.
- Select **Verify** and **Save** to verify the credentials are valid and to save your provider.

![Azure Cloud Provider Form with values](/ksphere/kommander/1.0/img/Azure-Cloud-provider-with-values.png)

Figure 8 - Azure Cloud Provider Form with values

After the provider is created, a Cloud Provider’s display name or credentials can be updated.
