---
layout: layout.pug
navigationTitle:  Multiple Regions
title: Multiple Regions
menuWeight: 10
excerpt: Experimenting with multiple region configurations
---

DC/OS does not currently support multiple region configurations. If you would like to experiment with multi-region configurations, this page provides the setup recommendations and caveats.

A typical DC/OS cluster has all master and agent nodes in the same zone. The cost of having masters spread across zones usually outweighs the benefits. The following multi-region setups have not been tested or verified.

# Single Region Masters and Cross-Region Agents
In this configuration, DC/OS masters are within a region, possibly spanning zones. DC/OS agents span multiple regions. This configuration is similar to masters in an on-prem data center, and agents running on-prem and on a public cloud.

## Recommendations and Caveats

- This setup is typically not recommended because it is difficult to guarantee the latency and addressing requirements. Masters within the region should be placed in different zones to tolerate zone failures. DC/OS service schedulers should be constrained to the region that contains the masters.

The total cross-sectional bandwidth between regions will be extremely limited. We do not recommend deploying single data (I/O) intensive DC/OS services across multiple regions. If the region that contains masters fails, apps in other regions will continue to run. However, app updates or rescheduling of failed apps is not possible until a quorum of masters come up.

# Cross-Region Masters and Cross-Region Agents
DC/OS masters and agents span multiple regions. This setup is similar to masters and agents spanning on-prem DC and public cloud.

## Recommendations and Caveats

This setup is typically not recommended because it is difficult to guarantee the latency and addressing requirements. It should only be considered if dedicated private connections between regions are available; for example, AWS Direct Connect or Azure Express Route. Since networking partitions are more likely across zones, masters could end up in split-brain scenario. For example: two different masters think they are the leader at the same time. This is typically harmless because only one leader is allowed to make modifiable actions like register or shutdown agents.
