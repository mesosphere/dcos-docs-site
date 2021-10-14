---
layout: layout.pug
navigationTitle: HTTP proxy override files
title: HTTP proxy override files
excerpt: HTTP proxy override files
beta: true
enterprise: false
menuWeight: 105
---

The ansible playbooks create `systemd` drop-in files for `containerd` and `kubelet` to configure the `http_proxy`, `http_proxy`, and `no_proxy` environment variables for the service from the file `/etc/konvoy_http_proxy.conf`. To configure a proxy to be used during image creation, create a new override file and specify the following:

```yaml
# Example override-proxy.yaml
---
export http_proxy: http://example.org:8080
export https_proxy: http://example.org:8081
export no_proxy: example.org,example.com,example.net

```

These values are only used for the image creation. After the image is created, the ansible playbooks remove the `/etc/konvoy_http_proxy.conf` file. The `dkp` command can be used to configure the `KubeadmConfigTemplate` object to create this file on bootup of the image with values supplied during the `dkp` invocation. This enables using different proxy settings for image creation and runtime.
