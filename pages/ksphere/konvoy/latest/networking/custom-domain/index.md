# Configure Konvoy to use a custom domain

To configure a custom domain, update the `konvoyconfig` addon in `cluster.yaml`:

```yaml
- name: konvoyconfig
  enabled: true
  values: |
     config:
        clusterHostname: < custom domain >
```

## Use external-dns to create a CNAME

In a cloud environment, you can automate the process of creating a CNAME record
 for your ELB by configuring the `external-dns` addon.

### AWS

In AWS, the `external-dns` can be configured as:

```yaml
- name: external-dns
  enabled: true
  values: |
    aws:
      credentials:
        secretKey: <aws secret key>
        accessKey:  <aws access key>
      region: <aws region>
      preferCNAME: true
    policy: sync
    txtPrefix: local-
    domainFilters:
    - <custom domain>
```

<p class="message--note"><strong>NOTE: </strong>The AWS account must have permissions to update `route 53`. More details can be found [here][external-dns].</p>

You also have to annotate the `traefik` addon with the custom domain name.

```yaml
- name: traefik
  enabled: true
  values: |
    service:
      annotations:
        external-dns.alpha.kubernetes.io/hostname: <custom domain>
```

## Configure Konvoy to use custom certificates

You can also configure Konvoy to use custom certificates as an
additional measure of security.

To configure custom certificates for your domain:

## Pre-requisites

-   Requires minimum Konvoy version `v1.3` or greater.
-   A custom domain with the following:
    - Certificate (in PEM-format)
    - Key (unencrypted RSA private key)
    - CA bundle (intermediate-ca and root-ca certificates in PEM-format concatenated in the same file) for the custom domain

## Instructions

1.  Create the directory `extras/kubernetes` inside the root Konvoy directory.

    ```shell
    mkdir -p <path to konvoy dir>/extras/kubernetes
    ```

1.  Create a `secret.yaml` file with the certificate, key and CA bundle(s) and place it in `extras/kubernetes`.
    - *Note*: in the following example, `custom-cert` is used as the secret name and later used to modify addons but users can use whatever secret name they prefer.

    ```shell
    kubectl create secret generic custom-cert -n kubeaddons \
      --from-file ca.crt=<path to ca bundle> \
      --from-file tls.crt=<path to certificate file> \
      --from-file tls.key=<path to private key> \
      --dry-run \
      --save-config -o yaml > extras/kubernetes/secret.yaml
    ```

1.  Update `cluster.yaml` addons with the custom domain name and the secret name.
    -   Set `clusterHostname` in `konvoyConfig` to your custom domain.
    -   Set the `caSecretName` in `dex-k8s-authenticator`, `kube-oidc-proxy`, and `traefik`, and `traefik-forward-auth` to the name of the secret created in Step 2.
        - *Note*: The following example is a yaml file and the indentation must be maintained.

      ```yaml
      - name: konvoyconfig
        values: |
          config:
            clusterHostname: <hostname>

      - name: dex-k8s-authenticator
        values: |
          caCerts:
            enabled: true
            caSecretName: custom-cert

      - name: kube-oidc-proxy
        values: |
          oidc:
            caSecretName: custom-cert

      - name: traefik
        values: |
          ssl:
            caSecretName: custom-cert

      - name: traefik-forward-auth
        values: |
          traefikForwardAuth:
            caSecretName: custom-cert
      ```

1.  Install `konvoy`.

    ```shell
    konvoy up
    ```

1.  Navigate to `https://<custom-domain>/ops/landing`. Verify the custom certificate is served by the browser.

[external-dns]: https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md
