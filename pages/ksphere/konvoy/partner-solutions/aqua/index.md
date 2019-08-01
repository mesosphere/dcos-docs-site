---
layout: layout.pug
navigationTitle: Aqua
title: Aqua
excerpt: Aqua the Cloud Native Security Platform
menuWeight: 10
category: Security
image: img/aqua.png
---

Aqua tames the complexity of securing Kubernetes deployments with policy-driven controls that leverage native K8s capabilities, while adding deeper image assurance, runtime protection, and network security controls.

## quick start

### prerequisites

Before you can get started you will need to [contact Aqua Security](https://www.aquasec.com/about-us/contact-us/) to obtain the following.

* Aqua `username` and `password`
* Aqua CSP `license token`

With the username and password you will be able to sign into [https://my.aquasec.com](https://my.aquasec.com). Navigate to `Licenses` section where you will find the CSP `license token`.

**Note:** All product specific `documentation links` in the following can only be reached if you are signed into [https://my.aquasec.com](https://my.aquasec.com).

Next we create the `aqua` namespace.

```sh
kubectl create namespace aqua
```

After that we create the `csp-registry-secret` with the `username` and `passsword` we got before. The secret is required to pull the Aqua container images from the private Aqua docker registry.

```sh
kubectl create secret docker-registry csp-registry-secret  --docker-server="registry.aquasec.com" --namespace aqua --docker-username="jg@example.com" --docker-password="Truckin" --docker-email="jg@example.com"
```

Clone the `aqua-helm` github repository to get access to the helm charts.

**Note:** We clone a specific 'Aqua version 4.2'. The quick start is specific to that version.

```sh
git clone -b 4.2 https://github.com/aquasecurity/aqua-helm.git

cd aqua-helm
```

#### temporary workaround to install the Aqua container images

**Note:** Konvoy is using `containerd`. There is currently an issue with the Aqua container registry when pulling private images. Thats why we need the additional steps described in this section until the issue gets resolved.

Use your `Aqua credentials` to login to the `Aqua container registry`.

```sh
docker login registry.aquasec.com
```

Next execute the following script. It pulls the Aqua container images, saves them in a tarball, copies the tarball to every worker node, and imports it into containerd.

**Note:** The script requires the aws cli and jq commands to be installed. On Mac OS X both can be installed using brew. You also have to login to your aws account using the aws cli.

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

In your Konvoy `cluster.yaml file` remove the line `-  AlwaysPullImages` and do a `konvoy up`.

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

### install the Aqua server, database, and gateway

Let install the Aqua `server`, `database`, and `gateway`.

```sh
helm upgrade --install --namespace aqua csp ./server --set scanner.enabled=true,imageCredentials.username=<>,imageCredentials.password=<>
```

Next enable localhost access to Aqua.

```sh
kubectl port-forward service/csp-console-svc 8080:8080 -n aqua
```

Click to open the [Aqua CSP console](http://localhost:8080).

When you access the `Aqua CSP console` for the first time, you must enter and confirm the `password` for the `administrator username`. After the login a screen appears where you have to enter the Aqua CSP License Token. After that you have access to the `Aqua dashboard`.

### install the Aqua enforcer

In the `Aqua CSP console` navigate to the `Enforcers` section to create an [Enforcer Group](https://docs.aquasec.com/docs/enforcer-group-settings). Note that the Orchestrator must be set to Kubernetes. Copy the `enforcer token`, we will need it in the next step.

Lets install the enforcer.

```sh
helm upgrade --install --namespace aqua csp-enforcer ./enforcer --set enforcerToken=<aquasec-token>
```

### delete Aqua

Delete the `CSP enforcer` and `CSP`.

```sh
helm delete --purge csp-enforcer
helm delete --purge csp
```

## information

#### documentation

* [aqua helm deploy](https://docs.aquasec.com/docs/std-deployment-kubernetes-helm)
* [aqua helm deploy git](https://github.com/aquasecurity/aqua-helm/tree/4.2)
* [aqua helm configuration](https://github.com/aquasecurity/aqua-helm/tree/4.2#configurable-variables)
* [aqua documentation](https://docs.aquasec.com/)
* [aqua container security channel](https://www.aquasec.com/resources/virtual-container-security-channel/)
* [aqua blog](https://blog.aquasec.com/)

#### release notes

* [aqua v4.2 release notes](https://docs.aquasec.com/docs/aqua-version-42-release-notes)

#### license & support

* For license and support [contact Aqua Security](https://www.aquasec.com/about-us/contact-us/)
