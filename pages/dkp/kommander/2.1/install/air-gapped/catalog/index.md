---
layout: layout.pug
navigationTitle: Host on Gitea
title: Host on Gitea
menuWeight: 10
excerpt: How to host git repositories on Gitea for air gapped deployments
---

DKP supports using an external catalog git repository to install applications. In cases where an external repository is not accessible from within the cluster, to install applications, use the Gitea server that comes out-of-box with a Kommander deployment.

## Prerequisites

- Install `git` in the local environment (from where a connection to air-gapped cluster is established).

## Host external repository on Gitea

To configure the Gitea server, follow these steps:

1. Set the `VERSION` environment variable to the version of Kommander you want to install, for example:

    ```bash
    export VERSION=v2.1.1
    ```

1. Set the `TARGET_NAMESPACE` to the workspace (or project) namespace in which the catalog repository will be created.

    ```bash
    export TARGET_NAMESPACE=<WORKSPACE_OR_PROJECT_NAMESPACE>
    ```

1. Go to the Gitea UI below and register a new user account:
    
    ```bash
    GITEA_HOSTNAME=$((kubectl -n kommander get cm konvoyconfig-kubeaddons -o go-template='{{if ne .data.clusterHostname ""}}{{.data.clusterHostname}}{{"\n"}}{{end}}' ; kubectl -n kommander get ingress gitea -o jsonpath="{.status.loadBalancer.ingress[0]['ip','hostname']}") | head -1) && echo https://${GITEA_HOSTNAME}/dkp/kommander/git/
    ```

1. Create a new repository under the new user account. Rest of this guide assumes you created a private repository named `dkp-catalog-applications` with `main` as default branch. You can substitute these values as needed. Create environment variables that contain the Gitea credentials and repository metadata:

    ```bash
    GITEA_USERNAME=<YOUR_GITEA_USERNAME>
    GITEA_PASSWORD=<YOUR_GITEA_PASSWORD>
    GITEA_REPOSITORY_NAME=dkp-catalog-applications
    GITEA_REPOSITORY_DEFAULT_BRANCH=main
    ```

1. Clone the newly created repository on your local machine:

    ```bash
    kubectl -n kommander get secret kommander-traefik-certificate -o go-template='{{index .data "ca.crt"|base64decode}}' > /tmp/ca.crt
    git clone -c http.sslCAInfo=/tmp/ca.crt https://${GITEA_USERNAME}:${GITEA_PASSWORD}@${GITEA_HOSTNAME}/dkp/kommander/git/${GITEA_USERNAME}/${GITEA_REPOSITORY_NAME}
    ```

1. Download and extract the catalog repository bundle to your local machine from the download portal and extract the contents into the `${GITEA_REPOSITORY_NAME}` repository cloned in the above step:

    ```bash
    curl -fsSL https://github.com/mesosphere/dkp-catalog-applications/archive/refs/tags/${VERSION}.tar.gz | tar zxf - --strip-components=1 -C ${GITEA_REPOSITORY_NAME}
    ```

<p class="message--note"><strong>NOTE: </strong>This docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio">here</a>.</p>

1. Navigate into the `${GITEA_REPOSITORY_NAME}` directory and push the changes:

    ```bash
    cd ${GITEA_REPOSITORY_NAME}
    git add .
    git commit -m "feat: initialize ${GITEA_REPOSITORY_NAME} for air-gapped"
    git push --set-upstream origin ${GITEA_REPOSITORY_DEFAULT_BRANCH}
    cd ..
    ```

1. Run the following command to create a secret containing Gitea credentials in `TARGET_NAMESPACE`:

    ```bash
    kubectl create secret generic -n${TARGET_NAMESPACE} ${TARGET_NAMESPACE} --type opaque \
        --from-literal=caFile="$(cat /tmp/ca.crt)" \
        --from-literal=username="${GITEA_USERNAME}" \
        --from-literal=password="${GITEA_PASSWORD}"
    ```

    <p class="message--note"><strong>NOTE: </strong>This command needs to be run in Management cluster (where Kommander is installed) and ALL target clusters that belong to the specific Workspace or Project.</p>

1. Optionally, cleanup the certificate and locally cloned repository:

    ```bash
    rm -rf ${GITEA_REPOSITORY_NAME}
    rm /tmp/ca.crt
    ```

1. Run the following command to create the catalog `GitRepository`:

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: ${GITEA_REPOSITORY_NAME}
      namespace: ${TARGET_NAMESPACE}
      labels:
        kommander.d2iq.io/gitapps-gitrepository-type: catalog
        kommander.d2iq.io/gitrepository-type: catalog
    spec:
      interval: 1m0s
      ref:
        branch: ${GITEA_REPOSITORY_DEFAULT_BRANCH}
      timeout: 20s
      url: https://${GITEA_HOSTNAME}/dkp/kommander/git/${GITEA_USERNAME}/${GITEA_REPOSITORY_NAME}
      secretRef:
        name: ${TARGET_NAMESPACE}
    EOF
    ```

1. After the newly created `GitRepository` on the management cluster reconciles, any corresponding `App`s are loaded by Kommander controller.
