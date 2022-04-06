---
layout: layout.pug
navigationTitle: Project Network Policies
title: Project Network Policies
menuWeight: 8
excerpt: Projects are created with a secure-by-default network policy and users needing more flexibility can edit or add more policies to tailor to their unique security needs.
---

Cluster networking is a critical and central part of Kubernetes that can also be quite challenging. All network communication within and between clusters depends on the presence of a Container Network Interface (CNI) plugin.

## About Network Plugins

Network plugins ensure that Kubernetes networking requirements are met and surface features needed by network administrators, such as enforcing network policies. Common Network Plugins include Flannel, Calico, and Weave among many others. As an example, D2iQ&reg; Konvoy&reg; uses the Calico CNI plugin by default, but can support others.

Since pods are short-lived, the cluster needs a way to configure the network dynamically as pods are created and destroyed. Plugins provision and manage IP addresses to interfaces and let administrators manage IPs and their assignments to containers, in addition to connections to more than one host, when needed.

## About Network Policies

By default, and to enable fluid communications within and between clusters, all traffic is authorized between nodes and pods. Most production environments require some kind of traffic flow control at the IP address or port level. An application-centric approach to this uses Network Policies. Pods are isolated by having a Network Policy that selects them, and the configuration of the policy limits the kind of traffic they can receive or send. Network policies do not conflict because they are additive. Pods selected by more than one policy are subject to the union of the policies' ingress and egress rules.

A Network Policy's rules define ingress and egress for network communications between pods and across namespaces. Successful traffic control using network policies is bi-directional. You have to configure both the egress policy on the source pod and the ingress policy on the destination pod to enable the traffic. If either end denies the traffic, it will not flow between the pods.

Since the Kubernetes default is to allow all traffic, it is a common practice to create a default "deny all traffic" rule, and then specifically open up some combination of the pods, ports, and applications as needed.

## Creating Network Policies

You create network policies in three main parts:

- General information
- Ingress rules
- Egress rules

### General information section

The fields in this part of the form allow you to create a name and description for this policy. Creating a detailed **Description** helps to keep policy functions understandable for additional use and maintenance.

This section also contains the **Pod Selector** fields for selecting pods using either Labels or Expressions. **Labels** added to pod declarations are a common means of identifying individual pods, or creating groups of pods, in a Kubernetes cluster. **Expressions** are similar to Labels, but allow you to define parameters that identify a range of pods.

The **Policy Types** selections help to define the type of Network Policy you are creating:

- **Default** - automatically includes ingress, and egress is set only if the network policy defines egress rules.
- **Ingress** - this policy applies to ingress traffic for the selected pods, to namespaces using the options you define below, or both.
- **Egress** - this policy applies to egress traffic for the selected pods, to namespaces using the options you define below, or both.

If the Default policy type is too rigid or does not offer what you need, you can select the Ingress or Egress type, or both, and explicitly define the policy with the options that follow. For example, if you do not want this policy to apply to ingress traffic, you would select only Egress, and then define the policy.

To deny all ingress traffic, select the **Ingress** option here and then leave the ingress rules empty.

To deny all egress traffic, select the **Egress** option here and then leave the egress rules empty.

### Ingress rules section

Ingress rules use a combination of **Port** / **Protocol** and **Source** to define the incoming traffic allowed to some or all of the pods in this namespace.

The options under **Sources: From** enable you to define a source either by using the pod selector or by defining an IP block. When using the pod selector method, you can define the namespace, the pods within that namespace, or both.

**Namespaces** - Selecting a namespace in an ingress rule source permits the pods selected by the pod selector, in your selected namespaces, to receive incoming traffic that meets the other defined criteria. If you have not selected any pods, the rule permits traffic from all pods in the selected namespaces.

**Pods** - This option selects specific Pods which should be allowed as ingress sources or egress destinations. If you have not selected any namespaces in the namespace selector, this option selects all matching pods in the project namespace. Otherwise, this option selects all matching pods in the selected namespaces.

There also are options to select all namespaces, all pods, or both.

When defining ingress rules using the IP Block method, you define a CIDR and exception conditions. CIDR stands for Classless Inter-Domain Routing and is an IP standard for creating unique network and device identifiers. When grouped together so that they share an initial sequence of bits in their binary representation, the range of addresses creates a CIDR block. The block identity is in an IPv4-like notation including a dotted-decimal address, followed by a slash, then a colon and a number from 0 through 32, for example, 127.0.26.33:31.

### Egress rules section

Egress rules use a similar combination of options to define the outgoing traffic from pods, ranges of pods, or namespaces in a Kommander Project. Port, Protocol, and Destination options for egress rules define the outgoing traffic. You can define your egress rules under  **Destination: To**. Ensure the egress policy on the source pods, and the ingress policy on the destination pods, permit traffic in order for the pods to be able to communicate over the network.

