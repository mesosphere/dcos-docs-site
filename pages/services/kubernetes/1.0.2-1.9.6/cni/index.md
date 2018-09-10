---
layout: layout.pug
navigationTitle: Container Networking Interface (CNI)
title: Container Networking Interface (CNI) Support
menuWeight: 100
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


## Container Networking Interface (CNI) Support

By default, Kubernetes on DC/OS uses DC/OS overlay network to launch kubernetes
pods. However, one can use some other network by selecting the network provider
at the time of the kubernetes package installation.

This document uses
[`Calico`](https://docs.projectcalico.org/v2.0/getting-started/mesos/installation/dc-os/)
as a sample CNI network provider to demonstrate the steps required to use
some other CNI provider with kubernetes on DC/OS.

## Using Calico with Kubernetes on DC/OS (For Enterprise Only)

The first step would be to install Calico on DC/OS. There are two ways to
install Calico on DC/OS.

### Installing Calico using DC/OS Universe package

The quick and easy way would be to install Calico from DC/OS universe package.
Below are the instructions to do that:

```
1. Install ETCD from DC/OS Universe package. (wait for ETCD to be up and running)
2. Install Calico from DC/OS Universe package.
```

More details are available [`here`](https://docs.projectcalico.org/v2.0/getting-started/mesos/)

### Advance Installation of Calico on DC/OS

Installing the DC/OS Universe package is easy; however, there are times when you might want
to install Calico on your own. For instance, if you want to try a newer version
of Calico than what is available as part of DC/OS Universe package. However, it
is pretty involved and easily qualifies as advance installation procedure.

Below are the instructions to do advance installation:

```
1. Install etcd from DC/OS Universe package. You could also install etcd manually
   by following instructions
   https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md
   [repeat steps 2 to 12 on all agents]
2. ssh to an agent
3. Run etcd proxy
       wget https://github.com/coreos/etcd/releases/download/v3.3.1/etcd-v3.3.1-linux-amd64.tar.gz
       tar -xzvf etcd-v3.3.1-linux-amd64.tar.gz
       ./etcd-v3.3.1-linux-amd64/etcd --proxy=on --discovery-srv=etcd.mesos &
4. Set rp_filter for calico
       sudo sysctl -w net.ipv4.conf.all.rp_filter=1
4. Fetch calicoctl
       wget https://github.com/projectcalico/calicoctl/releases/download/v1.6.3/calicoctl
5. chmod +x calicoctl
6. Launch `calico/node`
       sudo ./calicoctl node run --node-image=calico/node:v2.6.6
7. Check `calico/node` status
       ./calicoctl get nodes
8. Download Calico CNI plugins
      wget https://github.com/projectcalico/calico-cni/releases/download/v1.11.2/calico
      wget https://github.com/projectcalico/calico-cni/releases/download/v1.11.2/calico-ipam
9. chmod +x calico calico-ipam
10. Move them to CNI plugin directory
      sudo mv calico /opt/mesosphere/active/cni/
      sudo mv calico-ipam /opt/mesosphere/active/cni/
11. Create a Calico CNI config file `calico.cni`
      {
        "name": "calico",
        "type": "calico",
        "etcd_endpoints": "http://localhost:2379",
        "ipam": {
            "type": "calico-ipam"
        }
      }
12. Place it in DC/OS CNI config directory
      sudo mv calico.cni /opt/mesosphere/etc/dcos/network/cni/
```

More details are available
[`here`](https://docs.projectcalico.org/v2.0/getting-started/mesos/installation/integration)
In the above method we installed calico out-of-band. DC/OS is not aware of any such installation.
Hence, you would not see calico network in the UI. However, you could launch your services on
this network just like you would launch on any other network in DC/OS.

### Additional steps for public cloud

If you are running DC/OS on a public cloud such as AWS, GCE, or Azure, you might
have to enable IP-in-IP and NAT for Calico network. You could do that by doing:

```
1. SSH to one of the agent nodes
2. Fetch calicoctl
	wget https://github.com/projectcalico/calicoctl/releases/download/v1.6.3/calicoctl
3. chmod +x calicoctl
4. ./calicoctl get nodes (wait till the list has nodes equal to number of agents in the cluster)
5. Create a pool config `pool.yaml` to select CIDR subnet, enable ipip and nat-outgoing.
   (A sample is shown below)
   cat > pool.yaml <<EOF | ./calicoctl apply -f pool.yaml
   apiVersion: v1
   kind: ipPool
   metadata:
     cidr: 192.168.0.0/16
   spec:
     ipip:
       enabled: true
     nat-outgoing: true
   EOF
```

Further, certain settings would have to be configured depending on the cloud
provider. Please refer to below links for your specific cloud provider:

1. [AWS](https://docs.projectcalico.org/v3.0/reference/public-cloud/aws)
2. [GCE](https://docs.projectcalico.org/v3.0/reference/public-cloud/gce)
3. [Azure](https://docs.projectcalico.org/v3.0/reference/public-cloud/azure)

### Create certificate for Calico CNI plugin

In order to allow Calico cni plugin to connect to the Kubernetes API server,
we need to generate appropriate certificates for Calico. Below are the steps
to do so:

```
1. Get enterprise cli commands
     dcos package install dcos-enterprise-cli --yes --cli
2. Create a new certificate
     dcos security cluster ca newcert --cn "calico" --host "<any agent ip>" --json > cert.json
3. Fetch certs from cert.json
     jq -r .certificate cert.json > crt.pem
4. Fetch private key from cert.json
     jq -r .private_key cert.json > private.pem
5. Fetch CA bundle
    dcos security cluster ca cacert > ca.pem
6. Copy cert, private key and ca bundle to all the agents
```

### Create Calico CNI config for Kubernetes cluster

The Calico cni plugin needs additional information to work with Kubernetes.
So, we need to create a separate cni configuration file for kubernetes.

```
1. Create the cni config file
   cat > cni.conflist <<EOF
   {
     "cniVersion": "0.3.0",
     "name": "kube-cni",
     "plugins": [
       {
         "type": "calico",
         "etcd_endpoints": "http://localhost:2379",
         "ipam": {
           "type": "calico-ipam"
         },
         "policy": {
           "type": "k8s",
           "k8s_api_root": "https://apiserver.kubernetes.l4lb.thisdcos.directory:6443",
           "k8s_client_certificate": "<client certificate>",
           "k8s_client_key": "<client key>",
           "k8s_certificate_authority": "<ca certificate>"
         }
       },
       {
         "type": "portmap",
         "capabilities": { "portMappings": true},
         "snat": true
       }
      ]
   }
   EOF
2. Place it in DC/OS CNI config directory
      sudo mv cni.conflist /opt/mesosphere/etc/dcos/network/cni/

```

### Deploying Kubernetes on top of Calico on DC/OS

As mentioned earlier, you will have to select `Calico` as the network
provider in the package option before installing kubernetes package. You could
do that either by editing DC/OS Kubernetes Universe package or if you are using
DC/OS CLI then you could provide an option file.

```
{
   "kubernetes": {
       "network_provider": "calico"
   }
}
```

### Mandatory addon

Kubernetes on DC/OS installs some of the addons as part of package installation.
If you have been following the instructions you would see that these
addons would be failing to start. The reason being that by default Calico comes
with `no access` policy and so none of the addons would be able to communicate with
the Kubernetes control plan. We would need to install `calico-kube-controller` which
will allow access over the calico network. You could do that by creating a
deployment for `calico-kube-controller` and then launching it using kubectl.
A sample deployment looks like:

```
cat > policy_controller.yaml <<EOF | ./kubectl apply -f policy_controller.yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: calico-kube-controller
  namespace: kube-system
  labels:
    k8s-app: calico-kube-controller
spec:
  replicas: 1
  template:
    metadata:
      name: calico-kube-controller
      namespace: kube-system
      labels:
        k8s-app: calico-kube-controller
    spec:
      hostNetwork: true
      containers:
        - name: calico-kube-controller
          # Make sure to pin this to your desired version.
          image: calico/kube-policy-controller:v0.3.0
          env:  
            - name: ETCD_ENDPOINTS
              value: "http://localhost:2379"
            - name: CONFIGURE_ETC_HOSTS
              value: "true"
EOF
```

Once you installed `calico-kube-controller` you should see following default network
profiles in Calico. After this, the addons would start to come up. Sometimes, you
might have to wait 2 - 3 minutes for addons to come up again.

```
./calicoctl get profile
NAME
k8s_ns.default
k8s_ns.kube-public
k8s_ns.kube-system
```

## Tested

calico release [`v2.6.6`](https://docs.projectcalico.org/v2.6/releases/)

|                  | Version |
| ---------------- | ------- |
| calico/node      | v2.6.6  |
| calico           | v1.11.2 |
| calico-ipam      | v1.11.2 |
| calicoctl        | v1.6.3  |
| kube-controllers | v0.7.0  |
| etcd             | v3.3.1  |
