---
layout: layout.pug
navigationTitle: Custom domain name and certificates
title: Configuring custom domain name and certificates to access Kaptain
menuWeight: 70
excerpt: Configuring custom domain name and certificates to access Kaptain
beta: false
enterprise: false
---

Learn how to configure a custom domain name with TLS certificates trusted by your organization. 
This allows most browsers to validate the certificate for the Kaptain endpoint that users log on to to access the main UI, the central dashboard.

## Prerequisites

-   You already provisioned a Konvoy cluster using at least `v1.7.0`.
-   You can setup a DNS [A record][dnsarecord] for the Kaptain gateway IP, or a [CNAME][dnscname] for the Kaptain
gateway load balancer hostname in the public cloud cases like AWS.
-   You already have a certificate and private key files for the domain name that will be used for accessing Kaptain.

## Setting up the Kaptain hostname and certificates

A custom domain name and certificates can be configured at installation time of Kaptain. Create or update a configuration file to include the following properties:

```yaml
customDomainName: <the domain name to use for accessing Kaptain>
base64CustomCertificate: <Base64-encoded contents of the TLS certificate file For example, kaptain.crt>
base64CustomCertificateKey: <Base64-encoded contents of the private key file. For example, kaptain.key>
```

To create a base64-encoded values for a certificate and a private key files, run the following command:
```bash
cat kaptain.crt | base64
cat kaptain.key | base64
```

