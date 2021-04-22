---
layout: layout.pug
navigationTitle: Finish attaching the existing cluster to Kommander
title: Finish attaching the existing cluster to Kommander
menuWeight: 15
excerpt: How to apply the kubeconfig file to create the network tunnel to attach an existing cluster 
beta: true
---

Though the required file is now generated, you still need to apply it to create the network tunnel and complete the attachment process.

1. Select the **Download Manifest** link to download the file you [generated previously][attach-with-restrctions].

1. Copy the `kubectl apply...` command from the user interface and paste into your terminal session, substituting the actual name of the file for the variable. Running this command starts the attachment process, which may take several minutes to complete. The Cluster details page will be displayed automatically when the cluster attachment process completes.

1. (Optional) Select the **Verify Connection to Cluster** button to send a request to Kommander to refresh the connection information. You can use this option to check to see if the connection is complete, though the Cluster Details page displays automatically when the connection is complete.

<p class="message--note"><strong>NOTE: </strong>After the initial connection is made, and your cluster become viewable as attached in the Kommander UI, the attachment and federated addons and platform services will still need to complete.
This may take several additional minutes.
If a cluster has limited resources to deploy all the federated platform services, it will fail to stay attached in the Kommander UI.
If this happens, check if there are any pods that are not getting the resources required.</p>

[attach-with-restrctions]: ../cluster-with-network-restrictions/
