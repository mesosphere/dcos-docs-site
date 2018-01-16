---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 20
excerpt:
featureMaturity:
enterprise: false
---

In this quick start, you will install Kubernetes on DC/OS, set up an SSH tunnel to your master node, and then configure and test your Kubernetes installation.

# Prerequisite

- [DC/OS installed on your cluster](/1.10/installing/). See the Install and Customize section for cluster size and resource requirements.

## Install Kubernetes

If you are using open source DC/OS, install a Kubernetes cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for information.

```shell
dcos package install beta-kubernetes
```

Alternatively, you can install Kubernetes from [the DC/OS web interface](/latest/usage/webinterface/).

The service will now deploy with a default configuration. You can monitor its deployment from the Services tab of the DC/OS web interface.

## Install and configure kubectl

Use the Kubernetes command-line tool, kubectl, to deploy and manage applications on Kubernetes. Follow installation instructions [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

Configure kubectl:

```bash
kubectl config set-cluster dcos-k8s --server=http://localhost:9000
kubectl config set-context dcos-k8s --cluster=dcos-k8s --namespace=default
kubectl config use-context dcos-k8s
```

## Connect to the Kubernetes APIServer

Find the public IP address of your master node. Then, create an SSH tunnel:

```
ssh -i <your-private-key> -N -L 9000:apiserver-insecure.kubernetes.l4lb.thisdcos.directory:9000 \
     <ssh-user>@<master-ip>
```

When the Kubernetes API task(s) are healthy, it should be accessible on `http://localhost:9000`. Reaching this endpoint should show something like:

```bash
$ curl http://localhost:9000
{
  "paths": [
    "/api",
    "/api/v1",
    "/apis",
    "/apis/apps",
    "/apis/apps/v1beta1",
    "/apis/authentication.k8s.io",
    "/apis/authentication.k8s.io/v1",
    "/apis/authentication.k8s.io/v1beta1",
    "/apis/authorization.k8s.io",
    "/apis/authorization.k8s.io/v1",
    "/apis/authorization.k8s.io/v1beta1",
    "/apis/autoscaling",
    "/apis/autoscaling/v1",
    "/apis/autoscaling/v2alpha1",
    "/apis/batch",
    "/apis/batch/v1",
    "/apis/batch/v2alpha1",
    "/apis/certificates.k8s.io",
    "/apis/certificates.k8s.io/v1beta1",
    "/apis/extensions",
    "/apis/extensions/v1beta1",
    "/apis/policy",
    "/apis/policy/v1beta1",
    "/apis/rbac.authorization.k8s.io",
    "/apis/rbac.authorization.k8s.io/v1alpha1",
    "/apis/rbac.authorization.k8s.io/v1beta1",
    "/apis/settings.k8s.io",
    "/apis/settings.k8s.io/v1alpha1",
    "/apis/storage.k8s.io",
    "/apis/storage.k8s.io/v1",
    "/apis/storage.k8s.io/v1beta1",
    "/healthz",
    "/healthz/ping",
    "/healthz/poststarthook/bootstrap-controller",
    "/healthz/poststarthook/ca-registration",
    "/healthz/poststarthook/extensions/third-party-resources",
    "/logs",
    "/metrics",
    "/swaggerapi/",
    "/ui/",
    "/version"
  ]
}
```

Test access by retrieving the Kubernetes cluster nodes:
```bash
$ kubectl get nodes
NAME                                   STATUS    AGE       VERSION
kube-node-0-kubelet.kubernetes.mesos   Ready     7m        v1.7.5
kube-node-1-kubelet.kubernetes.mesos   Ready     7m        v1.7.5
kube-node-2-kubelet.kubernetes.mesos   Ready     7m        v1.7.5
```
## Install mandatory add-ons

Presently, only `kube-dns` is a mandatory add-on.

Run the following commands to install `kube-dns`.

```bash
kubectl create -f add-ons/dns/kubedns-cm.yaml
kubectl create -f add-ons/dns/kubedns-svc.yaml
kubectl create -f add-ons/dns/kubedns-deployment.yaml
```

**NOTE:** The Kubernetes namespace where `kube-dns` will be running is `kube-system`, not `default`.

A successful deployment should look like the following:
```bash
$ kubectl -n kube-system get deployment,pods
NAME              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/kube-dns   1         1         1            1           1h

NAME                           READY     STATUS    RESTARTS   AGE
po/kube-dns-1115425399-mwsn8   3/3       Running   0          1h
```

And a Kubernetes service should be exposed on `10.100.0.10` with at least one endpoint (pod):

```bash
$ kubectl -n kube-system describe svc kube-dns
Name:			kube-dns
Namespace:		kube-system
Labels:			k8s-app=kube-dns
			kubernetes.io/cluster-service=true
			kubernetes.io/name=KubeDNS
Annotations:		<none>
Selector:		k8s-app=kube-dns
Type:			ClusterIP
IP:			10.100.0.10
Port:			dns	53/UDP
Endpoints:		9.0.2.5:53
Port:			dns-tcp	53/TCP
Endpoints:		9.0.2.5:53
Session Affinity:	None
Events:			<none>
```

# Further example

Now that you're up and running with Kubernetes, try out [a sample application that employs both Kubernetes and Cassandra](https://github.com/mesosphere/dcos-kubernetes-quickstart/blob/master/examples/os-detector/os-detector.md).
