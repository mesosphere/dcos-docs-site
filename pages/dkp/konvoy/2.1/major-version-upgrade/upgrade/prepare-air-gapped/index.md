---
layout: layout.pug
navigationTitle: Prepare Air-Gapped Cluster
title: Prepare Air-Gapped Cluster
menuWeight: 10
excerpt: Preparing an air-gapped cluster for upgrade
beta: true
enterprise: false
---

Follow these steps only if you are upgrading an air-gapped Cluster.

## Patch `containerd` config

1.  Download the current `/etc/containerd/config.toml` from one of the nodes.

1.  Edit the `metrics` section, replacing the node's IP address with `{{ inventory_hostname }}`. The section will be the following:

    ```toml
    [metrics]
    address = "{{ inventory_hostname }}:1338"
    grpc_histogram = false
    ```

1.  Setup the registry variables:

    ```bash
    export DOCKER_REGISTRY_HOST=<registry-address>
    export DOCKER_REGISTRY_PORT=<registry-port>
    export DOCKER_REGISTRY_ADDRESS="<https/http>://${DOCKER_REGISTRY_HOST}:${DOCKER_REGISTRY_PORT}"
    export DOCKER_REGISTRY_USERNAME=<registry-username>
    export DOCKER_REGISTRY_PASSWORD=<registry-password>
    ```

    - DOCKER_REGISTRY_HOST: the hostname / IP address of an existing Docker registry that the cluster nodes use when pulling images.
    - DOCKER_REGISTRY_PORT: the TCP port the registry listens on.
    - DOCKER_REGISTRY_ADDRESS: the full address of the registry with the protocol specified (https|http).
    - DOCKER_REGISTRY_USERNAME: the username for registry auth.
    - DOCKER_REGISTRY_PASSWORD: the password for registry auth.

    <p class="message--note"><strong>NOTE: </strong>If your registry does not require auth, you may omit <code>DOCKER_REGISTRY_USERNAME</code> and <code>DOCKER_REGISTRY_PASSWORD</code> and the <code>plugins."io.containerd.grpc.v1.cri".registry.configs</code> section</p>

