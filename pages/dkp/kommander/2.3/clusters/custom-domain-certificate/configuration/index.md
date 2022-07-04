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

To customize the domain or certificate for a specific cluster after the installation of DKP, adapt or create an API `yaml` that allows DKP to implement the established adjustments on top of the default, or any previous configuration, you have made.

## Configure custom domains or custom certificates

<p class="message--warning"><strong>IMPORTANT:</strong> Ensure your <code>dkp</code> configuration references the management cluster of the environment where you want to customize the domain or certificate by setting the <code>KUBECONFIG=<path></code> environment variable, or using the <code>--kubeconfig</code> flag, <a href="https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/">in accordance with Kubernetes conventions</a>.

To customize the domain or certificate of a cluster, alter the `spec` values of the `ingress` object in the `KommanderCluster`. Note that you can reference an issuer as an `issuerRef` **OR** a secret as a `certificateSecretRef`, as long as the object is created on the cluster where you want to customize the configuration.

In the Management cluster, both the `KommanderCluster` and `issuerRef` or `certificateSecretRef` objects are on the same cluster. In Managed and Attached clusters, the `KommanderCluster` object is stored on the Management cluster, and the `issuerRef` or `certificateSecretRef` object is on the Managed or Attached cluster.

Use the API yaml to customize the domain (via the `hostname` field), and the certificate (via the `issuerRef` or `certificateSecretRef` field).

Refer to the following examples:

1.  You have two options to create or update and apply the `KommanderCluster` object with the wanted ingress.

    One option is to use a certificate that is managed automatically and supported by cert-manager like ACME (if you use Let's Encrypt, refer to the [example below](#example-configure-a-custom-certificate-with-lets-encrypt). For this, reference the **name of the `Issuer` or `ClusterIssuer` that contains your ACME provider information** in the `issuerRef` field, and enter the custom domain name in the `hostname` field of the target cluster:

    ```yaml
    cat <<EOF | kubectl -n <workspace_namespace> --kubeconfig <management_cluster_kubeconfig> patch \ 
    kommandercluster <cluster_name>  --type='merge' --patch-file=/dev/stdin
    spec:
      ingress:
        hostname: <cluster_hostname>
        issuerRef:
          name: <issuer_name>
          kind: ClusterIssuer # or Issuer depending on the issuer config
    EOF
    ```

    Another option is to use a manually created certificate that is **customized for your hostname**. To do so, create a secret holding the certificate on the target cluster. Reference that secret in the `certificateSecretRef` field and the custom domain name in the `hostname` field of the target cluster:

    ```yaml
    cat <<EOF | kubectl -n <workspace_namespace> --kubeconfig <management_cluster_kubeconfig> patch \ 
    kommandercluster <cluster_name>  --type='merge' --patch-file=/dev/stdin
    spec:
      ingress:
        hostname: <cluster_hostname>
        certificateSecretRef:
          name: <secret_name>
    EOF
    ```

<p class="message--note"><strong>NOTE: </strong>It is not possible to configure the namespace of the secret with a command. Ensure the secret is stored in the workspace namespace of the target cluster.</p>

### Example: Configure a custom certificate with Let's Encrypt

Let's Encrypt is one of the Certificate Authorities (CA) supported by cert-manager. To set up a Let's Encrypt certificate, provide an `Issuer` or `ClusterIssuer` on the target cluster in the `issuerRef` field.

1.  Create the Let's Encrypt ACME cert-manager issuer:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: cert-manager.io/v1
    kind: ClusterIssuer
    metadata:
      name: custom-acme-issuer
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

1.  Configure the Management cluster to use your `custom-domain.example.com` with a certificate issued by Let's Encrypt.

    ```yaml
    cat <<EOF | kubectl -n kommander --kubeconfig <management_cluster_kubeconfig> patch \ kommandercluster host-cluster  --type='merge' --patch-file=/dev/stdin
    spec:
      ingress:
        hostname: custom-domain.example.com
        issuerRef:
          name: custom-acme-issuer
          kind: ClusterIssuer
    EOF
    ```

## Verify the status of the configuration and troubleshoot in case of errors

If you want to ensure the customization for a domain or a certificate is completed, or if you want to obtain more information if the customization fails, display the status information for the `KommanderCluster`.

1.  Inspect the modified `KommanderCluster` object:

    ```bash
    kubectl -n <workspace_namespace> get kommandercluster <cluster_name> -o yaml
    ```

    If the ingress is still being provisioned, the output looks similar to this:

    ```yaml
      conditions:
      - lastTransitionTime: "2022-06-24T07:48:31Z"
        message: Ingress service object was not found in the cluster
        reason: IngressServiceNotFound
        status: "False"
        type: IngressAddressReady
    ```

    If the provisioning has been completed, the output looks similar to this:

    ```yaml
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

```yaml
  ingress:
    address: 172.20.255.180
    caBundle: LS0tLS1CRUdJTiBD...<output has been shortened>...DQVRFLS0tLS0K
```

[management]: ../../../install/configuration/custom-domain/
