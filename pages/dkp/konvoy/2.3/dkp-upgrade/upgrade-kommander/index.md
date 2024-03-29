---
layout: layout.pug
navigationTitle: Upgrade Kommander
title: Upgrade Kommander
menuWeight: 20
excerpt: Steps to upgrade Kommander via CLI
beta: false
---

This section describes how to upgrade your Kommander Management cluster and all Platform Applications to their supported versions in networked, air-gapped, and on-prem environments. To prevent compatibility issues, you must first upgrade Kommander on your Management Cluster before upgrading to DKP.

## Prerequisites

-   **REQUIRED** Before upgrading, create an [on-demand backup][backup] of your current configuration with Velero.
-   [Download][download_binary] and install the latest DKP CLI binary on your computer.
-   Ensure you are on DKP version 2.2 or 2.2.x and Kubernetes version 1.22.
-   If you have attached clusters, ensure they are on Kubernetes versions 1.21 or 1.22.
-   Review the [Platform Application version updates][release_notes] that are part of this upgrade.  
-   For air-gapped environments **with** DKP Catalog Applications in a multi-cluster environment: [Load the Docker images into your Docker registry][load_images_catalog]
-   For air-gapped environments **without** DKP Catalog Applications: [Load the Docker images into your Docker registry][load_images]
-   For air-gapped environments only:

  Download the Kommander application definitions:

  ```bash
  wget "https://downloads.d2iq.com/dkp/v2.3.0/kommander-applications-v2.3.0.tar.gz"
  ```

  Download the Kommander charts bundle:

  ```bash
  wget "https://downloads.d2iq.com/dkp/v2.3.0/dkp-kommander-charts-bundle-v2.3.0.tar.gz"
  ```

  If you have any DKP Catalog Applications, download the DKP Catalog Application charts bundle:

  ```bash
  wget "https://downloads.d2iq.com/dkp/v2.3.0/dkp-catalog-applications-charts-bundle-v2.3.0.tar.gz"
  ```

## Detach MetalLB from Kommander

  <p class="message--important"><strong>IMPORTANT:</strong> Beginning with DKP version 2.3, MetalLB is no longer managed as a platform application. If you installed MetalLB on the cluster that you're upgrading prior to DKP version 2.3, you will need to detach MetalLB from the cluster prior to upgrading.</p>

  1.  Pause the helm release:

      ```bash
      kubectl -n kommander patch -p='{"spec":{"suspend": true}}' --type=merge helmrelease/metallb
      ```
  
      ```sh
      helmrelease.helm.toolkit.fluxcd.io/metallb patched
      ```

  1.  Delete the helm release secret:
  
      ```bash
      kubectl -n kommander delete secret -l name=metallb,owner=helm
      ```

      ```sh
      secret "sh.helm.release.v1.metallb.v1" deleted
      ```

  1.  Delete MetalLB:

      ```bash
      kubectl -n kommander delete appdeployment metallb
      ```

      ```sh
      appdeployment.apps.kommander.d2iq.io "metallb" deleted
      ```

  1.  Unpause the helm release.

      ```bash
      kubectl -n kommander patch -p='{"spec":{"suspend": false}}' --type=merge helmrelease/metallb
      ```

      ```sh
      helmrelease.helm.toolkit.fluxcd.io/metallb patched
      ```

      This deletes MetalLb from Kommander while leaving the resources running in the cluster.

      ```bash
      kubectl -n kommander get pod -l app=metallb
      ```

      ```sh
      NAME                                 READY   STATUS    RESTARTS   AGE
      metallb-controller-d657c8dbb-zlgrk   1/1     Running   0          20m
      metallb-speaker-2gz6p                1/1     Running   0          20m
      metallb-speaker-48d44                1/1     Running   0          20m
      metallb-speaker-6gp76                1/1     Running   0          20m
      metallb-speaker-dh9dm                1/1     Running   0          20m
      ```

## Upgrade Kommander

Before running the following command, ensure that your `dkp` configuration **references the Kommander Management cluster**, otherwise it attempts to run the upgrade on the bootstrap cluster. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file's location][k8s_access_to_clusters].

