---
layout: layout.pug
navigationTitle:  Feature Maturity
title: Feature Maturity
menuWeight: 10
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

# <a name="lifecycle"></a>Mesosphere DC/OS Feature Maturity Lifecycle

This document gives guidance to Mesosphere customers, partners, users, and operators about Mesosphere's feature maturity lifecycle.  The guidelines below apply to the version of DC/OS and its catalog packages that this document resides in.

Mesosphere DC/OS features are either General Availability (GA) features or Beta features.

In order to determine if a feature should be used, a customer of Mesosphere DC/OS should carefully examine the ramifications of using the feature based on its Maturity State as described below.

## <a name="general_availability">General Availability

A feature that is Generally Available (GA) is recommended to be used by all consumers. A feature in this state of the maturity lifecycle should be considered for use in any customer deployment state including production.

1. GA features are ready for testing, evaluation, application development and production usage by the customer.
2. GA features may be continued to be enhanced and bugs or defects resolved.
3. API modifications will be under version control (V1, V2 etc).
4. For customers of DC/OS Enterprise, feedback and support should go through the methods outlined in the Mesosphere Support Terms.
5. For customers of DC/OS Open, feedback should go through Community channels.
6. GA feature modifications or maturity lifecycle changes can be found in the release notes.

## <a name="beta">Beta

Features that are labeled Beta are aimed at consumers that are looking to have early exposure to a given feature.  Typically, these features are primarily used for evaluation and non-production testing purposes or to provide feedback to Mesosphere.

1. Beta features are ready for customer or end-user testing and early validation of features and functionality.
2. Beta features may be changed, discontinued, or deprecated for any reason and at any time.
3. Beta features are still evolving and may contain bugs, errors, defects, or may require further enhancements. A beta feature may not have its abilities or APIs finalized.  
4. Beta features may be subject to reduced or different security, compliance and privacy commitments.
5. Beta features may be subject to reduced performance, scalability or capacity commitments.
6. Beta features are not guaranteed to be promoted from Beta to GA.
7. Feedback on beta features may be provided via non-standard channels like email, slack channels or community forums, based on testing, usage and experiences.

**Note**: Any use of a Beta version or feature of Mesosphere DC/OS Enterprise is subject to the [Evaluation Terms](https://mesosphere.com/mesosphere-support-terms/), to the exclusion of all other terms.

## <a name="prior-stages">Prior Lifecycle Stages

Prior to 1.10, GA features were called Stable features, and beta features were called Experimental or Preview features.

## <a name="not_a_warranty">Not a Warranty

The foregoing **does not** constitute a product warranty.  Mesosphere disclaims all warranties, either express or implied, with respect to the software and specifically disclaims any warranty that the functions contained in the software will meet a user’s requirements or that the operation of the software will be uninterrupted or error free.
