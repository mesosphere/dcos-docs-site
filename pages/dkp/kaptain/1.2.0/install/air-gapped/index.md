---
layout: layout.pug
navigationTitle: Install air-gapped
title: Install Kaptain on an air-gapped cluster
menuWeight: 10
excerpt: Install Kaptain on an air-gapped cluster
beta: false
enterprise: false
---

## Air-Gapped Installation

<p class="message--note"><strong>IMPORTANT: </strong>The air-gapped installation procedure is still in beta, so the process may change in the future.</p>

Kaptain supports installation on an air-gapped (a.k.a. offline or private) Konvoy cluster.
Before installing Kaptain, please follow the [Konvoy Air-Gapped Installation Guide][konvoy-air-gap]
to set up the air-gapped Konvoy cluster. The cluster admin is responsible for configuring the
Konvoy `cluster.yaml` correctly and ensuring container images have been pre-loaded to the private
registry before spinning up the cluster.

The installation steps for Kaptain on an air-gapped cluster are as follows:

* Download `kaptain_air_gapped.tar.gz` that will contain the required artifacts to perform an air-gapped installation.

* Unpack `kaptain_air_gapped.tar.gz` and copy the following files and folders into the Konvoy working directory (`<konvoy_artifacts_dir>`):
    * `<kaptain_artifacts_dir>/images.json` to `<konvoy_artifacts_dir>/extras/images/kaptain/`
    * `<kaptain_artifacts_dir>/images/*` to `<konvoy_artifacts_dir>/extras/images/kaptain/`
    * `<kaptain_artifacts_dir>/kubeaddons-kaptain` `<konvoy_artifacts_dir>/`

* Add the Kaptain addon repository to the `cluster.yaml` file and update other addon repositories to use Kaptain's Docker
 image which includes Kaptain specific addons:
	```yaml
    - configRepository: /opt/konvoy/artifacts/kubeaddons-kaptain
      configVersion: stable-1.20-1.3.0
      addonRepository:
        image: mesosphere/kubeflow:kaptain-addons-stable-1.20-1.3.0
      addonsList:
        - name: knative
          enabled: true
	```
* Load, re-tag, and push all images to the private registry by using the Konvoy CLI:
    ```bash
    konvoy config images seed
    ```

* Spin up the Konvoy cluster:
    ```bash
    konvoy up
    ```

* When the Konvoy cluster is ready, [install Kaptain][install-kaptain].

[install-kaptain]: ../konvoy/
[konvoy-air-gap]: /dkp/konvoy/1.8/install/install-airgapped/