<p class="message--note"><strong>NOTE:</strong> As stated earlier, an alternative to initializing the KUBECONFIG environment variable is to use the <code>–kubeconfig=cluster_name.conf</code> flag. This ensures that Kommander upgrades on the workload cluster.</p>

1.  Use the DKP CLI to upgrade Kommander and all the Platform Applications in the Management Cluster:

    -   For air-gapped:

        ```bash
        dkp upgrade kommander --charts-bundle dkp-kommander-charts-bundle-v2.3.0.tar.gz --kommander-applications-repository kommander-applications-v2.3.0.tar.gz
        ```

    -   For air-gapped **with** DKP Catalog Applications in a multi-cluster environment:

        ```bash
        dkp upgrade kommander --charts-bundle dkp-kommander-charts-bundle-v2.3.0.tar.gz --charts-bundle dkp-catalog-applications-charts-bundle-v2.3.0.tar.gz --kommander-applications-repository kommander-applications-v2.3.0.tar.gz
        ```

        After the upgrade, follow the [DKP Catalog Applications configuration page](../../../../kommander/2.3/install/configuration/enterprise-catalog#air-gapped-catalog-configuration) to update the Git repository.

    -   For non air-gapped:

        ```bash
        dkp upgrade kommander
        ```

        If you have DKP Catalog Applications deployed, follow the [DKP Catalog Applications configuration page](../../../../kommander/2.3/install/configuration/enterprise-catalog#configure-a-default-enterprise-catalog) to update the Git repository after the upgrade.

        ```bash
        dkp upgrade kommander  --kommander-applications-repository ~/work/git_repos/kommander-applications
        ```

        An output similar to this appears:

        ```sh
        ✓ Ensuring upgrading conditions are met
        ✓ Ensuring application definitions are updated
        ✓ Ensuring helm-mirror implementation is migrated to chartmuseum
        ...
        ```

1.  For air-gapped deployments, an additional step is required to upgrade the Grafana Loki MinIO Tenant:

    ```bash
    kubectl patch statefulset grafana-loki-minio-ss-0 -n kommander --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"quay.io/minio/minio:RELEASE.2022-01-08T03-11-54Z"}]'
    ```

1.  If the upgrade fails, run the following command to get more information on the upgrade process:

    ```bash
    dkp upgrade kommander -v 4
    ```

1.  For Enterprise customers (multi-cluster environment): Upgrade your additional [Workspaces][upgrade_workspaces] on a per-Workspace basis to upgrade the Platform Applications on other clusters than the Management Cluster.
    For Essential customers (single-cluster environment): Proceed with the [Konvoy Upgrade][konvoy_upgrade].

You can always go back to the [DKP Upgrade overview][dkp_upgrade], to review the next steps depending on your environment and license type.

This Docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html). The complete source code for the versions of MinIO packaged with DKP 2.3.0 are available at these URLs:

* https://github.com/minio/minio/tree/RELEASE.2022-04-01T03-41-39Z
* https://github.com/minio/minio/tree/RELEASE.2022-01-08T03-11-54Z

[download_binary]: ../../download/
[AKS]: https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster
<!--- [AWS]: ../../choose-infrastructure/aws/advanced/update/
[Azure]: ../../choose-infrastructure/azure/advanced/update/ -->
[EKS]: https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html
<!--- [pre_provisioned]: ../../choose-infrastructure/pre-provisioned/upgrade/control-plane/ -->
[k8s_access_to_clusters]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[upgrade_workspaces]: ../../../../kommander/2.3/projects/applications/platform-applications#upgrade-platform-applications-from-the-cli
[release_notes]: ../../release-notes/
[konvoy_upgrade]: ../upgrade-konvoy/
[load_images]: ../../../../kommander/2.3/install/air-gapped#load-the-docker-images-into-your-docker-registry
[dkp_upgrade]: ../
[load_images_catalog]: ../../../../kommander/2.3/install/air-gapped/catalog#load-the-docker-images-into-your-docker-registry
[backup]: ../../../../kommander/2.3/backup-and-restore#back-up-on-demand
