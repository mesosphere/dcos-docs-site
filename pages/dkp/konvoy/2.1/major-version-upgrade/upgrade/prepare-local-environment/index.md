---
layout: layout.pug
navigationTitle: Prepare Local Environment
title: Prepare Local Environment
menuWeight: 10
excerpt: Preparing the local environment
beta: true
enterprise: false
---


## Install software

- [Download and install DKP Konvoy 2.1](../../../download) and review the [Release Notes](../../../release-notes)
- [Download and install Helm](https://helm.sh/docs/intro/install/).

## Get Konvoy 1.8 Cluster Artifacts

1.  Download the artifacts from one of the control plane machines in your cluster.

    Run this script in your Konvoy 1.8 cluster directory.

    ```yaml
      cat <<EOF > fetch.yaml
    - hosts: control-plane[0]
      any_errors_fatal: true
      name: "{{ play_name | default('Fetch existing cluster artifacts') }}"
      serial: 1
      become: yes

      tasks:
        - name: Fetch cluster CA
          fetch:
            src: /etc/kubernetes/pki/{{ item }}
            dest: "{{ working_directory }}/cluster-artifacts/{{ item }}"
            flat: yes
          with_items:
            - ca.crt
            - ca.key
            - sa.pub
            - sa.key
            - front-proxy-ca.crt
            - front-proxy-ca.key

        - name: Fetch etcd CA
          fetch:
            src: /etc/kubernetes/pki/etcd/{{ item }}
            dest: "{{ working_directory }}/cluster-artifacts/etcd-{{ item }}"
            flat: yes
          with_items:
            - ca.crt
            - ca.key

        - name: Fetch etcd encryption-config.yaml
          fetch:
            src: /etc/kubernetes/pki/encryption-config.yaml
            dest: "{{ working_directory }}/cluster-artifacts/etcd-encryption-config.yaml"
            flat: yes

        - name: Get Node specs
          command: kubectl get nodes -o yaml --kubeconfig /etc/kubernetes/admin.conf
          register: nodes

        - name: Write Node specs to nodes.yaml
          become: no
          delegate_to: localhost
          copy:
            content: "{{ nodes.stdout }}"
            dest: "{{ working_directory }}/cluster-artifacts/nodes.yaml"
    EOF
    ```

2.  Get the artifacts and place it in a the `cluster-artifacts/` subdirectory.

    Run this command:

    ```bash
    konvoy run playbook fetch.yaml -y
    ```

    The output of the command will be similar to the following:

    ```sh
    Running custom playbook "fetch.yaml"

    STAGE [Running Custom Playbook]

    PLAY [Fetch existing cluster artifacts] **************************************************************************************************************************************************************************************

    TASK [Gathering Facts] *******************************************************************************************************************************************************************************************************
    ok: [192.168.104.209]

    TASK [Fetch cluster CA] ******************************************************************************************************************************************************************************************************
    changed: [192.168.104.209] => (item=ca.crt)
    changed: [192.168.104.209] => (item=ca.key)
    changed: [192.168.104.209] => (item=sa.pub)
    changed: [192.168.104.209] => (item=sa.key)
    changed: [192.168.104.209] => (item=front-proxy-ca.crt)
    changed: [192.168.104.209] => (item=front-proxy-ca.key)

    TASK [Fetch etcd CA] *********************************************************************************************************************************************************************************************************
    changed: [192.168.104.209] => (item=ca.crt)
    changed: [192.168.104.209] => (item=ca.key)

    TASK [Fetch etcd encryption-config.yaml] *************************************************************************************************************************************************************************************
    changed: [192.168.104.209]

    PLAY RECAP *******************************************************************************************************************************************************************************************************************
    192.168.104.209            : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    ```

3.  Check that artifacts were copied.

    Run this command:

    ```bash
    ls -1 cluster-artifacts/
    ```

    ```sh
    ca.crt
    ca.key
    etcd-ca.crt
    etcd-ca.key
    etcd-encryption-config.yaml
    front-proxy-ca.crt
    front-proxy-ca.key
    nodes.yaml
    sa.key
    sa.pub
    ```

When complete, move on to [upgrading your AWS cluster](../aws) or [upgrading your Preprovisioned cluster](../preprovisioned), depending on your infrastructure.
