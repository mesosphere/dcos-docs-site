---
layout: layout.pug
navigationTitle: Fluent Bit
title: Fluent Bit
menuWeight: 11
excerpt: Fluent Bit is the Kommander choice of open-source log collection and forwarding tool.
beta: false
enterprise: false
---

[Fluent Bit](https://fluentbit.io/) is the DKP choice of open-source log collection and forwarding tool.

## Audit Log Collection

[Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) in Kubernetes provides a way to chronologically document the actions taken on a cluster. On Kommander, by default, audit logs are collected and stored for quick indexing. Viewing and accessing can be done via the Grafana logging UI.

## Collecting systemd logs from a non-default path

By default, Fluent Bit pods are configured to collect `systemd` logs from the
`/var/log/journal/` path on cluster nodes.

If `systemd-journald` running as a part of the OS on the nodes uses a different
path for writing logs, you will need to override configuration of the
`fluent-bit` AppDeployment to make Fluent Bit collect `systemd` logs.

To configure the Fluent Bit AppDeployment to collect `systemd` logs from a
non-default path, follow these steps (all `kubectl` invocations refer to the
**management** cluster):

1.  Identify the `systemd-journald` log data storage path on the nodes of the
clusters in the workspace by using the OS documentation and examining the
`systemd` configuration.

    Usually it will be either `/var/log/journal` (typically used when
    `systemd-journald` is configured to store logs permanently; in this case the
    default Fluent Bit configuration should work) or `/run/log/journal` (typically
    used when `systemd-journald` is configured to use a volatile storage).

1.  Extract the default Helm values used by the Fluent Bit App:

    ```bash
    kubectl get -n kommander configmaps fluent-bit-0.16.2-d2iq-defaults -o=jsonpath='{.data.values\.yaml}' > fluent-bit-values.yaml
    ```

1.  Edit the resulting file `fluent-bit-values.yaml` by removing all sections except for `extraVolumes`, `extraVolumeMounts` and `config.inputs`. The result should look similarly to this:

    ```yaml
    extraVolumes:
    # we create this to have a persistent tail-db directory an all nodes
    # otherwise a restarted fluent-bit would rescrape all tails
    - name: tail-db
      hostPath:
        path: /var/log/tail-db
        type: DirectoryOrCreate
    # we create this to get rid of error messages that would appear on non control-plane nodes
    - name: kubernetes-audit
      hostPath:
        path: /var/log/kubernetes/audit
        type: DirectoryOrCreate
    # needed for kmsg input plugin
    - name: uptime
      hostPath:
        path: /proc/uptime
        type: File
    - name: kmsg
      hostPath:
        path: /dev/kmsg
        type: CharDevice

    extraVolumeMounts:
    - name: tail-db
      mountPath: /tail-db
    - name: kubernetes-audit
      mountPath: /var/log/kubernetes/audit
    - name: uptime
      mountPath: /proc/uptime
    - name: kmsg
      mountPath: /dev/kmsg

    config:
      inputs: |
        # Collect audit logs, systemd logs, and kernel logs.
        # Pod logs are collected by the fluent-bit deployment managed by logging-operator.
        [INPUT]
            Name tail
            Alias kubernetes_audit
            Path /var/log/kubernetes/audit/*.log
            Parser kubernetes-audit
            DB /tail-db/audit.db
            Tag audit.*
            Refresh_Interval 10
            Rotate_Wait 5
            Mem_Buf_Limit 135MB
            Buffer_Chunk_Size 5MB
            Buffer_Max_Size 20MB
            Skip_Long_Lines Off
        [INPUT]
            Name systemd
            Alias kubernetes_host
            DB /tail-db/journal.db
            Tag host.*
            Max_Entries 1000
            Read_From_Tail On
            Strip_Underscores On
        [INPUT]
            Name kmsg
            Alias kubernetes_host_kernel
            Tag kernel
    ```

1.  Add the following item to the list under the `extraVolumes` key:

    ```yaml
    - name: kubernetes-host
      hostPath:
        path: <path to systemd logs on the node>
        type: Directory
    ```

1.  Add the following item to the list under the `extraVolumeMounts` key:

    ```yaml
    - name: kubernetes-host
      mountPath: <path to systemd logs on the node>
    ```

    These items will make Kubernetes mount systemd logs into Fluent Bit pods.

1.  Add the following line into the `[INPUT]` entry identified by `Name systemd` and `Alias kubernetes_host`.

    ```bash
    Path <path to systemd logs on the node>
    ```

This is needed to make Fluent Bit actually collect the mounted logs

Assuming that the path to systemd logs on the node is `/run/log/journal`,
the result will look similarly to this:

```yaml
extraVolumes:
# we create this to have a persistent tail-db directory an all nodes
# otherwise a restarted fluent-bit would rescrape all tails
- name: tail-db
  hostPath:
    path: /var/log/tail-db
    type: DirectoryOrCreate
# we create this to get rid of error messages that would appear on non control-plane nodes
- name: kubernetes-audit
  hostPath:
    path: /var/log/kubernetes/audit
    type: DirectoryOrCreate
# needed for kmsg input plugin
- name: uptime
  hostPath:
    path: /proc/uptime
    type: File
- name: kmsg
  hostPath:
    path: /dev/kmsg
    type: CharDevice
- name: kubernetes-host
  hostPath:
    path: /run/log/journal
    type: Directory

extraVolumeMounts:
- name: tail-db
  mountPath: /tail-db
- name: kubernetes-audit
  mountPath: /var/log/kubernetes/audit
- name: uptime
  mountPath: /proc/uptime
- name: kmsg
  mountPath: /dev/kmsg
- name: kubernetes-host
  mountPath: /run/log/journal

config:
  inputs: |
    # Collect audit logs, systemd logs, and kernel logs.
    # Pod logs are collected by the fluent-bit deployment managed by logging-operator.
    [INPUT]
        Name tail
        Alias kubernetes_audit
        Path /var/log/kubernetes/audit/*.log
        Parser kubernetes-audit
        DB /tail-db/audit.db
        Tag audit.*
        Refresh_Interval 10
        Rotate_Wait 5
        Mem_Buf_Limit 135MB
        Buffer_Chunk_Size 5MB
        Buffer_Max_Size 20MB
        Skip_Long_Lines Off
    [INPUT]
        Name systemd
        Alias kubernetes_host
        Path /run/log/journal
        DB /tail-db/journal.db
        Tag host.*
        Max_Entries 1000
        Read_From_Tail On
        Strip_Underscores On
    [INPUT]
        Name kmsg
        Alias kubernetes_host_kernel
        Tag kernel
```

1.  Execute the following command to get the namespace of your workspace:

    ```bash
    kubectl get workspaces
    ```

1.  Copy the value under `WORKSPACE NAMESPACE` column for your workspace. This may NOT be identical to the Display Name of the `Workspace`.

1.  Export the `WORKSPACE_NAMESPACE` variable:

    ```bash
    export WORKSPACE_NAMESPACE=<WORKSPACE_NAMESPACE>
    ```

1.  Create a `ConfigMap` manifest with override values from `fluent-bit-values.yaml`:

    ```bash
    cat <<EOF >fluent-bit-overrides.yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
      name: fluent-bit-overrides
    data:
      values.yaml: |
    $(cat fluent-bit-values.yaml | sed 's/^/    /g')
    EOF
    ```

1.  Create a `ConfigMap` from the manifest above:

    ```bash
    kubectl apply -f fluent-bit-overrides.yaml
    ```

1.  Edit the `fluent-bit` AppDeployment to set the value of
`spec.configOverrides.name` to the name of the created `ConfigMap`.
(You can use the steps in the procedure, [Deploy an application with a custom configuration](../../workspaces/workspace-platform-services/application-deployment/#deploy-an-application-with-a-custom-configuration) as a guide.)

    ```bash
    kubectl edit -n ${WORKSPACE_NAMESPACE} fluent-bit
    ```

    After your editing is complete, the AppDeployment resembles this example:

    ```yaml
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: fluent-bit
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: fluent-bit-0.16.2
        kind: ClusterApp
      configOverrides:
        name: fluent-bit-overrides
    ```

1.  Log in into the Grafana logging UI of your workspace and verify that logs
with a label `log_source=kubernetes_host` are now present in Loki.

## Related information

For information on related topics or procedures, refer to the following:

- [Logging](..)
