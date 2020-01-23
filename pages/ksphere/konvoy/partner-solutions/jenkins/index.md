---
layout: layout.pug
navigationTitle: Jenkins
title: Jenkins
excerpt: Jenkins on Konvoy
menuWeight: 70
category: 
---

# Installing Jenkins&reg; on Konvoy

Jenkins can be installed in several ways:

1. Using the Kommander catalog addon (Recommended)
2. From an upstream helm repo

## Install from Kommander Catalog Addons

### Prerequisites

You must have a running Konvoy cluster attached to a Kommander instance. If this is not the case, follow these instructions to deploy one:

1. Go to the Kommander UI and attach the Konvoy clusters in which you desire to install Jenkins.
1. Create a project with labels matching this cluster, if it doesn't already exist.
1. Make any necessary changes to the configuration, if needed.
1. Go to **Projects > Select your Project > View Catalog > Select Jenkins > Deploy** 

Your Jenkins instance will deploy.

## Installing Jenkins from upstream helm chart

1. Create a service account, role and role binding, changing permissions as necessary.

    ```bash
    cat <<EOF | kubectl create -f -
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
    name: jenkins
    namespace: jenkins
    ---
    kind: Role
    apiVersion: rbac.authorization.k8s.io/v1beta1
    metadata:
    name: jenkins
    namespace: jenkins
    rules:
    - apiGroups: [""]
    resources: ["pods"]
    verbs: ["create","delete","get","list","patch","update","watch"]
    - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create","delete","get","list","patch","update","watch"]
    - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get","list","watch"]
    - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get"]
    ---
    apiVersion: rbac.authorization.k8s.io/v1beta1
    kind: RoleBinding
    metadata:
    name: jenkins
    namespace: jenkins
    roleRef:
    apiGroup: rbac.authorization.k8s.io
    kind: Role
    name: jenkins
    subjects:
    - kind: ServiceAccount
    name: jenkins
    EOF
    ```

1. Create a `values.yaml` file that can be used to install Jenkins from the upstream helm repo.

    ```yaml
    master:
    useSecurity: false
    installPlugins: ["prometheus:2.0.6","kubernetes:1.18.2"]
    csrf:
        defaultCrumbIssuer:
        enabled: false
        proxyCompatability: false
    prometheus:
        enabled: true
        serviceMonitorNamespace: "kubeaddons"
        serviceMonitorAdditionalLabels:
        app: jenkins
        release: prometheus-kubeaddons
    serviceType: "ClusterIP"
    jenkinsUriPrefix: "/jenkins"
    ingress:
        enabled: true
        path: /jenkins
        annotations:
        kubernetes.io/ingress.class: traefik
    ```

1. Install helm chart with the service credentials and `values.yaml` created above.

    ```bash
    helm install \
        --namespace jenkins \
        --name jenkins \
        -f values.yaml \
        --set master.jenkinsUriPrefix=/jenkins \
        --set master.ingress.path=/jenkins \
        --set serviceAccount.create=false \
        --set serviceAccount.name=jenkins \
        --set serviceAccountAgent.name=jenkins \
        stable/jenkins
    ```

# Migrating Jenkins

This section explains how to migrate your workloads from Jenkins on DC/OS to Jenkins on Konvoy.

<p class="message--note"><strong>NOTE: </strong>This guide assumes you are moving to a Jenkins instance on Konvoy from a Jenkins instance on DC/OS. For any other migration reference, please refer to the <a href="#references">references</a> at the bottom of this page.</p>

## Step 1: Download the directory
To begin installing Jenkins on Konvoy, you must download the `$JENKINS_HOME/jobs` directory.

1. Make sure the DC/OS Jenkins instance is healthy. Identify the Jenkins task ID by running:

    ```bash
    dcos task list <name-of-your-jenkins-task> -q
    ```

    Example:

    ```bash
    dcos task list jenkins -q
    jenkins.instance-5d5cfb57-365b-11ea-8f22-3ece2a18bc93._app.1
    ```

    You may have multiple tasks with the string "jenkins" in their names. Make sure you have the correct task ID by looking at the JSON output as needed (append `--json` to above command).

1. Download the `$JENKINS_HOME/jobs` directory to your work station:

    ```bash
    dcos task download <task-id> [<path>]
    ```

    Example:
    ```bash
     dcos task download jenkins.instance-5d5cfb57-365b-11ea-8f22-3ece2a18bc93._app.1 jenkins_home/jobs --target-dir=$(pwd)/jenkins_home
    ```

    This command may take awhile. When it is finished, you should have the `jenkins_home/jobs` folder locally.

## Step 2: Write the directory to new instance of Jenkins

In this step, you will copy the `$JENKINS_HOME/jobs` folder into the running Jenkins pod.

1. Get the pod ID of the running jenkins instance:

    ```bash
    kubectl get pods --namespace jenkinsnamespace
    ```
1. Change the namespace, pod name and entry command as needed.
    ```bash
     kubectl cp ./jenkins_home/jobs/ <POD_ID>:/var/jenkins_home --container jenkins --namespace jenkinsnamespace
    ```

    These operations can be done even when Jenkins is running. 

1. For these changes to take effect, you must go to the Jenkins GUI **Manage Jenkins** page and select **Reload Configuration from Disk** to force Jenkins to reload the configuration from the disk.

<a id="references"></a>
## References:

- [https://wiki.jenkins.io/display/JENKINS/Administering+Jenkins](https://wiki.jenkins.io/display/JENKINS/Administering+Jenkins)
- [https://support.cloudbees.com/hc/en-us/articles/216241937-Migration-Guide-CloudBees-Jenkins-Platform-and-CloudBees-Jenkins-Team](https://support.cloudbees.com/hc/en-us/articles/216241937-Migration-Guide-CloudBees-Jenkins-Platform-and-CloudBees-Jenkins-Team-)