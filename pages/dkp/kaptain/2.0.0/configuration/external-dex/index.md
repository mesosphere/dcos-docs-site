---
layout: layout.pug
navigationTitle: Configure Dex
title: Configure Kaptain to authenticate with a Kommander Management Cluster
menuWeight: 70
excerpt: Configure Kaptain to authenticate with a Kommander Management Cluster
beta: false
enterprise: false
---

Configure Kaptain to use the Dex OIDC Provider on a Kommander management cluster for authentication.

## Prerequisites
- A Kommander management cluster.
- A managed cluster, into which Kaptain will be installed.
- The managed cluster is [attached][attached-cluster] to the management cluster (Kommander). (You will need to [create a cluster via Kommander][create-managed-cluster] to have a managed Konvoy cluster.)
- A Dex Client created on the management cluster.

## Kaptain configuration requirements
To use the Kommander Dex instance for authentication with Kaptain you will need to collect the following information:
- Dex Client Identifier (ID) of the managed cluster
- Dex Client secret corresponding to the Client ID
- External OIDC provider endpoint from the management cluster
- External OIDC provider CA bundle

## Create a Dex Client

To create the external Dex Client ID, run the following commands on the (Kommander) management cluster:

Get the management cluster's URL:

```bash
export MANAGEMENT_CLUSTER_URL=$(kubectl get ingress dex -n kommander -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
```

Create the Dex Client, noting the client id `kubeflow-authservice` for later use.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: dex.mesosphere.io/v1alpha1
kind: Client
metadata:
  name: kubeflow-authservice
  namespace: kommander
spec:
  displayName: Kubeflow Auth Service
  clientSecretRef:
    name: kubeflow-authservice
  redirectURIs:
    - "https://${MANAGEMENT_CLUSTER_URL}/login/oidc"
  logoURL: https://example.com/logo.png
EOF
```

## Create a Dex Client Secret

Generate a secret to replace `<kubeflow-authservice-secret>`. 

Example:

```bash
openssl rand -base64 64
```

To create a Dex client secret, run the following command on the (Kommander) management cluster:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: kubeflow-authservice
  namespace: kommander
type: Opaque
stringData:
  client-secret: <kubeflow-authservice-secret>
EOF
```

## Get external OIDC provider endpoint and CA bundle
Get the management cluster's OIDC provider endpoint as `https://<management-cluster-url>/dex`

To get the OIDC provider CA bundle, run the following command on the (Kommander) management cluster:

```bash
kubectl get secret kommander-traefik-certificate -n kommander -o jsonpath='{.data.ca\.crt}'
```

## Install Kaptain
Create or update a configuration file named `parameters.yaml` that includes the following properties:

```yaml
ingress:
      externalDexClientId: dex-controller-<Dex Client ID>
      externalDexClientSecret: <Dex Client secret>
      oidcProviderEndpoint: <OIDC provider endpoint>
      oidcProviderBase64CaBundle: <OIDC provider CA bundle>
```

The resulting configuration file should look similar to the following:

