---
layout: layout.pug
navigationTitle: Configure Dex
title: Configure Kaptain to authenticate with a Kommander Management Cluster
menuWeight: 70
excerpt: Configure Kaptain to authenticate with a Kommander Management Cluster
beta: false
enterprise: false
---

Configure Kaptain in a managed cluster to connect to the management cluster using the Dex OIDC Provider for authentication.

## Prerequisites

- A management cluster.
- A managed cluster, into which Kaptain will be installed.
- The managed cluster is [attached][attached-cluster] to the management cluster. (You will need to [create a cluster via Kommander][create-managed-cluster] to have a managed Konvoy cluster.)

## Kaptain configuration

To use the Kommander Dex instance for authentication with Kaptain, create the following resources:

- [Create a Dex Client Identifier (ID)](#create-a-dex-client) for the managed cluster
- [Create a Dex Client secret](#create-a-dex-client-secret) corresponding to the Dex Client ID

and collect the following information:

- External OIDC provider [endpoint and CA bundle](#get-external-oidc-provider-endpoint-and-ca-bundle) from the management cluster

as shown in this guide.

## Create a Dex Client

To create the external Dex Client ID, run the following commands on the (Kommander) management cluster:

Create the `kubeflow-authservice` Dex Client:

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
  logoURL: https://example.com/logo.png
EOF
```

## Create a Dex Client Secret

Generate a secret to replace `<kubeflow-authservice-secret>`.

Example:

```bash
DEX_CLIENT_SECRET=$(openssl rand -base64 64)
```

To create a Dex client secret, run the following command on the management cluster:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: kubeflow-authservice
  namespace: kommander
type: Opaque
stringData:
  client-secret: "$DEX_CLIENT_SECRET"
EOF
```

After creating the `kubeflow-authservice` secret, display the `$DEX_CLIENT_SECRET` value to use it later in this procedure:

```bash
echo $DEX_CLIENT_SECRET
```

The output should look like this:

```sh
+2+slRbKjbZHwlTdR4lXbpakHEmaTmwOZiOkRHMw7y3gTNhVl7FU00Ydk71RMCIk 8MZ3eK22k885XNku4lSJVA==
```

## Get external OIDC provider endpoint and CA bundle

Get the management cluster's OIDC provider endpoint as `https://<management-cluster-url>/dex`, by running the following command:

```bash
kubectl -n kommander get svc kommander-traefik -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}/dex{{ "\n"}}'
```

To get the OIDC provider CA bundle, run the following command on the management cluster:

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

See [Install Kaptain][kaptain-install] for more info. To install Kaptain through the Kommander UI, copy and paste the configuration values from the previous section into the Kommander UI and deploy the Kaptain application.

## Add the redirect URL to Kaptain authentication service in the management cluster

Once Kaptain is up, get the redirect URL from Kaptain's authentication service by running the following command on the managed cluster:

```bash
kubectl exec -it -n kaptain-ingress authservice-0 -- sh -c 'echo $REDIRECT_URL'
```

On the management cluster, add the Redirect URL to the `redirectURLs` list of the Dex Client's resource:

```bash
kubectl patch client kubeflow-authservice -n kommander --type merge  -p '{"spec": {"redirectURIs": ["<Redirect URL>"]}}'
```

## Log in to Kaptain using the management cluster's Dex instance

Refer to the [Kaptain login](../../install/deploy-kaptain#log-in-to-kaptain-using-the-management-clusters-dex-instance) section to access Kaptains's Kubeflow dashboard.

[attached-cluster]: /dkp/kommander/latest/clusters/attach-cluster/
[create-managed-cluster]: /dkp/kommander/latest/clusters/creating-konvoy-cluster-aws/
[kaptain-install]: ../../install