The resulting configuration file resembles what follows:
```yaml
customDomainName: kaptain.mycluster.company.com
base64CustomCertificate: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUVQRENDQXlTZ0F3SUJBZ0lVVm1kOGNBUzlMRTFxM0VXZFRxWGI2K3Fnd2owd0RRWUpLb1pJaHZjTkFRRUwKQlFBd2daSXhDekFKQmdOVkJBWVRBbFZUTVJNd0VRWURWUVFJREFwRFlXeHBabTl5Ym1saE1SWXdGQVlEVlFRSApEQTFUWVc0Z1JuSmhibU5wYzJOdk1RMHdDd1lEVlFRS0RBUkVNbWxSTVJVd0V3WURWUVFMREF4VVpXRnRJRXRoCmNIUmhhVzR4RFRBTEJnTlZCQU1NQkVReWFWRXhJVEFmQmdrcWhraUc5dzBCQ1FFV0VtRnJhWEpwYkd4dmRrQmsKTW1seExtTnZiVEFlRncweU1ERXhNekF5TVRBME1qSmFGdzB5TXpBek1EVXlNVEEwTWpKYU1JR3pNUXN3Q1FZRApWUVFHRXdKVlV6RVRNQkVHQTFVRUNBd0tRMkZzYVdadmNtNXBZVEVVTUJJR0ExVUVCd3dMVTJGdWRHRWdRMnhoCmNtRXhGVEFUQmdOVkJBb01ERVF5YVZFZ1MyRndkR0ZwYmpFVk1CTUdBMVVFQ3d3TVZHVmhiU0JMWVhCMFlXbHUKTVNnd0pnWURWUVFEREI5cllYQjBZV2x1TG10emNHaGxjbVV0YTNWa2J5NWtNbWx4TG1Oc2IzVmtNU0V3SHdZSgpLb1pJaHZjTkFRa0JGaEpoYTJseWFXeHNiM1pBWkRKcGNTNWpiMjB3Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBCkE0SUJEd0F3Z2dFS0FvSUJBUURBNlhtRVpkWFF2NXA3NTM3TWdBN3pZVjM2QkFMSlpJM0xkWXREWTJ4aEZKazEKN3I5UFMxUWpOSnFLMHF3ZC9tM3BYeFB1dGFGYW82UVVzV0NGazFYaGxKNHNmaEVEQkg5ZTRhWFRldjJJWXVoVApRWlpZOG1zTTdzK2J1c0NLR1RUWEZwTzRyS3B2Nmt1dlgrYk9HYVdqRDRRV0N3dFQ5cFg4RkNMNThTOHg0VFZICkQvb1BwcW1XU3RzWGN4azFtU0NjMWF4ZExzRTk4c09zZVQxdlRRVFdkN1pZWUpvZ09qS3NtN2I5Qk4rOHdobWMKK295OEQ1R0lUSEZiMWo5OVY2TGw3ZkxoV21iMkcrZ29NbzJ4RDlBMjdLM2FyKzE3djBJNElYUzJFd2UxSTI1eAppMkNJYnR6VzVUZG1pOE1Fdnd0ZFhXSDMxUUU4N1N4K3VsOXN6ODFqQWdNQkFBR2paekJsTUI4R0ExVWRJd1FZCk1CYUFGTEc1cDIyNC9qVk1zTHAwMmNUb0crc3I4TzFzTUFrR0ExVWRFd1FDTUFBd0N3WURWUjBQQkFRREFnVHcKTUNvR0ExVWRFUVFqTUNHQ0gydGhjSFJoYVc0dWEzTndhR1Z5WlMxcmRXUnZMbVF5YVhFdVkyeHZkV1F3RFFZSgpLb1pJaHZjTkFRRUxCUUFEZ2dFQkFDM0R0NERRK3JBd1RSTjAvN3pQQS85WmpPSnJpM0xTMzVSbW9oZVhUc3UyClRvN2NVMFVwSTlwRVRlUE1qVTVxK1RLeXlrdDg2YUxPZ1NEYkRvY21BL053dWhKU0xWRVFtbjJxSFh0cFNQK0MKQzE5R0gzRVFKVHkwcXpob3lBbTh4SmpuRklFNldKazNMRkZqRmdQK0lUZC9JOENBMXhrMFJYNnBZRE5RY3R4dwo5OExkVlNEM2NSL3VlMjRjS2l4aCs0dnpIcmhOSHJlekZ6Yml5TS9ZdnZRcWhkR1lvTTNRR084bmlxT2doVW1LCkhsNDRwenJTUDVoMUljSWRNQ0tQTENYNXR1WjFIZWxqNWhEaWx2cXZyQkI4M0dhcUl4SlYzWmRhd0hCaEZySjQKc3lvNkw3d1ZMMDJsZzdXYUZwcndtNUJhMlVsV1pSL2RrekI5cDF2WFZpND0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
base64CustomCertificateKey: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBd09sNWhHWFYwTCthZStkK3pJQU84MkZkK2dRQ3lXU055M1dMUTJOc1lSU1pOZTYvClQwdFVJelNhaXRLc0hmNXQ2VjhUN3JXaFdxT2tGTEZnaFpOVjRaU2VMSDRSQXdSL1h1R2wwM3I5aUdMb1UwR1cKV1BKckRPN1BtN3JBaWhrMDF4YVR1S3lxYitwTHIxL216aG1sb3crRUZnc0xVL2FWL0JRaStmRXZNZUUxUncvNgpENmFwbGtyYkYzTVpOWmtnbk5Xc1hTN0JQZkxEckhrOWIwMEUxbmUyV0dDYUlEb3lySnUyL1FUZnZNSVpuUHFNCnZBK1JpRXh4VzlZL2ZWZWk1ZTN5NFZwbTlodm9LREtOc1EvUU51eXQycS90ZTc5Q09DRjB0aE1IdFNOdWNZdGcKaUc3YzF1VTNab3ZEQkw4TFhWMWg5OVVCUE8wc2ZycGZiTS9OWXdJREFRQUJBb0lCQVFDejZRb3JMODM0b0xpeQpWWE1yeFVJc09PSXNDUkdRUVBiOGlPTVlOZUVkcU5nNk5DNjNCTW16QzV3VlcrU3BGRi90Qlg3UllSTGFOVU1SCkNWdTdOMjBndERuUHhNS1l6ZGo3NC9XREJYRHRnVkNxVk1DaXMzS2kzUlZCWnltcG9WaG1QK2dFa3dOZzNHRTUKYlhjVFAxZjZlcjMwME5mL3RqaXFueHovZks5SEUrSHRwL0RCOHFveUpSbERzQjJ4YUNFTzJRUVNOeDQyVDI5Mgo1dmNpci96Q2JORWlaOTJpQkZmaHAxbXpTa3VEMEFJV3JUWjFZNFdjZ3VTVUFBN3hYSUl1Vk9TM1FTUWxrSGx6CjJCMnFxcjFPaVVROWlkL1hQaHZmbkp4WXhBYUV1QjUrdUluL21tV21zblZ0SGt2bjdLMmdVYlpjaVMvZHBmUmQKc0JpR0diNEJBb0dCQU8yUTN3WnVaVjBpSHZ2T1A3V0R4NUx1Tzhlc0lOd2JyWXE3Y1BzMU9pT0wxUUNvNStBYQpDaVQ1QWxWSUw0VS95Z25zdmhrQnJSaEg4cTUwT3NocFlhaDhBWlp5NzlYQlo3NDgrTmxrcWNqelYyRTQyNld5CnlBcVgxTFBIL3JOV2hrRXRKKzNKVzhxT0pUZ01pcjVSaXVUQ3VlUjRMQVBPeVhoQllCSU9PNERQQW9HQkFNL2gKazNpdWdvVmxvY1dtTGVOcmo4ejdqMXdSQ25tMzdTTzg3eUxTdEtpRTVpMzdYTmtUL0JNcjltcyt2Q2tiQXNKVApCUzBWSmk0eGtsRnJFcHRUMklzZlRoL01XUWRDYkRGb0ViQ0lyVzhJVUZRY0FicGdrRlhLOUFxeEYvT1A4WGdZClZHWnl5czUxcnYzaEJtaXBVUUxsc3ZGZ1RIVFMxdlp2bUlpbkE0Y3RBb0dBWmpZdmpzL09zdHhzWWtDaDdwSHQKT3cxZkVSREE3cExGL3V1WXQ2eDJBRGM0aE5rbk1xZGhkL2pmQlJ4U3ZjenRPNG50WEVyNVUzb1pNdS8xSHFjZwppbUlZT01mbzRwb2M3Wi9FSFp5TzVGTzJZN0VYNTluYzhablR2U291THJEcWdINVNNSit5NjVwdTd3ZU9aa1lsCk1UbUt5MzdjeVNLZVVpd21qbjRySWNjQ2dZQlUyYUFWL0RUdU9nT0Q1MGFIc3htbzgyMGFpU0liZUlWa3R2TnMKNVZBMEVMcmJQZVF4L3NRL0Z3eW56WjJEc2JDNG5LWmFObTIxSVNxMTdOeFZaaTNXNjFvNkJIQzZVOVJSZmticQpKWCtVK0hIQlF3VTVpN3llS0E3Z1psUitaOXlKeG5SOHRKSXZIejNrQm50Vk1QY09GYStxY2tJQzFTUkV4bHdlCk92MW5xUUtCZ1FEQUdEdkc3WFVJMUJ2b2dEL1BIa0J2azVaMjBKOHNjZkd6c2hGN2hRWWd3VllHd1RIa0pQL3gKbEFnUEFycWJuclEwamdjczVwSWRQSGl0TVhyUGtmbGwzcnNSS2Q3L3ppV0dHL3Jxakd6V29QbEZRWmprT2pUOAo5UEZpL3piVVlPS2dGV0VzTHZreEFCN0ZYeTJ5NXBJS3I3K3YxbGpCVHo4d0wzcHlmdms2UlE9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=
```

