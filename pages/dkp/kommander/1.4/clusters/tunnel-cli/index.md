---
layout: layout.pug
beta: true
navigationTitle: Attach a Kubernetes Cluster using a Tunnel
title: Attach Cluster using tunnel
menuWeight: 7
excerpt: Using the CLI to attach a Kubernetes Cluster using a Tunnel
---

## Initial setup

### Identify the management cluster endpoint

Obtain the hostname and CA certificate for the management cluster:
```shell
hostname=$(kubectl get service -n kubeaddons traefik-kubeaddons -o jsonpath="{.status.loadBalancer.ingress[0].hostname}")
b64ca_cert=$(kubectl get secret -n cert-manager kubernetes-root-ca -o=go-template='{{index .data "tls.crt"}}')
```

### Create a namespace

Create a namespace on the management cluster for the tunnel gateway:
```shell
namespace=sample

cat > namespace.yaml <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: ${namespace}
EOF

kubectl apply -f namespace.yaml
```

You can verify the namespace exists using:
```shell
kubectl get namespace ${namespace}
```


### Create a tunnel gateway

Create a [tunnel gateway](api-reference#tunnelgateway) on the management cluster to listen for tunnel agents on remote clusters:
```shell
cacert_secret=kubetunnel-ca
gateway=sample-tunnel-gateway

cat > gateway.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  namespace: ${namespace}
  name: ${cacert_secret}
data:
  ca.crt:
    ${b64ca_cert}
---
apiVersion: kubetunnel.d2iq.io/v1alpha1
kind: TunnelGateway
metadata:
  namespace: ${namespace}
  name: ${gateway}
spec:
  ingress:
    caSecretRef:
      namespace: ${namespace}
      name: ${cacert_secret}
    loadBalancer:
      hostname: ${hostname}
    urlPathPrefix: /ops/portal/kubetunnel
    extraAnnotations:
      kubernetes.io/ingress.class: traefik
      traefik.frontend.rule.type: PathPrefixStrip
EOF

kubectl apply -f gateway.yaml
```

You can verify the gateway exists using:
```shell
kubectl get tunnelgateway -n ${namespace} ${gateway}
```

## Connecting a remote cluster

### Create a tunnel connector

Create a [tunnel connector](api-reference#tunnelconnector) on the management cluster for the remote cluster:
```shell
connector=sample-tunnel-connector

cat > connector.yaml <<EOF
apiVersion: kubetunnel.d2iq.io/v1alpha1
kind: TunnelConnector
metadata:
  namespace: ${namespace}
  name: ${connector}
spec:
  gatewayRef:
    name: ${gateway}
EOF

kubectl apply -f connector.yaml
```
You can verify the connector exists using:
```shell
kubectl get tunnelconnector -n ${namespace} ${connector}
```

Wait for the tunnel connector to reach `Listening` state and then export the agent manifest:

```shell
while [ "$(kubectl get tunnelconnector -n ${namespace} ${connector} -o jsonpath="{.status.state}")" != "Listening" ]
do
  sleep 5
done

manifest=$(kubectl get tunnelconnector -n ${namespace} ${connector} -o jsonpath="{.status.tunnelAgent.manifestsRef.name}")

kubectl get secret -n ${namespace} ${manifest} -o jsonpath='{.data.manifests\.yaml}' | base64 -d > manifest.yaml
```

### Setup the managed cluster

Copy the `manifest.yaml` file to the managed cluster and deploy the tunnel agent:

```shell
kubectl apply -f manifest.yaml
```

You can check the status of the created pods using:
```shell
kubectl get pods -n kubetunnel
```

There should be a `post-kubeconfig` job that reaches `Completed` state and a `tunnel-agent` deployment that stays in `Running` state.

### Add the managed cluster into Kommander

On the management cluster, wait for the tunnel to be connected by the tunnel agent:

```shell
while [ "$(kubectl get tunnelconnector -n ${namespace} ${connector} -o jsonpath="{.status.state}")" != "Connected" ]
do
  sleep 5
done
```

Add the cluster into Kommander:
```shell
managed=private-cluster
display_name=${managed}

cat > kommander.yaml <<EOF
apiVersion: kommander.mesosphere.io/v1beta1
kind: KommanderCluster
metadata:
  namespace: ${namespace}
  name: ${managed}
  annotations:
    kommander.mesosphere.io/display-name: ${display_name}
spec:
  clusterTunnelConnectorRef:
    name: ${connector}
EOF

kubectl apply -f kommander.yaml
```

Wait for the managed cluster to join the Kommander cluster:
```shell
while [ "$(kubectl get kommandercluster -n ${namespace} ${managed} -o jsonpath='{.status.phase}')" != "Joined" ]
do
  sleep 5
done

kubefed=$(kubectl get kommandercluster -n ${namespace} ${managed} -o jsonpath="{.status.kubefedclusterRef.name}")
while [ -z "${kubefed}" ]
do
  sleep 5
  kubefed=$(kubectl get kommandercluster -n ${namespace} ${managed} -o jsonpath="{.status.kubefedclusterRef.name}")
done

kubectl wait --for=condition=ready --timeout=60s kubefedcluster -n kommander ${kubefed}

kubectl get kubefedcluster -n kommander ${kubefed}
```
