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

To customize the domain or certificate of a cluster, alter the `Ingress` value of the `KommanderCluster`. Note that the `Issuer` object must be created on the cluster where you want to customize the configuration. In the Management cluster, both the `KommanderCluster` and `Issuer` objects are on the same cluster. In Managed and Attached clusters, the `KommanderCluster` object is stored on Management cluster, and the `Issuer` object is on the Managed or Attached cluster.

Use the API yaml to customize the domain (via the `hostname` field), the certificate (via the `issuerRef` or `certificateSecretRef` field), or both.

For this, refer to the following examples:

1.  You have two options to create or update and apply the `KommanderCluster` object with the wanted ingress.

    One option is to use a certificate that is managed automatically and supported by cert-manager like ACME (if you use Let's Encrypt, refer to the [example below](#example-configure-a-custom-certificate-with-lets-encrypt). For this, reference the `Issuer` or `ClusterIssuer` on the target cluster **to be used by cert-manager** in the `issuerRef` field, and enter the custom domain in the `hostname` field of the target cluster:

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

    Another option is to use a certificate provided by you and **customized for your hostname**. To do so, create a secret holding the certificate on the target cluster. Reference that secret in the `certificateSecretRef` field and the custom domain in the `hostname` field of the target cluster:

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

### Example: Configure a custom certificate with Let's Encrypt

Let's Encrypt is one of the Certificate Authorities (CA) supported by cert-manager. To set up a Let's Encrypt certificate, provide a `Issuer` or `ClusterIssuer` on the target cluster in the `issuerRef` field:

<!-- TODO: example for let's encrypt -->

## Verify the status of the configuration and troubleshoot in case of errors

If you want to ensure the customization for a domain or a certificate is completed, or if you want to obtain more information in case the customization fails, call up a list of statuses for the `KommanderCluster`.

1.  Inspect the modified `KommanderCluster` object:

    ```bash
    kubect -n <workspace_namespace> get kommandercluster <cluster_name> -o yaml
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