For what follows, the name of the configuration file is `parameters.yaml`.
Install Kaptain using that configuration file:
```bash
kubectl kudo install ./kubeflow-1.3.0_1.2.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```
To update an already installed Kaptain instance, run the following command:
```
kubectl kudo update --instance kaptain --namespace kubeflow -P parameters.yaml
```

Verify the installation completes successfully by running the following command:
```bash
kubectl kudo plan status --instance kaptain -n kubeflow
```

## Create or update DNS record for the Kaptain gateway

First, obtain the Kaptain gateway IP, or the Kaptain gateway load balancer hostname if you run Kaptain in public clouds.
This information can be obtained by running the following commands.

To obtain the Kaptain gateway IP:
```bash
kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].ip}"
```

To obtain the Kaptain gateway load balancer hostname:
```bash
kubectl get svc kubeflow-ingressgateway --namespace kubeflow -o jsonpath="{.status.loadBalancer.ingress[*].hostname}"
```

The output will be something like the following.

```bash
a070604cbbd7e4c96bf203b9d5069730-259996044.us-west-2.elb.amazonaws.com
```

In the above case, the Kaptain gateway load balancer hostname is `a070604cbbd7e4c96bf203b9d5069730-259996044.us-west-2.elb.amazonaws.com`.

Then, create a DNS record for the Kaptain gateway load balancer hostname.
In this case, we created a DNS CNAME record `kaptain.mycluster.company.com` to point to `a070604cbbd7e4c96bf203b9d5069730-259996044.us-west-2.elb.amazonaws.com`.
For the on premise case, the cluster ingress is an IP address, and you need to create a DNS A record.

Once the DNS record is updated, access the Kaptain central dashboard at `https://kaptain.mycluster.company.com/`.
You will notice that the certificate used by the domain is the one you provided during the installation.

[dnscname]: https://en.wikipedia.org/wiki/CNAME_record
[dnsarecord]: https://en.wikipedia.org/wiki/List_of_DNS_record_types
