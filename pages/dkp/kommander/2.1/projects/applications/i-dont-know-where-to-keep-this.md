---
layout: layout.pug
navigationTitle: Hosting on Gitea
title: Hosting on Gitea
menuWeight: 10
excerpt: How to host git repositories on Gitea for airgapped deployments
---

DKP Supports using an external catalog git repository to install applications. In cases where an external repository is not accessible from within the cluster, it is possible to use the Gitea server that comes out-of-box with a kommander deployment to install applications.

1. Set the `TARGET_NAMESPACE` to the workspace (or project) namespace in which the catalog repository needs to be created.

    ```bash
    export TARGET_NAMESPACE=<WORKSPACE_OR_PROJECT_NAMESPACE>
    ```

1. Create environment variables that contain the Gitea credentials:

    ```bash
    GITEA_USERNAME=$(kubectl get secrets -nkommander-flux kommander-git-credentials -oyaml -o go-template="{{.data.username | base64decode }}")
    GITEA_PASSWORD=$(kubectl get secrets -nkommander-flux kommander-git-credentials -oyaml -o go-template="{{.data.password | base64decode }}")
    ```

1. Using the above username and password, follow the steps below to login to the gitea UI and create a new repository in the `kommander` organization.   
    
    ```bash
    GITEA_URL=$(kubectl -n kommander get ingress gitea -o go-template='https://{{ (index .status.loadBalancer.ingress 0).hostname }}:443/dkp/kommander/git')
    ```

1. Login to the Gitea dashboard at `GITEA_URL` with the `GITEA_USERNAME` and `GITEA_PASSWORD` credentials. Create a new repository named `dkp-catalog-applications` or any other name you prefer.

1. Clone the newly created repository on your local machine:

    ```bash
    git clone -c http.sslVerify=false https://$GITEA_USERNAME:$GITEA_PASSWORD@$GITEA_URL/kommander/dkp-catalog-applications
    ```

1. Download and extract the catalog repository bundle on to your local machine from the download portal and extract the contents into `dkp-catalog-applications` cloned earlier:

    ```bash
    curl -fsSL https://github.com/mesosphere/dkp-catalog-applications/archive/refs/tags/v2.1.1-rc.2.tar.gz | tar zxf - --strip-components=1 -C dkp-catalog-applications
    ```

1. Navigate into the `dkp-catalog-applications` directory and push the changes:

    ```bash
    cd dkp-catalog-applications
    git add .
    git commit -m "feat: initialize dkp-catalog-applications for airgapped"
    git push --set-upstream origin master
    ```

1. Run the following command to create a secret containing Certificate Authority information in `TARGET_NAMESPACE`

    ```bash
    k create secret generic -n${TARGET_NAMESPACE} ${TARGET_NAMESPACE} --from-literal=caFile="$(kubectl get secrets -nkommander-flux kommander-git-credentials -o template='{{ .data.caFile | base64decode }}')" --type opaque
    ```

    **NOTE**: This command needs to be run in ALL target clusters that belong to the specific Workspace or Project. 
    <!-- TODO: Create a federated secret maybe? -->

1. Finally, run the following command to create the catalog `GitRepository`

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: source.toolkit.fluxcd.io/v1beta1
    kind: GitRepository
    metadata:
      name: dkp-catalog-applications
      namespace: ${TARGET_NAMESPACE}
    spec:
      interval: 1m0ss
      ref:
        branch: master
      timeout: 20s
      # TODO: use different url so this works in attached clusters
      url: ${GITEA_URL}/kommander/dkp-catalog-applications.git
      secretRef:
        name: ${TARGET_NAMESPACE}
    EOF
    ```
