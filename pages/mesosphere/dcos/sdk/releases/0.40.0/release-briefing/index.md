---
layout: layout.pug
navigationTitle:  0.40.x Releaase Briefing
title: DC/OS SDK - 0.40.x Release Briefing
menuWeight: 0
excerpt:
render: mustache
model: /mesosphere/dcos/data.yml
---

We are moving closer toward the GA release of the DC/OS SDK.  We’d like to take this opportunity to thank you, our partners and early adopters of the SDK, for you continued dedication to our platform.  Starting with this latest release, 0.40, we will be sending out a release briefing for each major and minor release of the SDK.  This briefing will explain what you need to know at a high level to adopt new releases; the linked release notes and guides will contain specific details.  We’ve included a special section at the end of this briefing that outlines our commitment to improving the SDK release process.

# What’s in this Release?
## Release Notes
Release notes for SDK Releases: [github](https://github.com/mesosphere/dcos-commons/releases)

## New Features

### Tools - _New in SDK 0.40:_
Our platform-level tooling for the SDK is rapidly evolving.  Please ensure you update the tools directory in your development environment to match the contents from the sdk-0.40 tag in dcos-commons.

### TLS for Transport Security - _New in SDK 0.40:_
TLS provisioning for SDK based frameworks enables developers to provide an automated way of provisioning X.509 certificates and private keys for tasks in DC/OS. TLS artifacts can be consumed by tasks to create encrypted TLS connections.  Please refer to the [Developer Guide](https://mesosphere.github.io/dcos-commons/developer-guide/) documentation for TLS.

### Pause a Pod - _New in SDK 0.40:_
The new CLI command will enable operators to "pause" a specific pod.   ("Pause" means the pod is restarted without the main application tasks running.)  This allows the operator to manually run recovery tools against the service’s environment and persistent state, without the service itself running. After the pod has been paused, it may be re-started again, at which point it will restart the service's task(s).  No work is needed to enable this feature for an SDK-based package.  Refer to the [Developer Guide](https://mesosphere.github.io/dcos-commons/developer-guide/) documentation for usage of Pause a Pod.

### Regions and Zones - _New in SDK 0.40_:
The SDK now includes support for rack awareness for frameworks via zone and region placement.  In any services configured enabling Zone/Region awareness, the SDK injects the Zone/Region information into each task's environment during the task launch process. The SDK uses the existing placement constraint mechanism to distribute pods appropriately across zones. There is also a new UI widget for building placement constraints. Refer to the [Developer Guide](https://mesosphere.github.io/dcos-commons/developer-guide/) documentation for Rack Awareness.

**Note:**  By default, the SDK allows services to upgrade from no rack awareness to a rack awareness cluster topology.  The developer has the option to opt out and not allow this upgrade path.  To opt out and prevent this upgrade path, the SDK provides Java validation APIs that must be consumed.   If the developer alters this behavior to allow the upgrade path in a future release, operators must decide the proper transition path.  As with any upgrade, backup of data is recommended prior to performing the migration.

### Pod Decommission - _New in SDK 0.40:_
Pods can release custom deployment plan resources from the original pod spec that are no longer in use.   These resources can be released back to the cluster. However, in the case of stateful services that may require application-specific actions, special care should be taken when implementing decommission.  Please refer to the [Developer Guide](https://mesosphere.github.io/dcos-commons/developer-guide/) documentation for further information: allow-decommission.

### ONCE/FINISH Goal States - _New in SDK 0.40:_
For tasks that should launch and exit upon success, the new goal state of FINISH has been included in the API.   FINISH includes the ability to rerun task if the configuration is updated.  ONCE has replaced the deprecated goal state of FINISHED.   If the task configuration is updated and has a goal state of ONCE, it will not be rerun.  For further information refer to the [YAML Reference](https://mesosphere.github.io/dcos-commons/yaml-reference/) documentation for task goals

**Note:** The goal state of FINISHED is deprecated and developers should use ONCE for this functionality moving forward.  See deprecation section below for additional information

### Scheduler Metrics - _New in SDK 0.40:_
Schedulers now generate metrics around critical aspects of its operation and performance.  They are available in 3 formats:  JSON, Prometheus and StatsD (dcos-metrics).  Metrics can be used to understand and alert on specific behavior of a service's scheduler.  For further information please refer to the [Developer Guide](https://mesosphere.github.io/dcos-commons/developer-guide/) documentation for metrics.

### Essential tasks - _New in SDK 0.40:_
When tasks in a pod are marked essential (the default) and experience a failure, all tasks in the pod are relaunched as a unit.  Non-essential task failures result in relaunching just that task and other tasks in the pod are not affected.  Refer to the [YAML Reference](https://mesosphere.github.io/dcos-commons/yaml-reference/) documentation for further information.

### Switch to Mesos V1 (HTTP) API:
All packages created with the SDK should switch from using the Mesos V0 API as the default, to V1(HTTP) API by default.  This is a simple change to config.json (assuming all wiring for the libmesos bundle is maintained). The SDK tooling has updated to inject the latest libmesos version.

### Shared PID Namespace - _New in SDK 0.40:_
A feature called `share-pid-namespace` has been added to the YAML API so tasks within the same pod can share the same process id namespace.  Please refer to the [YAML Reference](https://mesosphere.github.io/dcos-commons/yaml-reference/) documentation for further information.

## Deprecations

### FINISHED Goal State - _Deprecated in SDK 0.40_
The FINISHED goal state for tasks is deprecated in SDK version 0.40.  Developers should use the ONCE goal state moving forward. We will stop supporting FINISHED task goal state in the next major release of the SDK. For further information consult the [Developer Guide](https://mesosphere.github.io/dcos-commons/developer-guide/) documentation.

### HTTP Endpoints - _Deprecated in SDK 0.40_
The following endpoints are deprecated in SDK Version 04.0 and will no longer be supported in the next major release of the SDK:
* /plan  -  replaced with /plans/{plan_name}
* /plan/continue - replaced with /plans/{plan_name}/continue
* /plan/interrupt - replaced with /plans/{plan_name}/interrupt
* /plan/forceComplete - replaced with /plans/{plan_name}/forceComplete
* /plan/restart - replaced with /plans/{plan_name}/restart

## SDK Release Process
### Versioning Strategy
The SDK versioning is based on Semantic Versioning.  Starting in the 1.0.0 release we will implement strict guidelines for how we maintain compatibility and deprecation.    Our deprecation policy, based on semantic versioning is described as:
* We will only deprecate public APIs with a minor release.
* An API will not be deprecated in a patch release.
* A public API is one that is documented, and consumable by SDK Framework Developers.
* Only APIs marked “public” shall be covered under this policy.
* We will only remove deprecated APIs in a major release.
* We will only allow an exception to deprecation timeline policy for security vulnerabilities in public APIs and allow deprecation immediately with a minor release.
* We will update documentation to include any deprecated API.
* We will also update documentation to include recommended update path for deprecated API.
* An update path refers to the recommended alternative from using the deprecated API.
* We will include all information around deprecated APIs into release notes.

### Release Strategy
As we move closer to the GA release of the SDK, we will provide additional context on our release cadence moving forward.

### Compatibility Matrix
SDK-based services owned by Mesosphere are published on a [compatibility matrix](https://docs.mesosphere.com//version-policy/#certified-package-designations) to improve user understanding for certified package compatibility as it pertains to DC/OS Versions.

## SDK Related Inquiries
Please email the [product team](mailto:ask-product@mesosphere.io) for any SDK-related questions.
