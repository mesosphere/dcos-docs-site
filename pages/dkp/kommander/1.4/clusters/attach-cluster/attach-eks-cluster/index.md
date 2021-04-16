---
layout: layout.pug
navigationTitle: Attach Amazon EKS Cluster to Kommander
title: Attach Amazon EKS Cluster to Kommander
menuWeight: 30
excerpt: Attach an existing EKS cluster to Kommander
beta: false
enterprise: false
---

You can attach existing Kubernetes clusters to Kommander. After attaching the cluster, you can use Kommander to [examine and manage][manage-clusters] this cluster. The following procedure shows how to attach an existing Amazon Elastic Kubernetes Service (EKS) cluster to Kommander.

## Before you begin

This procedure requires the following items and configurations:

- A fully configured and running Amazon [EKS][eks] cluster with administrative privileges.
- Konvoy v1.5.0 or above, [installed and configured][konvoy-install] for your Amazon EKS cluster, on your machine.
- Kommander v1.2.0 or above, [installed and configured][kommander-install] on your machine.

<p class="message--note"><strong>NOTE: </strong>This procedure assumes you have an existing and spun up Amazon EKS cluster(s) with administrative privileges. Refer to the Amazon <a href="https://aws.amazon.com/eks/" target="_blank">EKS</a> for setup and configuration information.</p>

## Attach Amazon EKS Clusters to Kommander

Attaching an Amazon EKS cluster to Kommander requires that you:

- Verify you are connected to the clusters

- Create and connect service accounts

- Create and implement a kubeconfig file

- Attach the EKS clusters to Kommander

### Verify connections to your EKS clusters

1. Ensure you are connected to your EKS clusters. Enter the following commands for each of your clusters:

   ```bash
   kubectl config get-contexts
   kubectl config use-context <context for first eks cluster>
   ```

1. Confirm `kubectl` can access the EKS cluster.

   ```bash
   kubectl get nodes
   ```

### Create and connect the service accounts

1. Create a service account for Kommander on your EKS cluster.

   ```bash
   kubectl -n kube-system create serviceaccount kommander-cluster-admin
   ```

1. Configure your `kommander-cluster-admin` service account to have `cluster-admin` permissions. Enter the following command:

   ```yaml
   cat << EOF | kubectl apply -f -
   apiVersion: rbac.authorization.k8s.io/v1beta1
   kind: ClusterRoleBinding
   metadata:
     name: kommander-cluster-admin
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: cluster-admin
   subjects:
   - kind: ServiceAccount
     name: kommander-cluster-admin
     namespace: kube-system
   EOF
   ```

### Create and implement a kubeconfig file

1. You must create a kubeconfig file that is compatible with Kommander. Enter these commands to set the following environment variables:

   ```bash
   export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
   export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
   export CURRENT_CONTEXT=$(kubectl config current-context)
   export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
   export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ index .cluster "certificate-authority-data" }}{{end}}{{ end }}')
   export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
   ```

1. Confirm the variables are set correctly. Run the following command:

   ```bash
   env | grep CLUSTER
   ```

