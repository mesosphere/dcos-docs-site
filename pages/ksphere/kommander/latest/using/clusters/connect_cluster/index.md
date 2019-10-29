Connect cluster
Uses a configuration to connect a cluster to the Management cluster 
Kubeconfig File
The configuration that allows a cluster to be connected to the Management cluster. Allows Kommander to create artifacts (e.g.: namespace) and allocate resources
Context
Pick one context from the kubeconfig
Name
The display name of the cluster
Labels
Used as selectors for Projects (kubefed)
Default labels:
region: based on what was selected for “Region” above
provider: based on what was selected for “Cloud Provider” above
Validation
Alphanumeric
Can contain “-”, “_”, and “.”, but cannot start or end with “-”, “_”, or “.”
Cannot be blank