```yaml
ingress:
      externalDexClientId: dex-controller-kubeflow-authservice
      externalDexClientSecret: kkyhCc0W94WDJezbzsN7Ykif3DrwNuT40p3TWOKlDtdgjfJm1ItrJaqzRqQD7pUn
      oidcProviderEndpoint: https://<Management-cluster-URL>/dex
      oidcProviderBase64CaBundle: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS9tLS0tCk1JSUMrVENDQWVHZ0F3SUJBZ0lSQUp1NlBOSFVsWVZHR0AzRW9vSGNPd1F3RFFZSktvWklodmNOQVFFTEJRQXcKRlRFVE1CRUdBMVVFQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TURFeU1EZ3dPVFEzTkBsYUZ3MHpNREV5TURZdwpPVFEzTkRsYU1CY3hGVEFUQmdOVkJBTVRER05sY25RdGJXRnVZV2RsY2pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCCkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUwzQmlJR0RnVkpzRVhJUjEvc6hkdysvzzFLaG9PdkVwcVM5Mk1pS050cDkKaW1xVUtqZGFMSHVxYlBheWhuMjNwTmhUa2haL0NEOVgyb05xVFhOR0Q2SE44WGFrMWt4VE9xWnd4am9yNktydQpUWGZrREVmZGtHVG9nZUlSaEtpSUdxRUU1Vy9teWNkVkdDUThnNXEvcUprd3JIZHgyOTZMREVwSDEzMm9aQmk1CmVNMlZvNmpVYnUydkp4MHpyVnIzeVWuaUp0TlNpbnFoN1RVc2I2bTZoeFErRkVBZFY1djdraVBLVW4wdmZTVlYKQ1YwNXdmbUU0WEEyY2d5N3RpeEV3NkFCNmFOeGYwcGVSVXpXS0ZoL3FJdGpFWEg5RVJiWVJ5cDA1UGUyb2xCVwpHWXpiVDJsblVPeW5uL0I3YWZRSExWS0RPcTRsa3NmWlBoWTJQWmZwVW5NQ0F3RUFBYU5DTUVBd0RnWURWUjBQCkFRSC9CQVFEQWdLa01BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZHZmtITWxVTU1hSzRtRjgKNUNPeXhPMHAvWGNNTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFERjh2d3lhWnpZUmRYRGo5ODJrN0RZRDY2cwpMVE44d3Q0ZkxKbEJKODREFzd0TGJmSVdmYkJ4VzFDd0UxdEhuaTFPd3pROGkzUytpUFhuQ0dCZFNSdm5FQkJsCnF1bkpqdWRBMm9odEs5SmViTUhPTEFpbXRnWVhZdVllTFZudGxpWCtQdmxRMWxoYzByeXFENkRkWUUwckJSdlcKRkgvSTY2b2ZONGZFVlJ2RjFiSG5uZ1BsZlFUcHNRRzZFZVNoa0RvclAwSDhxNnU5RXcyaG5Ba0hwRXVlWUJibQpkeXZvRStVWTM1ck9XK3pEQ3NXNUNPRTVGWjVWQ64lRmJMRmRSUU9tdW9BaXlCV2UyTHZHdjgzdXVSZTRsSWhxCnAxSEIrZlBPTGdJVGRaSHEwYkgvdEZZNEw0YmNkRGhGYnlJRldzN01NZ2FxeCtMZThoMDNIZE5ybG5USQotLS0tWARORCBDRVJUSUZJQ0FURS0tRS0tCg==
```

### Kommander install

See [Install Kaptain][kaptain-install] for more info. To install Kaptain through the Kommander UI, copy and paste the configuration values from the previous section into the Kommander UI and deploy the Kaptain application.

### Helm Install

Install Kaptain with the provided parameters manually by running the following command against the managed cluster:

```bash
helm install --values values.yaml kaptain kaptain-2.0.0.tgz
```

To update an already installed Kaptain instance, run the following command on the managed cluster:

```
helm upgrade --values values.yaml kaptain kaptain-2.0.0.tgz
```

Verify that the installation has been completed successfully by running the following command:
```bash
helm status kaptain 
```

## Add the redirect URL to Kaptain authentication service in the management cluster
Once Kaptain is up, get the redirect URL from Kaptain's authservice by running the following command on the managed cluster:
```bash
kubectl exec -it -n kubeflow authservice-0 -- sh -c 'echo $REDIRECT_URL'
```

On the management cluster, add the Redirect URL to the `redirectURLs` list of the Dex Client's resource:
```bash
kubectl patch clients.dex.mesosphere.io -n kommander <Dex Client ID> \
  --type "json" -p '[{"op":"add", "path" :"/spec/redirectURIs/-", "value": "<Redirect URL>"}]'
```

# Log in to Kaptain using the management cluster's Dex instance

Discover the Kaptain endpoint:
-  If you are running Kaptain _on-premises_:
      ```bash
      kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}"
      ```
-  Or if you are running Kaptain on _AWS_:
      ```bash
      kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}"
      ```

When accessing Kaptain via `https://<Kaptain endpoint>`, you will be redirected to the login page of the management cluster's Dex instance.

[attached-cluster]: /dkp/kommander/latest/clusters/attach-cluster/
[create-managed-cluster]: /dkp/kommander/latest/clusters/creating-konvoy-cluster-aws/
[kaptain-install]: ../../install
