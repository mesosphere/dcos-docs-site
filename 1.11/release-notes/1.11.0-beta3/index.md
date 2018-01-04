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
<li>Upgrades from 1.11 are not supported.</li>
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
- [Issues Fixed since 1.9.0](#fixed-issues)

# <a name="new-features"></a>New Features and Capabilities

## Apache Mesos 1.4 and Marathon 1.6 Integrated.
- DC/OS 1.11 is is based on Mesos 1.5.0. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.11 is integrated with the latest release of Marathon, version 1.6. Resulting breaking changes and new features are documented below. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Networking

[enterprise type="block" size="large"]
## Security
[/ enterprise]
  


## Updated DC/OS Data Services


## Platform
- Pods - added support for persistent volumes. [View the documentation](/1.11/deploying-services/pods).
- UCR - added support for garbage collection and XXX [View the documentation](/1.11/deploying-services/containerizers).
- Linked Clusters. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links).
- Metrics

## GUI



<a name="breaking-changes"></a>
# Breaking Changes

- Upgrades not supported in 1.11 Beta 1.
  Upgrades from 1.10 to 1.11 are _not supported_ in 1.11 Beta 1.

- Marathon Networking API Changes in 1.5
  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md). <!-- linking to the marathon doc until I port the relevant information to the dc/os site -->


# <a name="known-issues"></a>Known Issues and Limitations


# <a name="fixed-issues"></a>Major Issues Fixed Since 1.10.0
