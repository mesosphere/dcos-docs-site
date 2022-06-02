---
layout: layout.pug
navigationTitle: Default Override Files
title: Default Override Files
excerpt: Learn about default override files provided with Konvoy
beta: false
enterprise: false
menuWeight: 0
---

Konvoy comes with default override files:

- FIPS override:

  ```yaml
  ---
  etcd_image_tag: v3.4.13_fips.0
  fips:
    enabled: true
    etcdImageTag: "{{ etcd_image_tag }}"
  build_name_extra: -fips
  kubernetes_build_metadata: fips.0
  default_image_repo: hub.docker.io/mesosphere
  k8s_image_registry: mesosphere
  kubernetes_rpm_repository_url: "https://kubernetes-fips.s3.us-east-2.amazonaws.com\
                              /{{ ansible_distribution_major_version|int }}\
                              /x86_64"
  kubernetes_rpm_gpg_key_url: "https://kubernetes-fips.s3.us-east-2.amazonaws.com\
                               /{{ ansible_distribution_major_version|int }}\
                               /rpm-gpg-pub-key"
  docker_rpm_repository_url: "https://containerd-fips.s3.us-east-2.amazonaws.com\
                              /{{ ansible_distribution_major_version|int }}\
                              /x86_64"
  ```

- Nvidia override:

  ```yaml
  ---
  gpu:
    types:
      - nvidia
  
  build_name_extra: "-nvidia"
  ```
