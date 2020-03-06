---
layout: layout.pug
navigationTitle: Release Notes  
excerpt: Discover the new features, updates, and known limitations in this release of the Cassandra Service
title: Release Notes 
menuWeight: 10
model: /mesosphere/dcos/services/cassandra/data.yml
render: mustache
---
# Release Notes for {{ model.techShortName }} Service version 2.9.0-3.11.6

## Updates

- Upgraded {{ model.techShortName }} to version `3.11.6`
- Upgraded SDK library to version `0.57.3`. For more information see [SDK Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3)

## Upgrading your cluster from 2.5.0-3.11.3 to 2.9.0-3.11.6

- It is possible to upgrade directly to `2.9.0-3.11.6` from version `2.5.0-3.11.3`. However, you'll need to run the following command to successfully upgrade your {{ model.techName }} package: 

  ```
  dcos {{ model.serviceName }} update start --package-version=2.9.0-3.11.6 --replace
  ```


# Release Notes for {{ model.techShortName }} Service version 2.8.0-3.11.5

## Updates

- Upgraded SDK library to version `0.57.2`. For more information see [SDK Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.2)
- Upgraded JDK version from `8` to `11` for schedular.

## Upgrading your cluster from 2.5.0-3.11.3 to 2.8.0-3.11.5

- It is possible to upgrade directly to `2.8.0-3.11.5` from version `2.5.0-3.11.3`. However, you'll need to run the following command to successfully upgrade your {{ model.techName }} package: 

  ```
  dcos {{ model.serviceName }} update start --package-version=2.8.0-3.11.5 --replace
  ```

# Release Notes for {{ model.techShortName }} Service version 2.7.0-3.11.4

## Updates

- Upgraded SDK library to version `0.57.0`. For more information see [SDK Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)
- Added support for [Secure JMX](/mesosphere/dcos/services/{{ model.serviceName }}/2.7.0-3.11.4/advanced/#secure-jmx-enterprise)

## Upgrading your cluster from 2.5.0-3.11.3 to 2.7.0-3.11.4

- It is possible to upgrade directly to `2.7.0-3.11.4` from version `2.5.0-3.11.3`. However, you'll need to run the following command to successfully upgrade your {{ model.techName }} package: 

  ```
  dcos {{ model.serviceName }} update start --package-version=2.7.0-3.11.4 --replace
  ```

# Release Notes for {{ model.techShortName }} Service version 2.6.0-3.11.4

## Updates

- Upgraded {{ model.techShortName }} to version `3.11.4`
- Upgraded SDK library to version `0.56.1`
- Oracle JDK has been replaced with OpenJDK 8

## New Features

- Added support for both [custom](/mesosphere/dcos/services/{{ model.serviceName }}/2.6.0-3.11.4/configuration/#custom-authentication-and-authorization) and {{model.techName}}'s [native](/mesosphere/dcos/services/{{ model.serviceName }}/2.6.0-3.11.4/configuration/#native-authentication-and-authorization) authentication and authorization mechanisms 
- Added support for DSS volume profiles 
- User defined functions are now configurable
- Added [custom domain](/mesosphere/dcos/services/{{ model.serviceName }}/2.6.0-3.11.4/security/#forwarding-dns-and-custom-domain) support

## Improvements

- Many of {{ model.techShortName }}'s parameters are now configurable from the DC/OS UI.

## Upgrading your cluster from 2.5.0-3.11.3 to 2.6.0-3.11.4

- Run the following command to upgrade your {{ model.techShortName }} package: 
  ```
  dcos {{ model.packageName }} update start --package-version=2.6.0-3.11.4 --replace
  ```

# Release Notes for {{ model.techShortName }} Service version 2.5.0-3.11.3

## Upgrades

- Upgrade {{ model.techShortName }} to version `3.11.3`
- Upgraded SDK library to version `0.55.2`

## New Features

- Readiness-check `interval`, `timeout`, and `delay` are now configurable properties 
- The number of open file descriptors (`RLIMIT_NOFILE`) is now a configurable property 

## Improvements

- Service names are now validated with a regex.

# Release Notes for {{ model.techShortName }} Service version 2.4.0-3.0.16

## Bug Fixes

- Fix a bug where an out of date configuration ID would be selected when restarting or replacing pods. This could lead to configuration updates being reverted to the values with which the service was initially deployed. ([#2694](https://github.com/mesosphere/dcos-commons/pull/2694))

## Updates

- Upgrade JRE to 1.8u192 to address CVEs.
