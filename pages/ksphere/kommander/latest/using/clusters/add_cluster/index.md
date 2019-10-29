Create Konvoy Cluster
Kubernetes Version
The version of Kubernetes the cluster will be running on
Also determines which version of Konvoy is used to deploy the cluster
Cloud Provider
When a valid cloud provider is selected:
The regions are fetched and the “Region” field is populated if there is no error during fetch
The “Availability Zones” field is populated
Default Node Pools are populated
Regions
The regions available based on your cloud provider
When your region is selected, we fetch it’s availability zones
Availability Zones
Subsets of the selected region
Name
The display name of the cluster
Configure Node Pools
There can be no more than 10 worker node pools
Name
“control-plane”: designates the node pool as a control plane
If the Node Pool is a control plane, it must have an odd number of nodes
“bastion”: designates the node pool as a bastion
Any other valid name creates a worker node pool
Machine type
Dependent on user’s cloud provider
Number of nodes
Number of nodes in the node pool
Must be at least 1
Maximum number?
Taints
Kubernetes docs
Labels
Used as selectors for the workloads
Labels
Used as selectors for Projects (kubefed)
Default labels:
region: based on what was selected for “Region” above
provider: based on what was selected for “Cloud Provider” above
Validation
Alphanumeric
Can contain “-”, “_”, and “.”, but cannot start or end with “-”, “_”, or “.”
Cannot be blank
