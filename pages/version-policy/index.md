---
layout: layout.pug
navigationTitle:  Version Policy
title: Version Policy
menuWeight: 5
excerpt:
---
# Mesosphere DC/OS Version Lifecycle and Compatibility Matrix

The purpose of this document is to provide guidance and education for Mesosphere customers, partners, users, and operators of Mesosphere DC/OS about the modifications or enhancements to the same software product as designated by a change in the version release. A version release provides backward compatibility to all released APIs. The guidelines outlined within this document apply to the version of DC/OS and its catalog packages that this document resides in.

## DC/OS Version Lifecycle

Mesosphere tests DC/OS Enterprise with specific components and operating systems as covered in the [DC/OS Version Compatibility Matrix](#version-compatibility-matrix). This testing is provided in the [DC/OS Platform Interoperability Matrix](#dcos-platform-version-compatibility-matrix). Support services for customers under a license and support agreement is defined within the <a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere Support Terms</a>.

### Versioning Definitions

- **Major Versions** (**X**.y.z) are releases for providing major and minor features and improvements or optimizations to existing features. They incorporate all applicable bug fixes made in earlier Major, Minor, and Maintenance versions.
- **Minor Version** (x.**Y**.z) are versions for delivering minor features, improvements or optimizations to existing features, and bug fixes. They incorporate all applicable bug fixes made in earlier Minor versions, and Maintenance versions.
- **Maintenance Version** (x.y.**Z**) are versions for providing bug fixes that are highly impactful to a number of customers and who cannot wait for the next Major or Minor version. They incorporate all applicable bug fixes made in prior Maintenance versions.
- **"End of Life (EOL)"** versions are no longer supported by Mesosphere, upgrading to a later version is highly recommended.

### Version Lifecycle

Mesosphere shall provide support services for customers under a current agreement as outlined in the <a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere Support Terms</a>, for specific versions of Mesosphere DC/OS. While these versions are outlined in the Mesosphere DC/OS Version-Compatibility Matrix they follow a specific model for determining which versions are supported. The model follows an N-2 (for Major and Minor  Versions) and N-4 (for Maintenance Versions) specification. Thus, Mesosphere shall provide support services for those versions of DC/OS that are either the current, N, or up to two (2) Minor versions behind. <br>

 *Examples* follow:

* **Major Version**: Upon the availability of a new DC/OS Major version, 2.0.0, Maintenance versions prior to (N-2) Minor versions of the previous (N-1) major release would not be supported. Major Versions also count towards advancing the Minor number version.<br>

Thus, upon the release of 2.0.0 where 1.10.4 and 1.9.7 are available:
   - Minor Versions 1.10.2 (1.10.4 and - 2) and older would no longer be supported.
   - Minor Versions 1.9.4 (1.9.4 and - 2) and older would no longer be supported.

* **Minor Version**: Upon the availability of a new DC/OS Minor version 1.11.0, minor versions prior to and including 1.8.0 will no longer be supported as (N-2) includes 1.11 (N), 1.10 (N-1) and 1.9 (N-2).
* **Maintenance Version**: Upon the availability of DC/OS Maintenance version 1.10.5, Maintenance versions prior to and including 1.10.0 will no longer be supported as (N-4) includes 1.10.5 (N), 1.10.4 (N-1), 1.10.3 (N-2), 1.10.2 (N-3) and 1.10.1 (N-4).<br>

## DC/OS Platform Version Compatibility Matrix

The below matrix provides guidance as to which platform components and operating environments are tested to run DC/OS on. Customers that are running DC/OS on non-supported Platform components should upgrade to a supported component. For clarity, Mesosphere only provides support services to paying customers under a written agreement; the term “supported” in Mesosphere documentation refers to whether the indicated software component has been tested for compatibility.



|Display Icon | Service |
|---------- | ------- |
| ⚫| Supported |
|    | Not Supported |


<table class="table">
    <tr>
    <th><strong>Platform Component</strong></th>
    <th><strong>DC/OS 1.11</strong></th>
    <th><strong>DC/OS 1.10</strong></th>
    <th><strong>DC/OS 1.9</strong></th>
    </tr>
    <tr>
       <td>CoreOS 1688.5.3<sup>*</sup></td>
       <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.12.1</p></td>
       <td>                    </td>
       <td>                    </td>
    </tr>
    <tr>
      <td>CoreOS Stable 1235.12.0</td>
      <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p></td>
      <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13</p><p style="text-align: center;">Docker Engine 1.12 </p><p style="text-align: center;"> Docker Engine 1.11 </p></td>
      <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13 </p><p style="text-align: center;">Docker Engine 1.12 </p> <p style="text-align: center;">Docker Engine 1.11 </p>
    </tr>
    <tr>
        <td>CoreOS Stable 835.13.0</td>
        <td>                    </td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13 </p><p style="text-align: center;">Docker Engine 1.12 </p><p style="text-align: center;">Docker Engine 1.11 </p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13 </p><p style="text-align: center;">Docker Engine 1.12</p><p style="text-align: center;">Docker Engine 1.11 </p>
    </tr>
    <tr>
        <td>RHEL 7.2</td>
        <td>                    </td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13</p><p style="text-align: center;">Docker Engine 1.12</p><p style="text-align: center;">Docker Engine 1.11 </p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13 </p> <p style="text-align: center;">Docker Engine 1.12 </p><p style="text-align: center;"> Docker Engine 1.11 </p>
     </tr>
     <tr>
        <td>RHEL 7.3</td>
        <td>                    </td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13 </p><p style="text-align: center;">Docker Engine 1.12 </p><p style="text-align: center;">Docker Engine 1.11 </p>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13 </p><p style="text-align: center;">Docker Engine 1.12 </p><p style="text-align: center;">Docker Engine 1.11 </p></td>
    </tr>
     <tr>
        <td>RHEL 7.4</td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p><p style="text-align: center;">Docker EE 17.06.2</p><p style="text-align: center;">Docker CE 17.12.1</p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p><p style="text-align: center;">Docker EE 17.06.2</p><p style="text-align: center;">Docker CE 17.12.1</p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p></td>
    </tr>
    <tr>
        <td>CentOS 7.3</td>
        <td>                    </td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13</p><p style="text-align: center;"> Docker Engine 1.12 </p><p style="text-align: center;">Docker Engine 1.11</p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker Engine 1.13</p><p style="text-align: center;">Docker Engine 1.12</p><p style="text-align: center;">Docker Engine 1.11</p> </td>
    </tr>
     <tr>
        <td>CentOS 7.4</td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p><p style="text-align: center;">Docker EE 17.06.2</p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p><p style="text-align: center;">Docker EE 17.06.2</p></td>
        <td><p style="text-align: center;">⚫</p><p style="text-align: center;">Docker CE 17.05</p></td>
    </tr>
    <tr>
    <th><strong>Web Browser</strong></th>
    </tr>
    <tr>
        <td>Chrome</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
    <tr>
        <td>Firefox</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
</table>

<sup>*</sup> CoreOS 1688.5.3 requires DC/OS 1.11.3 or later releases.


## Version Compatibility Matrix

Mesosphere maintains and certifies several packages for DC/OS.

### Base Technology

Mesosphere does not offer support services for the base technology (e.g. Jenkins). The base technology version is denoted as the second version in the package number (e.g. 1.2.3-4.5.6).

### Certified Package Designations

Services that are labeled as “Certified” have been tested by Mesosphere for interoperability with DC/OS, but Mesosphere disclaims all warranties, and makes no promises, including with respect to the services’ operation or production readiness. Support for the integration may be available from Mesosphere or the creator of the service. The matrix below lists certified packages and the current state of what packages are tested on what version of DC/OS, and what is within the best effort scope of our technical support organization.

The designations are as follows:

⚫ - This combination is tested and compatible with the specified version of DC/OS.

- This package is within the scope of our technical support organization.
- This is package is eligible for bug fixes.

◒ - This combination has been tested previously and should be compatible with the specified version of DC/OS.
- This combination is not within the scope of our technical support organization.
- This combination is not eligible for bug fixes.

◯ - This package combination has not been tested.
- This combination is not within the scope of our technical support organization.
- This combination is not eligible for bug fixes.

B- This package combination is *beta*.      
- Beta packages are not within the scope of our technical support organization.
- Beta packages iterate quickly and are not eligible for bug fixes.

## Certified Packages and DC/OS Versions
<table class="table">
    <tr>
    <th><strong>DC/OS Package for:</strong></th>
    <th><p style="text-align: center;"><strong>DC/OS 1.11</strong></p></th>
    <th><p style="text-align: center;"><strong>DC/OS 1.10</strong></p></th>
    <th><p style="text-align: center;"><strong>DC/OS 1.9</strong></p></th>
    <th><p style="text-align: center;"><strong>DC/OS 1.8</strong></p></th>
    </tr>
    <tr>
        <td>Kafka 2.1.x-1.0.0</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kafka 2.0.x-0.11.0</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kafka 2.0.x-1.0.0</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kafka 1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
      <tr>
        <td>Kubernetes 1.0.x-*</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>Confluent-Kafka 2.1.x-3.3.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Confluent-Kafka 2.0.x-3.2.x</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Confluent-Kafka 1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>Cassandra 2.1.x-3.0.15</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Cassandra 2.0.x-3.0.15</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Cassandra 1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>¹DataStax-DSE 2.1.x-*</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>¹DataStax-Ops 2.1.x-*</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>¹DataStax-DSE 2.0.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>¹DataStax-Ops 2.0.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>DSE 1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>ElasticSearch 2.2.x-5.6.y</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
      <tr>
        <td>ElasticSearch 2.1.x-5.6.y</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>ElasticSearch 2.0.x-5.6.y</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>HDFS 2.1.x-2.6.y</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>HDFS 2.0.x-2.6.y</td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>HDFS 1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Jenkins 3.4.x-2.89.y</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Jenkins 3.3.x-2.73.y</td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Jenkins 3.2.x-2.60.y</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>Jenkins 3.1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>Jenkins 3.0.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Jenkins 2.1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Jenkins 2.0.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.6</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
      <td><p style="text-align: center;">◯</p></td>
    </tr>
     <tr>
        <td>MoM (Marathon on Marathon) 1.5</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Edge-LB 1.0.0</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Edge-LB 0.1.9</td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    <tr>
        <td>Edge-LB 0.1.8</td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Marathon-LB 1.11.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>    
     <tr>
        <td>Marathon-LB 1.10.x</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
      <tr>
        <td>Marathon-LB 1.2.* 1.9.*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Spark 2.1.x-2.2.y</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>   
    <tr>
        <td>Spark 2.0.x-2.2.y</td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◒</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>   
    <tr>
        <td>Spark 1.x-*</td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>
    <tr>
        <td>Kafka-Zookeeper 2.0.x-3.4.11</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">◯</p></td>
    </tr>   
</table>

### Footnotes

1 - *Package maintained and technical support services solely by DataStax Corporation*.
