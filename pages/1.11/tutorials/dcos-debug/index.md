---
layout: layout.pug
title: DC/OS Debugging Applications
excerpt: DC/OS is a powerful platform for deploying and managing applications, but what can you do if your app is failing or not even deploying?
menuWeight: 55
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>Important:</b> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is to demonstrate capabilities, and may not be suited for use in a production environment. Before using a similar solution in your environment, you must adapt, validate, and test.</td> </tr> </table>

DC/OS provides a platform for running complex distributed systems both for Big Data applications and also custom containerized applications. But what happens if your application keeps failing? Debugging in distributed systems is always difficult and while DC/OS provides a number of tools for debugging, it might be difficult to choose which of these tools to apply in which situation.

This tutorial provides an overview to debugging applications and their deployments on DC/OS.

This tutorial should not be considered an exhaustive resource for debugging on DC/OS, but rather a starting point.

You should have a working knowledge of DC/OS in order to complete this tutorial. There are plenty of other [tutorials](/1.11/tutorials/) to get you up and running with DC/OS.

Expecting failures and preparing for it, is probably to most important tip for working with distributed system (and as such also a design criteria for DC/OS). So a few of the most important steps are – hopefully – happening before the actual debugging:

- Design your applications for debuggability
- Follow best practices for deployments
- Set up monitoring and alerts so you can resolve issues as early as possible

 We will first look at [some potential problems](#problems) you might face when deploying an application on DC/OS. Next, we will look at the [standard set of tools](#tools) for debugging. Then, after introducing [a general strategy for using those tools](#strategy), we have two [concrete examples](#examples) to illustrate how the strategy works in practice.

We encourage everyone to first try debugging these yourself, but we also provide detailed guidance for debugging them.

<a name=problems></a>

# Problems with Application Deployment on DC/OS

<a name=tools></a>

# Tools for Application Deployment Debugging on DC/OS

<a name=strategy></a>

# Deployment Debugging on DC/OS: General Strategy

<a name=examples></a>

# Deployment Debugging on DC/OS: Hands On
