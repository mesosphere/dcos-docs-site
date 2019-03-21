---
# layout: layout.pug
navigationTitle: Mesosphere Release Notes Proposal
title: Mesosphere Release Notes Proposal
menuWeight: 0
excerpt: Background and suggestions for improving the content in release notes
---
29 January 2019

# Purpose
The purpose of this proposal is to start a conversation about ways to improve the information we provide in the form of release notes. To be effective, release notes depend on a collaborative effort that draws on the strengths of people in different roles:

* the engineers’ technical expertise
* the product managers’ awareness of customer requirements and industry landscape
* the writers’ language skills
* the release team’s commitment to coordinating, scheduling, and delivering quality products
* the support and customer success groups’ experience communicating directly with customers

# Motivation
How do we provide the best experience for casual explorers, prospects, serious-but-unsold browsers, internal audiences, and (of course) existing and new customers?

### What we have right now
* Presents a laundry list of issues organized under product areas or components
* Tends to be thin on content, that is, more terse than it is concise
* Uses jargon or “insider” terminology
* Leans toward negative descriptions of what was wrong
* Leans toward passive and impersonal constructions
* Weights issue-tracking identifiers over issue descriptions
* Doesn’t always prioritize or scrub which issues should be exposed or highlighted
* Blurs distinctions between types of information (it isn’t always clear what items fit where--is it a fixed issue, a customary advisory, a notable change?)
* Lacks context for someone coming to the document for the first time

### Survey
What we have is not radically different from what other vendors doing. However, the best solutions in the commercial space provide more consistently robust content in describing fixes and features. 

In general, the release notes I surveyed provide better descriptions of changes than we do.
[Openshift](https://docs.openshift.com/container-platform/3.9/release_notes/ocp_3_9_release_notes.html#ocp-3-9-27)
[Pivotal](https://docs.pivotal.io/pivotalcf/2-3/pcf-release-notes/index.html )
[Confluent](https://docs.confluent.io/current/release-notes.html#)
[Databricks](https://docs.confluent.io/current/release-notes.html#)
[Portworx](https://docsnew.portworx.com/reference/release-notes/px-enterprise#12116-release-notes)

Just to round things out, I also looked at release notes for [Amazon EC2](https://aws.amazon.com/releasenotes/?tag=releasenotes%23keywords%23amazon-ec2), [Azure](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/whats-new), [Google Cloud](https://cloud.google.com/compute/docs/release-notes), and [Splunk Enterprise](http://docs.splunk.com/Documentation/ES/5.2.0/RN/Enhancements). For frequently released software, the number of items documented was relatively small but the descriptions were often fairly detailed.

### Content suggestions
There are a few content-driven changes we could make to improve the release notes:
* Slant descriptions toward positive statements, whenever possible. A fix improves the product in some way. Let’s not be shy about it.
* Release notes should have a statement that sets context in some way. The statement could be one sentence, boilerplate content, or an overview of some kind (release summary, highlights, themes).

### Style suggestions
There are a few stylistic and formatting changes we could make to improve the release notes:
* Use sentence style capitalization for headings. It’s easier to read than initial capitalization and reduces the chance of misuse.
* Use active voice with explicit sentence subjects, whenever possible. It’s easier to read, comprehend, and (usually) translate.

## Executive summary and samples
The two sample excerpts illustrate:
* Setting context with an introductory paragraph
* Using simplified broad categories
* Using descriptive phrases to organize release features, fixes, issues
* Providing active and declarative statements about what changed and why
* Deemphasizing tracking IDs by moving them after the related content

It would be useful to have JQL queries that return the issues for each section:

### New features and capabilities
This section is primarily for major releases, but occasionally minor and patch releases include “bug fixes” that could be considered “features” because of how they are implemented. For “grey areas” and the major release feature categories, product management should provide guidance and recommendations about how to group the information (for example, by theme, component area, or team).

**Sample query** for new features to be documented:

<code>issuetype = Feature and (fixVersion = "DC/OS 1.12.1" OR (fixVersion = "DC/OS 1.12" and status = Resolved))</code>

### Issues fixed in this release
**Sample query** for issues fixed for DC/OS 1.12.1 that need to be evaluated for release notes:

<code>fixVersion = "DC/OS 1.12.1" AND status in (Resolved, "Engineering - Awaiting Release") AND reporter != automation-bot AND resolution in (Done, Released)</code>

### Known issues and limitations
**Sample query** for issues that are intended for DC/OS 1.12 but that have not been resolved:

<code>fixVersion in versionMatches("DC/OS 1.12") AND resolution is EMPTY AND reporter != automation-bot</code>

### Customer Advisory 
This section lists resources (Knowledge Base articles) from Mesosphere’s support site that are essential for customers to be aware of in a particular release.

# Additional process suggestions
1. Add a required JIRA field to identify as early as possible the potential issues to include.
    Release note: Yes / No / Don’t know

    If the Release note field selection in **Yes**, add the required field(s) to help fill out the description.

1. Add more information to the description for each issue.
    * Symptom or problem reported

        What was the observed behavior and why (if not readily apparent) it is a problem?

        In most cases, the Summary or Description fields might be sufficient, but in some cases, the real issue is the eventual outcome related to the symptom. For example, if there is a memory leak, the problem isn’t probably just the leak, but the eventual effect of the leak that might mean issues with application availability, reliability, and performance, a system becoming unstable or unusable, or services crashing in an unrecoverable state.

    * Root cause for the problem reported

        What causes the observed behavior?

        If engineering can’t identify the root cause of an issue, we should try to describe any correlated events that might help to troubleshoot the problem (as a customer, I want to know if an issue that’s been fixed is the same as or similar to a problem I’m experiencing).

    * Fix implemented to resolve the problem reported

        What specific changes were made to fix the observed behavior?

        It would be helpful to provide some direction about what actually changed: is it a new user-facing configuration parameter? An internal code change that isn’t user-visible like a flag or timer that is set programmatically? A library update?

    If we were to add the fields and adjust the issue resolution process to use them, a JIRA query could pull out issues flagged with Release note = Yes to include the symptom/cause/fix information as a starting point for documenting the issue.

1. Review and re-use the description of individual issues.

    JIRA tickets <> Release Notes: Review and re-use the description of individual issues from the JIRA tickets to the corresponding issues listed in the Release Notes to maintain content consistency.

    In case of missing descriptions, contact the bug/issue reporter/assignee for information and document the description in JIRA ticket and Release Notes.
