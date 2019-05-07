---
layout: layout.pug
navigationTitle: Configuring Alert Manager
title: Configuring Alert Manager
menuWeight: 50
excerpt: Configuring Alert Manager
render: mustache
model: ../../data.yml
---

#include /services/include/beta-software-warning.tmpl

The Alert Manager bundled with the {{ model.techName }} service is off by default.
To run Alert Manager, you must configure it to pull the Alert Manager configurations from a Git repository.
This section explains how to configure Alert Manager.
