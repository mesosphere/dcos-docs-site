---
layout: layout.pug
navigationTitle: Create Azure Image
title: Create a custom Azure Image
excerpt: Learn how to build a custom Azure Image for use with Konvoy
beta: false
enterprise: false
menuWeight: 60
---

This procedure describes how to use the Konvoy Image Builder to create a [Cluster API](https://cluster-api.sigs.k8s.io/) compliant Azure Virtual Machine (VM) Image. The VM Image contains the base operating system you specify and all the necessary Kubernetes components. The Konvoy Image Builder uses variable [`overrides`][overrides] to specify the base image and container images to use in your new Azure VM image.

## Prerequisites

Before you begin, you must:

-   Download the latest [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) bundle (prefixed with `konvoy-image-bundle`) for your OS. Do not use the release prefixed with `konvoy-image-builder`.

-   Create a working `Docker` setup.

## Extract the bundle

Extract the bundle and `cd` into the extracted `konvoy-image-bundle-$VERSION_$OS` folder. The bundled version of `konvoy-image` contains an embedded `docker` image that contains all the requirements for building.

<p class="message--note"><strong>NOTE: </strong> The <code>konvoy-image</code> binary and all supporting folders are also extracted. When run, <code>konvoy-image</code> bind mounts the current working directory (<code>${PWD}</code>) into the container to be used.</p>

## Configure Azure prerequisites

1.  Sign in to Azure:

    ```bash
    az login
    ```

    ```sh
    [
      {
        "cloudName": "AzureCloud",
        "homeTenantId": "a1234567-b132-1234-1a11-1234a5678b90",
        "id": "b1234567-abcd-11a1-a0a0-1234a5678b90",
        "isDefault": true,
        "managedByTenants": [],
        "name": "Mesosphere Developer Subscription",
        "state": "Enabled",
        "tenantId": "a1234567-b132-1234-1a11-1234a5678b90",
        "user": {
          "name": "user@azuremesosphere.onmicrosoft.com",
          "type": "user"
        }
      }
    ]
    ```

1.  Create an Azure Service Principal (SP) by running the following command:

    <p class="message--note"><strong>NOTE: </strong>If an SP with the name exists, this command will rotate the password.</p>

    ```bash
    az ad sp create-for-rbac --role contributor --name "$(whoami)-konvoy" --scopes=/subscriptions/$(az account show --query id -o tsv) --query "{ client_id: appId, client_secret: password, tenant_id: tenant }"
    ```

    ```sh
    {
      "client_id": "7654321a-1a23-567b-b789-0987b6543a21",
      "client_secret": "Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C",
      "tenant_id": "a1234567-b132-1234-1a11-1234a5678b90"
    }
    ```

-   Set the `AZURE_CLIENT_SECRET` and `AZURE_SUBSCRIPTION_ID` environment variables:

    ```bash
    export AZURE_CLIENT_SECRET="<azure_client_secret>"
    export AZURE_SUBSCRIPTION_ID="<subscription_id>"
    ```

-   Ensure you have an [override file](../override-files) to configure specific attributes of your Azure image.

## Build the image

Run the `konvoy-image` command to build and validate the image.

```bash
konvoy-image build azure --client-id "<azure_client_id>" --tenant-id "<azure_tenant_id>" images/azure/image.yaml --overrides overrides/image.yaml
```

By default, the image builder builds in the `westus2` location. To specify another location set the `--location` flag:

```bash
konvoy-image build azure --client-id "<azure_client_id>" --tenant-id "<azure_tenant_id>" --location eastus --overrides override-source-image.yaml images/azure/centos-7.yaml
konvoy-image build azure --client-id <azure_client_id> --tenant-id <azure_tenant_id> --location eastus --overrides override-source-image.yaml images/azure/centos-7.yaml
```

When the command is complete, the image id is printed and written to `./manifest.json`.    You should then specify this image id when creating the cluster.

## Image gallery

By default Konvoy Image Builder will create a Resource Group, Gallery, and Image Name to store the resulting image in. To specify a specific Resource Group, Gallery, or Image Name flags may be specified:

```sh
--gallery-image-locations location   a list of locatins to publish the image (default same as location)
--gallery-image-name string          the gallery image name to publish the image to
--gallery-image-offer string         the gallery image offer to set (default "dkp")
--gallery-image-publisher string     the gallery image publisher to set (default "dkp")
--gallery-image-sku string           the gallery image sku to set
--gallery-name string                the gallery name to publish the image in (default "dkp")
--resource-group string              the resource group to create the image in (default "dkp")
```

The SKU and Image Name will default to the values found in the image yaml.

[overrides]: ../override-files/
[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
[install_docker]: https://docs.docker.com/get-docker/
