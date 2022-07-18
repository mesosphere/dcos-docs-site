---
layout: layout.pug
navigationTitle: Base image override files
title: Base image override files
excerpt: Base image override files
beta: false
enterprise: false
menuWeight: 85
---

When using Konvoy Image Builder (KIB) to create a base OS image, compliant with DKP, the instructions on how to build and configure the image are included in the file located in images/builder-type/os-version.yaml:

```bash
./konvoy-image build images/{builder-type}/{os}-{version}.yaml
```

Although there are several parameters specified by default in the packer templates for each provider, it is possible to override the default values.  One option is to execute KIB with specific flags to override the values of source-ami (--source-ami), ami-region (--ami-regions), aws-instance type (--aws-instance-type), and so on. For a comprehensive list of these flags, please run:

```bash
./konvoy-image build --help
```
Another option is by creating a file with the parameters to be overriden and specify the `--overrides` flag as shown below:

```bash
./konvoy-image build images/{builder-type}/{os}-{version}.yaml --overrides overrides.yaml
```

For example, when using the AWS packer builder to override the above base image with another base image, create an override file and set the source_ami under the packer key. This overrides the image search and forces the use of the specified source_ami.

### Example 1:
override-source-ami.yaml
```yaml
---
packer:
  source_ami: "ami-0123456789"   
```
and then execute:
```bash
./konvoy-image build images/ami/centos-7.yaml --overrides override-source-ami.yaml
```

### Example 2:
To abide to best security practices, the user could set their own user and password while creating the base OS image and override the default credentials in KIB by creating a file (overrides-user-password.yaml) with the following content: 

```yaml
---
packer:
  ssh_username: "<USERNAME>"
  ssh_password: "<PASSWORD>"  
```

A complete list of the variables that can be modified for each packer builder, the user can refer to: 

[ AWS packer template ](https://github.com/mesosphere/konvoy-image-builder/blob/v1.12.0/pkg/packer/manifests/aws/packer.json.tmpl#L2)

[ Azure packer template ](https://github.com/mesosphere/konvoy-image-builder/blob/v1.12.0/pkg/packer/manifests/azure/packer.json.tmpl#L2)

[ vSphere packer template ](https://github.com/mesosphere/konvoy-image-builder/blob/v1.12.0/pkg/packer/manifests/vsphere/packer.json.tmpl#L2)


A base image is a specific AMI image used as the base for your new AMI image. By default, Konvoy Image Builder searches for the latest CentOS 7 `ami` for the base image. The current base image description, at `images/ami/centos-7.yaml`, is similar to the following:

```yaml
---
# Example images/ami/centos-7.yaml
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
