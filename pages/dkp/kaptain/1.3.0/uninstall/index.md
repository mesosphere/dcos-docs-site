---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall Kaptain
menuWeight: 7
excerpt: Uninstall Kaptain from your cluster
beta: false
enterprise: false
---

### Uninstall Kaptain

Uninstalling Kaptain requires the execution of a few manual steps in addition to the regular "KUDO uninstall" command.

1.  Delete all profiles configured with Kaptain. Profiles have dependencies (such as finalizers) associated with Kaptain, and removing Kaptain before removing your profiles will put your cluster in a broken state.

    The following command deletes all notebooks, pipelines and deployed models. Notebook volumes created when deploying notebooks are cleaned up and deleted. Ensure you have backed up anything that is not in managed storage (even if model artifacts are stored in your object store, and your notebook code is in version control).

    ```bash
    kubectl get profile --output name | while read name; do
      kubectl delete $name
    done
    ```

**DO NOT** proceed until all profiles are removed. If a profile cannot be removed, review the troubleshooting section for instructions to [forcibly delete a profile][#### Removing a profile gets stuck].

1.  Uninstall Kaptain using KUDO. This command deletes the Kaptain Percona DB store, all deployments, statefulsets, jobs, and volumes associated with the kubeflow namespace.

    ```
    kubectl kudo uninstall --instance "kaptain" --namespace kubeflow --wait --wait-time=600
    ```

1.  Ensure that the following namespaces are removed:

    ```bash
    for ns in kubeflow kaptain-ingres kserve; do
      kubectl delete namespace $ns
    done
    ```

1.  Clean up several additional configuration resources left behind by KUDO-managed Kaptain, so you can install Helm-managed Kaptain correctly. This command selects various resource types with the label `kudo.dev/instance` of either `"kaptain"` or beginning with `"kaptain-"`.

    ```bash
    for type in clusterrole customresourcedefinition clusterrolebinding clusterrole mutatingwebhookconfiguration ValidatingWebhookConfiguration; do
      INSTANCES=$(kubectl get $type  --output json | jq '.items[].metadata.labels["kudo.dev/instance"] | select(. != null)'  -r | egrep '^kaptain(-|$)' | tr "\n" ",")
      kubectl delete $type --selector "kudo.dev/instance in ($INSTANCES)"
    done
    ```

    Kaptain is now fully uninstalled.

1.  Remove Kudo:

    ```bash
    kubectl kudo init --upgrade --dry-run --output yaml | kubectl delete -f -
    ```

### Troubleshooting and overcoming failures

Sometimes, for various reasons, uninstall steps may fail or hang because a cleanup task gets stuck. You may need to take steps for force Kubernetes to uninstall resources. Some cleanup may not be fully run.

#### Removing a profile gets stuck

If a profile fails to remove, you can skip the finalizer and manually clean up the namespace and related persistent volumes.

```
kubectl patch profile <profile-name> -p '{"metadata":{"finalizers":null}}' --type=merge
```

Then, try to delete it again:

```
kubectl delete profile <profile-name>
```

Next, find and make record of all persistent volumes ids associated with this profile. You will want to delete these volumes later.

```
kubectl get persistentvolume
```

Now, delete the namespace associated with the profile.

```
kubectl delete namespace <profile-name>
```

Finally, delete any persistent volumes that were associated with this profile

```
kubectl delete persistentvolume <persistent-volume-id>
```

#### KUDO Kaptain uninstall fails

If Kudo Kaptain uninstall hangs and fails to properly uninstall, you can force the removal of the Kaptain instance, and then manually clean up volumes and namespaces.

Find the Kudo instance which is stuck:

```
kubectl get instances -n kubeflow
```

Patch it, and remove it:

```
kubectl patch instances -n kubeflow <instance-name> -p '{"metadata":{"finalizers":null}}' --type=merge
kubectl delete instance <instance-name>
```

Repeat the above until `kubectl get instances -n kubeflow` returns an empty list.

Next, find and make record all persistent volumes ids associated with Kubeflow. Look at the CLAIM column and look for values `kubeflow/datadir-kaptain-mysql-store-pxc-0`. You will want to delete these volumes later.

```
kubectl get persistentvolume
```

Next, remove the kubeflow namespace:

```
kubectl delete namespace kubeflow
```

Finally, remove all dangling persistent volumes:

```
kubectl delete persistentvolume <persistentvolumeid>
```
