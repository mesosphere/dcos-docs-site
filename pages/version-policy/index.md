---
layout: layout.pug
navigationTitle:  Version Policy
title: Version Policy
menuWeight: 1
excerpt:
--- 
# Mesosphere DC/OS Feature Maturity Lifecycle and Compatibility Matrix

The purpose of this document is to provide guidance and education for Mesosphere customers, partners, users and operators of Mesosphere DC/OS about Mesosphere's feature lifecycle model and the maturity of a given feature within that model.  The guidelines outlined within this document apply to the version of DC/OS and its catalog packages that this document resides in.

## Feature Lifecycle

A Mesosphere DC/OS feature will progress through a multi-stage lifecycle.  This lifecycle, covered in this section can be used to determine if and when a given feature is used for various stages of deployment.  These stages of deployment can include, but are not limited to, development, testing, evaluation or production. A customer of Mesosphere DC/OS should, in order to determine if one should use a given feature, carefully examine the ramifications of using a given feature based upon its Maturity State and the stage of DC/OS deployment.

**Note**: For the purposes of brevity in this document, a feature can encompass Apps, Services, Frameworks, Components or Packages that are part of Mesosphere DC/OS or its catalog.

The five Maturity States of a Mesosphere DC/OS feature are illustrated below and progress from left to right starting with *Beta* and ending with *Decommissioned*. 

![Five Maturity States of Mesosphere DC/OS](1.11/img/five-maturity-states.png)

## Beta 

At a high level, features that are labeled Beta are aimed at those consumers that are looking to have early exposure to a given feature. Typically, these features are primarily used for evaluation and non-production testing purposes or to provide feedback to Mesosphere. Beta features are:
<ol>
<li>Ready for customer or end-user testing and early validation of features and functionality.</li>
<li>Changes and or removal of functionality may be changed, discontinued, or deprecated for any reason and at any time.</li>
<li>A still evolving feature that may contain bugs/errors/defects, require further enhancements or not have its' abilities or APIs finalized.</li>  
<li>May be subject to reduced or different security, compliance and privacy commitments.</li>
<li>May be subject to reduced performance, scalability or capacity commitments.</li>
<li>Not guaranteed to be promoted from Beta to GA.</li>
<li>May be subject to provide feedback via non-standard channels to include, but not limited to, email, slack channels or community forums, based on testing, usage and experiences.</li>

**Note:** Any use of a Beta version or feature of Mesosphere DC/OS Enterprise is subject to the <a href="https://mesosphere.com/evaluation-terms/">Evaluation Terms</a>,to the exclusion of all other terms.

## General Availability

A feature that is Generally Available (GA), is recommended to be used by all consumers. A feature in this state of the maturity lifecycle should be considered for use in any customer deployment state including production. 

<ol>
<li>Ready for testing, evaluation, application development and production usage by the customer.</li>
<li>Feature may be continued to be enhanced and bugs or defects resolved.</li>
<li>API modifications will be under version control (V1, V2 etc).</li>
<li>For customers of DC/OS Enterprise, feedback and support should go through the methods outlined in the <a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere Support Terms</a>.</li>
<li>For customers of DC/OS Open, feedback should go through <a href="https://dcos.io/community/">Community channels</a>.</li>
<li>Feature modifications or Maturity lifecycle changes can be found in the release notes.</li>
</ol>

## Deprecated

A deprecated feature is a feature that Mesosphere has deemed should no longer provide enhancements to.  The change in state may be due to, but not limited to, superseding by a newer/different feature, shift in the industry or lack of customer interest. This may include Apps, Frameworks, Services or Components of Mesosphere DC/OS or versions of parts or access methods (e.g. APIs, CLI commands) of the Apps, Frameworks, Services or Components.  Consumers of Mesosphere DC/OS should consider migrating their applications or DC/OS cluster to use the newer feature.  
<ol>
<li>Enhancements to the feature should not be expected.</li>
<li>Bugs may continue to be resolved based on factors including, but not limited to, severity, priority or if they have been addressed by the superseding feature.</li>
</ol>

## Retired 

A retired feature is a feature that has reached the end of its maturity lifecycle within Mesosphere DC/OS but is still part of the product.  Customers using a retired feature are strongly urged to migrate off the retired feature and to an GA feature, as this is the last state within the Maturity lifecycle that the feature is still present in Mesosphere DC/OS.
<ol>
<li>Enhancements to the feature should not be expected.</li>
<li>Bugs or defects should not be expected to be fixed.</li>
</ol>

## Decommissioned 

A decommissioned feature is no longer available in current releases of DC/OS. The feature has since been removed from the current and future versions of DC/OS.

# DC/OS Version Lifecycle

