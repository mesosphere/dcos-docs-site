---
layout: layout.pug
navigationTitle: Lightbend
title: Lightbend Console
excerpt: Lightbend Console, the Reactive Application Monitor
menuWeight: 80
category: Workload
image: img/lightbend.png
---
# Lightbend Console

[Lightbend Console](https://developer.lightbend.com/docs/console/current/) enables you to monitor your Reactive applications running on Kubernetes.

The Console provides visibility for KPIs, reactive metrics, monitors and alerting, and includes a large selection of ready-to-use dashboards. Lightbend Console delivers real value during development, testing, and staging as well as during production. The Console works with Lightbend Orchestration to help you manage the complexities of distributed applications and focus on building core business value.

The Console provides out-of-the-box support for any application instrumented to export metrics to Prometheus. Akka, Lagom, and Play applications that include Lightbend Telemetry (formerly called Cinnamon) provide even deeper insights and can take advantage of pre-built Grafana dashboards. Lightbend Orchestration provides a command line to simplify packaging and deployment of Akka, Lagom, and Play applications.

## Quick Start

### Prerequisites

1. Contact Lightbend to get a [Lightbend account](https://www.lightbend.com/lightbend-platform-subscription).

1. Add the Lightbend helm chart repository.

    ```bash
    helm repo add es-repo https://repo.lightbend.com/helm-charts
    helm repo update
    ```

### Temporary Workaround to Install the Lightbend Container Images

<p class="message--note"><strong>NOTE: </strong> Konvoy is using `containerd`. There is currently an issue with the Lightbend container registry (i.e. bintray, JFrog internal JIRA JBT-2988) when pulling private images. Thats why we need the additional steps described in this section until the issue gets resolved.</p>

<p class="message--note"><strong>NOTE: </strong>In your Konvoy <tt>cluster.yaml file</tt>, remove the line <strong>-  AlwaysPullImages</strong> before creating the cluster with <tt>konvoy up</tt>.</p>

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

1. Use your `Lightbend credentials` to log in to the `Lightbend container registry`.

    ```bash
    docker login lightbend-docker-commercial-registry.bintray.io
    ```

1. Execute the following script. It pulls the Lightbend container images, saves them in a tarball, copies the tarball to every worker node, and imports it into `containerd`.

    <p class="message--note"><strong>NOTE: </strong> The script requires the AWS cli and jq commands to be installed. On Mac OS X, both can be installed using <tt>brew</tt>. You also have to log in to your AWS account using the aws cli.</p>

    ```bash
    CLUSTER=... # name of your cluster, its the prefix used for worker nodes, check in ec2 console
    REGION=us-west-2
    KEY_FILE=... # path to private key file in folder where you ran konvoy -up


    docker pull lightbend-docker-commercial-registry.bintray.io/enterprise-suite/es-console:v1.0.7
    docker pull lightbend-docker-commercial-registry.bintray.io/enterprise-suite/es-grafana:v0.2.4
    docker pull lightbend-docker-commercial-registry.bintray.io/enterprise-suite/console-api:v1.0.12

    docker save lightbend-docker-commercial-registry.bintray.io/enterprise-suite/es-console:v1.0.7 lightbend-docker-commercial-registry.bintray.io/enterprise-suite/es-grafana:v0.2.4 lightbend-docker-commercial-registry.bintray.io/enterprise-suite/console-api:v1.0.12 > lb.tar.gz

    IPS=$(aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.PublicIpAddress] | join(\" \")")

    for ip in $IPS; do
      echo $ip;
      scp -o StrictHostKeyChecking=no -i $KEY_FILE lb.tar.gz centos@$ip:/tmp;
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo ctr -n k8s.io image import /tmp/lb.tar.gz;
    done
    ```

### Installing the Lightbend Console

The helm install requires that you pass your `Lightbend credenitals`. 

1. Use the following snippet to create a `credentials.yaml` file.

    ```yaml
    cat << EOF > credentials.yaml
    imageCredentials:
        username: <your-lightbend-username>
        password: <your-lightbend-password>
    EOF
    ```

1. Install the Lightbend console.

    ```bash
    helm install es-repo/enterprise-suite --name enterprise-console --namespace lightbend --version 1.1.0 --values credentials.yaml
    ```

### Accessing the Lightbend Console

1. Enable localhost access to the Lightbend console.

    ```bash
    kubectl -n lightbend port-forward svc/console-server 5000:80
    ```

1. Click to open the [Lightbend console](http://localhost:5000).

### Installing Lightbend Demo Applications

Lightbend provides [two demo applications](https://github.com/lightbend/lb-demos) to experience the Lightbend platform, `shoppingcartapp` and `drone-tracker`.

Start with cloning the demo github repository.

```bash
git clone https://github.com/lightbend/lb-demos.git
cd lb-demos
```

#### Build the Examples Yourself

An overview of the demonstrated features, and instructions to build these examples locally, is available in the [lb-demos](https://github.com/lightbend/lb-demos.git) repository.

#### Run with Prebuilt Images

If you want to quickly deploy versions of these apps, use the following instructions:

If you want to install the [shoppingcartapp](https://github.com/lightbend/lb-demos/tree/master/shoppingcartapp), then go to the respective subfolder. In the `shoppingcartapp.yaml` change the image setting to `image: "kwehden/shoppingcartapp"`. Next you apply the yaml manifest.

```bash
kubectl apply -f shoppingcart.yaml
```

If you want to install the [drone-tracker](https://github.com/lightbend/lb-demos/tree/master/drone-tracker), then go to the respective subfolder. In the `drone-tracker.yaml` and `drone-sim.yaml` change the image setting to `image: kwehden/dronetracker:latest`. Next apply both manifests.

```bash
kubectl apply -f drone-tracker.yaml
kubectl apply -f drone-sim.yaml
```

### Delete the Lightbend Console

```sh
helm delete --purge enterprise-console
```


## Information

### Documentation

* [Lightbend console](https://developer.lightbend.com/docs/console/current/)
* [Lightbend console - helm](https://developer.lightbend.com/docs/console/current/installation/es.html#installing-without-lbc-py)
* [Lightbend demos](https://github.com/lightbend/lb-demos)

### Release Notes

* [Lightbend console release notes](https://developer.lightbend.com/docs/console/current/release-notes/index.html)

### Licensing

* [Lightbend subscription](https://www.lightbend.com/lightbend-platform-subscription)

### Maintenance & Support

* [Lightbend support](https://support.lightbend.com/)