## Network Policy Examples

<p class="message--important"><strong>IMPORTANT: </strong>Before you begin each example, ensure you're on the Network Policy page for your project</p>

To navigate to your project's Network Policy page:

1. From the top menu bar, select your target workspace.
1. Select **Projects** from the sidebar menu.
1. Select your project from the list.
1. Select the **Network Policy** tab.

### Ingress: Permit access to API service pods from all namespaces

Suppose you need to create a network policy to permit incoming traffic to API service pods in a specific Kommander Project's namespace from any other pod in any namespace that has the label, `service.corp/users-api-role: client`. For this example, API service pods are those pods created with the Label, `service.corp/users-api-role: api`.

You can limit the policy to just incoming traffic from select namespaces by adding an ingress rule with these characteristics:

- Use Port 8080 to receive incoming TCP traffic
- Refuse traffic from pods unless they are client pods that have a specific Label, such as `service.corp/users-api-role: client`. This example follows a common microservice architecture pattern, microservice-tier-role: access_mode

#### Configure the general information to access API service pods

1. Select the **+ Create Network Policy** button.
1. Type "microsvc-users-api-allow" in the **ID Name** field.
1. Type "Allow Users microservice clients to reach the APIs provided in this namespace" in the **Description** field.
1. Select **Add** under **Pod Selector** and then select **Match Label**.
1. Set the **Key** to "service.corp/users-api-role" and the **Value** to "API".

#### Create an Ingress rule to access API service pods

1. Leave **Policy Types** set to Default.
1. Scroll down to **Ingress Rules** and select **+ Add an Ingress Rule**.
1. Select **+ Add Port**, and set the **Port** to 8080 and the **Protocol** to TCP.

#### Add Sources to access API service pods

1. Select **+ Add Source** and mark the **Select All Namespaces** check box.
1. Select **+ Add Pod Selector**.
1. Select **Match Label**.
1. Set the **Key** value to "service.corp/users-api-role" and set the **Value** to "client".
1. Scroll up and select **Save**.

### Ingress: Limit pods that access a database to this namespace

Suppose that while deploying an application in a project, you want to protect its database pods by permitting ingress only from API service pods in the current namespace, and prevent ingress from pods in any other namespace.

You can limit the database pods to just the incoming traffic from the current namespaces by adding an ingress rule with these characteristics:

- Use Port 3306 to receive incoming TCP traffic for pods that have the label, `tier: database`
- Refuse traffic from pods unless they have the label, `tier: api`

#### Configure the general information to access a database

1. Select the **+ Create Network Policy** button.
1. Type "database-access-api-only" in the **ID name** field.
1. Type "Allow MySQL access only from API pods in this namespace" in the **Description** field.
1. Select **Pod Selector** then select **Match Label**.
1. Set the **Key** to "tier" and the **Value** to "database".

#### Create an Ingress rule to access a database

1. Select Default for the **Policy Types**.
1. Scroll down to the **Ingress** section.
1. Select **+ Add Ingress Rule**, then select **+ Add Port**.
1. Set the **Port** to "3306" and leave the **Protocol** set to "TCP".

#### Add Sources to access a database

1. Select **+ Add Source**.
1. Select **+ Add Pod Selector**.
1. Select **Match Label** and set the **Key** to "tier" and the **Value** to "API".
1. Scroll up and select **Save**.

### Ingress: Disable but don’t delete ingress rules

Suppose that you want to disable ingress rules temporarily for testing or triaging purposes.

First, you need to create a network policy with one or more ingress rules. You could follow one of the preceding procedures, for example. Then, you need to edit the policy to match the following example:

#### Edit your Network Policy

1. In the table row belonging to your network policy, click the context menu at the right of the row and select **Edit**.

#### Disable Ingress rules

1. Update the **Policy Types** so that only **Egress** is selected. If you don’t want to deny _all_ egress traffic, ensure that you add an egress rule that suits your preferred level of access. You can add an empty rule to allow all egress traffic.
1. Scroll up and select **Save**.

### Egress: Deny all egress traffic from restricted pods

Suppose that you need to deny all egress traffic from a group of restricted pods. This is a simple egress rule and you can create it following this example and steps:

#### Configure the General Information to deny Egress

1. Select **+ Add Network Policy**.
1. Type "deny-restricted-egress" in the **ID name** field.
1. Type "Deny egress traffic from restricted pods" in the **Description** field.
1. Select **Pod selector** then select **Match Label.**
1. Set the **Key** to "access" and the **Value** to "restricted".

#### Deny Egress traffic

1. Update the **Policy Types** so that only **Egress** is selected. Do not add any egress rules.
1. Scroll up and select **Save**.
