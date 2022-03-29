---
layout: layout.pug
navigationTitle: Download Air-Gapped Bundles
title: Download Air-Gapped Bundles
menuWeight: 10
excerpt: Review OS compatibilities and download the air-gapped bundles.
beta: false
enterprise: false
---

## Review the air-gapped bundle contents

The air-gapped bundle contains the necessary OS dependencies and images required to set up a DKP Essential installation in an air-gapped environment. The download and installation of these bundles is agnostic to a specific environment, and is compatible with any of the environments listed in the table below:

| Operating System      | Kernel                      | Air-Gapped     |
|-----------------------|-----------------------------|----------------|
| [CentOS 7.9][centos7] | 3.10.0-1160.el7.x86_64      | Yes            |
| [RHEL 7.9][rhel_7_9]  | 3.10.0-1160.el7.x86_64      | Yes            |

The air-gapped bundle includes the following packages and tooling:

- Command line tooling
- Konvoy air-gapped bundle,
- Kommander air-gapped bundle,
- Konvoy Image Builder
- CentOS/RHEL 7.9 dependencies
- Docker registry image

## Download and expand the air-gapped bundle

1.  Define an environment variable for the Kubernetes version that corresponds with Konvoy release you are installing. You can find the correct Kubernetes version by checking the release notes for the release you are installing.

    ```bash
    export VERSION=1.21.6
    ```

1.  Download the air-gapped bundle files.

    ```bash
    curl -O downloads.d2iq.com/konvoy/airgapped/os-packages_$VERSION_x86_64_rpms.tar.gz
    curl -O downloads.d2iq.com/konvoy/airgapped/pip-packages.tar.gz
    ```
1.  Transfer the air-gapped bundle to the bastion host.

    ```bash
	scp $VERSION_x86_64_rpms.tar.gz <user>@<bastion_host>:~/
	```
1.  Login to the bastion host using the same credentials used in the previous step.

	```bash
	ssh <user>@<bastion_host>
	```

1.  Expand the air-gapped bundle artifact.

```bash

    tar -xvf $VERSION_x86_64_rpms.tar.gz
    ```
1.  Move into the created directory.

  ```bash

    cd dkp-$VERSION
    ```
Then, begin loading the bootstrap image.

[rhel_7_9]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.9_release_notes/index
[centos7]: https://wiki.centos.org/action/show/Manuals/ReleaseNotes/CentOS7.2003
