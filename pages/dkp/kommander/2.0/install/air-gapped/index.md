---
layout: layout.pug
navigationTitle: Install Kommander in an air-gapped environment
title: Install Kommander in an air-gapped environment
menuWeight: 20
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

-   All the prerequisites covered in [air-gapped Konvoy installation][air-gap-before-you-begin].

### Determine the installation version

Set the `VERSION` environment variable to the version of Kommander you want to install, for example:

```bash
export VERSION=v2.0.0
```

### Load the Docker images into your Docker registry

1.  Download the `kommander-image-bundle.tar.gz` file.

    ```bash
    wget "https://downloads.d2iq.com/kommander/airgapped/${VERSION}/kommander_image_bundle_${VERSION}_linux_amd64.tar" -O kommander-image-bundle.tar
    ```

1.  See the `NOTICES.txt` file for 3rd party software attributions and place the `kommander-image-bundle-v2.0.0.tar.gz` bundle within a location where you can load and push the images to your private Docker registry.

1.  Ensure you set the `REGISTRY_URL` and `AIRGAPPED_TAR_FILE` variable appropriately and then use the following script to load the air-gapped image bundle:

    ```bash
    #!/usr/bin/env bash
    set -euo pipefail
    IFS=$'\n\t'

    readonly AIRGAPPED_TAR_FILE=${AIRGAPPED_TAR_FILE:-"kommander-image-bundle.tar"}
    readonly REGISTRY_URL=${REGISTRY_URL?"Need to set REGISTRY_URL. E.g: 10.23.45.67:5000"}

    docker load <"${AIRGAPPED_TAR_FILE}"

    while read -r IMAGE; do
        echo "Processing ${IMAGE}"
        REGISTRY_IMAGE="$(echo "${IMAGE}" | sed -E "s@^(quay|gcr|ghcr|docker).io@${REGISTRY_URL}@")"
        docker tag "${IMAGE}" "${REGISTRY_IMAGE}"
        docker push "${REGISTRY_IMAGE}"
    done < <(tar xfO "${AIRGAPPED_TAR_FILE}" "index.json" | grep -oP '(?<="io.containerd.image.name":").*?(?=",)')
    ```

Based on the network latency between the environment of script execution and the docker registry, this can take a while to upload all the images to your image registry.

## Install on Konvoy

1.  Kommander v2.0 ships in a Helm chart. Prior to installing Kommander, ensure the helm charts for an air-gapped deployment are available locally. To get the latest chart:

    ```bash
    wget "https://mesosphere.github.io/kommander/charts/kommander-bootstrap-${VERSION}.tgz"
    ```

1.  Create the following `values.yaml` file that can be used for installing Kommander in your air-gapped environment:

    ```yaml
    export GOARCH=amd64
    export CERT_MANAGER=$(kubectl get ns cert-manager > /dev/null 2>&1 && echo "false" || echo "true")
    cat <<EOF > values-airgapped.yaml
    airgapped:
      enabled: true
      helmMirror:
        image:
          tag: ${VERSION}-${GOARCH}
    certManager: ${CERT_MANAGER}
    authorizedlister:
      image:
        tag: ${VERSION}-${GOARCH}
    webhook:
      image:
        tag: ${VERSION}-${GOARCH}
    bootstrapper:
      containers:
        manager:
          image:
            tag: ${VERSION}-${GOARCH}
    controller:
      containers:
        manager:
          image:
            tag: ${VERSION}-${GOARCH}
    fluxOperator:
      containers:
        manager:
          image:
            tag: ${VERSION}-${GOARCH}
    gitrepository:
      image:
        tag: ${VERSION}-${GOARCH}
    EOF
    ```

1.  To install Kommander in your air-gapped environment using the above `values.yaml` file, enter the following command:

    ```bash
    helm install -n kommander --create-namespace kommander-bootstrap kommander-bootstrap-${VERSION}.tgz --values values-airgapped.yaml
    ```

1.  If you are installing Kommander in an AWS VPC, set the Traefik annotation to create an internal facing ELB by creating the following configmap in the `kommander` namespace:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: traefik-overrides
      namespace: kommander
    data:
      values.yaml: |
        ---
        service:
          annotations:
            service.beta.kubernetes.io/aws-load-balancer-internal: "true"
    EOF
    ```

1.  [Verify your installation](../networked#verify-installation).

[air-gap-konvoy]: /dkp/konvoy/2.0/choose_infrastructure/aws/air-gapped/
[air-gap-before-you-begin]: /dkp/konvoy/2.0/choose_infrastructure/aws/air-gapped/prerequisites/
