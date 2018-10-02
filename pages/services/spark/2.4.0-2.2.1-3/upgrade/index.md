---
layout: layout.pug
navigationTitle: Upgrade
excerpt: Upgrading DC/OS Apache Spark
title: Upgrade
menuWeight: 50
featureMaturity:
render: mustache
model: /services/spark/data.yml
---
The only way currently to upgrade your version of DC/OS {{ model.techName }} is to first uninstall it, then re-install it. 

1. Go to the **Universe** > **Installed** page of the DC/OS web interface. Hover over your {{ model.techShortName }} Service to see the **Uninstall** button, then select it. 

   Alternatively, enter the following from the DC/OS CLI:

        dcos package uninstall spark

1. Verify that you no longer see your {{ model.techShortName }} service on the **Services** page.
1. Reinstall {{ model.techShortName }}.

        dcos package install spark
