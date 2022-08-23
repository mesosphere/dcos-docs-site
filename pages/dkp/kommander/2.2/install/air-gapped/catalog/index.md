---
layout: layout.pug
navigationTitle: Install Kommander in an air-gapped environment with catalog applications
title: Install Kommander in an air-gapped environment with catalog applications
menuWeight: 10
excerpt: How to install Kommander in an Air-gapped installation with catalog applications
beta: false
enterprise: true
---

This topic shows how to run Kommander on top of an [air-gapped Konvoy cluster][air-gap-konvoy] installation with catalog applications.

Depending on your configuration, there are three different ways you can install DKP to an air-gapped environment.

<p class="message--note"><strong>NOTE: </strong>Ensure you follow the correct procedure for your configuration type, and ignore the other two sections that do not pertain to your environment:</p>

-   Install air-gapped Kommander with DKP Catalog Applications

-   Install air-gapped Kommander with DKP Insights

-   Install air-gapped Kommander with DKP Insights and DKP Catalog Applications

## Load the Docker images into your Docker Registry

1.  Download the DKP image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/kommander-image-bundle-v2.2.1.tar" -O - | tar -xvf -
    ```

1.  Optionally download the DKP catalog applications image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-image-bundle-v2.2.1.tar" -O - | tar -xvf -
    ```

1.  Optionally download the DKP insights image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-insights-image-bundle-v2.2.1.tar"
    ```

1.  See the NOTICES.txt file for 3rd party software attributions and place the kommander-image-bundle-v2.2.1.tar and dkp-catalog-applications-image-bundle-v2.2.1.tar bundles within a location where you can load and push the images to your private Docker registry.

1.  Run the following command to load the air-gapped image bundle into your private Docker registry:

    ```bash
    dkp push image-bundle --image-bundle kommander-image-bundle-v2.2.1.tar --to-registry <REGISTRY_URL>
    dkp push image-bundle --image-bundle dkp-catalog-applications-image-bundle-v2.2.1.tar --to-registry <REGISTRY_URL>`
    dkp push image-bundle --image-bundle dkp-insights-image-bundle-v2.2.1.tar --to-registry <REGISTRY_URL>`
    ```

## Install air-gapped Kommander with the DKP Catalog Applications

Use this section to install DKP with Catalog Applications.

### Prerequisites

To use the DKP Catalog Applications in an air-gapped environment, you need the following files (including downloading and pushing the dkp-insights-image-bundle file mentioned above):

1.  Download the DKP catalog application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-v2.2.1.tar.gz"
    ```

1.  Download the [DKP catalog applications](/wiki/spaces/DENT/pages/29919387) chart bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the Kommander charts bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-kommander-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the Kommander application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/kommander-applications-v2.2.1.tar.gz"
    ```

### Install Kommander

Follow these steps:

1.  Create the [configuration file](https://d2iq.atlassian.net/wiki/pages/createpage.action?spaceKey=DKP&title=Kommander%20Install%20Configuration) by running dkp install kommander --init --airgapped > install.yaml for the air-gapped deployment. Open the install.yaml file and review that it looks like the following:

    ```bash
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    airgapped:
      enabled: true
    ```

1.  In the same file, if you are installing Kommander in an AWS VPC, set the Traefik annotation to create an internal facing ELB by setting the following:

    ```bash
    apps:
      traefik:
        values: |
          service:
            annotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    catalog:
      repositories:
        - name: dkp-catalog-applications
          labels:
            kommander.d2iq.io/project-default-catalog-repository: "true"
            kommander.d2iq.io/workspace-default-catalog-repository: "true"
            kommander.d2iq.io/gitapps-gitrepository-type: "dkp"
          path: ./dkp-catalog-applications.tar.gz
    ```

1.  To install DKP in your air-gapped environment using the above configuration file, run the following command:

    ```bash
    dkp install kommander --installer-config ./install.yaml\
    --kommander-applications-repository kommander-applications-v2.2.1.tar.gz\
    --charts-bundle dkp-kommander-charts-bundle-v2.2.1.tar.gz\
    --charts-bundle dkp-catalog-applications-charts-bundle-v2.2.1.tar.gz
    ```

1.  [Verify your installation](https:...).

## Install air-gapped Kommander with DKP Insights

Use this section to install DKP with DKP Insights.

### Prerequisites

If you are utilizing [DKP Insights](/wiki/spaces/DINS) in an air-gapped environment, there are additional files in order to use the DKP Insights engine:

1.  Download the DKP Insights catalog:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-insights-v2.2.1.tar.gz"
    ```

1.  Download the DKP Insights chart bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-insights-charts-bundle-v2.2.1.tar.gz"
    ```

1.  Download the Kommander charts bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-kommander-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the Kommander application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/kommander-applications-v2.2.1.tar.gz"
    ```

### Install Kommander

