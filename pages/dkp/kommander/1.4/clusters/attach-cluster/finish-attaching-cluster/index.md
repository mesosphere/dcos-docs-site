---
layout: layout.pug
navigationTitle: Finish attaching the existing cluster to Kommander
title: Finish attaching the existing cluster to Kommander
menuWeight: 15
excerpt: How to apply the kubeconfig file to create the network tunnel to attach an existing cluster 
beta: false
---

Though the required kubeconfig file is now generated, you still need to apply it to create the network tunnel and complete the attachment process.

1. Select the **Download Manifest** link to download the kubeconfig file you generated previously.

1. Copy the `kubectl apply...` command from the user interface and paste into your terminal session, substituting the actual name of the file for the variable. Running this command starts the attachment process, which may take several minutes to complete. If you do nothing further, when the cluster attachment completes, the Cluster details page displays.

1. (Optional) Select the **Verify Connection to Cluster** button to send a request to Kommander to refresh the conneciton information. You can use this option to check to see if the connection is complete, though the Cluster Details page displays automatically when the connection is complete.
