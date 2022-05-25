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
  k8s_image_registry: docker.io/mesosphere
  
  fips:
    enabled: true
  
  build_name_extra: -fips
  kubernetes_build_metadata: fips.0
  default_image_repo: hub.docker.io/mesosphere
  kubernetes_rpm_repository_url: "https://packages.d2iq.com/konvoy/stable/linux/repos/el/kubernetes-v{{ kubernetes_version }}-fips/x86_64"
  docker_rpm_repository_url: "\
    https://containerd-fips.s3.us-east-2.amazonaws.com\
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

- Offline override:

  ```yaml
  os_packages_local_bundle_file: "{{ playbook_dir }}/../artifacts/{{ kubernetes_version }}_{{ ansible_distribution|lower }}_{{ ansible_distribution_major_version }}_x86_64.tar.gz"
  pip_packages_local_bundle_file: "{{ playbook_dir }}/../artifacts/pip-packages.tar.gz"
  images_local_bundle_dir: "{{ playbook_dir}}/../artifacts/images"
  ```

- Offline for FIPS override:

  ```yaml
  # fips os-packages
  os_packages_local_bundle_file: "{{ playbook_dir }}/../artifacts/{{ kubernetes_version }}_{{ ansible_distribution|lower }}_{{ ansible_distribution_major_version }}_x86_64_fips.tar.gz"
  pip_packages_local_bundle_file: "{{ playbook_dir }}/../artifacts/pip-packages.tar.gz"
  images_local_bundle_dir: "{{ playbook_dir}}/../artifacts/images"
  ```
