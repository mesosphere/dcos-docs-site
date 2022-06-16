---
layout: layout.pug
title: Store secrets in GitOps Repository using SealedSecrets
navigationTitle: Store secrets in a GitOps Repository using SealedSecrets
beta: false
menuWeight: 40
excerpt: Securely managing secrets in a GitOps workflow using SealedSecrets
---

For security reasons, Kubernetes secrets are usually the only resource that cannot be managed with a GitOps workflow. Instead of managing secrets outside of GitOps and having to use a third-party tool like Vault, SealedSecrets provides a way to keep all the advantages of using a GitOps workflow while avoiding exposing secrets. SealedSecrets is composed of two main components:

- A CLI (Kubeseal) to encrypt secrets.
- A cluster-side controller to decrypt the sealed secrets into regular Kubernetes secrets. Only this controller can decrypt sealed secrets, not even the original author.

This tutorial describes how to install these two components, configure the controller, and add or remove sealed secrets.

## Setup

These instructions are used as an example. For instructions on the latest release, see the [release page][sealed-secrets-releases]. For full documentation on SealedSecrets, see the [GitHub repo][sealed-secrets-git].

## Install Kubeseal CLI to encrypt your secrets

-   On MacOS

    ```bash
    brew install kubeseal
    ```

-   On Linux

    ```bash
    wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.17.1/kubeseal-linux-amd64 -O kubeseal
    sudo install -m 755 kubeseal /usr/local/bin/kubeseal
    ```

## Install the SealedSecrets controller on your cluster

This controller will be able to decrypt SealedSecrets and create Kubernetes secrets.

1.  Create the controller:

    ```bash
    kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.17.1/controller.yaml
    ```

1.  Fetch the certificate that you will use to encrypt your secrets into sealed secrets:

    ```bash
    kubeseal --fetch-cert > mycert.pem
    ```

1.  Commit `mycert.pem` to your git repo.

## Adding a secret

Secrets can be securely added to Git using sealed secrets:

1.  Create a Kubernetes secret and pipe it into [kubeseal](https://github.com/bitnami-labs/sealed-secrets#usage) using the certificate `mycert.pem` that you fetched from the controller in the setup:

    ```bash
    echo '---' >> secrets.yaml
    kubectl create secret -n dispatch generic mysecret --dry-run -o yaml --from-literal=my-secret=value | \
        kubeseal --format yaml --cert mycert.pem >> secrets.yaml
    ```

1.  Go to the end of `secrets.yaml` where you just added your new sealed secret. Remove any "creationTimestamp" fields from the yaml.

1.  Run `kubectl apply -f secrets.yaml`. If you do not have permission, commit your changes to the repo and let FluxCD apply the changes for you.

1.  The sealed secret controller will then decrypt the sealed secret and generate a Kubernetes secret from it. Your secret got successfully created by running:

    ```bash
    kubectl get secret mysecret -n dispatch -o yaml
    ```

1.  If your sealed secret got created successfully but did not generate the matching secret, look at the logs of the controller:

    ```bash
    kubectl logs -l=name=sealed-secrets-controller -n kube-system
    ```

1.  Commit `secrets.yaml` to your repo if you have not already done so in step 3.

## Removing a secret

1.  Following the same example from above in "Adding a secret", now remove the manifest for `mysecret` in `secrets.yaml` and commit those changes to the repo.

1.  Delete the sealed secret in the cluster:

    ```bash
    kubectl delete SealedSecret mysecret
    ```

1.  Delete the secret itself:

    ```bash
    kubectl delete secret mysecret
    ```

## Rotating the controller's sealing key

For added security, it is a good practice to rotate the key the controller uses to decrypt sealed secrets. By default, the controller generates a new key every 30 days. When this happens, you need to update the certificate you use to create sealed secrets by fetching the latest one:

   ```bash
      kubeseal --fetch-cert > mycert.pem
   ```

<p class="message--note"><strong>NOTE: </strong>Do not forget to commit it back to the repo!</p>

In a disaster case, let's say your cluster gets destroyed, you would lose all your sealing keys, so you would not be able to recreate all the secrets from the sealed secrets in your GitOps repo. For this reason, you might want to back up the sealing keys. To do this every time a new sealing key is generated, run:

   ```bash
   kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > sealing-key
   ```

Then store `sealing-key` with the others in a safe location such as OneLogin Notes or Vault.
To restore from a backup after a disaster, recreate all of the sealing keys with `kubectl apply -f sealing-key1 sealing-key2 ...` before starting the controller. If the controller was already started, restart it:
`kubectl delete pod -n kube-system -l name=sealed-secrets-controller`

**To disable sealing key rotation** For example, configure the controller's command in the pod template with `--key-renew-period=0`. See the following yaml file.

```yaml
Pod Template:
  Labels:           name=sealed-secrets-controller
  Service Account:  sealed-secrets-controller
  Containers:
   sealed-secrets-controller:
    Image:      quay.io/bitnami/sealed-secrets-controller:v0.9.8
    Port:       8080/TCP
    Host Port:  0/TCP
    Command:    controller
      --key-renew-period=0
```

If required, edit the controller's manifest with:

   ```bash
   kubectl edit deployment.apps/sealed-secrets-controller -n kube-system
   ```

[sealed-secrets-git]: https://github.com/bitnami-labs/sealed-secrets
[sealed-secrets-releases]: https://github.com/bitnami-labs/sealed-secrets/releases
