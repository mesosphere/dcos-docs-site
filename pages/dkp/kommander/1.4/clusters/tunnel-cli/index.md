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

## Using a remote cluster

To access services running on the remote cluster from the management cluster, connect to the tunnel proxy.

There are two methods:

1. If the client program supports SOCKS5 proxying, use the proxy directly;
1. Otherwise deploy a proxy server on the management cluster.

### Managed cluster service

For these sections, we require a service to run on the managed cluster.

As an example, start the following service:

```shell
cat > nginx.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webserver
  labels:
    app: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-app
  template:
    metadata:
      labels:
        app: nginx-app
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx-app
  type: ClusterIP
  ports:
    - targetPort: 80
      port: 8888
EOF

kubectl apply -f nginx.yaml

kubectl rollout status deploy webserver
```

On the managed cluster this service can be accessed by a client Job using:
```shell
nginx_host=$(kubectl get service nginx-service -o jsonpath='{.spec.clusterIP}')
url="http://${nginx_host}:8888/"

cat > curl.yaml <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: curl
spec:
  template:
    spec:
      containers:
      - name: curl
        image: curlimages/curl:7.76.0
        command: ["curl", "--silent", "--show-error", ${url}"]
      restartPolicy: Never
  backoffLimit: 4
EOF

kubectl apply -f curl.yaml

kubectl wait --for=condition=complete job curl

podname=$(kubectl get pods --selector=job-name=curl --field-selector=status.phase=Succeeded -o jsonpath='{.items[0].metadata.name}')

kubectl logs ${podname}
```

The final command returns the default nginx web page:
```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

### Direct use of SOCKS5 proxy


Since `curl` supports SOCKS5 proxies, this Job can be run on the management cluster by adding the SOCKS5 proxy to the `curl` command. On the management cluster:
```shell
url=""  # set to same URL used for service in managed cluster

proxy_service=$(kubectl get tunnelconnector -n sample sample-tunnel-connector -o jsonpath='{.status.tunnelServer.serviceRef.name}')

proxy=$(kubectl get service -n sample "${proxy_service}" -o jsonpath='{.spec.clusterIP}{":"}{.spec.ports[?(@.name=="proxy")].port}')

cat > curl.yaml <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: curl
spec:
  template:
    spec:
      containers:
      - name: curl
        image: curlimages/curl:7.76.0
        command: ["curl", "--silent", "--show-error", "--socks5-hostname", "${proxy}", "${url}"]
      restartPolicy: Never
  backoffLimit: 4
EOF

kubectl apply -f curl.yaml

kubectl wait --for=condition=complete job curl

podname=$(kubectl get pods --selector=job-name=curl --field-selector=status.phase=Succeeded -o jsonpath='{.items[0].metadata.name}')

kubectl logs ${podname}
```

The final command here will return the same output as for the job on the managed cluster, indicating that the job on the management cluster accessed the service running on the managed cluster.


### Use of deployed proxy on management cluster
