---
navigationTitle:  Version Policy
title: Version Policy
menuWeight: 5
excerpt: DC/OS version lifecycle and compatibility matrix
---

The Version Policy page was updated on 08 September, 2020.

# Mesosphere DC/OS Version Lifecycle and Compatibility Matrix

This page explains to D2iQ customers, partners, users, and operators of Mesosphere DC/OS the modifications or enhancements to the same software product as designated by a change in the version release. A version release provides backward compatibility to all released APIs. The guidelines outlined in this document applies to the version of DC/OS and its catalog packages.

## DC/OS Version Lifecycle

D2iQ tests DC/OS Enterprise with specific components and operating systems as covered in the [DC/OS Version Compatibility Matrix](#version-compatibility-matrix). This testing is provided in the [DC/OS Platform Interoperability Matrix](#dcos-platform-version-compatibility-matrix). Support services for customers under a license and support agreement is defined within the <a href="https://mesosphere.com/mesosphere-support-terms/">D2iQ Support and Maintenance Terms</a>.

### Versioning Definitions

- **Major Versions** (**X**.y.z) are releases for providing major and minor features and improvements or optimizations to existing features. They incorporate all applicable bug fixes made in earlier Major, Minor, and Maintenance versions.
- **Minor Version** (x.**Y**.z) are versions for delivering minor features, improvements or optimizations to existing features, and bug fixes. They incorporate all applicable bug fixes made in earlier Minor versions, and Maintenance versions.
- **Maintenance Version** (x.y.**Z**) are versions for providing bug fixes that are highly impactful to a number of customers and who cannot wait for the next Major or Minor version. They incorporate all applicable bug fixes made in prior Maintenance versions.
- **"End of Life (EOL)"** versions are no longer supported by D2iQ, upgrading to a later version is highly recommended.

### Version Lifecycle

D2iQ shall provide support services for customers under a current agreement as outlined in the <a href="https://mesosphere.com/mesosphere-support-terms/">D2iQ Support and Maintenance Terms</a>, for specific versions of Mesosphere DC/OS. While these versions are outlined in the Mesosphere DC/OS Version Compatibility Matrix, they follow a specific model for determining which versions are supported. The model follows an N-2 (for Major and Minor Versions) and N-4 (for Maintenance Versions) specification. Thus, D2iQ shall provide support services for those versions of DC/OS that are either the current, N, or up to two Minor versions behind.<br>

 Examples of Major and Minor versions are as follows:

* **Major Version**: Upon the availability of a new DC/OS Major version, 2.0.0, Maintenance versions prior to (N-2) Minor versions of the previous (N-1) major release would not be supported. Major Versions also count towards advancing the Minor number version.<br>

Thus, upon the release of 2.0.0 where 1.13.4 and 1.12.5 are available:
   - Minor Versions 1.13.2 (1.13.4 and - 2) would be supported, while older versions (1.13.1) would no longer be supported.
   - Minor Versions 1.12.3 (1.12.5 and - 2) would be supported, while older versions (1.12.2) would no longer be supported.

* **Minor Version**: Upon the availability of a new DC/OS Minor version 1.11.0, minor versions prior to and including 1.8.0 will no longer be supported as (N-2) includes 1.11 (N), 1.10 (N-1) and 1.9 (N-2).
* **Maintenance Version**: Upon the availability of DC/OS Maintenance version 1.10.5, Maintenance versions prior to and including 1.10.0 will no longer be supported as (N-4) includes 1.10.5 (N), 1.10.4 (N-1), 1.10.3 (N-2), 1.10.2 (N-3) and 1.10.1 (N-4).<br>

## DC/OS Platform Version Compatibility Matrix

DC/OS will run on the tested platform components and operating environments. The list of support matrix for platform components and operating environments are as follows:

##### [CentOS support matrix](#CentOS-support-matrix)
##### [RHEL support matrix](#RHEL-support-matrix)
##### [Flatcar Linux support matrix](#flatcar-support-matrix)

Customers running DC/OS on non-supported platform components should upgrade to a supported component. For clarity, D2iQ only provides support services to paying customers under a written agreement. The term “supported” in D2iQ documentation refers to whether the indicated software component has been tested for compatibility.

D2iQ does not retroactively test and support all versions of each of these operating systems against every single historical DC/OS release.  Not all of these operating systems are supported on every version of DC/OS or can be expected to be.  Rather, we test each new DC/OS version (minor or patch)  against the latest stable releases of these supported operating systems by installing DC/OS on the target OS and running the integration test suite against DC/OS installed on an OS/Docker combination.
CentOS is the only Operating System that is extensively tested (nightly tests, long lived cluster tests, scale tests etc) by D2iQ. All the other mentioned OSes in this page are tested only once per minor or patch release.

Note: The [Universal Installer](https://docs.d2iq.com/mesosphere/dcos/2.1/installing/evaluation/) only supports CentOS and RHEL. There are no plans to add support for other referenced OSes in this page. Customers are recommended to use the Advanced Installation method for installing DC/OS on these other OSes.

### <a name="CentOS-support-matrix"></a>CentOS support matrix
<table class="table">
    <tr>
    <th><strong>Platform Component</strong></th>
    <th><strong>DC/OS 2.2 Latest Stable</strong></th>
    <th><strong>DC/OS 2.1 Latest Stable</strong></th>
    <th><strong>DC/OS 2.0 Latest Stable</strong></th>
    </tr>
    <tr>
        <td>CentOS 7.*</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br>Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br>Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br>Docker CE 18.09.9</p></td>
    </tr>
</table>

### <a name="RHEL-support-matrix"></a>RHEL support matrix
<table class="table">
    <tr>
    <th><strong>Platform Component</strong></th>
    <th><strong>DC/OS 2.2 Latest Stable</strong></th>
    <th><strong>DC/OS 2.1 Latest Stable</strong></th>
    <th><strong>DC/OS 2.0 Latest Stable</strong></th>
    </tr>
    <tr>
        <td>RHEL 7.*</td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br>Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br>Docker CE 18.09.9</p></td>
        <td><p style="text-align: center;">Docker CE 19.03.5<br>Docker CE 18.09.9</p></td>
    </tr>
</table>

### <a name="Ubuntu-support-matrix"></a>Ubuntu support matrix
**NOTE: Starting with DC/OS 2.0, we have discontinued support for Ubuntu Linux.**


### <a name="Oracle-support-matrix"></a>Oracle support matrix
**NOTE: Starting with DC/OS 2.0, we have discontinued support for Oracle Linux.**


### <a name="CoreOS-support-matrix"></a>CoreOS support matrix
As of May 26th 2020 CoreOS Container Linux has reached its [end of life](https://coreos.com/os/eol/) and will no longer receive updates. The recommended alternative is to use [Flatcar Linux](#flatcar-support-matrix).

**NOTE: Starting with DC/OS 2.0, we have discontinued support for CoreOS.**
<table class="table">
    <tr>
    <th><strong>Platform Component</strong></th>
    <th><strong>DC/OS 1.13 Latest Stable</strong></th>
    </tr>
    <tr>
        <td>CoreOS 2079.3.0</td>
        <td><p style="text-align: center;">Docker CE 18.06.3</p></td>
    </tr>
    <tr>
        <td>CoreOS 2023.5.0</td>
        <td><p style="text-align: center;">Docker CE 18.06.1</p></td>
    </tr>
    <tr>
        <td>CoreOS 2023.4.0</td>
        <td><p style="text-align: center;">Docker CE 18.06.1</p></td>
    </tr>
</table>

### <a name="flatcar-support-matrix"></a>Flatcar Linux support matrix
<table class="table">
    <tr>
    <th><strong>Platform Component</strong></th>
    <th><strong>DC/OS 2.2 Latest Stable</strong></th>
    <th><strong>DC/OS 2.1 Latest Stable</strong></th>
    </tr>
    <tr>
        <td>Flatcar Linux 2345.3.1</td>
        <td><p style="text-align: center;">Docker CE 18.06.3</p></td>
        <td><p style="text-align: center;">Docker CE 18.06.3</p></td>
    </tr>
</table>

## Internet Browser and CLI Matrix
Use the following legend table to see the supported/not supported service for the operating environments on which DC/OS has been tested.

### Legend for Internet Browser and CLI support matrix
|Display Icon | Service       |
|------------ |-------------- |
| ⚫          | Supported     |
|             | Not Supported |


### Internet Browser support matrix
<table class="table">
    <tr>
    <th><strong>Web Browser</strong></th>
    <th><strong>DC/OS 2.2 Latest Stable</strong></th>
    <th><strong>DC/OS 2.1 Latest Stable</strong></th>
    <th><strong>DC/OS 2.0 Latest Stable</strong></th>
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

### CLI support matrix
<table class="table">
    <tr>
    <th><strong>CLI</strong></th>
    <th><strong>DC/OS 2.2 Latest Stable</strong></th>
    <th><strong>DC/OS 2.1 Latest Stable</strong></th>
    <th><strong>DC/OS 2.0 Latest Stable</strong></th>
    </tr>
    <tr>
        <td>DC/OS CLI 1.x</td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
        <td><p style="text-align: center;">⚫</p></td>
    </tr>
</table>

## Customer Advisory for CentOS/RHEL 7.X
<p class="message--important"><strong>IMPORTANT: </strong>Docker recently enabled <code>kmem</code> accounting in version 17.06+. Customers may notice instability for the entire system when running under RHEL or CentOS 7.x. The symptoms include tasks getting stuck indefinitely and kernel-related error messages in the system logs. The <code>kmem</code> accounting feature in Redhat’s forked Linux Kernel is incomplete and can cause kernel deadlocks or kernel memory leaks. Details on the bug and mitigation instructions are located <a href="https://mesosphere-community.force.com/s/article/Critical-Issue-KMEM-MSPH-2018-0006">here</a>.</p>

## Version Compatibility Matrix

D2iQ maintains and certifies several packages for DC/OS.

### Base Technology

D2iQ does not offer support services for the base technology (for example, Jenkins). The base technology version is denoted as the second version in the package number (for example, 1.2.3-**4.5.6**).

### Certified Package Designations

Services that are labeled as “Certified” have been tested by D2iQ for interoperability with DC/OS, but D2iQ disclaims all warranties, and makes no promises, including with respect to the services’ operation or production readiness. Support for the integration may be available from D2iQ or the creator of the service. The matrix below lists certified packages and the current state of which packages are tested on what version of DC/OS, and what is within the best effort scope of our technical support organization.

The designations are as follows:

⚫ This combination is tested and compatible with the specified version of DC/OS.
- This package is within the scope of our technical support organization.
- This is package is eligible for bug fixes.

◒ This combination has been tested previously and should be compatible with the specified version of DC/OS.
- This combination is not within the scope of our technical support organization.
- This combination is not eligible for bug fixes.

◯ This package combination has not been tested.
- This combination is not within the scope of our technical support organization.
- This combination is not eligible for bug fixes.

## Certified Packages and DC/OS Versions
<table class="table">
    <tr>
        <th><strong>DC/OS Package for</strong></th>
        <th><p style="text-align: center;"><strong>DC/OS 2.2</strong></p></th>
            </tr>
    <tr>
        <td>Cassandra 2.4.x-3.0.16</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Cassandra 2.9.x-3.11.6 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Confluent-Kafka 2.5.x-4.1.2</td>
        <td><p style="text-align: center;">⚫</p></td>
           </tr>
    <tr>
        <td>Confluent-Kafka 2.10.x-5.5.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Confluent-ZooKeeper 2.5.x-4.1.3e</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Confluent-ZooKeeper 2.8.x-5.5.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
        <tr>
        <td>²DataStax-DSE 2.4.x-5.1.10</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>²DataStax-DSE 3.2.x-6.7.7 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
        <td>²DataStax-Ops 2.4.x-6.1.9</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>²DataStax-Ops 3.2.x-6.7.7 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
             <tr>
        <td>Edge-LB 1.2</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Edge-LB 1.3 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Elastic 2.7.x-6.8.1</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Elastic 3.1.2-7.6.0 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>HDFS 2.5.x-2.6.0-cdh5.11.0 </td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>HDFS 2.8.x-3.2.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
           </tr>
    <tr>
        <td>Jenkins 3.5.x-2.107.2</td>
        <td><p style="text-align: center;">⚫</p></td>
           </tr>
    <tr>
        <td>Jenkins 3.5.x-2.150.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Kafka 2.4.x-1.1.1</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Kafka 2.9.x-2.4.0 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Kafka-Zookeeper 2.6.x-3.4.14</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <!-- Where is Kafka-ZooKeeper 2.4.x? -->
    <tr>
        <td>Kafka-Zookeeper 2.7.x-3.4.14 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Kibana 2.7.x-6.8.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Kubernetes 2.1.x-1.12.y</td>
        <td><p style="text-align: center;">◯</p></td>
            </tr>
    <tr>
        <td>Kubernetes 2.2.x-1.13.y </td>
        <td><p style="text-align: center;">◯</p></td>
            </tr>
    <tr>
        <td>Kubernetes 2.2.x-1.14.y (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
           </tr>
    <tr>
        <td>Kubernetes Cluster 2.2.x-1.13.y </td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Kubernetes Cluster 2.3.x-1.14.y (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Marathon-LB 1.12.x</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Marathon-LB 1.13.x (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.6.x</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.7.x</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>MoM (Marathon on Marathon) 1.8.x (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Spark 2.11.x-2.4.6</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Spark 2.12.x-3.0.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
    <tr>
        <td>Spark History 2.11.x-2.4.6</td>
        <td><p style="text-align: center;">⚫</p></td>
           </tr>
    <tr>
        <td>Spark History 2.12.x-3.0.1 (Recommended)</td>
        <td><p style="text-align: center;">⚫</p></td>
            </tr>
</table>

### Beta Package Designations
Services that are labeled as “Beta” are not ready for production.

The designations are as follows:

◯ - This package combination has not been tested.
- This combination is not within the scope of our technical support organization.
- This combination is not eligible for bug fixes.

B - This package combination is *beta*.
- Beta packages are not within the scope of our technical support organization.
- Beta packages iterate quickly and are not eligible for bug fixes.

## Beta Packages and DC/OS Versions
<table class="table">
    <tr>
        <th><strong>DC/OS Package for</strong></th>
        <th><p style="text-align: center;"><strong>DC/OS 2.2</strong></p></th>
            </tr>
    <tr>
        <td>Beta DC/OS Storage Services 0.4.0</td>
        <td><p style="text-align: center;">◯</p></td>
            </tr>
    <tr>
        <td>¹Beta DC/OS Storage Services 0.5.3 </td>
        <td><p style="text-align: center;">◯</p></td>
            </tr>
    <tr>
        <td>Beta DC/OS Storage Services 0.6.0 (Recommended)</td>
        <td><p style="text-align: center;">B</p></td>
            </tr>
    <tr>
        <td>Beta Mesosphere Jupyter Service 1.3.x - 0.35.4 (Recommended)</td>
        <td><p style="text-align: center;">B</p></td>
            </tr>
</table>
