---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your machine and environment to run DKP
enterprise: false
---

## Konvoy prerequisites

Before you begin using Konvoy, you must have:

- An x86_64-based Linux or macOS machine.
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid Azure account with [credentials configured][azure_credentials].

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

If you use these instructions to create a cluster on Azure using the DKP default settings without any edits to configuration files or additional flags, your cluster will be deployed on an [Ubuntu 20.04 operating system image][supported-systems] with 3 control plane nodes, and 4 worker nodes.

## Azure prerequisites

Before you begin using Konvoy with Azure, you must:

1.  Log in to Azure:

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
    az ad sp create-for-rbac --role contributor --name "$(whoami)-konvoy"
    ```

    ```sh
    {
      "appId": "7654321a-1a23-567b-b789-0987b6543a21",
      "displayName": "azure-cli-2021-03-09-23-17-06",
      "name": "http://azure-cli-2021-03-09-23-17-06",
      "password": "Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C",
      "tenant": "a1234567-b132-1234-1a11-1234a5678b90"
    }
    ```

1.  Set the required environment variables:

    ```bash
    export AZURE_SUBSCRIPTION_ID=<id> # b1234567-abcd-11a1-a0a0-1234a5678b90
    export AZURE_TENANT_ID="<tenant>" # a1234567-b132-1234-1a11-1234a5678b90
    export AZURE_CLIENT_ID="<appId>"  # 7654321a-1a23-567b-b789-0987b6543a21
    export AZURE_CLIENT_SECRET='<password>' # Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C
    ```

1.  Base64 encode the same environment variables:

    ```bash
    export AZURE_SUBSCRIPTION_ID_B64="$(echo -n "${AZURE_SUBSCRIPTION_ID}" | base64 | tr -d '\n')"
    export AZURE_TENANT_ID_B64="$(echo -n "${AZURE_TENANT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_ID_B64="$(echo -n "${AZURE_CLIENT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_SECRET_B64="$(echo -n "${AZURE_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

When you completed, move on to the [Bootstrap][bootstrap] section.

[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
[bootstrap]: ../bootstrap
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[supported-systems]: ../../../../supported-operating-systems