1.  Create the [configuration file](/wiki/spaces/DENT/pages/29892161) by running dkp install kommander --init --airgapped > install.yaml for the air-gapped deployment. Open the install.yaml file and review that it looks like the following:

    ```bash
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    airgapped:
      enabled: true
    ```

1.  In the same file, if you are installing Kommander in an AWS VPC, set the Traefik annotation to create an internal facing ELB by setting the following:

    ```bash
    apps:
      traefik:
        values: |
          service:
            annotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    dkp-insights-management:
      enabled: true
    catalog:
      repositories:
        - name: insights-catalog-applications
          labels:
            kommander.d2iq.io/workspace-default-catalog-repository: "true"
            kommander.d2iq.io/gitapps-gitrepository-type: "dkp"
          path: ./dkp-insights-v2.2.1.tar.gz
    ```

1.  Push the DKP Insights charts bundle:

    ```bash
    dkp push chart-bundle dkp-insights-charts-bundle-v2.2.1.tar.gz
    ```

1.  Install DKP with Insights enabled by running:

    ```bash
    dkp install kommander --installer-config ./install.yaml\
    --kommander-applications-repository kommander-applications-v2.2.1.tar.gz\
    --charts-bundle dkp-kommander-charts-bundle-v2.2.1.tar.gz\
    --charts-bundle dkp-insights-charts-bundle-v2.2.1.tar.gz
    ```

1.  [Verify your installation](...).

## Install air-gapped Kommander with DKP Insights and DKP Catalog Applications

Use this section to install DKP with DKP Insights and Catalog Applications.

### Prerequisites

Follow these steps:

1.  Download the DKP catalog application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-v2.2.1.tar.gz"
    ```

1.  Download the [DKP catalog applications](/wiki/spaces/DENT/pages/29919387) chart bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-catalog-applications-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the DKP Insights catalog:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-insights-v2.2.1.tar.gz"
    ```

1.  Download the DKP Insights chart bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-insights-charts-bundle-v2.2.1.tar.gz"
    ```

1.  Download the Kommander charts bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/dkp-kommander-charts-bundle-v2.2.1.tar.gz" -O - | tar -xvf -
    ```

1.  Download the Kommander application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.1/kommander-applications-v2.2.1.tar.gz"
    ```

### Install Kommander

Follow these steps:

1.  Create the [configuration file](/wiki/spaces/DENT/pages/29892161) by running dkp install kommander --init --airgapped > install.yaml for the air-gapped deployment. Open the install.yaml file and review that it looks like the following:

    ```bash
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    airgapped:
      enabled: true
    ```

1.  In the same file, if you are installing Kommander in an AWS VPC, set the Traefik annotation to create an internal facing ELB by setting the following:

    ```bash
    apps:
      traefik:
        values: |
          service:
            annotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    dkp-insights-management:
      enabled: true
    catalog:
      repositories:
        - name: insights-catalog-applications
          labels:
            kommander.d2iq.io/workspace-default-catalog-repository: "true"
            kommander.d2iq.io/gitapps-gitrepository-type: "dkp"
          path: ./dkp-insights-v2.2.1.tar.gz
        - name: dkp-catalog-applications
          labels:
            kommander.d2iq.io/project-default-catalog-repository: "true"
            kommander.d2iq.io/workspace-default-catalog-repository: "true"
            kommander.d2iq.io/gitapps-gitrepository-type: "dkp"
          path: ./dkp-catalog-applications.tar.gz
    ```

1.  Follow the steps on the [Configure an Enterprise catalog](/wiki/spaces/DENT/pages/29892180) page to configure the DKP catalog applications.

1.  To install DKP in your air-gapped environment using the above configuration file, run the following command:

    ```bash
    dkp install kommander --installer-config ./install.yaml\
    --kommander-applications-repository kommander-applications-v2.2.1.tar.gz\
    --charts-bundle dkp-kommander-charts-bundle-v2.2.1.tar.gz\
    --charts-bundle dkp-catalog-applications-charts-bundle-v2.2.1.tar.gz\
    --charts-bundle dkp-insights-charts-bundle-v2.2.1.tar.gz
    ```

1.  [Verify your installation](https://d2iq.atlassian.net/wiki/spaces/DENT/pages/29892245/Install+Kommander+in+a+Networked+Environment#Verify-installation).

## Useful DKP CLI Commands

### Kommander Charts Bundle

The charts bundle is a gzipped tar archive containing Helm charts, which are required during Kommander installation. Create the charts bundle with the Kommander CLI or downloaded along with the DKP CLI. Execute this command to create the charts bundle:

```bash
dkp create chart-bundle
```

DKP creates charts-bundle.tar.gz. Optionally, specify the output using the -o parameter:

```bash
dkp create chart-bundle -o [name of the output file]
```

### DKP Internal Helm Repository

The DKP charts bundle is pushed to DKP's internal Helm repository. To inspect the contents:

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
