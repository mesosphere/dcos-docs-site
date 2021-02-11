---
layout: layout.pug
navigationTitle: Configure Dex
title: Configure external Dex to authenticate to Kaptain
menuWeight: 70
excerpt: Configure external Dex to authenticate to Kaptain
beta: false
enterprise: false
---

Configure an external Dex instance from a management cluster for authentication with Kaptain.

## Prerequisites
- A Kommander management cluster.
- A managed Konvoy cluster, into which Kaptain will be installed.
- The managed (Konvoy) cluster is [attached](https://docs.d2iq.com/dkp/kommander/latest/clusters/attach-cluster/) to the management cluster (Kommander).

## Kaptain configuration parameters
To configure an external Dex instance for authentication with Kaptain, please provide the following parameters:
- Dex client identifier of the managed cluster 
- Dex Client secret corresponding to the client identifier
- External OIDC provider endpoint that points to the external Dex instance to be used
- External OIDC provider CA bundle

## Get Dex Client Id 
To get the external Dex Client ID, run the following command on the managed cluster (Konvoy):
    
```bash
kubectl describe configmaps -n kommander-system traefik-forward-auth-kommander-kubeaddons-configmap | grep client-id | cut -d '-' -f4-
```

## Get Dex Client Secret 
To get the Dex client secret, run the following command on the management cluster:
```bash
kubectl get secrets -n kubeaddons \
"$(kubectl get clients.dex.mesosphere.io -n kubeaddons <Dex Client ID> --template={{.spec.clientSecretRef.name}})" \
--template='{{index .data "client-secret"}}' | base64 --decode
```

## Get external OIDC provider endpoint and CA bundle
Get the management cluster's OIDC provider endpoint as `https://<management-cluster-url>/dex`

To get the OIDC provider CA bundle, run the following command on the management cluster (Kommander):
```bash
kubectl get secret traefik-kubeaddons-certificate -n kubeaddons -o jsonpath="{.data.ca\.crt}"
```
## Install Kaptain
Create or update a configuration file `parameters.yaml` to include the following properties:
```yaml
externalDexClientId: dex-controller-<Dex Client ID>
externalDexClientSecret: <Dex Client secret>
oidcProviderEndpoint: <OIDC provider endpoint>
oidcProviderBase64CaBundle: <OIDC provider CA bundle>
```
The resulting configuration file looks similar to the following:
```yaml
externalDexClientId: dex-controller-dextfa-client-managed-cluster-admin-managed-cluster-dkzzq
externalDexClientSecret: kkyhCc0W94WDJezbzsN7Ykif3DrwNuT40p3TWOKlDtdgjfJm1ItrJaqzRqQD7pUn
oidcProviderEndpoint: https://<Management-cluster-URL>/dex
oidcProviderBase64CaBundle: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS9tLS0tCk1JSUMrVENDQWVHZ0F3SUJBZ0lSQUp1NlBOSFVsWVZHR0AzRW9vSGNPd1F3RFFZSktvWklodmNOQVFFTEJRQXcKRlRFVE1CRUdBMVVFQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TURFeU1EZ3dPVFEzTkBsYUZ3MHpNREV5TURZdwpPVFEzTkRsYU1CY3hGVEFUQmdOVkJBTVRER05sY25RdGJXRnVZV2RsY2pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCCkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUwzQmlJR0RnVkpzRVhJUjEvc6hkdysvzzFLaG9PdkVwcVM5Mk1pS050cDkKaW1xVUtqZGFMSHVxYlBheWhuMjNwTmhUa2haL0NEOVgyb05xVFhOR0Q2SE44WGFrMWt4VE9xWnd4am9yNktydQpUWGZrREVmZGtHVG9nZUlSaEtpSUdxRUU1Vy9teWNkVkdDUThnNXEvcUprd3JIZHgyOTZMREVwSDEzMm9aQmk1CmVNMlZvNmpVYnUydkp4MHpyVnIzeVWuaUp0TlNpbnFoN1RVc2I2bTZoeFErRkVBZFY1djdraVBLVW4wdmZTVlYKQ1YwNXdmbUU0WEEyY2d5N3RpeEV3NkFCNmFOeGYwcGVSVXpXS0ZoL3FJdGpFWEg5RVJiWVJ5cDA1UGUyb2xCVwpHWXpiVDJsblVPeW5uL0I3YWZRSExWS0RPcTRsa3NmWlBoWTJQWmZwVW5NQ0F3RUFBYU5DTUVBd0RnWURWUjBQCkFRSC9CQVFEQWdLa01BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZHZmtITWxVTU1hSzRtRjgKNUNPeXhPMHAvWGNNTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFERjh2d3lhWnpZUmRYRGo5ODJrN0RZRDY2cwpMVE44d3Q0ZkxKbEJKODREFzd0TGJmSVdmYkJ4VzFDd0UxdEhuaTFPd3pROGkzUytpUFhuQ0dCZFNSdm5FQkJsCnF1bkpqdWRBMm9odEs5SmViTUhPTEFpbXRnWVhZdVllTFZudGxpWCtQdmxRMWxoYzByeXFENkRkWUUwckJSdlcKRkgvSTY2b2ZONGZFVlJ2RjFiSG5uZ1BsZlFUcHNRRzZFZVNoa0RvclAwSDhxNnU5RXcyaG5Ba0hwRXVlWUJibQpkeXZvRStVWTM1ck9XK3pEQ3NXNUNPRTVGWjVWQ64lRmJMRmRSUU9tdW9BaXlCV2UyTHZHdjgzdXVSZTRsSWhxCnAxSEIrZlBPTGdJVGRaSHEwYkgvdEZZNEw0YmNkRGhGYnlJRldzN01NZ2FxeCtMZThoMDNIZE5ybG5USQotLS0tWARORCBDRVJUSUZJQ0FURS0tRS0tCg==
```

To install Kaptain with the provided parameters, run the following command on the managed cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.0.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

Verify the installation completed successfully by running the following command:
```bash
kubectl kudo plan status --instance kaptain -n kubeflow
```

## Add the redirect URL to Kaptain authentication service in the management cluster
Once Kaptain is up, get the redirect URL from Kaptain's authservice by running the following command on the managed cluster: 
```bash
kubectl describe statefulsets.apps -n kubeflow authservice | grep REDIRECT_URL | awk '{print $2}'
```

On the management cluster add Redirect URL to the `redirectURIs` list of the Dex client resource:
```bash
kubectl patch clients.dex.mesosphere.io -n kubeaddons <Dex Client ID> \
  --type "json" -p '[{"op":"add", "path" :"/spec/redirectURIs/-", "value": "<Redirect URL>"}]'
```

# Log in to Kaptain using the management cluster's Dex  

Discover the Kaptain endpoint:
-  If you are running Kaptain _on-premises_:
      ```bash
      kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}"
      ```
-  Or if you are running Kaptain on _AWS_:
      ```bash
      kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}"
      ```

When accessing Kaptain via `https://<Kaptain endpoint>`, you are redirected to login page of the management cluster's Dex instance.