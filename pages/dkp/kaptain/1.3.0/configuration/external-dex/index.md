---
layout: layout.pug
navigationTitle: Configure Dex
title: Configure Kaptain to authenticate with a Kommander Management Cluster
menuWeight: 70
excerpt: Configure Kaptain to authenticate with a Kommander Management Cluster
beta: false
enterprise: false
---

Configure Kaptain to use a Kommander management cluster for authentication.

## Prerequisites
- A Kommander management cluster.
- A managed cluster, into which Kaptain will be installed.
- The managed cluster is [attached][attached-cluster] to the management cluster (Kommander). (You will need to [create a cluster via Kommander][create-managed-cluster] to have a managed Konvoy cluster.)

## Kaptain configuration requirements
To use the Kommander Dex instance for authentication with Kaptain you will need to collect the following information:
- Dex Client Identifier (ID) of the managed cluster
- Dex Client secret corresponding to the Client ID
- External OIDC provider endpoint from the management cluster
- External OIDC provider CA bundle

## Get Dex Client Id

### Konvoy 1.x
To get the Dex client secret, run the following command on the managed cluster:
```bash
kubectl get secrets -n kubeaddons \
"$(kubectl get clients.dex.mesosphere.io -n kubeaddons <Dex Client ID> --template={{.spec.clientSecretRef.name}})" \
--template='{{index .data "client-secret"}}' | base64 --decode
```

### DKP 2.x
To get the external Dex Client ID on DKP 2.x, run the following command on the management cluster (Kommander):

```bash
kubectl describe configmaps -n kommander traefik-forward-auth-configmap | grep client-id | cut -d '-' -f4-
```

## Get Dex Client Secret
### Konvoy 1.x
To get the Dex client secret on Konvoy 1.x, run the following command on the management (Kommander) cluster:
```bash
kubectl get secrets -n kubeaddons \
"$(kubectl get clients.dex.mesosphere.io -n kubeaddons <Dex Client ID> --template={{.spec.clientSecretRef.name}})" \
--template='{{index .data "client-secret"}}' | base64 --decode
```

### DKP 2.x
To get the Dex client secret on DKP 2.x, run the following command on the management (Kommander) cluster:
```bash
kubectl get secrets -n kommander \
"$(kubectl get clients.dex.mesosphere.io -n kommander <Dex Client ID> --template={{.spec.clientSecretRef.name}})" \
--template='{{index .data "client-secret"}}' | base64 --decode
```

## Get external OIDC provider endpoint and CA bundle
Get the management cluster's OIDC provider endpoint as `https://<management-cluster-url>/dex`

### Get CA bundle on Konvoy 1.x

To get the OIDC provider CA bundle, run the following command on the management cluster (Kommander):
```bash
kubectl get secret traefik-kubeaddons-certificate -n kubeaddons -o jsonpath="{.data.ca\.crt}"
```

### Get CA bundle on DKP 2.x
To get the OIDC provider CA bundle, run the following command on the management cluster (Kommander):
```bash
kubectl get secret kommander-traefik-certificate -n kommander -o jsonpath='{.data.ca\.crt}'
```

