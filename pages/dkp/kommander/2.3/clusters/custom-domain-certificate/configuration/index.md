---
layout: layout.pug
navigationTitle: Configuration 
title: Configure a custom domain and certificate for your cluster
menuWeight: 20
excerpt: Configure a custom domain and certificate in the Management and any Managed or Attached Clusters
beta: false
enterprise: false
---

This section describes how to enable custom domains and certificates in your **Management and any Managed or Attached** clusters after the installation of DKP. If you want to set up a custom domain and certificate for your Management Cluster **during the installation**, refer to the [Customize a domain and certificate during installation][management] documentation.

To customize the domain or certificate for a specific cluster after the installation of DKP, adapt or create an API `yaml` that will allow Kommander to implement the established adjustments on top of the default or any previous configuration you have made.

## Configure custom domains or custom certificates

<p class="message--warning"><strong>IMPORTANT:</strong>Ensure your <code>dkp</code> configuration references the management cluster of the environment where you want to customize the domain or certificate by setting the <code>KUBECONFIG=<path></code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

Use the API yaml to customize the domain (via the `hostname` field), the certificate (via the `issuerRef` or `certificateSecretRef` field), or both. For this, refer to the following examples:

1.  You have two options to create or update and apply the `KommanderCluster` object with the wanted ingress. Remember to specify the cluster in the `kubeconfigRef` name field.

    One option is to use a certificate that is managed automatically by cert-manager with the ACME protocol like Let's Encrypt. For this, reference the `Issuer` or `ClusterIssuer` **to be used by cert-manager** in the `issuerRef` field, and enter the custom domain in the `hostname` field of the target cluster:

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

    Another option is to use a certificate provided by you and **customized for your hostname**. To do so, enter the secret in the `certificateSecretRef` field and the custom domain in the `hostname` field of the target cluster:

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

## Verify the status of the configuration and troubleshoot in case of errors

If you want to ensure the customization for a domain or a certificate is completed, or if you want to obtain more information in case the customization fails, call up a list of statuses for the `KommanderCluster`.

1.  Inspect the modified `KommanderCluster` object:

    ```bash
    kubect -n <workspace_namespace> get kommandercluster <cluster_name> -o yaml
    ```

    If the ingress is still being provisioned, the output looks similar to this:

    ```bash
      conditions:
      - lastTransitionTime: "2022-06-24T07:48:31Z"
        message: Ingress service object was not found in the cluster
        reason: IngressServiceNotFound
        status: "False"
        type: IngressAddressReady
    ```

    If the provisioning has been completed, the output looks similar to this:

    ```bash
      - lastTransitionTime: "2022-06-24T07:58:48Z"
        message: Ingress service address has been provisioned
        reason: IngressServiceAddressFound
        status: "True"
        type: IngressAddressReady
      - lastTransitionTime: "2022-06-24T07:58:50Z"
        message: Certificate is up to date and has not expired
        reason: Ready
        status: "True"
        type: IngressCertificateReady
    ```

You can also call up the actual customized values, by inspecting the `KommanderCluster.Status.Ingress`. Here is an example:

```bash
  ingress:
    address: 172.20.255.180
    caBundle: LS0tLS1CRUdJTiBD...<output has been shortened>...DQVRFLS0tLS0K
```

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
