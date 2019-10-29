erview
Cluster dropdown menu
View details
navigates to the cluster’s detail page
Download Kubeconfig
downloads a YAML file of the cluster’s configuration
Add-ons
service add-ons available to the cluster
Edit
Navigates to the edit form. Currently, the edit form can only add, update, or remove labels
Only available on “Managed” and “Imported” clusters
Changing a cluster’s labels may add or remove the cluster from Projects. If a cluster is removed from a project any resources deployed to the cluster from that Project will be removed. If a cluster is added to a project any existing project resources will be deployed to the cluster.
Disconnect
Disconnects the cluster from the Management cluster. 
The cluster will be unjoined from `kubefed` and resources deployed to the cluster from Kommander will be removed.
Delete
Deletes the cluster
only available on “Managed” clusters
The cluster will be de-provisioned from your cloud provider
The Cloud Provider used to create the cluster must still be available and active to delete the cluster.