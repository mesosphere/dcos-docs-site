---
layout: layout.pug
navigationTitle: DC/OS 2.2.0 Release Notes
title: DC/OS 2.2 Release Notes
menuWeight: 5
render: mustache
beta: false
model:  /mesosphere/dcos/2.2/data.yml
excerpt: Release notes for DC/OS 2.2.0, including Open Source attribution, and version policy.
---
Mesosphere&reg; DC/OS&trade; 2.2.0 was released on 29, October 2020.

<p class="message--warning"><strong>WARNING:</strong> Upgrading to DC/OS 2.2.0 causes all Docker containers, launched by Docker Containerizer, in any cluster to be restarted due to an issue that changes the name of the 'libnetwork' certificate. Because of this, we recommend you upgrade directly to DC/OS 2.2.1.</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.2.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.2.0/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers must contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

This release provides new features and enhancements to improve the user experience, fix reported issues, integrate changes from previous releases, and maintain compatibility and support for other packages, such as Marathon and Metronome, used in DC/OS.

# New features and capabilities 

## External storage with CSI volumes
DC/OS's Universal Container Runtime (UCR) now supports external volumes provided via the Container Storage Interface (CSI). Storage providers which integrate with the CSI specification provide plugins which DC/OS users may install into their cluster. These plugins allow volumes backed by that provider to be attached to task containers. This initial release of CSI support in DC/OS 2.2 has some caveats. For more information, see the [CSI](/mesosphere/dcos/2.2/storage/external-storage/csi/).

## Marathon Support for Mesos Offer Constraints
Marathon can now send offer constraints to Mesos to reduce the number of offers it needs to decline due to placement constraints. This behavior is intended to improve the launch speed for services with placement constraints. It is currently experimental and disabled by default. To enable, add the line `MARATHON_MESOS_OFFER_CONSTRAINTS=` to the file `/var/lib/dcos/marathon/environment` on all masters, and restart Marathon.

