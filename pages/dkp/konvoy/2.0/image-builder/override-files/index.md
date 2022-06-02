---
layout: layout.pug
navigationTitle: Override Files
title: Override Files
excerpt: Learn how to use override files with Konvoy
beta: false
enterprise: false
menuWeight: 75
---
## Override files

The konvoy-image-builder is used to install the basic components required to run Konvoy. You can specify customization of the images through the use of override files, which are used to specify alternate package libraries, docker image repos, and other customizations.

Konvoy comes with default override files:

- FIPS override:

  ```yaml
  ---
  fips:
    enabled: true
    etcdImageTag: v3.4.13_fips
  build_name_extra: -fips
  kubernetes_build_metadata: fips.0
  default_image_repo: hub.docker.io/mesosphere
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
