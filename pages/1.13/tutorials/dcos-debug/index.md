---
layout: layout.pug
navigationTitle:  Debugging Applications on DC/OS
title: Tutorial -  Debugging Applications on DC/OS
excerpt: Debugging application deployment issues in distributed systems
menuWeight: 55
---

<!-- i. Support Disclaimer -->

#include /include/tutorial-disclaimer.tmpl

<!-- ii. Intro/Set Expectations for this Tutorial -->

This tutorial merely aims to provide a top-down introduction to debugging applications during and after their deployment on DC/OS. It should not be considered an exhaustive resource for debugging on DC/OS, but rather a starting point.

Debugging application deployment issues in distributed systems is often a challenging task. While DC/OS provides a number of tools for debugging, it might be difficult to choose which tool to apply in your particular situation. You should have a working knowledge of DC/OS in order to complete this tutorial. However, if needed there are plenty of other [tutorials to get you up and running](/latest/tutorials/).

It can be encouraging to keep in mind that failures are highly likely when working with distributed systems. Many components must be configured to precise specifications to function together as intended. This takes detailed  preparation and awareness during installation and initial configuration. Fortunately, this also means that by putting extra care in the general design of the application architecture can potentially prevent many bugs from even arising:

- [Design your applications for debuggability](https://schd.ws/hosted_files/mesosconeu17/a6/MesosCon%20EU%202017%20University%20Slides.pdf)
- [Follow best practices for deployments](https://mesosphere.com/blog/improving-your-deployments/)
- [Set up monitoring and alerts so you can resolve issues as early as possible](https://docs.mesosphere.com/1.10/cli/command-reference/dcos-node/dcos-node-diagnostics/)

We will first look at [some potential problems](/tutorials/dcos-debug/problems/) you might face when deploying an application on DC/OS. Next, we will look at the [standard set of tools](/tutorials/dcos-debug/tools/) for debugging. Then, after introducing [a general strategy for using those tools](/tutorials/dcos-debug/gen-strat/), we have two [concrete examples](/tutorials/dcos-debug/scenarios/) to illustrate how the strategy works in practice. We encourage you to first try debugging these challenges yourself, but we also provide detailed guidance for debugging them as well. There are even more scenarios like these in the [dcos-debugging github repository](https://github.com/dcos-labs/dcos-debugging/tree/master/1.10/). Also please feel free to contribute your own debugging scenarios to this repository.
