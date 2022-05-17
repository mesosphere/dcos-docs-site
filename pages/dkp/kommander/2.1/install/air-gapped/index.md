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

-   Connectivity with clusters attaching to the management cluster:
    - Both management and attached clusters must connect to the Docker registry.
    - Management cluster must connect to the attached cluster's API server.
    - Management cluster must connect to load balancers created by some platform services.

-   A [configuration file][kommander-config] that you will adapt to your needs using the steps outlined in this topic. Make sure to create that file using the following command:

  ```bash
  kommander install --init > install.yaml
  ```

-   All the prerequisites covered in [air-gapped Konvoy installation][air-gap-before-you-begin].

-   [MetalLB enabled and configured][air-gap-install-metallb], which provides load-balancing services.

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

### Determine the installation version

Set the `VERSION` environment variable to the version of Kommander you want to install, for example:

```bash
export VERSION=v2.1.1
```

### Load the Docker images into your Docker registry

1.  Download the image bundle file:

    ```bash
    wget "https://downloads.d2iq.com/kommander/airgapped/${VERSION}/kommander_image_bundle_${VERSION}_linux_amd64.tar" -O kommander-image-bundle.tar
    ```

    <p class="message--note"><strong>NOTE: </strong>This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio">here</a>.</p>

1.  Place the bundle in a location where you can load and push the images to your private Docker registry.

1.  Ensure you set the `REGISTRY_URL` and `AIRGAPPED_TAR_FILE` variable appropriately, then use the following script to load the air-gapped image bundle:

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail
    IFS=$'\n\t'

    readonly AIRGAPPED_TAR_FILE=${AIRGAPPED_TAR_FILE:-"kommander-image-bundle.tar"}
    readonly REGISTRY_URL=${REGISTRY_URL?"Need to set REGISTRY_URL. E.g: 10.23.45.67:5000"}

    docker load <"${AIRGAPPED_TAR_FILE}"

    while read -r IMAGE; do
        echo "Processing ${IMAGE}"
        REGISTRY_IMAGE="$(echo "${IMAGE}" | sed -E "s@^(quay|gcr|ghcr|docker|k8s.gcr).io@${REGISTRY_URL}@")"
        docker tag "${IMAGE}" "${REGISTRY_IMAGE}"
        docker push "${REGISTRY_IMAGE}"
    done < <(tar xfO "${AIRGAPPED_TAR_FILE}" "index.json" | grep -oP '(?<="io.containerd.image.name":").*?(?=",)')
    ```

Based on the network latency between the environment of script execution and the docker registry, this can take a while to upload all the images to your image registry.

## Install on Konvoy

1.  Adapt the [configuration file][kommander-config] created from running `kommander install --init > install.yaml` for the air-gapped deployment by changing the `.apps.kommander` section. Ensure you use the actual version number everywhere `${VERSION}` appears:

    ```yaml
    apiVersion: config.kommander.mesosphere.io/v1alpha1
    kind: Installation
    apps:
      ...
      kommander:
        values: |
          authorizedlister:
            image:
              tag: ${VERSION}-amd64
          controller:
            containers:
              manager:
                image:
                  tag: ${VERSION}-amd64
          fluxOperator:
            containers:
              manager:
                image:
                  tag: ${VERSION}-amd64
          kommander-licensing:
            controller:
              containers:
                manager:
                  image:
                    tag: ${VERSION}-amd64
            webhook:
              image:
                tag: ${VERSION}-amd64
          kubetools:
            image:
              tag: ${VERSION}-amd64
          webhook:
            image:
              tag: ${VERSION}-amd64
    ...
    ```

1.  In the same file, adapt the other image tags accordingly and enable air-gapped mode. Replace `${VERSION}` with the actual version number:

    ```yaml
    appManagementImageTag: "${VERSION}-amd64"
    airgapped:
      enabled: true
      helmMirrorImageTag: "${VERSION}-amd64"
    ```

1.  In the same file, if you are installing Kommander in an AWS VPC, set the Traefik annotation to create an internal facing ELB:

    ```yaml
    apps:
      traefik:
        values: |
          service:
            annotations:
              service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    ```

1.  Download and extract the `kommander-applications` bundle.

    ```bash
    mkdir kommander-applications && wget https://downloads.d2iq.com/dkp/kommander-applications_${VERSION}.tar.gz -O - | tar xvzf - -C kommander-applications
    ```

    <p class="message--note"><strong>NOTE: </strong>This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio">here</a>.</p>

1.  To install Kommander in your air-gapped environment using the above configuration file, enter the following command:

    ```bash
    kommander install --installer-config ./install.yaml --kommander-applications-repository ./kommander-applications
    ```

1.  [Verify your installation](../networked#verify-installation).

[air-gap-before-you-begin]: /dkp/konvoy/2.1/choose-infrastructure/aws/air-gapped/prerequisites/
[air-gap-install-metallb]: #use-metallb
[air-gap-konvoy]: /dkp/konvoy/2.1/choose-infrastructure/aws/air-gapped/
[kommander-config]: ../configuration
[kommander-load-balancing]: ../../networking/load-balancing
[metallb]: https://metallb.universe.tf/concepts/
[metallb_config]: https://metallb.universe.tf/configuration/