# Jobs with dependencies
Metronome based jobs can have one or more dependencies specified; a job will only be run when all of its dependencies have successfully run. This capability allows users to natively setup DAG-based workflows in DC/OS. For more information, see [dependencies](mesosphere/dcos/2.2/deploying-jobs/quickstart#dependencies).

# Custom CA certificate rotation
DC/OS now allows an operator to rotate the custom CA certificates by simply updating configuration settings during an upgrade. This feature ensures all the services that are using the custom CA based certificates are automatically updated after an upgrade. 

# Breaking changes
- Docker Hub announced an [update](https://www.docker.com/blog/scaling-docker-to-serve-millions-more-developers-network-egress/) to their image pull policies in August 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

  Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Mesosphere® DC/OS®, does not have any influence as to whether your current address is rate-limited or not. Mesosphere DC/OS does not have a strict dependency on Docker Hub accounts or plans.

  Without any further configuration, your cluster is likely using the “Free plan - anonymous users” tier. This means that if each of your nodes has its own public IP address, you can do 100 image pulls per 6 hours on every node. While this should not be a problem with just a few, usually-healthy workloads, but you may encounter unforeseeable issues if you:

    - Have constantly failing tasks
    - Are running a large number of CI jobs
    - Have metronome tasks with different containers
    - Use the [docker.forcePullImage](https://mesosphere.github.io/marathon/docs/native-docker.html#forcing-a-docker-pull) option

  In the worst case, your cluster might not be able to reschedule a failed task for up to 6 hours, which could lead to unresponsive services or even data corruption, for example, when using clustered databases.

  The DC/OS software offers several ways to specify these credentials:

    1. Cluster-wide credentials using dcos-config.yml: [Using Docker credentials to set cluster-wide registry credentials](https://docs.d2iq.com/mesosphere/dcos/2.1/deploying-services/private-docker-registry/#using-cluster-docker-credentials-to-set-cluster-wide-registry-credentials)

    1. Task-specific credentials using secrets: [Reference private docker registry credentials in DC/OS secrets](https://docs.d2iq.com/mesosphere/dcos/2.1/deploying-services/private-docker-registry/#reference-private-docker-registry-credentials-in-dcos-secrets-enterprise)

  A non-DC/OS-specific way to specify the Docker credentials is to use the .docker/config.json file on each agent, as described here: 
[Create a Docker credentials configuration file](https://docs.d2iq.com/mesosphere/dcos/2.1/deploying-services/private-docker-registry/#create-a-docker-credentials-configuration-file)

# Component Versions
DC/OS 2.2.0 includes the following component version updates:

- Apache® Mesos® 1.11.0-dev
- Marathon 1.11.23
- Metronome 0.6.68
- DC/OS UI 6.1.16
- CockroachDB 19.1.11
- Etcd 3.4.9

# Fixed and Improved Issues
DC/OS 2.2 fixes the following issues:

- systemd errors were being thrown during patch upgrades. (COPS-6506)
- dcos-fluent-bit.service was consuming too much memory. (COPS-6218) 
- Selecting *Install DC/OS CLI* presented a URL to a binary that was incorrect. (COPS-6360)
- Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode. (COPS-6335, D2iQ-70037) 
- Tasks would not start until Telegraf created /run/dcos/telegraf/dcos_statsd.sock. (COPS-6355)
- DC/OS installations on Flatcar Linux would not finish due to Java processing issues. (COPS-6422, D2iQ-70809, COPS-6190) 
- Fixed an issue with unmounting external persistent volumes in Mesos. (COPS-5920)
- After a reboot, the RootCA bundle was not being written soon enough for Docker to find it before the systemd startup limits were exhausted. (COPS-6534)
- UCR fetcher had issues pulling down images. (COPS-6381) 
- dcos-net was not always able to set all Spartan IP addresses after node reboot. (COPS-6519)
- dcos-telegraf.socket was down after a patch. (COPS-6512)
- Marathon migration failed while upgrading from 1.13.7 to 2.0.2 (and higher). (COPS-5897)
- Nested Marathon groups were not inheriting enforceRole behavior from top-level groups. (COPS-6529)
- enforceRole was automatically being set to false on all Marathon groups. (COPS-6533)
- Selecting *Run* on a job or selecting *Delete* to remove a group had no effect and threw an exception. (COPS-6324) 
- etcd provided an incorrect response in calicoctl. (COPS-6341)  
- Users were unable to remove empty folders from Metronome. (COPS-6139) 
- Hostname Resolution was failing for VIPs. (COPS-6411)  
- Using file-based secrets caused mount failure and issues in the json editor. (COPS-6085, D2iQ-68114)  
- Added URI to failure messages in URI fetcher plugins. (COPS-6116) (MESOS-7485)
- Cache adminrouter permissions for 10s to reduce load on Bouncer in large clusters. (COPS-5979, COPS-5915, D2iQ-65296)
- DC/OS UI showed unexpected information in **Services->Tasks table->CPU** column. (COPS-6555)
- Telgraf was consuming too much CPU. (COPS-5629)
- UI failed to show manually assigned port on endpoints tab. (COPS-6491)
- Exhibitor was writing JNA files to /tmp. (COPS-6111, D2iQ-68109) 
- Renaming or deleting folders via the Jupyter UI resulted in a rename error and delete failed. (COPS-6166)
- After an upgrade, the dcos-telegraf directories had incorrect permissions leading to a problem launching tasks. (COPS-6232, D2iQ-69295)
- Exhibitor endpoint responses were inconsistent. (D2iQ-70393, COPS-6326)  
- DC/OS OSS UI was not displaying a user name, but instead showed a *User added through OIDC ID Token login* message. (COPS-6295, D2iQ-70199) 
- Added details of job to Metronome Overview page and Job Runs page. (COPS-4665)
- The DC/OS Installer now checks to make sure that the Spartan IP's are not set as the 'resolvers'. (COPS-4616)
- A master node was not able to rejoin a cluster after failure/restart when another master was offline or being upgraded. (COPS-1754)
- Turned on enable_docker_gc by default for all types of DC/OS installations. (COPS-5520)
- Added the ability to disable Calico in config.yaml. (COPS-6451)

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
