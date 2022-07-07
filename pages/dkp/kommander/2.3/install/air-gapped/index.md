---
layout: layout.pug
navigationTitle: Install Kommander in an air-gapped environment
title: Install Kommander in an air-gapped environment
menuWeight: 30
excerpt: Install Kommander in an air-gapped environment
beta: false
enterprise: false
---

This topic shows how to run Kommander on top of an [air-gapped Konvoy cluster][air-gap-konvoy] installation.

## Prerequisites

Before installing, ensure you have:

-   A Docker registry containing all the necessary Docker installation images, including the Kommander images. The `kommander-image-bundle.tar` tarball has the required artifacts.

-   A charts bundle file containing all Helm charts that Kommander installation needs.

-   Connectivity with clusters attaching to the management cluster:
    - Both management and attached clusters must be able to connect to the Docker registry.
    - The management cluster must be able to connect to all attached cluster's API servers.
    - The management cluster must be able to connect to any load balancers created for platform services on the management cluster.

-   A [configuration file][kommander-config] that you will adapt to your needs using the steps outlined in this topic. Make sure to create that file using the following command:

  ```bash
  dkp install kommander --init --airgapped > install.yaml
  ```

-   All the prerequisites covered in [air-gapped Konvoy installation][air-gap-before-you-begin].

-   [MetalLB enabled and configured][air-gap-install-metallb], which provides load-balancing services.

-   Sufficient resources on your cluster to run Kommander. Review the [Management cluster application requirements](../mgmt-cluster-apps) and [Workspace platform application requirements](../../workspaces/applications/platform-applications/platform-application-requirements) for application requirements.

### Kommander charts bundle

The charts bundle is a gzipped Tar archive containing Helm charts, which are required during Kommander installation.
Create the charts bundle with the DKP CLI or downloaded along with the DKP CLI.
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

### Use MetalLB

For an on-premises deployment, Kommander ships with [MetalLB][metallb], which provides load-balancing services.

<p class="message--note"><strong>NOTE: </strong>Making a configuration change in the <code>ConfigMap</code> for the <code>metallb</code> application may not result in the configuration change applying. This is <a href="https://github.com/danderson/metallb/issues/348#issuecomment-442218138" target="_blank">intentional behavior</a>. MetalLB refuses to adopt changes to the ConfigMap that breaks existing Services. You can force MetalLB to load those changes by deleting the <code>metallb</code> controller pod:</p>

   ```bash
   kubectl -n kommander delete pod -l app=metallb,component=controller
   ```

To use MetalLB:

1.  Identify and reserve a virtual IP (VIP) address range in your networking infrastructure.

1.  Configure your networking infrastructure so that the reserved IP addresses is reachable:

    - from all hosts specified in the inventory file.
    - from the computer used to deploy Kubernetes.

<p class="message--note"><strong>NOTE: </strong>Ensure the MetalLB subnet does not overlap with <code>podSubnet</code> and <code>serviceSubnet</code>.</p>

Your configuration is complete if the reserved virtual IP addresses are in the same subnet as the rest of the cluster nodes.
If it is in a different subnet, configure appropriate routes to ensure connectivity with the virtual IP address.
If the virtual IP addresses share an interface with the primary IP address of the interface, disable any IP or MAC spoofing from the infrastructure firewall.

You can configure MetalLB in two modes: Layer2 and BGP.

#### Layer2

The following example illustrates how to enable MetalLB and configure it with the Layer2 mode using the `install.yaml` configuration file created above:

   ```yaml
   apiVersion: config.kommander.mesosphere.io/v1alpha1
   kind: Installation
   apps:
    ...
     metallb:
       values: |
         configInline:
           address-pools:
             - name: default
               protocol: layer2
               addresses:
                 - 10.0.50.25-10.0.50.50
   ```

The number of virtual IP addresses in the reserved range determines the maximum number of `LoadBalancer` service types you can create in the cluster.

#### BGP

MetalLB in `bgp` mode implements only a subset of the BGP protocol. In particular, it only advertises the virtual IP to peer BGP agent.

The following example illustrates the BGP configuration in the overrides `ConfigMap`:

   ```yaml
   apiVersion: config.kommander.mesosphere.io/v1alpha1
   kind: Installation
   apps:
    ...
     metallb:
       values: |
         configInline:
           peers:
             - my-asn: 64500
               peer-asn: 64500
               peer-address: 172.17.0.4
           address-pools:
             - name: my-ip-space
               protocol: bgp
               addresses:
                 - 172.40.100.0/24
   ```

In the above configuration, `peers` defines the configuration of the BGP peer, such as peer IP address and `autonomous system number` (`asn`).
The `address-pools` section is similar to `layer2`, except for the protocol.

MetalLB also supports [advanced BGP configuration][metallb_config].

See [Kommander Load Balancing][kommander-load-balancing] for more information.

### Load the Docker images into your Docker registry

1.  Download the image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.3.0/kommander-image-bundle-v2.3.0.tar"
    ```

2.  See the `NOTICES.txt` file for 3rd party software attributions and place the `kommander-image-bundle-v2.3.0.tar` bundle within a location where you can load and push the images to your private Docker registry.

3.  Run the following command to load the air-gapped image bundle into your private Docker registry:

    ```bash
    dkp push image-bundle --image-bundle kommander-image-bundle-v2.3.0.tar --to-registry <REGISTRY_URL>
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

1.  Download the Kommander application definitions:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.3.0/kommander-applications-v2.3.0.tar.gz"
    ```

1.  Download the Kommander charts bundle:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.3.0/dkp-kommander-charts-bundle-v2.3.0.tar.gz"
    ```

1.  To install Kommander in your air-gapped environment using the above configuration file, enter the following command:

    ```bash
    dkp install kommander --installer-config ./install.yaml \
    --kommander-applications-repository kommander-applications-v2.3.0.tar.gz \
    --charts-bundle dkp-kommander-charts-bundle-v2.3.0.tar.gz
    ```

1.  [Verify your installation](../networked#verify-installation).

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0][https://www.gnu.org/licenses/agpl-3.0.en.html]. The complete source code for the versions of MinIO packaged with DKP 2.2.0 are available at these URLs:

* https://github.com/minio/minio/tree/RELEASE.2022-04-01T03-41-39Z
* https://github.com/minio/minio/tree/RELEASE.2022-01-08T03-11-54Z

[air-gap-before-you-begin]: /dkp/konvoy/2.2/choose-infrastructure/aws/air-gapped/prerequisites/
[air-gap-install-metallb]: #use-metallb
[air-gap-konvoy]: /dkp/konvoy/2.2/choose-infrastructure/aws/air-gapped/
[kommander-config]: ../configuration
[kommander-load-balancing]: ../../networking/load-balancing
[metallb]: https://metallb.universe.tf/concepts/
[metallb_config]: https://metallb.universe.tf/configuration/
[dkp_catalog_applications]: ../../workspaces/applications/catalog-applications/dkp-applications/
