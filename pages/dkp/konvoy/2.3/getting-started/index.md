---
layout: layout.pug
navigationTitle: getting-started
title: Getting started
menuWeight: 30
excerpt: Install a DKP cluster
beta: false
enterprise: false
---

When installing DKP for a project, line-of-business, or enterprise, the first step is to determine the infrastructure on which you want to deploy.

For example, you can:

- Install on a public cloud infrastructure, such as Amazon Web Services (AWS) or Azure.
- Install on an internal network on-premises with a physical (bare metal) or virtual infrastructure.
- Install on air-gapped Edge.

<p class="message--important"><strong>IMPORTANT: </strong>The infrastructure you select then determines the specific requirements for a successful installation.</p>


DKP is a tool for provisioning Kubernetes clusters with a suite of pre-selected [Cloud Native Computing Foundation [CNCF](https://www.cncf.io/) and community-contributed tools.
By combining a native Kubernetes cluster as its foundation with a default set of cluster extensions,
DKP provides a complete out-of-the-box solution for organizations that want to deploy production-ready
Kubernetes.

As an example, this Installation guide provides simplified instructions to get your DKP cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) public cloud instance. For information about installing on a different platform, see [Infrastructure providers](../choose-infrastructure/). 

# Before you begin

Before installing DKP, ensure you have the [following](../supported-operating-systems/).

# Installing DKP

1.  Install required packages. In most cases, you can install the required software using your preferred package manager. For example, on a macOS computer, you can use [Homebrew](https://docs.brew.sh/Installation) to install `kubectl` and the `aws` command-line utility by running the following command:

    ```bash
    brew install kubernetes-cli awscli
    ```

1.  Check the Kubernetes client version. Many important Kubernetes functions **do not work** if your client is outdated. You can verify that the version of `kubectl` you have installed is supported by running the following command:

    ```bash
    kubectl version --short=true
    ```

1.  To download DKP, see the [Download Konvoy](../download) topic for information. You will need to download and extract the DKP binary package tarball.

1.  Verify you have valid **cloud provider security credentials** to deploy the cluster on that platform. This step is not required if you are installing DKP on an on-premises environment. For information about installing in an on-premises environment, see [Install on-premises](../choose-infrastructure/on-prem).

1.  Deploy with all of the default settings depending on which infrastructure you have. Go to the Choose Infrastructure section of the documentation for further steps on creating a cluster on your Cloud platform. [Infrastructure providers](../choose-infrastructure/) 
  
1.  Lastly, you will want to [Install Kommander](/../../dkp/kommander/2.3/install/)   

# Next steps

Now that you have a basic Konvoy cluster installed and ready to use, you might want to test operations by deploying
a simple, sample application, customizing the cluster configuration, or checking the status of cluster components.

For more details, see the following topics:

- [Deploy a sample application](../deployments/deploy-sample-app/)
- [Platform application deployment](/../../dkp/kommander/2.3/projects/applications/platform-applications/)
- [Troubleshooting](../troubleshooting/)

