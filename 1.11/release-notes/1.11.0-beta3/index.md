---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.0 Beta 3
title: Release Notes for 1.11.0 Beta 3
menuWeight: 0
excerpt:
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;">

<h3>This beta release is for testing only and not to be used in production. It will only support new installations.</h3>
<h3>DC/OS 1.11.0 Beta 3 has a number of limitations that will be resolved at GA time:</h3>

<ul>
<li>Upgrades from 1.10 are not supported.</li>
<li>DC/OS 1.11 requires CLI version 0.6.x.
  <ul>
  <li><a href="/1.11/cli/uninstall/">Uninstall the existing CLI</a>.</li>
  <li>Install version 0.6.x using the <strong>Install CLI</strong> instructions in the dropdown in the upper left hand corner of the 1.11 DC/OS GUI.</li>
  </ul>
<strong>Note:</strong> CLI version 0.6.x is not compatible with DC/OS 1.10</li>
</ul>


### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.10.0](#fixed-issues)

# <a name="new-features"></a>New Features and Capabilities

## Apache Mesos 1.5 and Marathon 1.6 Integrated.
- DC/OS 1.11 is is based on Mesos 1.5. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.11 is integrated with the latest release of Marathon, version 1.6. Resulting breaking changes and new features are documented below. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Networking

[enterprise]
## Security
[/enterprise]
  


## Updated DC/OS Data Services


## Platform

- Fault domains - 
- Licensing - Contractual terms are now enforced by DC/OS licensing and audit components. You must specify your license when you create the cluster using the CLI or advanced installer. The GUI installer is currently unsupported. [View the documentation](/1.11/administering-clusters/licenses). You can view the state of your cluster with respect to the license conditions in the **Cluster -> Overview** tab. [enterprise type="inline" size="small" /] 
- Linked clusters. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links). [enterprise type="inline" size="small" /]
- Metrics - The DC/OS metrics component now produces metrics in Prometheus format. [View the documentation](/1.11/metrics).
- Pods - added support for persistent volumes. [View the documentation](/1.11/deploying-services/pods).
- UCR - added support for garbage collection and XXX. [View the documentation](/1.11/deploying-services/containerizers).

<a name="breaking-changes"></a>
# Breaking Changes

- Upgrades from 1.10 to 1.11 are _not supported_ in 1.11 Beta 3.

# <a name="known-issues"></a>Known Issues and Limitations


# <a name="fixed-issues"></a>Major Issues Fixed Since 1.10.0
