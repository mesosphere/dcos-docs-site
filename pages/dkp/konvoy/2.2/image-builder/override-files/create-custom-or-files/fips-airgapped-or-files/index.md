---
layout: layout.pug
navigationTitle: FIPS air-gapped image override files
title: FIPS air-gapped  image override files
excerpt: FIPS air-gapped  image override files
beta: false
enterprise: false
menuWeight: 85
---

A FIPS air-gapped image is a specific machine image used as the base for air-gapped cluster environments that require FIPS 140-2 support. The current base image descriptions are similar to the following:

```yaml
---
os_packages_local_bundle_file: "/path/to/os/fips/package.tar.gz"
pip_packages_local_bundle_file: "/path/to/fips/pip-packages.tar.gz"
images_local_bundle_dir: "/path/to/images/fips/directory"
```

[Follow this link][kib-overrides] to see other images in the Konvoy Image Builder repository.

<p class="message--note"><strong>NOTE: </strong>You can specify a base image to build on, using the <code>--source-ami</code> command line flag:<br />
<code>konvoy-image build --source-ami=ami-12345abcdef <path/to/image.yaml></code></p>

To override the above base image with another base image, create an `override` file and set the `source_ami` under the `packer` key. This overrides the image search and forces the use of the specified `source_ami`.

See [Supported Operating Systems](../../../../supported-operating-systems) for details.

[kib-overrides]: https://github.com/mesosphere/konvoy-image-builder/tree/main/overrides
