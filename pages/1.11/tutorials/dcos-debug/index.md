---
layout: layout.pug
title: Debugging Applications on DC/OS
excerpt: What can you do if your app is failing to deploy as expected?
menuWeight: 55
---

<!-- i. Support Disclaimer -->

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>Important:</b> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is to demonstrate capabilities, and may not be suited for use in a production environment. Before using a similar solution in your environment, you must adapt, validate, and test.</td> </tr> </table>

<!-- ii. Intro/Set Expectations for this Tutorial -->

Debugging application deployment issues in distributed systems is often a challenging task. While DC/OS provides a number of tools for debugging, it might be difficult to choose which tool to apply in your particular situation.

This tutorial only aims to provide a top-down introduction to debugging applications during and after their deployment on DC/OS. As such, it should not be considered an exhaustive resource for debugging on DC/OS, but rather a starting point.

You should have a working knowledge of DC/OS in order to complete this tutorial. However, if needed there are plenty of other [tutorials to get you up and running](/1.11/tutorials/).

It can be encouraging to keep in mind that failures are highly likely when working with distributed systems. Many components must be configured to precise specifications to function together as intended. This takes detailed  preparation and awareness during installation and initial configuration. Fortunately, this also means that by putting extra care in the general design of the application architecture can potentially prevent many bugs from even arising:

- [Design your applications for debuggability](https://schd.ws/hosted_files/mesosconeu17/a6/MesosCon%20EU%202017%20University%20Slides.pdf)
- [Follow best practices for deployments](https://mesosphere.com/blog/improving-your-deployments/)
- [Set up monitoring and alerts so you can resolve issues as early as possible](https://docs.mesosphere.com/1.10/cli/command-reference/dcos-node/dcos-node-diagnostics/)

We will first look at [some potential problems](#problems) you might face when deploying an application on DC/OS. Next, we will look at the [standard set of tools](#tools) for debugging. Then, after introducing [a general strategy for using those tools](#strategy), we have two [concrete examples](#hands-on) to illustrate how the strategy works in practice.

We encourage everyone to first try debugging these challenges yourself, but we also provide detailed guidance for debugging them.
