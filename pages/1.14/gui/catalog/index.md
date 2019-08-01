---
layout: layout.pug
navigationTitle: Catalog
title: Catalog
menuWeight: 4
excerpt: The Catalog page shows all the services that run on DC/OS
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

The {{ model.packageRepo }} page shows all of the available DC/OS services. You can install packages from the DC/OS {{ model.packageRepo }} with a single click. The packages can be installed with defaults or customized directly in the user interface.

# Types of packages

Mesosphere offers two kinds of service packages: Certified and Community.

## Certified packages

Certified packages are verified by Mesosphere to be interoperable with DC/OS. 

![Certified packages](/mesosphere/dcos/1.14/img/GUI-Catalog-Certified-Services-1_14.png)

Figure 1 - Certified packages


Documentation supporting these certified packages can be found on the [DC/OS Service Docs page](https://docs.mesosphere.com/services/).

## Community packages

Community packages have been contributed by Mesosphere partners and members of the open source community. They are not verified by Mesosphere to be interoperable with DC/OS. However, they offer many functions not available in the Certified {{ model.packageRepo }}. New packages are offered on a regular basis. Some of them have Mesosphere-specific documentation available on the [DC/OS Service Docs page](https://docs.mesosphere.com/services/).

![Community packages](/mesosphere/dcos/1.14/img/GUI-Catalog-Community-Packages-1_14.png)

Figure 2 - Community packages

# Search {{ model.packageRepo }}

You can search the entire {{ model.packageRepo }} from the Search box at the top of the page.

![Search box](/mesosphere/dcos/1.14/img/GUI-Catalog-Search-1_14.png)

Figure 3 - Search box

# Installing from the {{ model.packageRepo }}

You can run DC/OS services you create or install a package from the {{ model.packageRepo }}. Both the services you create and those you install from the {{ model.packageRepo }} appear on the [Services](/mesosphere/dcos/1.14/gui/services/) tab of the DC/OS UI when they are running.

The quick and easy way to install a service is from the {{ model.packageRepo }} page. 

1.  Navigate to the [**{{ model.packageRepo }}**](/mesosphere/dcos/1.14/gui/catalog/) tab in the DC/OS UI.

    ![Certified packages](/mesosphere/dcos/1.14/img/GUI-Catalog-Certified-Services-1_14.png)

    Figure 4 - {{ model.packageRepo }} tab

1. Click on a package.
    
1. Review the Preinstall notes, if any. Make sure your cluster meets the requirements listed. Click **REVIEW & RUN**.
    
1. Edit the configuration as necessary. 

1. Click **REVIEW & RUN** again and review your configuration. When you are satisfied, click **RUN SERVICE**.

1. Watch your service being deployed from the [Services](/mesosphere/dcos/1.14/gui/services/) tab.

    ![Services deploying](/mesosphere/dcos/1.14/img/GUI-Services-Running_Services_View-1_12.png)

    Figure 5 - Services deploying

For more details about installing, configuring and deploying services from the {{ model.packageRepo }}, see the [Deploying Services documentation](/mesosphere/dcos/1.14/deploying-services/#dcos-services). 

