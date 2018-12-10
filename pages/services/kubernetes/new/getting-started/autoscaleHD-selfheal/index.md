---
layout: layout.pug
navigationTitle: Autoscaling, Self-healing, High Density
title: Autoscaling, Self-healing HD DC/OS Kubernetes clusters
menuWeight: 15
excerpt: Learn to demonstrate High Density DC/OS Kubernetes clusters autoscaling and self-healing features in action.
---

Scaling your Kubernetes Cluster

Using the UI
From the UI, go to Services > kubernetes-cluster1 and select edit

Under "kubernetes" in left hand menu, make your cluster adjustments

For this exercise, change the integer corresponding to `private_node_count` to `2` and `public_node_count` to `1`:


Click Review and Run > Run Service to complete scaling your Kubernetes cluster. Check the UI afterwards to see that the cluster scaled:

Using the CLI:
Modify your designated options.json to make your cluster adjustments and save as options-scale.json

For this exercise, change the number of private_node_count to 2 and public_node_count to 1.

{
    "service": {
        "name": "kubernetes-cluster1",
        "service_account": "kubernetes-cluster1",
        "service_account_secret": "kubernetes-cluster1/sa"
    },
    "kubernetes": {
        "authorization_mode": "AlwaysAllow",
        "control_plane_placement": "[[\"hostname\", \"UNIQUE\"]]",
        "control_plane_reserved_resources": {
            "cpus": 1.5,
            "disk": 10240,
            "mem": 4096
        },
        "high_availability": false,
        "private_node_count": 2,
        "private_node_placement": "",
        "private_reserved_resources": {
            "kube_cpus": 2,
            "kube_disk": 10240,
            "kube_mem": 2048,
            "system_cpus": 1,
            "system_mem": 1024
        },
        "public_node_count": 1,
        "public_node_placement": "",
        "public_reserved_resources": {
            "kube_cpus": 0.5,
            "kube_disk": 2048,
            "kube_mem": 512,
            "system_cpus": 1,
            "system_mem": 1024
        }
    }
}
Scale your Cluster:

dcos kubernetes cluster update --cluster-name=kubernetes-cluster1 --options=options-scale.json
The output should look similar to below:

$ dcos kubernetes cluster update --cluster-name=kubernetes-cluster1 --options=options-scale.json
Using Kubernetes cluster: kubernetes-cluster1
The following differences were detected between service configurations (CHANGED, CURRENT):
 {
   "kubernetes": {
     "authorization_mode": "AlwaysAllow",
     "control_plane_placement": "[["hostname", "UNIQUE"]]",
     "control_plane_reserved_resources": {
       "cpus": 1.5,
       "disk": 10240,
       "mem": 4096
     },
     "high_availability": false,
-    "private_node_count": 1,
+    "private_node_count": 2,
     "private_node_placement": "",
     "private_reserved_resources": {
       "kube_cpus": 2,
       "kube_disk": 10240,
       "kube_mem": 2048,
       "system_cpus": 1,
       "system_mem": 1024
     }
   },
+  "public_node_count": 1,
+  "public_node_placement": "",
+  "public_reserved_resources": {
+    "kube_cpus": 0.5,
+    "kube_disk": 2048,
+    "kube_mem": 512,
+    "system_cpus": 1,
+    "system_mem": 1024
+  },
   "service": {
     "name": "kubernetes-cluster1",
     "service_account": "kubernetes-cluster1",
     "service_account_secret": "kubernetes-cluster1/sa"
   },
+  "public_node_count": 1,
+  "public_node_placement": "",
+  "public_reserved_resources": {
+    "kube_cpus": 0.5,
+    "kube_disk": 2048,
+    "kube_mem": 512,
+    "system_cpus": 1,
+    "system_mem": 1024
+  }
 }

The components of the cluster will be updated according to the changes in the
options file [options-scale.json].

Updating these components means the Kubernetes cluster may experience some
downtime or, in the worst-case scenario, cease to function properly.
Before updating proceed cautiously and always backup your data.
This operation is long-running and has to run to completion.
Continue cluster update? [yes/no]: yes
2018/11/01 17:03:53 starting update process...
2018/11/01 17:03:54 waiting for update to finish...
2018/11/01 17:05:25 update complete!
Automated Self Healing
Kubernetes with DC/OS includes automated self-healing of Kubernetes infrastructure.

We can demo this by killing the etcd-0 component of one of the Kubernetes cluster

List your Kubernetes tasks:

dcos task | grep etcd
Output should resemble below

$ dcos task | grep etcd
etcd-0-peer                                    172.12.25.146   root     R    kubernetes-cluster2__etcd-0-peer__c09966b0-379e-4519-ae10-5683db4926b0                           fc11bc38-dd26-4fbb-9011-cca26231f64b-S0  us-west-2  us-west-2b
etcd-0-peer                                    172.12.25.146   root     R    kubernetes-cluster1__etcd-0-peer__98e0bc46-a7d7-4553-8749-a9bafb624ae1                           fc11bc38-dd26-4fbb-9011-cca26231f64b-S0  us-west-2  us-west-2b
Navigate to the DC/OS UI: Navigate to the DC/OS UI > Services > Kubernetes tab and open next to the terminal so you can see the components in the DC/OS UI. Use the search bar to search for etcd to observe auto-healing capabilities



Run the command below to kill the etcd-0 component of kubernetes-cluster1:

dcos task exec -it kubernetes-cluster1__etcd-0 bash -c 'kill -9 $(pidof etcd)'