Mesosphere tests DC/OS Enterprise with specific components and operating systems as covered in the [DC/OS Compatibility Matrix](#DC/OS-Compatibility-Matrix). This testing is provided in the DC/OS Platform Interoperability Matrix and support for customers under a license and support agreement is defined within the <a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere Support Terms</a>. 

## Versioning Definitions

- **Major Versions** (**X**.y.z) are releases for providing major and minor features and improvements or optimizations to existing features. They incorporate all applicable Bug fixes made in earlier Major, Minor, and Maintenance versions.</
- **Minor Version** (x.**Y**.z) are versions for delivering minor features, improvements or optimizations to existing features, and bug fixes. They incorporate all applicable bug fixes made in earlier Minor versions, and Maintenance versions.
- **Maintenance Version** (x.y.**Z**) are versions for providing bug fixes that are highly impactful to a number of customers and who cannot wait for the next major or minor version. They incorporate all applicable bug fixes made in prior Maintenance versions.
- **"End of Life (EOL)"** versions are no longer supported by Mesosphere, upgrading to a later version is highly recommended.

## Version Lifecycle

Mesosphere shall provide support for customers under a current agreement as outlined in the <a href="https://mesosphere.com/mesosphere-support-terms/">Mesosphere Support Terms</a>, for specific versions of Mesosphere DC/OS.  While these versions are outlined in the Mesosphere DC/OS Compatibility Matrix they follow a specific model for determining which versions are supported. The model follows an N-2 (for Major and Minor  Versions) and N-4 (for Maintenance Versions) specification.  Thus Mesosphere shall support those versions of DC/OS that are either the current, N, or up to two (2) minor versions behind. 
*Examples* follow:

- **Major Version**: Upon the availability of a new DC/OS major version, 2.0.0, maintenance versions prior to (N-2) minor versions of the previous (N-1) major release would not be supported.  Major Versions also count towards advancing the Minor number version. Thus, upon the release of 2.0.0 where 1.10.4 and 1.9.7 are available:
   - Minor Versions 1.10.2 (1.10.4 and - 2) and older would no longer be supported. 
   - Minor Versions 1.9.4 (1.9.4 and - 2) and older would no longer be supported.
- **Minor Version**: Upon the availability of a new DC/OS minor version 1.11.0, minor versions prior to and including 1.8.0 will no longer be supported as (N-2) includes 1.11 (N), 1.10 (N-1) and 1.9 (N-2).
- **Maintenance Version**: Upon the availability of DC/OS maintenance version 1.10.5, maintenance versions prior to and including 1.10.0 will no longer be supported as (N-4) includes 1.10.5 (N), 1.10.4 (N-1), 1.10.3 (N-2), 1.10.2 (N-3) and 1.10.1 (N-4).

# DC/OS Platform Compatibility Matrix

The below matrix provides guidance as to which Platform components and Operating environments are tested to run DC/OS on.  Customers that are running DC/OS on non-supported Platform components should upgrade to a supported component.

DELETE THIS:
{1.11/img/closed-o.png
1.11/img/half-filled-o.png
1.11/img/open-o.png 
}

|![Closed Circle](1.11/img/closed-o.png)  | Supported |
|-------|----------|
|    | Not Supported |


<table class="table">
    <tr>
    <th><strong>Platform Component</strong></th>
    <th><strong>DC/OS 1.11</strong></th>
    <th><strong>DC/OS 1.10</strong></th>
    <th><strong>DC/OS 1.9</strong></th>
    </tr>
    <tr> 
      <td>CoreOS Stable 1235.12.0</td>
      <td><img src="1.11/img/closed-o.png"></img> <br> Docker CD 17.05</td>
      <td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
      <td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    </tr>
    <tr>
    	<td>CoreOS Stable 835.13.0</td>
    	<td>                    </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    </tr>
    <tr>
    	<td>RHEL 7.2</td>
    	<td>                    </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
     </tr>
     <tr>
    	<td>RHEL 7.3</td>
    	<td>                    </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    </tr>
     <tr>
    	<td>RHEL 7.4</td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker CD 17.05</td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker CD 17.05</td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker CD 17.05</td>
    </tr>
    <tr>
    	<td>CentOS 7.3</td>
    	<td>                    </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker Engine 1.13 <br> Docker Engine 1.12 <br> Docker Engine 1.11 </td>
    </tr>
     <tr>
    	<td>CentOS 7.4</td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker CD 17.05</td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker CD 17.05</td>
    	<td><img src="1.11/img/closed-o.png"></img> <br>Docker CD 17.05</td>
    </tr>
    <tr>
    <th><strong>Web Browser</strong></th>
    </tr>
    <tr>
    	<td>Chrome</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    </tr>
    <tr>
    	<td>Firefox</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    </tr>
</table>

# Compatibility Matrix

Mesosphere maintains and certifies several packages for DC/OS.

## Base Technology

Mesosphere does not offer support for the base technology (e.g. Jenkins). The base technology version is denoted as the second version in the package number (e.g. 1.2.3-4.5.6).

## Certified Package Designations

Services that are labeled as “Certified” have been tested by Mesosphere for interoperability with DC/OS, but Mesosphere disclaims all warranties, and makes no promises, including with respect to the services’ operation or production readiness. Support for the integration may be available from Mesosphere or the creator of the service. The matrix below lists certified packages and the current state of what packages are tested on what version of DC/OS, and what is within the best effort scope of our technical support organization. 

The designations are as follows:
![Closed Circle](1.11/img/closed-o.png) -- This combination is tested and compatible with the specified version of DC/OS.
      - This package is within the scope of our technical support organization.
      - This is package is eligible for bug fixes.

![Half-Filled Circle](1.11/img/half-filled-o.png)-- This combination has been tested previously and should be compatible with the specified version of DC/OS.
     - This combination is not within the scope of our technical support organization.
     - This combination is not eligible for bug fixes.

![Open Circle](1.11/img/open-o.png) -- This package combination has not been tested.
     - This combination is not within the scope of our technical support organization.
     - This combination is not eligible for bug fixes.

B -- This package combination is *beta*.      
    - Beta packages are not within the scope of our technical support organization.
    - Beta packages iterate quickly and are not eligible for bug fixes.

#Certified Packages and DC/OS Versions

<table class="table">
    <tr>
    <th><strong>DC/OS Package for:</strong></th>
    <th><strong>DC/OS 1.11</strong></th>
    <th><strong>DC/OS 1.10</strong></th>
    <th><strong>DC/OS 1.9</strong></th>
    <th><strong>DC/OS 1.8</strong></th
    </tr>
    <tr>
    	<td>Kafka 2.1.x-1.0.0</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Kafka 2.0.x-0.11.0</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td>◯</td>
    </tr>
    <tr>
    	<td>Kafka 2.0.x-1.0.0</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Kafka 1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
     <tr>
    	<td>Confluent-Kafka 2.1.x-3.3.x</td>
        <td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td>◯</td>
    </tr>
    <tr>
    	<td>Confluent-Kafka 2.0.x-3.2.x</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>Confluent-Kafka 1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	v
    </tr>
     <tr>
    	<td>Cassandra 2.1.x-3.0.15</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Cassandra 2.0.x-3.0.15</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>¹DataStax-DSE 2.1.x-*</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>¹DataStax-Ops 2.1.x-*</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td>◯</td>
    </tr>
    <tr>
    	<td>¹DataStax-DSE 2.0.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
     <tr>
    	<td>¹DataStax-Ops 2.0.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>DSE 1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>ElasticSearch 2.2.x-5.6.y</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td>◯</td>
    </tr>
      <tr>
    	<td>ElasticSearch 2.1.x-5.6.y</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>ElasticSearch 2.0.x-5.6.y</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>HDFS 2.1.x-2.6.y</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td>  </td>
    </tr>
     <tr>
    	<td>HDFS 2.0.x-2.6.y</td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>HDFS 1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Jenkins 3.4.x-2.89.y</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Jenkins 3.3.x-2.73.y</td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Jenkins 3.2.x-2.60.y</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
     <tr>
    	<td>Jenkins 3.1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
     <tr>
    	<td>Jenkins 3.0.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Jenkins 2.1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Jenkins 2.0.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>MoM (Marathon on Marathon) 1.6</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
        <td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
        <td><img src="1.11/img/open-o.png"></img></td>
    </tr>
     <tr>
    	<td>MoM (Marathon on Marathon) 1.5</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Edge-LB 1.0.0</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Edge-LB 0.1.9</td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Edge-LB 0.1.8</td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>
    <tr>
    	<td>Marathon-LB 1.11.x</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>    
     <tr>
    	<td>Marathon-LB 1.10.x</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
      <tr>
    	<td>Marathon-LB 1.2.* 1.9.*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>Spark 2.1.x-2.2.y</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>   
    <tr>
    	<td>Spark 2.0.x-2.2.y</td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/half-filled-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>   
    <tr>
    	<td>Spark 1.x-*</td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr> 
    <tr>
    	<td>Kafka-Zookeeper 2.0.x-3.4.11</td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/closed-o.png"></img></td>
    	<td><img src="1.11/img/open-o.png"></img></td>
    </tr>   
</table>

## Footnotes

1 - *Package maintained and technical support solely by DataStax Corporation*.