---
layout: layout.pug
navigationTitle:  Networking
title: Networking
menuWeight: 6
excerpt: Using the Network menu
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

The Networking screen provides a comprehensive view of the health of your virtual IP addresses (VIPs).


![Tweeter scaled](/1.14/img/GUI-Networking-Main.png)

Figure 1 - Networking tab

There are two sub-pages for the Networking interface: **Networks** and **Service Addresses**.

# Networks tab

The **Networks** tab lists the networks currently deployed on your cluster. This is the main view, by default. 

If you click on the name of a network, you can see the Networks detail page, with two tabs: **Tasks** and **Details**.

![Networks Detail](/1.14/img/GUI-Networking-Networks-Detail.png)

Figure 2 - Networks detail

## Tasks

The **Tasks** tab lists the following information:

| Name | Description |
|---------|--------------|
| Task |   |
| Container IP |        |
| Port Mappings |        |

## Details

The **Details** tab lists the following information:

| Name | Description |
|---------|--------------|
| Name |   |
| IP Subnet |        |

# Service Addresses tab

The Service Addresses tab displays a summary of the statistics for each network service address:

![Service Addresses tab](/1.14/img/GUI-Networking-Service-Addresses-Main.png)

Figure 3 - Service Addresses tab

| Name | Description |
|---------|--------------|
| Name |   |
| Successes |        |
| Failures | |
| Failure % | |
| P99 Latency |   |

## Service Addresses detail tabs

If you click on the name of a running service, you will access the **Backends** page, which will display more detail about the performance of the specified network.  

![Service Address Backends](/1.14/img/GUI-Networking-Service-Addresses-Backends.png)

Figure 4 - Backends page

The same information found in the **Service Addresses** page is displayed, but with a graphical representation and more detail.

If you click on the Name of the local IP address, you will access information about any clients.

![Service Address Detail 2](/1.14/img/GUI-Networking-Service-Addresses-Detail.png)

Figure 5 - Service Addresses detail page showing clients


# Creating a VIP

DC/OS can map traffic from a single Virtual IP (VIP) to multiple IP addresses and ports. 

For detailed information on creating a virtual IP, see the [Networking documentation](/1.14/networking/load-balancing-vips/virtual-ip-addresses/#creating-a-vip).
.