1.  Edit the `plugins."io.containerd.grpc.v1.cri".registry` section and replace the contents with:

    ```toml
    [plugins."io.containerd.grpc.v1.cri".registry]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["${DOCKER_REGISTRY_ADDRESS}/v2/","https://registry-1.docker.io"]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."*"]
          endpoint = ["${DOCKER_REGISTRY_ADDRESS}/v2/"]
      [plugins."io.containerd.grpc.v1.cri".registry.configs]
        [plugins."io.containerd.grpc.v1.cri".registry.configs."${DOCKER_REGISTRY_ADDRESS}".auth]
            username = "${DOCKER_REGISTRY_USERNAME}"
            password = "${DOCKER_REGISTRY_PASSWORD}"
            auth = ""
            identitytoken = ""
    ```

    The full contents of the file will be similar to the following:

    ```toml
    version = 2
    root = "/var/lib/containerd"
    state = "/run/containerd"
    plugin_dir = ""
    disabled_plugins = []
    required_plugins = []
    oom_score = 0


    [grpc]
      address = "/run/containerd/containerd.sock"
      tcp_address = ""
      tcp_tls_cert = ""
      tcp_tls_key = ""
      uid = 0
      gid = 0
      max_recv_message_size = 16777216
      max_send_message_size = 16777216

    [ttrpc]
      address = ""
      uid = 0
      gid = 0

    [debug]
      address = ""
      uid = 0
      gid = 0
      level = ""

    [metrics]
      address = "{{ inventory_hostname }}:1338"
      grpc_histogram = false

    [cgroup]
      path = ""

    [timeouts]
      "io.containerd.timeout.shim.cleanup" = "5s"
      "io.containerd.timeout.shim.load" = "5s"
      "io.containerd.timeout.shim.shutdown" = "3s"
      "io.containerd.timeout.task.state" = "2s"

    [plugins]
      [plugins."io.containerd.gc.v1.scheduler"]
        pause_threshold = 0.02
        deletion_threshold = 0
        mutation_threshold = 100
        schedule_delay = "0s"
        startup_delay = "100ms"
      [plugins."io.containerd.grpc.v1.cri"]
        disable_tcp_service = true
        stream_server_address = "127.0.0.1"
        stream_server_port = "0"
        stream_idle_timeout = "4h0m0s"
        enable_selinux = false
        sandbox_image = "${DOCKER_REGISTRY_HOST}:${DOCKER_REGISTRY_PORT}/k8s.gcr.io/pause:3.2"
        stats_collect_period = 10
        systemd_cgroup = false
        enable_tls_streaming = false
        max_container_log_line_size = 16384
        disable_cgroup = false
        disable_apparmor = false
        restrict_oom_score_adj = false
        max_concurrent_downloads = 3
        disable_proc_mount = false
        [plugins."io.containerd.grpc.v1.cri".containerd]
          snapshotter = "overlayfs"
          default_runtime_name = "runc"
          no_pivot = false
          [plugins."io.containerd.grpc.v1.cri".containerd.default_runtime]
            runtime_type = ""
            runtime_engine = ""
            runtime_root = ""
            privileged_without_host_devices = false
          [plugins."io.containerd.grpc.v1.cri".containerd.untrusted_workload_runtime]
            runtime_type = ""
            runtime_engine = ""
            runtime_root = ""
            privileged_without_host_devices = false
          [plugins."io.containerd.grpc.v1.cri".containerd.runtimes]
            [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
              runtime_type = "io.containerd.runc.v1"
              runtime_engine = ""
              runtime_root = ""
              privileged_without_host_devices = false
            [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.nvidia-container-runtime]
              runtime_type = "io.containerd.runc.v1"
              [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.nvidia-container-runtime.options]
                BinaryName = "/usr/bin/nvidia-container-runtime"
        [plugins."io.containerd.grpc.v1.cri".cni]
          bin_dir = "/opt/cni/bin"
          conf_dir = "/etc/cni/net.d"
          max_conf_num = 1
          conf_template = ""
        [plugins."io.containerd.grpc.v1.cri".registry]
          [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
            [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
              endpoint = ["${DOCKER_REGISTRY_ADDRESS}/v2/","https://registry-1.docker.io"]
            [plugins."io.containerd.grpc.v1.cri".registry.mirrors."*"]
              endpoint = ["${DOCKER_REGISTRY_ADDRESS}/v2/"]
          [plugins."io.containerd.grpc.v1.cri".registry.configs]
            [plugins."io.containerd.grpc.v1.cri".registry.configs."${DOCKER_REGISTRY_ADDRESS}".auth]
                username = "${DOCKER_REGISTRY_USERNAME}"
                password = "${DOCKER_REGISTRY_PASSWORD}"
                auth = ""
                identitytoken = ""
        [plugins."io.containerd.grpc.v1.cri".x509_key_pair_streaming]
          tls_cert_file = ""
          tls_key_file = ""
      [plugins."io.containerd.internal.v1.opt"]
        path = "/opt/containerd"
      [plugins."io.containerd.internal.v1.restart"]
        interval = "10s"
      [plugins."io.containerd.metadata.v1.bolt"]
        content_sharing_policy = "shared"
      [plugins."io.containerd.monitor.v1.cgroups"]
        no_prometheus = false
      [plugins."io.containerd.runtime.v1.linux"]
        shim = "containerd-shim"
        runtime = "runc"
        runtime_root = ""
        no_shim = false
        shim_debug = false
      [plugins."io.containerd.runtime.v2.task"]
        platforms = ["linux/amd64"]
      [plugins."io.containerd.service.v1.diff-service"]
        default = ["walking"]
      [plugins."io.containerd.snapshotter.v1.devmapper"]
        root_path = ""
        pool_name = ""
        base_image_size = ""
        ```

1.  Create a playbook to apply the config to the cluster.

    ```yaml
    cat <<EOF > registry.yaml
    ---
    - hosts: node control-plane
      any_errors_fatal: true
      name: "add wildcard registry entry"
      gather_facts: false
      become: true
      strategy: linear

      tasks:
        - name: wait 360 for target connection to become reachable
          wait_for_connection:
            timeout: 360

        - name: copy containerd config
          template:
            src: config.toml
            dest: /etc/containerd/config.toml

        - name: restart containerd
          service:
            name: containerd
            state: restarted
            enabled: true
    EOF
    ```

1.  Replay the current `/etc/containerd/config.toml` on the nodes.

    Run this command:

    ```bash
    konvoy run playbook registry.yaml -y
    ```
