---
layout: layout.pug
navigationTitle:
excerpt: Release notes for 2.7.0-2.3.0
title: Release Notes
menuWeight: 5
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---

## Version 2.7.0-2.3.0

### Updates
- Upgrade the base dcos-commons SDK version to `0.56.2`.
- Upgrade the base tech version of Apache Kafka to `2.3.0`. See Kafka's Release Notes for [2.3.0](https://www.apache.org/dist/kafka/2.3.0/RELEASE_NOTES.html) for details.
- Option to configure new listener config `max.connections` which limits the number of active connections on each listener.

### New Features
- Added support for DC/OS Storage Service (DSS). See official [DSS docs](https://docs.d2iq.com/mesosphere/dcos/services/storage/1.0.0) for more details.
- Added better broker health checks. Users can now select between a simple port based check or an advanced producer-consumer check based on a custom heartbeat topic.

## Version 2.6.0-2.2.1

### Updates
- Upgrade {{ model.techShortName }} base tech to version `2.2.1`. See [{{ model.techShortName }}'s Release Notes](https://www.apache.org/dist/kafka/2.2.1/RELEASE_NOTES.html) for details.
- Upgrade the base dcos-commons SDK version to `0.56.1`.
- Oracle JDK is replaced by OpenJDK 8.

### New Features
- Autosuggestion is available for Service Account and Secrets when launching the service from DC/OS UI
- Support for <a href="/mesosphere/dcos/services/kafka/2.6.0-2.2.1/advanced/#secure-jmx-enterprise">Secure JMX</a>
- Added marathon service scheduler checks
- Service will fetch all required resources over HTTPS

## Version 2.5.0-2.1.0

### Important Notes

* The `inter_broker_protocol_version` now defaults to the newer `2.1` version. This has a few implications, as described below:

    - Kafka 1.1.0 supports `inter_broker_protocol_version`: `1.1` maximum, and by default it is set to `1.0`.
    - Kafka 2.1.0 supports `inter_broker_protocol_version`s up to `2.1`. 
    - If you haven't specified a `inter_broker_protocol_version` in your options file, the new default will be used and changed to `2.1`. This will cause downtime during the upgrade when some Kafka nodes will be on Kafka 1.1.0 using `inter_broker_protocol_version` `1.0` and others will be on Kafka 2.1.0 using protocol `2.1`.

    To avoid any potential downtime, change the protocol version used when upgrading Kafka.

    - Set up CLI to connect to a soak cluster
    - Update your `options_file.json` with the following contents:
        ```
        {
            ...
            "kafka": {
                ...
                "inter_broker_protocol_version": "1.0"
                ...
            }
            ...
        }
        ```

    - And update your service like so:
       ```
       ~$ dcos package install --cli --yes kafka
       ~$ dcos kafka --name=data-services/kafka update start \
           --package-version=2.5.0-2.1.0 \
           --options=options_file.json
       ```

### Updates
- Upgrade {{ model.techShortName }} base tech to version 2.1.0. See [{{ model.techShortName }}'s Release Notes](https://kafka.apache.org/21/documentation.html#upgrade_210_notable) more for details.
- Upgrade Zookeeper Client version to 3.4.13.

## Version 2.4.0-1.1.1

### Updates
- Upgrade {{ model.techShortName }} base tech to version 1.1.1. See [{{ model.techShortName }}'s Release Notes](https://archive.apache.org/dist/kafka/1.1.1/RELEASE_NOTES.html) for details.
- Upgrade the base dcos-commons SDK version to 0.55.2.
- Upgrade Zookeeper Client version to 3.4.13.

### New Features
- Number of open file descriptors is now configurable via the `RLIMIT_NOFILE_SOFT` and `RLIMIT_NOFILE_HARD` configuration parameters.
- Timeouts for readiness checks are now configurable via the `READINESS_CHECK_INTERVAL`, `READINESS_CHECK_DELAY` and `READINESS_CHECK_TIMEOUT` configuration parameters.

## Version 2.3.0-1.1.0

### Updates
- Upgrade {{ model.techShortName }} base tech to version 1.1.0. See [{{ model.techShortName }}'s Release Notes](https://kafka.apache.org/11/documentation.html#upgrade_110_notable) for details.

## Version 2.3.0-1.0.0

### New Features
- Support for configuring {{ model.techShortName }} transport encryption ciphers with secure defaults.

## Version 2.2.0-1.0.0

### New Features
- Support for using a custom top level domain to facilitate [exposing the service securely outside of the cluster](/mesosphere/dcos/services/kafka/2.3.0-1.0.0/security/#securely-exposing-dcos-apache-kafka-outside-the-cluster).
- Support for launching the service in a remote region.

## Version 2.1.0-1.0.0

### New Features
- Support for the automated provisioning of TLS artifacts to secure {{ model.techShortName }} communication.
- Support for Kerberos and SSL authorization and authentication.
- Support for `Zone` placement constraints in DC/OS 1.11.
- Ability to pause a service pod for debugging and recovery purposes.

### Updates
- Major improvements to the stability and performance of service orchestration.
- Protocol and log version defaults are also set to `1.0`.
- Improve {{ model.techShortName }}'s ZK library to enable re-resolution as required on virtual networks
- Upgrade the JRE to 1.8u162
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

## Version 2.0.4-1.0.0

### Updates
- Upgraded to {{ model.techShortName }} v1.0.0.
<p class="message--note"><strong>NOTE: </strong>Protocol and log version defaults are set to 0.11.0. After upgrading to this version, they may be set to 1.0.0.</p>

# Version 2.0.3-0.11.0

### Bug Fixes
* Uninstall now handles failed tasks correctly.
* Fixed a timing issue in the broker readiness check that caused brokers to be stuck in STARTING when the service is allocated more than 2 CPUs per broker.

# Version 2.0.2-0.11.0

### Bug Fixes

- Dynamic ports are no longer sticky across pod replaces
- Further fixes to scheduler behavior during task status transitions.

#### Improvements

- Updated JRE version to 8u144.
- Improved handling of error codes in service CLI.

# Version 2.0.1-0.11.0

### Bug Fixes
* Tasks will correctly bind on DC/OS 1.10.

### Documentation
* Updated post-install links for package.
* Updated `limitations.md`.
* Ensured previous `version-policy.md` content is present.

# Version 2.0.0-0.11.0

## Improvements
- Based on the latest stable release of the dcos-commons SDK, which provides numerous benefits:
  - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
  - Orchestrated software and configuration update, enforcement of version upgrade paths, and ability to pause/resume updates.
  - Placement constraints for pods.
  - Uniform user experience across a variety of services.
- Graceful shutdown for brokers.
- Update to 0.11.0.0 version of Apache {{ model.techShortName }} (including log and protocol versions).

## Breaking Changes
- This is a major release.  You cannot upgrade to version 2.0.0-0.11.0 from a 1.0.x version of the package. To upgrade, you must perform a fresh install and replicate data across clusters.
