---
layout: layout.pug
navigationTitle: Configure custom domain
title: Configure custom domain
menuWeight: 30
excerpt: Configure a custom domain for Kommander
beta: false
enterprise: false
---

Kommander supports configuring a custom domain name for accessing the Web UI and other platform services.
Additionally, you can provide a custom certificate for each domain, or one can be issued automatically by Let's Encrypt, or other certificate authorities supporting the ACME protocol.

## Configure a custom domain

To configure Kommander to use a custom domain, the domain name must be provided in an installation configuration file. For example, to use the domain `mycluster.domain.dom`, create the following yaml file:

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
clusterHostname: mycluster.domain.dom
```

This configuration can be used when installing or reconfiguring Kommander by passing it to the `kommander install` command:

<p class="message--note"><strong>NOTE: </strong>To ensure Kommander is installed on the workload cluster, use the <code>--kubeconfig=cluster_name.conf</code> flag as an alternative to KUBECONFIG. </p>

```bash
kommander install --installer-config <config_file.yaml>
```

Soon after the command completes, obtain the cluster Ingress IP address or hostname using the following command:

```bash
kubectl -n kommander get svc kommander-traefik -o go-template='{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{ "\n"}}'
```

Next, you need to create a DNS record for your custom hostname that resolves to the cluster Ingress load balancer hostname or IP address. If the previous command returns a hostname, you should create a CNAME DNS entry that resolves to that hostname. If the cluster Ingress is an IP address, create a DNS A record.

<p class="message--important"><strong>IMPORTANT: </strong> The domain must be resolvable from the client (your browser) and from the cluster. On installation, Kommander will wait for the domain to resolve to the load balancer. Only then the cluster will be fully functional.</p>

## Configure a custom certificate

If you want to use your own certificate for the configured domain, you need the following files (in PEM format):

- the certificate
- the certificate's private key
- the CA bundle (containing the root and intermediate certificates)

Specify the local file path to these files in the installation configuration file:

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
clusterHostname: mycluster.domain.dom
ingressCertificate:
  certificate: certs/cert.pem
  private_key: certs/key.pem
  ca: certs/ca.pem
```

## Automatic certificate management (ACME)

Kommander can be configured to automatically issue a trusted certificate for the configured custom domain and renew it before expiration.

<p class="message--important"><strong>IMPORTANT: </strong>This feature is currently only supported for the management cluster. Kommander does not currently support attaching clusters that use ACME certs. </p>

### Let's Encrypt

In this section, we will walk you through how to set up a Let’s Encrypt certificate for the cluster Ingress. This would allow most browsers to validate the certificate for the cluster when the users try to log into the UI.
ACME must be enabled in the installation configuration file. The provided email is used to register with Let's Encrypt, who will use this to contact you about expiring certificates, and issues related to your account.

Because ACME does not set up a CA bundle, some of the platform applications must be customized to use the certificate created by the ACME issuer:

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
clusterHostname: mycluster.domain.dom
acme:
  email: <your_email>
apps:
  traefik-forward-auth-mgmt:
    values: |
      traefikForwardAuth:
        caSecretName: null
  kube-oidc-proxy:
    values: |
      oidc:
        caSystemDefault: true
  dex-k8s-authenticator:
    values: |
      caCerts:
        caSecretName: null
        useSystemDefault: true
```

### Other ACME issuers

You can use other issuers that support the ACME protocol by configuring the issuer's server in the installation configuration. For example, to use the ZeroSSL service:

```yaml
acme:
  email: <your_email>
  server: https://acme.zerossl.com/v2/DV90
```

### Customize issuer details

By default, `kommander install` sets up a working ACME solver using HTTP01 challenges. If further control over the certificate issuing is needed, you can modify the pre-configured `ClusterIssuer`. For example, you can use a DNS01 challenge:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: kommander-acme-issuer
spec:
  acme:
    email: <your_email>
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: kommander-acme-issuer-account
    solvers:
      - dns01:
          route53:
            region: us-east-1
            role: arn:aws:iam::YYYYYYYYYYYY:role/dns-manager
EOF
```

For more information on the available options, refer to the [ACME section in the cert-manager documentation](https://cert-manager.io/docs/configuration/acme/).
