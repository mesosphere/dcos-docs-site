---
layout: layout.pug
title: Store secrets in GitOps Repository using SealedSecrets
navigationTitle: Store secrets in a GitOps Repository using SealedSecrets
beta: false
menuWeight: 105
excerpt: Securely managing secrets in a GitOps workflow using SealedSecrets
---

# Overview
For security reasons, Kubernetes secrets are usually the only resource that cannot be managed with a GitOps workflow. Instead of managing secrets outside GitOps and having to use a third-party tool like Vault, SealedSecrets provide a way to keep all the advantages of using a GitOps workflow while avoiding exposing secrets. SealedSecrets is composed of two main components:

1. A CLI (Kubeseal) to encrypt secrets.
2. A cluster-side controller to decrypt the sealed secrets into regular Kubernetes secrets. Only this controller can decrypt sealed secrets (not even the original author).

The following tutorial will cover how to install these two components, configure the controller, and add/remove sealed secrets.

# Setup

The instructions below are used as an example. For instructions on the latest release, see <https://github.com/bitnami-labs/sealed-secrets/releases>.  
For full documentation on SealedSecrets, see <https://github.com/bitnami-labs/sealed-secrets>.

## Install Kubeseal CLI to encrypt your secrets

- On MacOS
    ```bash
    brew install kubeseal
    ```

- On Linux
    ```bash
    wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.4/kubeseal-linux-amd64 -O kubeseal
    sudo install -m 755 kubeseal /usr/local/bin/kubeseal
    ```

## Install the SealedSecrets controller on your cluster
This controller will be able to decrypt SealedSecrets and create Kubernetes secrets.

1. Create the controller:

    ```bash
    kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.4/controller.yaml
    ```  

2. Fetch the certificate that you will use to encrypt your secrets into sealed secrets:

    ```
    kubeseal --fetch-cert > mycert.pem
    ```

3. Commit `mycert.pem` to your git repo.

# Adding a secret

Secrets can be securely added to Git using sealed secrets:

1. Create a Kubernetes secret and pipe it into [kubeseal](https://github.com/bitnami-labs/sealed-secrets#usage) using the certificate `mycert.pem` that you fetched from the controller in the setup:
    ```bash
    echo '---' >> secrets.yaml
    kubectl create secret -n dispatch generic mysecret --dry-run -o yaml --from-literal=my-secret=value | \
        kubeseal --format yaml --cert mycert.pem >> secrets.yaml
    ```

2. Go to the end of `secrets.yaml` where you just added your new sealed secret. Remove any "creationTimestamp" fields from the yaml.

3. Run `kubectl apply -f secrets.yaml`. If you don't have permission, commit your changes to the repo and let ArgoCD apply the changes for you.

4. The sealed secret controller will then decrypt the sealed secret and generate a Kubernetes secret from it.  that your secret got successfully created by running:  

    ```bash
    kubectl get secret mysecret -n dispatch -o yaml
    ```

5. If your sealed secret got created successfully but did not generate the matching secret, look at the logs of the controller:  
    
    ```bash
    kubectl logs -l=name=sealed-secrets-controller -n kube-system
    ```

6. Commit `secrets.yaml` to your repo if you haven't already done so in step 3.

# Removing a secret

1. Following the same example from above in "Adding a secret", now remove the manifest for `mysecret` in `secrets.yaml` and commit those changes to the repo.

2. Delete the sealed secret in the cluster:  

    ```bash
    kubectl delete SealedSecret mysecret
    ```

3. Delete the secret itself:  

    ```bash
    kubectl delete secret mysecret
    ```

# Rotating the controller's sealing key

For added security, it's a good practice to rotate the key the controller uses to decrypt sealed secrets. By default, the controller generates a new key every 30 days. When this happens, you need to update the certificate you use to create sealed secrets by fetching the latest one:


   ```
   kubeseal --fetch-cert > mycert.pem
   ```

**Note:** Don't forget to commit it back to the repo!

In a disaster case, let's say your cluster gets destroyed, you would lose all your sealing keys, so you would not be able to recreate all the secrets from the sealed secrets in your GitOps repo. For this reason, you might want to back up the sealing keys. Do this every time a new sealing key is generated:  

   ```bash
   kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > sealing-key
   ```

Then store `sealing-key` with the others in a safe location such as OneLogin Notes or Vault.
To restore from a backup after a disaster, recreate all of the sealing keys with `kubectl apply -f sealing-key1 sealing-key2 ...` before starting the controller. If the controller was already started, restart it:  
`kubectl delete pod -n kube-system -l name=sealed-secrets-controller`

**To disable sealing key rotation** (e.g. for a test environment), configure the controller's command in the pod template with `--key-renew-period=0` (see sample yaml below).

```yaml
Pod Template:
  Labels:           name=sealed-secrets-controller
  Service Account:  sealed-secrets-controller
  Containers:
   sealed-secrets-controller:
    Image:      quay.io/bitnami/sealed-secrets-controller:v0.9.8
    Port:       8080/TCP
    Host Port:  0/TCP
    Command:
      controller
      --key-renew-period=0
```

If required, edit the controller's manifest with  
   
   ```bash
   kubectl edit deployment.apps/sealed-secrets-controller -n kube-system
   ```
