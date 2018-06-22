---
layout: layout.pug
navigationTitle:  Installing, Patching, and Upgrading
title: Installing, Patching, and Upgrading
menuWeight: 30
excerpt:

---

The installation of DC/OS involves configuring your infrastructure and installing DC/OS bits on top. Some installation methods will configure your infrastructure for you, which results in limited functionality or control. These installation methods should be used for trials and proof of concept(s) only. 

# Types of Installation methods

Use the following installation methods based on your requirements:

- The Local installation method is for first-time users or developers who are interested to build services or modify DC/OS. The [Vagrant installer](https://docs.mesosphere.com/1.8/administration/installing/oss/local/) provides a quick, free way to deploy a virtual cluster on a single machine.

- The Trial installation method is used to test or demo DC/OS on Azure, AWS, GCE, Digital Ocean, or Packet. These clusters cannot be upgraded and functionality may be limited. The Trial installation method was previously called as Cloud Installation.


- The Production installation method is used for fully functional clusters on any infrastructure including on premise, public or private clouds. This is a flexible way to configure and install DC/OS on a cluster. This method supports DC/OS upgrade. The Production installation method was previously called as Custom Installation. 


