---
layout: layout.pug
navigationTitle:  Deploying Services and Pods
title: Deploying Services and Pods
menuWeight: 130
excerpt: Using Marathon to manage your processes and services
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: false
---

DC/OS uses Marathon to manage your processes and services.

Marathon is the "init system" for DC/OS. Marathon starts and monitors your applications and services, automatically healing failures.

A native Marathon instance is installed as a part of DC/OS installation. After DC/OS has started, you can manage the native Marathon instance through the DC/OS CLI with the [`dcos marathon`](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) command.

DC/OS services are Marathon applications that are deployed on DC/OS. DC/OS services are available from a package repository, such as the [Mesosphere {{ model.packageRepo }}](/mesosphere/dcos/1.14/overview/concepts/#mesosphere-universe), or you can create your own.

#  DC/OS Services

You can run DC/OS services you create or install a package from the [{{ model.packageRepo }}](/mesosphere/dcos/1.14/gui/catalog/). Both the services you create and those you install from {{ model.packageRepo }} appear on the **Services** tab of the DC/OS web interface when they are running.

Services you create yourself are administered by Marathon and can be configured and run [from the DC/OS CLI](/mesosphere/dcos/1.14/cli/command-reference/) with `dcos marathon` subcommands (e.g. `dcos marathon app add <myapp>.json`) or via the DC/OS web interface.

# {{ model.packageRepo }} Package Repository
Packaged DC/OS services created by Mesosphere or the community, like Spark or Kafka, appear on the **{{ model.packageRepo }}** tab of the DC/OS web interface, or you can search for a package from [the DC/OS CLI](/mesosphere/dcos/1.14/cli/command-reference/). You can configure and run {{ model.packageRepo }} services from the DC/OS web interface or via the DC/OS CLI with the [`dcos package install <package-name>`](/mesosphere/dcos/1.14/cli/command-reference/dcos-package/dcos-package-install/) command.
