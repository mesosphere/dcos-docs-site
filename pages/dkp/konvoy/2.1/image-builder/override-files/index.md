---
layout: layout.pug
navigationTitle: Override Files
title: Override Files
excerpt: Learn how to use override files with Konvoy
beta: true
enterprise: false
menuWeight: 75
---

The [Konvoy Image Builder](../create-ami) uses yaml `override` files to configure specific attributes of your AMI file. These files provide information to override default values for certain parts of your AMI file. `override` files can modify the version and parameters of the image description and the ansible playbook.

There are 2 types of override files:

- Default override files provided by Konvoy for you to use for specific purposes.
- Custom override files you create to use with Konvoy.
