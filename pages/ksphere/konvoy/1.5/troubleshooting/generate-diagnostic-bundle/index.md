---
layout: layout.pug
navigationTitle: Generate a diagnostic bundle
title: Generate a diagnostic bundle
menuWeight: 10
excerpt: Generate a diagnostic bundle of log files for troubleshooting and analysis
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy provides a subcommand to generate a diagnostic bundle with data collected for the last 48 hours of the life of the cluster.

To generate the diagnostic bundle

1. Change to the directory that contains the state files for your Konvoy cluster state.

1. Generate a compressed archive containing diagnostic information by running the following command:

    ```bash
    konvoy diagnose
    ```

    This command creates a bundle in the working directory with a file name that represents the timestamp for when the file was created.

1. Verify the file was created using the current timestamp as the file name by running the following command:

    ```bash
    ls
    ```

    If the file was successfully created, the directory listing returns output similar to the following:

    ```text
    20190705T114114.tar.gz
    ```

    The compressed archive contains detailed information about each node in the cluster, including information about the state of the system on each node and log files for each relevant running component.

1. Extract the contents of the compressed archive to see information about the files it contains.

    For example:

    ```bash
    $ tar -xvf 20190705T114114.tar.gz
    bundles/master_172.17.0.3.tar.gz
    bundles/worker_172.17.0.2.tar.gz
    bundles/cluster-data.tar.gz
    bundles/helm.tar.gz
    ...
    ```

    As you can see there is a `cluster-data.tar.gz` archive. That file contains cluster-wide data such as pod logs and details about API resources. Node bundles contain node-specific information:

    ```bash
    $ tar -xvf bundles/master_172.17.0.3.tar.gz
    iptables-save.txt
    ctr-version.txt
    containerd.service.log
    containerd.service.status.txt
    journalctl.log
    kubelet.service.log
    ansible_facts.json
    timedatectl.txt
    kubelet.service.status.txt
    dmesg.txt
    ```
