---
layout: layout.pug
navigationTitle: Managed Cluster 
title: Customize a domain and certificate in a Managed Cluster
menuWeight: 20
excerpt: Configure a custom domain and certificate in a Managed or Attached Cluster
beta: false
enterprise: false
---

This section describes how to enable custom domains and certificates in your **Management and any Managed or Attached** clusters after the installation of DKP. If you want to set up a custom domain and certificate for your Management Cluster **during the installation**, refer to the [Customize a domain and certificate during installation][management] documentation.

To customize the domain or certificate for a specific cluster after the installation of DKP, adapt or create an API `yaml` that will allow Kommander to implement the established adjustments on top of the default or any previous configuration you have made.

## Configure custom domains or custom certificates

<p class="message--warning"><strong>IMPORTANT:</strong>Ensure your <code>dkp</code> configuration references the management cluster of the environment where you want to customize the domain or certificate by setting the <code>KUBECONFIG=<path></code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

Use the API yaml to customize the domain (via the `hostname` field), the certificate (via the `issuerRef` or `certificateSecretRef` field), or both. For this, refer to the following examples:

1.  Create or update and apply the `KommanderCluster` object with the wanted ingress. Remember to specify the cluster in the `kubeconfigRef` name field.

    In this example, you can enter the custom domain in the `hostname` field, and an **issuer to be used by cert-manager** to issue a certificate for the domain in the `issuerRef` field.

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: kommander.mesosphere.io/v1beta1
    kind: KommanderCluster
    metadata:
      name: <cluster_name>
      namespace: <workspace_namespace>
    spec:
      kubeconfigRef:
        name: <cluster_name>-kubeconfig
      clusterRef:
        capiCluster:
          name: <cluster_name>
    ingress:
      hostname: <cluster_hostname>
      issuerRef:
        namespace: <issuer_namespace>
        name: <issuer_name>
    EOF
    ```

    In this example, you can enter the custom domain in the `hostname` field, and the secret in the `certificateSecretRef` field for **customized certificates created for your hostname**:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: kommander.mesosphere.io/v1beta1
    kind: KommanderCluster
    metadata:
      name: <cluster_name>
      namespace: <workspace_namespace>
    spec:
      kubeconfigRef:
        name: <cluster_name>-kubeconfig
      clusterRef:
        capiCluster:
          name: <cluster_name>
    ingress:
      hostname: <cluster_hostname>
      certificateSecretRef:
        namespace: <secret_namespace>
        name: <secret_name>
    EOF
    ```

<!-- 1.  TODO: Dev - Are there other steps, is there some sort of confirmation message or output?  -->

## Troubleshooting

If you want to ensure the customization for a domain or a certificate is completed, or if you want to obtain more information in case the customization fails, call up a list of statuses for the `KommanderCluster`:

<!-- 1.  TODO: DEV - provide command -->

<!-- 1.  TODO: DEV - provide example output -->

## Automatic certificate management (ACME)

Your managed or attached cluster can be configured to automatically issue a trusted certificate for the configured custom domain and renew it before expiration.

### Let's encrypt

Set up a Let’s Encrypt certificate for the cluster ingress, to validate the certificate for the cluster. Because ACME does not set up a CA bundle, some of the platform applications must be customized to use the certificate created by the ACME issuer:

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
[...]
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

[management]: ../../../install/configuration/custom-domain/
