---
layout: layout.pug
navigationTitle: Azure Cloud Provider
title: Azure Cloud Provider
excerpt: Managing the Azure cloud provider used by Kommander
---

Kommander needs authentication keys for Azure to automate its provisioning. It is possible to have many accounts for a single cloud provider.

### Configuring an Azure cloud provider

When creating an Azure cloud provider, you need a service principal with a set of minimal capabilities. This requires you to have `Contributor` and `User Access Administrator` rights on Azure.

#### Creating a service principal using the CLI

Find the `SUBSCRIPTION_ID` of your account, named `id` in the output of this command:
```
az account show
```

Create the service principal for the provider:
```
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

The command will return data needed to create the secret:
```
{
  "appId": "APP_ID",
  "displayName": "name",
  "name": "http://name",
  "password": "PASSWORD",
  "tenant": "TENANT"
}
```

Assign the role `User Access Administrator` to the service principal:
```
az role assignment create --assignee "APP_ID" --role "User Access Administrator"
```

Create a file for the secret and name it `azure.properties`:
```
clientID=APP_ID
clientSecret=PASSWORD
subscriptionID=SUBSCRIPTION_ID
tenantID=TENANT
```

Create the secret:
```
kubectl create secret generic azure-credentials --from-env-file=azure.properties --type=kommander.mesosphere.io/azure-credentials
```

Create the `CloudProviderAccount`:
```
cat <<EOF | kubectl apply -f -
apiVersion: kommander.mesosphere.io/v1beta1
kind: CloudProviderAccount
metadata:
  name: azure-credentials
spec:
  provider: azure
  credentialsRef:
    name: azure-credentials
EOF
```

#### Fill out the rest of the form

- Fill out the access and secret keys using the keys generated above
- Fill out a display name for your cloud provider that you can reference later.
- Click Verify and Save to verify that the credentials are valid and to save your provider.

![Cloud Provider Form with values](/ksphere/kommander/img/Cloud-provider-with-values.png)

Figure 7 - Cloud Provider Form with values

Once created, a Cloud Provider’s display name or credentials can be updated.

### Deleting a cloud provider

When attempting to delete a cloud provider Kommander will first verify if any existing managed clusters were created using the provider. The cloud provider cannot be deleted until all clusters created with the cloud provider have been deleted. This is to ensure Kommander has access to your cloud provider to remove all resources created for a managed cluster.

[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
