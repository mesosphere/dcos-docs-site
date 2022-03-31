---
layout: layout.pug
navigationTitle: Air-gapped image override files
title: Air-gapped image override files
excerpt: Air-gapped image override files
beta: false
enterprise: false
menuWeight: 85
---

An air-gapped image is a specific OS-based image used in air-gapped cluster environments. The current air-gapped image descriptions are similar to this example. [Follow this link][kib-overrides] to see other overrides in the Konvoy Image Builder repository.

```yaml
---
os_packages_local_bundle_file: "/path/to/os/package.tar.gz"
pip_packages_local_bundle_file: "/path/to/pip-packages.tar.gz"
images_local_bundle_dir: "/path/to/images/directory"
```

<p class="message--note"><strong>NOTE: </strong>You can specify an air-gapped image to build on, using the <code>--overrides</code> command line flag:<br />
<code>konvoy-image build <path/to/image.yaml> --overrides=/path/to/overrides/offline.yaml</code>.</p>

```yaml
# Example override-source-ami.yaml
---
packer:
  source_ami: "ami-0123456789"
```

See [Supported Operating Systems](../../../../supported-operating-systems) for details.

[kib-overrides]: https://github.com/mesosphere/konvoy-image-builder/tree/main/overrides
