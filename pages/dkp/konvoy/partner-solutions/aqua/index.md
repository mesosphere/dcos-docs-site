---
layout: layout.pug
navigationTitle: Aqua
title: Aqua
excerpt: The Cloud Native Security Platform
menuWeight: 10
category: Networking and Security
image: img/aqua.png
---
# Aqua

Aqua tames the complexity of securing Kubernetes deployments with policy-driven controls that leverage native K8s capabilities, while adding deeper image assurance, runtime protection, and network security controls.

## Quick Start

### Prerequisites

Before you can get started you will need to [contact Aqua Security](https://www.aquasec.com/about-us/contact-us/) to obtain the following:

* Aqua `username` and `password`
* Aqua CSP `license token`

1. With the username and password you will be able to sign into [https://my.aquasec.com](https://my.aquasec.com). Navigate to `Licenses` section where you will find the CSP `license token`.

    <p class="message--note"><strong>NOTE: </strong>All product specific `documentation links` in the following can only be reached if you are signed into <a href="https://my.aquasec.com">https://my.aquasec.com</a>.</p>

1. Next we create the `aqua` namespace.

    ```sh
    kubectl create namespace aqua
    ```

1. After that we create the `csp-registry-secret` with the `username` and `passsword` we got before. The secret is required to pull the Aqua container images from the private Aqua docker registry.

    ```sh
    kubectl create secret docker-registry csp-registry-secret  --docker-server="registry.aquasec.com" --namespace aqua --docker-username="jg@example.com" --docker-password="Truckin" --docker-email="jg@example.com"
    ```

1. Clone the `aqua-helm` github repository to get access to the helm charts.

    <p class="message--note"><strong>NOTE: </strong> We clone a specific Aqua version 4.2. The quick start is specific to that version.</p>

    ```sh
    git clone -b 4.2 https://github.com/aquasecurity/aqua-helm.git

    cd aqua-helm
    ```

#### Temporary Workaround To Install The Aqua Container Images

<p class="message--note"><strong>NOTE: </strong> Konvoy is using <tt>containerd</tt>. There is currently an issue with the Aqua container registry when pulling private images. Thats why we need the additional steps described in this section until the issue gets resolved.</p>

<p class="message--note"><strong>NOTE: </strong>In your Konvoy <tt>cluster.yaml file</tt>, remove the line <tt>-  AlwaysPullImages</tt> before creating the cluster with <tt>konvoy up</tt>.</p>

```yaml
...
spec:
  kubernetes:
    admissionPlugins:
      enabled:
      - NodeRestriction
      - AlwaysPullImages
      disabled: []
...
```

1. Use your `Aqua credentials` to login to the `Aqua container registry`.

    ```bash
    docker login registry.aquasec.com
    ```

1. Next execute the following script. It pulls the Aqua container images, saves them in a tarball, copies the tarball to every worker node, and imports it into containerd.

    <p class="message--note"><strong>NOTE: </strong>The script requires the aws cli and jq commands to be installed. On Mac OS X both can be installed using brew. You also have to login to your aws account using the aws cli.</p>

    ```sh
    CLUSTER=... # name of your cluster, its the prefix used for worker nodes, check in ec2 console
    REGION=us-west-2
    KEY_FILE=... # path to private key file in folder where you ran konvoy -up


    docker pull registry.aquasec.com/database:4.2
    docker pull registry.aquasec.com/gateway:4.2
    docker pull registry.aquasec.com/console:4.2
    docker pull registry.aquasec.com/scanner:4.2
    docker pull registry.aquasec.com/enforcer:4.2

    docker save registry.aquasec.com/scanner:4.2 registry.aquasec.com/console:4.2 registry.aquasec.com/gateway:4.2 registry.aquasec.com/database:4.2 registry.aquasec.com/enforcer:4.2 > aqua.tar.gz

    IPS=$(aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.PublicIpAddress] | join(\" \")")

    for ip in $IPS; do
      echo $ip;
      scp -o StrictHostKeyChecking=no -i $KEY_FILE aqua.tar.gz centos@$ip:/tmp;
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo ctr -n k8s.io image import /tmp/aqua.tar.gz;
    done
    ```

### Install The Aqua Server, Database, And Gateway

1. Install the Aqua `server`, `database`, and `gateway`.

    ```bash
    helm upgrade --install --namespace aqua csp ./server --set scanner.enabled=true,imageCredentials.username=<>,imageCredentials.password=<>
    ```

1. Next enable localhost access to Aqua.

    ```bash
    kubectl port-forward service/csp-console-svc 8080:8080 -n aqua
    ```

1. Open the [Aqua CSP console](http://localhost:8080).

When you access the `Aqua CSP console` for the first time, you must enter and confirm the `password` for the `administrator username`. After the login a screen appears where you have to enter the Aqua CSP License Token. After that you have access to the `Aqua dashboard`.

### Install The Aqua Enforcer

In the `Aqua CSP console`, navigate to the `Enforcers` section to create an [Enforcer Group](https://docs.aquasec.com/docs/enforcer-group-settings). Note that the Orchestrator must be set to Kubernetes. 

1. Copy the `enforcer token`; we will need it in the next step.

1. Install the enforcer.

    ```bash
    helm upgrade --install --namespace aqua csp-enforcer ./enforcer --set enforcerToken=<aquasec-token>
    ```

### Delete Aqua

Delete the `CSP enforcer` and `CSP`.

```bash
helm delete --purge csp-enforcer
helm delete --purge csp
```

## Information

### Documentation

* [Aqua helm deploy](https://docs.aquasec.com/docs/std-deployment-kubernetes-helm)
* [Aqua helm deploy git](https://github.com/aquasecurity/aqua-helm/tree/4.2)
* [Aqua helm configuration](https://github.com/aquasecurity/aqua-helm/tree/4.2#configurable-variables)
* [Aqua documentation](https://docs.aquasec.com/)
* [Aqua container security channel](https://www.aquasec.com/resources/virtual-container-security-channel/)
* [Aqua blog](https://blog.aquasec.com/)

### Release Notes

* [Aqua v4.2 release notes](https://docs.aquasec.com/docs/aqua-version-42-release-notes)

### Licensing & Support

* For licensing and support [contact Aqua Security](https://www.aquasec.com/about-us/contact-us/)
