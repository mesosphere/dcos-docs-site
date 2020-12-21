---
layout: layout.pug
navigationTitle: DC/OS 2.1.1 Release Notes
title: DC/OS 2.1.1 Release Notes
menuWeight: 5
excerpt: Release notes for DC/OS 2.1.1, including Open Source attribution, and version policy.
---
DC/OS&trade; 2.1.1 was released on 27 August, 2020.

<p class="message--warning"><strong>WARNING:</strong> Upgrading from DC/OS 2.1.x to DC/OS 2.2.0 causes all Docker containers, launched by Docker Containerizer, in any cluster to be restarted due to an issue that changes the name of the 'libnetwork' certificate. Because of this, we recommend you upgrade directly to DC/OS 2.2.1.</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.1/dcos_generate_config.ee.sh"]Download DC/OS Enterprise* [/button]

New customers, contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> before attempting to download and install DC/OS Enterprise.

# Release Summary
DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment.

# DC/OS 

## Breaking changes
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

## Component Versions

DC/OS 2.1.1 includes the following component versions:

- Apache Mesos 1.10.1
- Marathon 1.10.26
- DC/OS UI 5.1.7
- Fluentbit 1.4.6

### DC/OS Fixed and Improved Issues

DC/OS 2.1.1 fixes the following issues:

- Selecting **Install DC/OS CLI** presents a URL to a binary that is incorrect. (COPS-6360)
- The Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode. (COPS-6335, D2iQ-70037)
- Selecting **Run** on a job or selecting **Delete** to remove a group had no effect and threw an exception. (COPS-6324)
- DC/OS OSS UI was not displaying a user name, but instead showed a **User added through OIDC ID Token login** message. (COPS-6295, D2iQ-70199) 
- Renaming or deleting folders via the Jupyter UI resulted in a Rename Error and Delete Failed. (COPS-6166, DCOS_OSS-5967)
- Users were unable to remove empty folders from Metronome. (COPS-6139, D2iQ-68541)
- Exhibitor was writing JNA files to /tmp. (COPS-6111, D2iQ-68109, D2iQ-68868) 
- Using file-based secrets caused mount failure and issues in the json editor. (COPS-6085, D2iQ-68114, D2iQ-67819) 
- An unknown response code was received when querying DC/OS health endpoints. (COPS-5915, COPS-5979, D2iQ-65296, D2iQ-69169) 
- After an upgrade, the dcos-telegraf directories had incorrect permissions leading to a problem launching tasks. (COPS-6232, D2iQ-69295)
- In the DC/OS UI, selecting **Enter** in the Secret ID textbox reloaded the page. (D2iQ-14964) 
- Running two CLI installers from the same machine aborted with an error. (D2iQ-7844) 
- A master node was not able to rejoin a cluster after failure/restart when another master was offline or being upgraded. (COPS-1754, D2iQ-4248) 
- An error was thrown when unmounting external persistent volumes in Mesos. (COPS-5920, D2iQ-65497)
- A critical error in Metronome where existing jobs appear to be lost after upgrade. (DCOS_OSS-5965, COPS-6174)
- DC/OS installations on Flatcar Linux would not finish due to Java processing issues. (COPS-6422, D2iQ-70809, COPS-6190)
- Exhibitor endpoint responses were inconsistent. (D2iQ-70393, COPS-6326) 
- The Mesos Authorizer module was trying to authorize the dcos_anonymous account on permissive security mode. (COPS-6335, D2iQ-70025) 
- The file bootstrap.py was updated to check for changes to the signing certificate authority. (D2iQ-69408) 
- Frameworks could interfere with Marathon pods by launching tasks on resources reserved to Marathon. (D2iQ-68800)
- etcd was providing an incorrect response in calicoctl. (COPS-6341) 
- dcos-fluent-bit.service was consuming too much memory. (COPS-6218)

## Mesos Fixed and Improved Issues
For a detailed description on updates to Mesos, see the [changelog](https://github.com/apache/mesos/blob/802a50f4902f1f5ca3829dca4a472d8a582f7b9b/CHANGELOG)

## Marathon Fixed and Improved Issues
For a detailed description on updates to Marathon, see the [changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Metronome Fixed and Improved Issues
For a detailed description on updates to Metronome, see the [changelog](https://github.com/dcos/metronome/blob/master/changelog.md).
