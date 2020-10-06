---
layout: layout.pug
navigationTitle: Jenkins
title: Jenkins
excerpt: Jenkins on Konvoy
menuWeight: 70
category: Workload
---

# Install Jenkins&reg; on Konvoy

Install Jenkins in one of the following ways:

1. Using the Kommander catalog addon (Recommended)
2. From an upstream helm repository

## Install from Kommander Catalog Addons

### Prerequisites

You must have a running Konvoy cluster attached to a Kommander instance. If you do not, follow these instructions to deploy one:

1. Go to the Kommander UI and attach the Konvoy clusters in which you desire to install Jenkins.
1. Create a project with labels matching this cluster, if it doesn't already exist.
1. Make any necessary changes to the configuration, if needed.
1. Go to **Projects > Select your Project > View Catalog > Select Jenkins > Deploy** 

Your Jenkins instance will deploy.

## Install Jenkins from upstream helm chart

The following instructions would work for both helm v2 and v3. If using helm v2, ensure tiller is setup correctly with right perms to be able to install charts into target namespace. Refer [https://v2.helm.sh/docs/rbac/](https://v2.helm.sh/docs/rbac/) for setting up Tiller with correct perms.

1. Create a namespace for Jenkins 

    ```bash
    kubectl create namespace jenkins
    ```

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

1. Create a `values.yaml` file that can be used to install Jenkins from the upstream helm repository.

    ```yaml
    master:
      useSecurity: false
      installPlugins:
        - prometheus:2.0.6
        - kubernetes:1.27.1.1
        - workflow-job:2.39
        - workflow-aggregator:2.6
        - credentials-binding:1.23
        - git:4.4.2
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
      serviceType: "LoadBalancer"
      jenkinsUriPrefix: "/jenkins"
      ingress:
        enabled: true
        path: /jenkins
        annotations:
          kubernetes.io/ingress.class: traefik
    ```

1. Install helm chart with the service credentials and `values.yaml` created above. (For using helm v2)

    ```bash
    helm install \
        --namespace jenkins \
        --name jenkins \
        -f values.yaml \
        --set serviceAccount.create=false \
        --set serviceAccount.name=jenkins \
        --set serviceAccountAgent.name=jenkins \
        --repo https://charts.jenkins.io \
        --version 2.6.4 \
        jenkins
    ```

1. If you are using helm v3, install the chart with the following command (note: the `--name` flag is no longer supported and instead the release name is directly supplied):

    ```bash
    helm install jenkins \
        --namespace jenkins \
        -f values.yaml \
        --set serviceAccount.create=false \
        --set serviceAccount.name=jenkins \
        --set serviceAccountAgent.name=jenkins \
        --repo https://charts.jenkins.io \
        --version 2.6.4 \
        jenkins
    ```

# Setup KuberenetesCloud - Jenkins plugin to run dynamic agents in a Kubernetes

You can follow the this [setup guide](https://plugins.jenkins.io/kubernetes/) for installing a KubernetesCloud in your Jenkins installation. This section walks you through setting up a hello world job that can be scheduled on KubernetesCloud.

1. Setup the Kubernetes Cloud plugin. Following the earlier instructions in this guide, you should have already installed the `1.27.1.1` version of the kubernetes plugin. Upgrade this plugin if desired.

1. Go to **Manage Jenkins** > **Manage Nodes and clouds** > **Configure Clouds** > **Add a new cloud** and add a kubernetes cloud

1. At the very least, following options need to be provided to set up the cloud (Refer [the setup guide](https://github.com/jenkinsci/kubernetes-plugin#generic-setup) for advanced configuration):

   * Jenkins URL : `http://<service-name>.<namespace>:<service-port>/<service-prefix>`. With the default options this is `http://jenkins.jenkins:8080/jenkins`. 
   * Jenkins Tunnel : `<service-name>.<namespace>:<service-port>`. With the default options this is `jenkins-agent.jenkins:50000`

1. Click on **Pod Templates** > **Add Pod Templates** > **Pod Template Details** and provide details such as name, namespace, label, including containers. By default, jenkins will inject jnlp container (See the setup guide to see how to override this). For the purposes of this guide assume that the Pod has been created with Labels as `default`.

1. If you try to create a job (or edit an existing job), you should be able to see the label `default` pop up in the **Restrict where this project can be run** > **Label expression** field. Enrich the pod template with containers, network configuration and other resource limits as needed.


# Migrate Jenkins

This section explains how to migrate your workloads from Jenkins on DC/OS to Jenkins on Konvoy.

<p class="message--note"><strong>NOTE: </strong>This guide assumes you are moving to a Jenkins instance on Konvoy from a Jenkins instance on DC/OS. For any other migration reference, please refer to the <a href="#references">references</a> at the bottom of this page.</p>

## Download the directory
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

    You may have many tasks with the string "jenkins" in their names. Make sure you have the correct task ID by looking at the JSON output as needed (append `--json` to above command).

1. Download the `$JENKINS_HOME/jobs` directory to your work station:

    ```bash
    dcos task download <task-id> [<path>]
    ```

    Example:
    ```bash
     dcos task download jenkins.instance-5d5cfb57-365b-11ea-8f22-3ece2a18bc93._app.1 jenkins_home/jobs --target-dir=$(pwd)/jenkins_home
    ```

    This command may take awhile. When it is finished, you should have the `jenkins_home/jobs` folder locally.

## Migrate the MesosCloud configuration to KubernetesCloud Configuration

Optionally, you can migrate the MesosCloud configuration (if any) in your DC/OS Jenkins installation to your Jenkins on Konvoy installation. Currently this supports `Mesos` plugin version `2.0` only.

1. Fetch the `config.xml` file from the `$JENKINS_HOME` directory. Download the script from [TODO: https://github.com/mesosphere/jenkins-konvoy-mwt/blob/tga/add-migration-script/migration/migrator.py](https://github.com/mesosphere/jenkins-konvoy-mwt/blob/tga/add-migration-script/migration/migrator.py) and run the migration command:

    ```bash
    python migrator.py
    ```
    The script looks for a file named `config.xml` in the same directory as the script. Update the path as needed if the file is located in a different location.
   
1. Above command should have printed the `KubernetesCloud` configuration with sensible defaults that allows the jobs with labels from `MesosCloud` agents to be scheduled in `KubernetesCloud`. Copy this content in to your `config.xml` in place of the `MesosCloud` configuration.


## Write the directory to new instance of Jenkins

In this step, you will copy the `$JENKINS_HOME/jobs` folder (as well as `$JENKINS_HOME/config.xml` if you want to migrate the `MesosCloud` config) into the running Jenkins pod.

1. Get the pod ID of the running jenkins instance:

    ```bash
    kubectl get pods --namespace jenkinsnamespace
    ```
1. Copy the updated `config.xml` to migrate `MesosCloud` to `KubernetesCloud` (if applicable). Change the namespace, pod name and entry command as needed.
    ```bash
    kubectl cp ./jenkins_home/config.xml <POD_ID>:/var/jenkins_home --container jenkins --namespace jenkinsnamespace
    ```
    It is *highly* recommended that you hit **Reload Configuration from Disk** from **Manage Jenkins** page to make sure the cloud configuration is as expected. Adjust values such as `namespaces`, resource limits, `name` of pods etc., as desired.
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
