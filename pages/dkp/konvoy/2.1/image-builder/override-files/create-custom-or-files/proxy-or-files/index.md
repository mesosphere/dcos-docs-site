---
layout: layout.pug
navigationTitle: HTTP proxy override files
title: HTTP proxy override files
excerpt: HTTP proxy override files
beta: false
enterprise: false
menuWeight: 105
---

You can use an HTTP proxy configuration when creating your image. The Ansible playbooks create `systemd` drop-in files for `containerd` and `kubelet` to configure the `http_proxy`, `http_proxy`, and `no_proxy` environment variables for the service from the file `/etc/konvoy_http_proxy.conf`.

To configure a proxy for use during image creation, create a new override file like the following example, and specify the correct values for your environment:

```sh
cat <<EOF > overrides.yaml
https_proxy: "http://10.0.64.5:3128"
http_proxy: "http://10.0.64.5:3128"
no_proxy: "127.0.0.1,192.168.0.0/16,10.0.0.0/16,10.96.0.0/12,169.254.169.254,169.254.0.0/24,localhost,kubernetes,kubernetes.default,kubernetes.default.svc,kubernetes.default.svc.cluster,kubernetes.default.svc.cluster.local,.svc,.svc.cluster,.svc.cluster.local,.svc.cluster.local.,kubecost-prometheus-server.kommander,logging-operator-logging-fluentd.kommander.svc,elb.amazonaws.com"
EOF
```

These values are only used for the image creation. After DKP creates the image, the Ansible playbooks remove the `/etc/konvoy_http_proxy.conf` file.

You can use the `dkp` command to configure the `KubeadmConfigTemplate` object to create this file on boot-up of the image with values supplied during the `dkp` invocation. This enables using different proxy settings for image creation and runtime.
