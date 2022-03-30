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
# Example images/ami/centos-7.yaml

%%% replace with actual image file contents
download_images: true
packer:
  ami_filter_name: "CentOS 7.9.2009 x86_64"
  ami_filter_owners: "125523088429"
  distribution: "CentOS"
  distribution_version: "7"
  source_ami: ""
  ssh_username: "centos"
  root_device_name: "/dev/sda1"
build_name: "centos-7"
packer_builder_type: "amazon"
python_path: ""
```

[Follow this link][kib-images] to see other images in the Konvoy Image Builder repository.

%%% need to find the correct description for the FIPS air-gapped overrides process

<p class="message--note"><strong>NOTE: </strong>You can specify a base image to build on, using the <code>--source-ami</code> command line flag:<br />
<code>konvoy-image build --source-ami=ami-12345abcdef <path/to/image.yaml></code></p>

To override the above base image with another base image, create an `override` file and set the `source_ami` under the `packer` key. This overrides the image search and forces the use of the specified `source_ami`.

```yaml
# Example override-source-ami.yaml
---
packer:
  source_ami: "ami-0123456789"
```

See [Supported Operating Systems](../../../../supported-operating-systems) for details.

[kib-images]: https://github.com/mesosphere/konvoy-image-builder/tree/main/images
