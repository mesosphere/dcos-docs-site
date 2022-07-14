---
layout: layout.pug
navigationTitle: Install Kommander in an air-gapped environment with catalog applications
title: Install Kommander in an air-gapped environment with catalog applications
menuWeight: 10
excerpt: Install Kommander in an air-gapped environment with catalog applications
beta: false
enterprise: true
---


This topic shows how to run Kommander on top of an [air-gapped Konvoy cluster][air-gap-konvoy] installation with catalog applications.

## Prerequisites

Before installing, ensure you have:

-   A Docker registry containing all the necessary Docker images, including the Kommander and [DKP catalog application][dkp_catalog_applications] images.

-   A charts bundle file containing all Helm charts that Kommander installation needs, including the [DKP catalog applications][dkp_catalog_applications] charts.

-   Connectivity with clusters attaching to the management cluster:
    - See more details about attaching air-gapped clusters in the [Managing Clusters](../../../clusters/attach-cluster/cluster-with-network-restrictions/) documentation.
    - Both management and attached clusters must be able to connect to the Docker registry.
    - The management cluster must be able to connect to all attached cluster's API servers.
    - The management cluster must be able to connect to any load balancers created for platform services on the management cluster.

-   A [configuration file][kommander-config] that you can adapt to your needs using the steps outlined in this topic. Make sure to create that file using the following command:

  ```bash
  dkp install kommander --init --airgapped > install.yaml
  ```

-   All the prerequisites covered in [air-gapped Konvoy installation][air-gap-before-you-begin].

-   MetalLB can now be installed when creating your Kubernetes cluster, refer to [the Konvoy installation instructions](../../../../../konvoy/2.2/choose-infrastructure/pre-provisioned/metal-lb) for new clusters, and if you're upgrading refer to the [Konvoy upgrade instructions](../../../../../konvoy/2.2/dkp-upgrade/).

### Kommander charts bundle

The charts bundle is a gzipped Tar archive containing Helm charts, which are required during Kommander installation.
Create the charts bundle with the Kommander CLI or downloaded along with the Kommander CLI.
Execute this command to create the charts bundle:

   ```bash
   dkp create chart-bundle
   ```

Kommander creates `charts-bundle.tar.gz`.
Optionally, specify the output using the `-o` parameter:

   ```bash
   dkp create chart-bundle -o [name of the output file]
   ```

### Kommander's internal Helm repository

The Kommander charts bundle is pushed to Kommander's internal Helm repository.
To inspect the contents:

   ```bash
   dkp get charts
   ```

Individual charts can be removed using:

   ```bash
   dkp delete chart [chartName] [chartVersion]
   ```

It is possible to push new charts as well:

   ```bash
   dkp push chart [chartTarball]
   ```

Or push a new bundle:

   ```bash
   dkp push chart-bundle [chartsTarball]
   ```

Check the built-in help text for each command for more information.

### Load the Docker images into your Docker registry

1.  Download the Kommander image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/kommander-image-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the [DKP catalog applications][dkp_catalog_applications] image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-image-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  See the `NOTICES.txt` file for 3rd party software attributions and place the `kommander-image-bundle-v2.2.1.tar.gz` and `dkp-catalog-applications-image-bundle-v2.2.1.tar.gz` bundles within a location where you can load and push the images to your private Docker registry.

1.  Run the following command to load the air-gapped image bundle into your private Docker registry:

    ```bash
    dkp push image-bundle --image-bundle kommander-image-bundle-v2.2.1.tar.gz --to-registry <REGISTRY_URL>
    dkp push image-bundle --image-bundle catalog-applications-image-bundle.tar.gz --to-registry <REGISTRY_URL>
    ```

It may take a while to push all the images to your image registry, depending on the performance of the network between the machine you are running the script on and the Docker registry.

## Install on Konvoy

1.  Create the [configuration file][kommander-config] by running `kommander install --init --airgapped > install.yaml` for the air-gapped deployment. Open the `install.yaml` file and review that it looks like the following:

    ```yaml
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    airgapped:
      enabled: true
    ```

1.  In the same file, if you are installing Kommander in an AWS VPC, set the Traefik annotation to create an internal facing ELB by setting the following:

    ```yaml
    apps:
      traefik:
        values: |
          service:
            annotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    ```

1.  Follow the steps on the [Configure an Enterprise catalog](../../configuration/enterprise-catalog#air-gapped-catalog-configuration) page.

1.  Download the Kommander application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/kommander-applications-v2.2.1.tar.gz"
    ```

1.  Download the Kommander charts bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-kommander-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the [DKP catalog applications][dkp_catalog_applications] chart bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  To install Kommander in your air-gapped environment using the above configuration file, enter the following command:

    ```bash
    dkp install kommander --installer-config ./install.yaml \
    --kommander-applications-repository kommander-applications-v2.2.1.tar.gz \
    --charts-bundle dkp-kommander-charts-bundle-v2.2.1.tar.gz \
    --charts-bundle dkp-catalog-applications-charts-bundle-v2.2.1.tar.gz
    ```

1.  [Verify your installation](../../networked#verify-installation).

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0][https://www.gnu.org/licenses/agpl-3.0.en.html]. The complete source code for the versions of MinIO packaged with DKP 2.2.1 are available at these URLs:

* https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z
* https://github.com/minio/minio/tree/RELEASE.2022-01-08T03-11-54Z
* https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z

[air-gap-before-you-begin]: /dkp/konvoy/2.2/choose-infrastructure/aws/air-gapped/prerequisites/
[air-gap-konvoy]: /dkp/konvoy/2.2/choose-infrastructure/aws/air-gapped/
[kommander-config]: ../../configuration
[kommander-load-balancing]: ../../../networking/load-balancing
[dkp_catalog_applications]: ../../../workspaces/applications/catalog-applications/dkp-applications/
