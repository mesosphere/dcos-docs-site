---
layout: layout.pug
navigationTitle: Custom Domain
title: Custom Domain
menuWeight: 8
excerpt: Configure a custom domain for Konvoy
beta: false
---

## Configure Konvoy to use a custom domain

To configure a custom domain, update the `konvoyconfig` addon in `cluster.yaml` and apply the changes using `konvoy up`:

The hostname, for example `mycluster.domain.dom` in these examples, must be resolvable from the client (your browser) and from the cluster.

```yaml
- name: konvoyconfig
  enabled: true
  values: |
     config:
        clusterHostname: mycluster.domain.dom
        caSecretName: <secret name>
```

### Use external-dns to create a CNAME  (Optional)

You can automate the process of creating a CNAME record for your ELB by configuring the `external-dns` and `traefik` addons:

#### Configure external-dns controller

##### AWS

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
    - domain.dom
```

<p class="message--note"><strong>NOTE: </strong>The AWS account must have permissions to update <code>route 53</code>. More details can be found <a href="https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md">in this documentation</a>.</p>

##### RFC2136 (for example, BIND and Windows DNS)

In many on-premises environments, DNS entries may be updated using the `external-dns` RFC2136 provider.

```yaml
- name: external-dns
  enabled: true
  values: |
    provider: rfc2136
    rfc2136:
      host: ns1.domain.dom
      port: 53
      zone: domain.dom
      tsigSecret: "96Ah/a2g0/nLeFGK+d/0tzQcccf9hCEIy34PoXX2Qg8="
      tsigSecretAlg: hmac-sha256
      tsigKeyname: externaldns-key
      tsigAxfr: true
    policy: sync
    txtPrefix: local-
    domainFilters:
    - domain.dom
```

#### Configure traefik for external-dns controller

Annotate the `traefik` Addon with the custom domain name.

```yaml
- name: traefik
  enabled: true
  values: |
    service:
      annotations:
        external-dns.alpha.kubernetes.io/hostname: mycluster.domain.dom
```

### Configure Konvoy to use custom certificates (Optional)

You can also configure Konvoy to use custom certificates as an
additional measure of security.

To configure custom certificates for your domain:

#### Pre-requisites

Requires a custom domain with the following:

- Certificate (in PEM-format)
- Key (unencrypted RSA private key)
- CA bundle (intermediate-ca and root-ca certificates in PEM-format concatenated in the same file) for the custom domain

#### Instructions

1.  Create the directory `extras/kubernetes` from the same directory as your cluster.yaml

    ```bash
    mkdir -p extras/kubernetes
    ```

1.  Create a `secret.yaml` file with the certificate, key and CA bundle(s) and place it in `extras/kubernetes`.
    - *Note*: in the following example, `custom-cert` is used as the secret name and later used to modify addons but users can use whatever secret name they prefer.

    ```bash
    kubectl create secret generic custom-cert -n kubeaddons \
      --from-file ca.crt=<path to ca bundle> \
      --from-file tls.crt=<path to certificate file> \
      --from-file tls.key=<path to private key> \
      --dry-run=client \
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
            clusterHostname: mycluster.domain.dom
            caSecretName: <secret name>

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

1.  Update `ClusterConfiguration` spec of your cluster.yaml with the custom domain name. That will allow you to login to cluster using kubectl

      ```yaml
      kind: ClusterConfiguration
      apiVersion: konvoy.mesosphere.io/v1beta2
      spec:
        kubernetes:
          controlPlane:
            certificate:
              subjectAlternativeNames:
              -  mycluster.domain.dom
      ```

1.  Install `konvoy`.

    ```bash
    konvoy up
    ```

1.  Navigate to `https://mycluster.domain.dom/ops/landing`. Verify the custom certificate is served by the browser.
