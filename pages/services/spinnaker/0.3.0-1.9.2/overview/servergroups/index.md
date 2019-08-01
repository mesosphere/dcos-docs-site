---
layout: layout.pug
navigationTitle: Server Groups
excerpt: Using Spinnaker applications and server groups
title: Applications and Server Groups
menuWeight: 6
model: /services/spinnaker/data.yml
render: mustache
---

# Concepts

The following three concept pictures are from Will Gorman's [Mesoscon presentation](
http://events.linuxfoundation.org/sites/events/files/slides/Continuous%20Delivery%20for%20DC%3AOS%20%20with%20Spinnaker.pdf). They introduce the key concepts that we will use in the following section.

A {{ model.techName }} **application** contains **(0-n)** **clusters**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs-c01.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs-c01.png)

Figure 1. {{ model.techName }} application concept

A {{ model.techName }} **cluster** contains **(1-n)** **server groups**, and each **server group** contains **(0-n)** **service instances**. Each server group represents a new version of the cluster.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs-c02.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs-c02.png)

Figure 2. {{ model.techName }} cluster view

A {{ model.techName }} **server group** maps (1-1) to a DC/OS **service** (aka Marathon app).

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs-c03.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs-c03.png)

Figure 3. {{ model.techName }} server group


# Applications and Server Groups

This section contains instructions for

* [Creating an Application](#creating-an-application)
* [Creating a Server Group](#creating-a-server-group)
* [Creating a Server Group Version](#creating-a-new-server-group-version)


## Creating an Application

1. On the {{ model.techName }} home page, select the **Applications** screen. There you select the **Create Application** action.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs01.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs01.png)

Figure 4. Applications screen

2. In the **New Application** dialog type `myapp` for the **Name** and `xxx@yyy.zzz` for the **Owner Email**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs02.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs02.png)

Figure 5. New application dialog

The new Application `myapp` shows up in the **Applications** list. Select `myapp` to open the app.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs03.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs03.png)

Figure 6. New app in Applications screen

<a name="creating-a-server-group"></a>

## Creating a Server Group

A server group is a DC/OS service (or Marathon app), so most of the information you have to fill in below will be familiar to you from creating Marathon `json` definitions.

1. In the **myapp > Clusters** view select the **Create Server Group** button.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs04.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs04.png)

Figure 7. Clusters view screen

2. Under **Basic Settings**, enter the **dcos Account** and **dcos Region** you want to create the server group in. 

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs05.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs05.png)

Figure 8. Basic Settings screen

3. Select the name of the **Stack**. The {{ model.techName }} application name plus stack name make the cluster name, in our case `myapp-prod`.

4. In **Container Settings** select `nginx:1.11` for the image to use.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs06.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs06.png)

Figure 9. Container Settings screen

5. In **Network** select `Bridge` for **Network Type** and port `80` for **Container Port**. Set `web` for service endpoint **Name**.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs07.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs07.png)

Figure 10. Network Settings screen

6. In **Health Checks** define a health check specifying `/` for **Path** and `0` for **Port Index**. 

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs08.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs08.png)

Figure 11. Health Checks screen

7. Select **Create** to create the server group.

In the **myapp > Clusters** view, you will see the new cluster with one server group containing one instance, that is, one **nginx** server running in our sample.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs09.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs09.png)

Figure 12. New cluster with server group

## Creating a Server Group Version

1. Repeat steps 1 - 4 in [Creating a Server Group](#creating-a-server-group). Choose the same **dcos Account**, same **dcos Region**, and same name for **Stack** as before.
1. In **Container Settings**, select `nginx:1.12` for the image. 
1. For the other sections, choose the same settings we used in [Creating a Server Group](#creating-a-server-group).
1. Choose **Create** to create another version of the server group.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs10.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs10.png)

Figure 13. New server group version Container Image

The **myapp > Clusters** view now shows that our cluster runs two server group versions, `V000` and `V001`. Later, we will show how you can leverage this capability in blue-green deployments.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs11.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs11.png)

Figure 14. New server group version

The following image shows how our two server group versions look on the DC/OS web interface. They are now running as DC/OS services, with the name made of the combined cluster name and version number; in this example they are `myapp-prod-V000` and `myapp-prod-v001`.

[<img src="/services/spinnaker/0.3.0-1.9.2/img/acs12.png"/>](/mesosphere/dcos/services/spinnaker/0.3.0-1.9.2/img/acs12.png)

Figure 15. Spinnaker server groups on DC/OS web interface