1. You should see a response that looks similar to this:

   ```bash
   CLUSTER_CA=LS0tLS1CRUdJTiBDRVJUtristiqueInterdumetmalesuadaUN5RENDQWJDZ0F3SUJBZ0lCQURBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwcmRXSmwKY201bGRHVnpNQjRYRFRJeE1EUXhOakl3TWpjeU9Gb1hEVE14TURReE5ESXdNamN5T0Zvd0ZURVRNQkVHQTFVRQpBeE1LYTNWaVpYSnVaWFJsY3pDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTDVRCmJCV1pEMkd6N0oxeSswY3FuYWE2aDBqYVVOdXI0ZGJidkZ5N1VqcU55bTd0KzhHaFl6Wk5VQzZPVFpWT3FZRkMKKzJZK1FoV0xLYzR3SW1sTjdVYWZxamh4MExONC8zR3BpQ1ZwSU52ZG9HelNYTXdLalg0dHViVUN0OTRjUnV2QgpjMlVYR0kvS0paWWV5TDY5UGQwWno5RUNTdlJFa2VqWlU3RHB0WVVtUldhUmdXUkgvbHNoRWl6ODl3WmlHWVUxCLoremipsumdolorsitamet05secteturadipiscingelitSuspendi2xsodalesnisisedleofacilisisafringillapuruscursusProindictumsuscipitloremnonfringillaaugueultriciestristiqueInterdumetmalesuadafamesacanteipsumprimisinfaucibusNamatestnecmagnaultricesposuereMorbi05vallisnuncquamapellentesquemetustemporeuVivamusfinibusnibhutiaculismalesuadaDonecsitametlaciniafelisNamultriceseunibhvitaeultrice2xdvolutpatporttitortellusvitaehendreritVivamusetmagnatellusDuisidurnaodioFuscealiquamvelitetexpharetraluctusNamultriciesdignissimsagittisMaecenasquissapiensapienS0tLQo=
   CLUSTER_SERVER=https://your-server-info.gr7.your-region-1.eks.amazonaws.com
   CURRENT_CLUSTER=dkp-engineering-eks.us-west-2.eksctl.io
   ```

1. Create a kubeconfig file to use in Kommander. Enter the following command:

   ```bash
   cat << EOF > kommander-cluster-admin-config
   apiVersion: v1
   kind: Config
   current-context: ${CURRENT_CONTEXT}
   contexts:
   - name: ${CURRENT_CONTEXT}
     context:
       cluster: ${CURRENT_CONTEXT}
       user: kommander-cluster-admin
       namespace: kube-system
   clusters:
   - name: ${CURRENT_CONTEXT}
     cluster:
       certificate-authority-data: ${CLUSTER_CA}
       server: ${CLUSTER_SERVER}
   users:
   - name: kommander-cluster-admin
     user:
       token: ${USER_TOKEN_VALUE}
   EOF
   ```

1. Verify that the kubeconfig file can access the EKS cluster.

   ```bash
   kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
   ```

1. Copy `kommander-cluster-admin-config` file contents to your clipboard.

   ```bash
   cat kommander-cluster-admin-config | pbcopy
   ```

   <p class="message--note"><strong>NOTE: </strong>If you are not using the Mac OS X operating system, this command will not work. If you are using the Linux operating system, enter the following command: <br/><code>cat kommander-cluster-admin-config | xclip -selection clipboard</code></p>

### Attach the Amazon EKS cluster to Kommander

1. From the Clusters page, select the **Add Cluster** button in your Kommander window.

1. Select the **Attach Cluster** button. If you don't have any [additional networking restrictions][no-network-restrictions], click the **No additional networking restrictions** card. If you do have a cluster with networking restrictions, follow the instructions to [attach a cluster with networking restrictions][with-network-restrictions].

1. Paste the contents of your clipboard into the **Connection Information** Kubeconfig File text box.

1. Assign a name and add any desired labels for the cluster.

1. Select the intended context with the config in the **Context** select list.

1. Confirm you are assigning the cluster to your desired workspace.

1. Select the **Submit** button.

<p class="message--note"><strong>NOTE: </strong>If a cluster has limited resources to deploy all the federated platform services, it will fail to stay attached in the Kommander UI. If this happens, please check if there are any pods that are not getting the resources required.</p>

## Related information

For information on related topics or procedures, refer to the following:

- [Configuring and Running Amazon EKS Clusters][eks]

- [Installing and Configuring Konvoy v1.5.0 or above][konvoy-install]

- [Installing and Configuring Kommander v1.2.0 or above][kommander-install]

- [Working with Kommander Clusters][manage-clusters]

[eks]: https://aws.amazon.com/eks/
[kommander-install]: /dkp/kommander/1.4/install/
[konvoy-install]: /dkp/konvoy/1.8/install/
[manage-clusters]: /dkp/kommander/1.4/clusters/
[no-network-restrictions]: /dkp/kommander/1.4/clusters/attach-cluster/cluster-no-network-restrictions/
[with-network-restrictions]: /dkp/kommander/1.4/clusters/attach-cluster/cluster-with-networking-restrictions/
