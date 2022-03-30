---
layout: layout.pug
navigationTitle: Air-gapped image override files
title: Air-gapped image override files
excerpt: Air-gapped image override files
beta: false
enterprise: false
menuWeight: 85
---

An air-gapped image is a specific OS-based image used in air-gapped cluster environments. The current air-gapped image descriptions are similar to this OVA example. [Follow this link][kib-images] to see other images in the Konvoy Image Builder repository.

```yaml
---
# Example images/ova/rhel-79.yaml
download_images: true
build_name: "vsphere-rhel-79"
packer_builder_type: "vsphere"
guestinfo_datasource_slug: "https://raw.githubusercontent.com/vmware/cloud-init-vmware-guestinfo"
guestinfo_datasource_ref: "v1.4.0"
guestinfo_datasource_script: "{{guestinfo_datasource_slug}}/{{guestinfo_datasource_ref}}/install.sh"
packer:
  cluster: "zone1"
  datacenter: "dc1"
  datastore: "ovh-nfs"
  folder: "cluster-api"
  insecure_connection: "false"
  network: "Airgapped"
  resource_pool: "Users"
  template: "base-rhel-7"
  vsphere_guest_os_type: "rhel7_64Guest"
  guest_os_type: "rhel7-64"
  #goss params
  distribution: "RHEL"
  distribution_version: "7.9"
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

[kib-images]: https://github.com/mesosphere/konvoy-image-builder/tree/main/images
