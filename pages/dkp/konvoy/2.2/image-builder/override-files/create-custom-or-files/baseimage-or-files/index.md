---
layout: layout.pug
navigationTitle: Base image override files
title: Base image override files
excerpt: Base image override files
beta: false
enterprise: false
menuWeight: 85
---

When using Konvoy Image Builder (KIB) to create a base OS image, compliant with DKP, the instructions on how to build and configure the image are included in the file located in `images/<builder-type>/<os>-<version>.yaml`:

```bash
./konvoy-image build images/<builder-type>/{os}-{version}.yaml
```

<p class="message--note"><strong>NOTE: </strong>In previous versions of the konvoy-image, only azure and aws providers were available, therefore specifying a vsphere was not necessary. </p>

Although there are several parameters specified by default in the packer templates for each provider, it is possible to override the default values.  One option is to execute KIB with specific flags to override the values of the source AMI (`--source-ami`), AMI region (`--ami-regions`), AWS EC2 instance type (`--aws-instance-type`), and so on. For a comprehensive list of these flags, please run:
 ```bash
 ./konvoy-image build --help
 ```
Another option is by creating a file with the parameters to be overriden and specify the `--overrides` flag as shown below: 

<p class="message--note"><strong>NOTE: </strong>While CLI flags can be used in combination with override files, CLI flags take priority over any override files.</p>

```bash
./konvoy-image build images/<builder-type>/<os>-<version>.yaml --overrides overrides.yaml
```

### Example 1:
For example, when using the AWS Packer builder to override the above base image with another base image, create an override file and set the `source_ami` under the packer key. This overrides the image search and forces the use of the specified `source_ami`.

```yaml
---
packer:
  source_ami: "ami-0123456789"   
```

After creating the override file for our `source_ami`, we can pass our override file by using the `--overrides` flag when building our image:

 ```bash
 ./konvoy-image build images/ami/centos-7.yaml --overrides override-source-ami.yaml
 ```

### Example 2:

To abide to security practices, a user could set their own username and password while creating the base OS image and override the default credentials in KIB by creating a file with the following content:

```yaml
---
packer:
  ssh_username: "<USERNAME>"
  ssh_password: "<PASSWORD>"  
```

For a complete list of the variables that can be modified for each packer builder, users can refer to: 

[AWS packer template](https://github.com/mesosphere/konvoy-image-builder/blob/main/pkg/packer/manifests/aws/packer.json.tmpl#L2)

[Azure packer template](https://github.com/mesosphere/konvoy-image-builder/blob/main/pkg/packer/manifests/azure/packer.json.tmpl#L2)

[GCP packer template](https://github.com/mesosphere/konvoy-image-builder/blob/main/pkg/packer/manifests/gcp/packer.json.tmpl#L2)

[vSphere packer template](https://github.com/mesosphere/konvoy-image-builder/blob/main/pkg/packer/manifests/vsphere/packer.json.tmpl#L2)
