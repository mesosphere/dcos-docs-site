---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall Kaptain
menuWeight: 7
excerpt: Uninstall Kaptain from your cluster
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>When uninstalling Kaptain, all Kaptain-related data of your Kaptain applications such as user profiles, notebooks, pipelines, deployed models, etc. will be lost.</p>

## Prerequisites

Before performing the uninstall, ensure you have:

- `kubectl` installed, and configured to connect to your cluster.
- `jq` installed, and available in your Linux PATH.

## Uninstall Kaptain

Uninstalling Kaptain requires the execution of several manual steps.

1.  Delete all profiles configured with Kaptain. Profiles have dependencies (such as finalizers) associated with Kaptain, so they must be removed before uninstalling Kaptain. Attempting to uninstall Kaptain without removing the profiles will fail and leave many resources in a broken state.

    The following command deletes all notebooks, pipelines and deployed models **permanently**. Notebook volumes created when deploying notebooks are cleaned up and deleted.

    ```bash
    kubectl delete profiles.kubeflow.org --all
    ```

**DO NOT** proceed until all profiles are removed. If a profile cannot be removed, review the troubleshooting section for instructions to [forcibly delete a profile][#cannot-finalize-removing-a-profile].

1.  Uninstall Kaptain using KUDO. This command deletes the Kaptain Percona DB store, all deployments, statefulsets, jobs, and volumes associated with the kubeflow namespace.

    ```bash
    kubectl kudo uninstall --instance "kaptain" --namespace kubeflow --wait --wait-time=600
    ```

1.  Ensure that the `kubeflow` namespace is removed:

    ```bash
    kubectl delete namespace kubeflow
    ```

1.  Clean up any additional configuration resources left behind by KUDO-managed Kaptain, so you can install Helm-managed Kaptain correctly. This command selects various resource types with the label `kudo.dev/instance` of either `"kaptain"` or beginning with `"kaptain-"`.

    ```bash
    for type in clusterrole customresourcedefinition clusterrolebinding clusterrole mutatingwebhookconfiguration ValidatingWebhookConfiguration operators; do
      INSTANCES=$(kubectl get $type  --output json | jq '.items[].metadata.labels["kudo.dev/instance"] | select(. != null)'  -r | egrep '^kaptain(-|$)' | tr "\n" ",")
      kubectl delete $type --selector "kudo.dev/instance in ($INSTANCES)"
    done
    ```

    Kaptain is now fully uninstalled.

1.  Remove Kudo:

    ```bash
    kubectl kudo init --upgrade --dry-run --output yaml | kubectl delete -f -
    ```

## Troubleshooting and overcoming failures

Sometimes, the uninstall steps will fail or hang because a cleanup task gets stuck. In that case, you will need to force Kubernetes to uninstall the resources. In such cases, you may need to clean up things manually. Follow the steps below as necessary.

### Cannot finalize removing a profile

1.  Skip the finalizer and manually clean up the namespace and related persistent volumes.

    ```bash
    kubectl patch profile <profile-name> -p '{"metadata":{"finalizers":null}}' --type=merge
    ```

1.  Try to delete the profile again:

    ```bash
    kubectl delete profile <profile-name>
    ```

1.  Find, and make a record of all persistent volumes IDs associated with this profile. You will delete these volumes later.

    ```bash
    kubectl get persistentvolume
    ```

1.  Delete the namespace associated with the profile.

    ```bash
    kubectl delete namespace <profile-name>
    ```

1.  Delete any persistent volumes that were associated with this profile.

    ```bash
    kubectl delete persistentvolume <persistent-volume-id>
    ```

### KUDO Kaptain uninstall fails

If KUDO Kaptain uninstall hangs and fails to properly uninstall, force the removal of the Kaptain instance, and manually clean up volumes and namespaces.

1.  Find the KUDO instance which is stuck:

    ```bash
    kubectl get instances -n kubeflow
    ```

1.  Patch it, and remove it:

    ```bash
    kubectl patch instances -n kubeflow <instance-name> -p '{"metadata":{"finalizers":null}}' --type=merge
    kubectl delete instance <instance-name>
    ```

1.  Repeat the above until `kubectl get instances -n kubeflow` returns an empty list.

1.  Find, and make a record of all persistent volumes IDs associated with Kubeflow. Look at the CLAIM column and look for values such as `kubeflow/datadir-kaptain-mysql-store-pxc-0`. You will delete these volumes later.

    ```bash
    kubectl get persistentvolume
    ```

1.  Remove the kubeflow namespace:

    ```bash
    kubectl delete namespace kubeflow
    ```

1.  Remove all dangling persistent volumes:

    ```bash
    kubectl delete persistentvolume <persistentvolumeid>
    ```