## Install Kaptain
Create or update a configuration file named `parameters.yaml` that includes the following properties:
```yaml
externalDexClientId: dex-controller-<Dex Client ID>
externalDexClientSecret: <Dex Client secret>
oidcProviderEndpoint: <OIDC provider endpoint>
oidcProviderBase64CaBundle: <OIDC provider CA bundle>
```
The resulting configuration file should look similar to the following:
```yaml
externalDexClientId: dex-controller-dextfa-client-host-cluster-mmtt5
externalDexClientSecret: kkyhCc0W94WDJezbzsN7Ykif3DrwNuT40p3TWOKlDtdgjfJm1ItrJaqzRqQD7pUn
oidcProviderEndpoint: https://<Management-cluster-URL>/dex
oidcProviderBase64CaBundle: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS9tLS0tCk1JSUMrVENDQWVHZ0F3SUJBZ0lSQUp1NlBOSFVsWVZHR0AzRW9vSGNPd1F3RFFZSktvWklodmNOQVFFTEJRQXcKRlRFVE1CRUdBMVVFQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TURFeU1EZ3dPVFEzTkBsYUZ3MHpNREV5TURZdwpPVFEzTkRsYU1CY3hGVEFUQmdOVkJBTVRER05sY25RdGJXRnVZV2RsY2pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCCkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUwzQmlJR0RnVkpzRVhJUjEvc6hkdysvzzFLaG9PdkVwcVM5Mk1pS050cDkKaW1xVUtqZGFMSHVxYlBheWhuMjNwTmhUa2haL0NEOVgyb05xVFhOR0Q2SE44WGFrMWt4VE9xWnd4am9yNktydQpUWGZrREVmZGtHVG9nZUlSaEtpSUdxRUU1Vy9teWNkVkdDUThnNXEvcUprd3JIZHgyOTZMREVwSDEzMm9aQmk1CmVNMlZvNmpVYnUydkp4MHpyVnIzeVWuaUp0TlNpbnFoN1RVc2I2bTZoeFErRkVBZFY1djdraVBLVW4wdmZTVlYKQ1YwNXdmbUU0WEEyY2d5N3RpeEV3NkFCNmFOeGYwcGVSVXpXS0ZoL3FJdGpFWEg5RVJiWVJ5cDA1UGUyb2xCVwpHWXpiVDJsblVPeW5uL0I3YWZRSExWS0RPcTRsa3NmWlBoWTJQWmZwVW5NQ0F3RUFBYU5DTUVBd0RnWURWUjBQCkFRSC9CQVFEQWdLa01BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZHZmtITWxVTU1hSzRtRjgKNUNPeXhPMHAvWGNNTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFERjh2d3lhWnpZUmRYRGo5ODJrN0RZRDY2cwpMVE44d3Q0ZkxKbEJKODREFzd0TGJmSVdmYkJ4VzFDd0UxdEhuaTFPd3pROGkzUytpUFhuQ0dCZFNSdm5FQkJsCnF1bkpqdWRBMm9odEs5SmViTUhPTEFpbXRnWVhZdVllTFZudGxpWCtQdmxRMWxoYzByeXFENkRkWUUwckJSdlcKRkgvSTY2b2ZONGZFVlJ2RjFiSG5uZ1BsZlFUcHNRRzZFZVNoa0RvclAwSDhxNnU5RXcyaG5Ba0hwRXVlWUJibQpkeXZvRStVWTM1ck9XK3pEQ3NXNUNPRTVGWjVWQ64lRmJMRmRSUU9tdW9BaXlCV2UyTHZHdjgzdXVSZTRsSWhxCnAxSEIrZlBPTGdJVGRaSHEwYkgvdEZZNEw0YmNkRGhGYnlJRldzN01NZ2FxeCtMZThoMDNIZE5ybG5USQotLS0tWARORCBDRVJUSUZJQ0FURS0tRS0tCg==
```

Install Kaptain with the provided parameters, by running the following command against the managed cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
                --instance kaptain \
                -P parameters.yaml \
                --namespace kubeflow \
                --create-namespace
```
To update an already installed Kaptain instance, run the following command on the managed cluster:
```
kubectl kudo update --instance kaptain --namespace kubeflow -P parameters.yaml
```

Verify the installation completed successfully by running the following command:
```bash
kubectl kudo plan status --instance kaptain -n kubeflow
```

## Add the redirect URL to Kaptain authentication service in the management cluster
Once Kaptain is up, get the redirect URL from Kaptain's authservice by running the following command on the managed cluster:
```bash
kubectl exec -it -n kubeflow authservice-0 -- sh -c 'echo $REDIRECT_URL'
```

### Konvoy 1.x

On the management cluster add the Redirect URL to the `redirectURIs` list of the Dex client resource:
```bash
kubectl patch clients.dex.mesosphere.io -n kubeaddons <Dex Client ID> \
  --type "json" -p '[{"op":"add", "path" :"/spec/redirectURIs/-", "value": "<Redirect URL>"}]'
```

### DKP 2.x
On the management cluster add the Redirect URL to the `redirectURIs` list of the Dex client resource:
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
