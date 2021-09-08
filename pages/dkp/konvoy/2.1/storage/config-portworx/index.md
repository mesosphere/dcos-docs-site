---
layout: layout.pug
navigationTitle: Configure Portworx
title: Configure Portwork for On-prem Usage
menuWeight: 20
excerpt: Configure Portworx Essentials for On-prem Use
beta: false
enterprise: false
---

Certain configurations require managing your own storage. We recommend the storage solutions of our [business partner][portworxpartners] [Portworx][portworx]. Portworx is a software-defined storage solution that provides high-availability persistent volume storage for containerized stateful applications running on Kubernetes clusters. This procedure describes how to create a Portworx Essentials yaml file for use with Konvoy.

The following example is a sample installation illustrating the overall process. For production installations, consult the Portworx documentation for appropriate configuration options.
## Before you begin

You need certain software configurations and settings before you start this procedure. This procedure requires the following items and configurations:

- Portwork login.

## Configure Portworx Essentials for On-prem Use

1.  Go to `https://portworx.com` and login to your account. Create an account for this site if you do not have access.

1.  Select the **Portworx Essentials** button and select the **>Next** link.

1.  In the **Basic** window enter values for the following fields:
    - **Kubernetes Version** - Enter the Kubernetes version number you are using.
    - **Portworx Version** - Enter the Portworx version number you want to use.

   Select the **Next** button.

1.  In the **Storage** window select the following attributes:
    - **On Premises**
    - **Automatically scan disks**
    - **Use unmounted disks even if they have a partition on it. PX will never use a drive or partition that is mounted**
    - **Skip KVDB device** - (This is not recommended for production installation but is referenced here for simple configurations.)

   Select the **Next** button.

1.  In the **Network** window keep the default settings. Do not change any values. Select the **Next** button.

1.  In the **Customize** window, in the **Advanced Setting** section, select the following items:
    - **Enable Stork**
    - **Enable Lighthouse**

   Select the **Finish** button.

1.  In the Portworx License Agreement dialog box, select the **Agree** button.

1.  In the **Spec Generator Essentials** window, select the **Download** button. The `portworx_essentials.yaml` file is downloaded to your machine.

1.  Move the `portwork_essentials.yaml` file to the `./extras/kubernetes` of the Konvoy deployment director. If the `/extras/kubernetes` directory does not already exist, create it using `mkdir -p ./extras/kubernetes`.

1.  Deploy Portworx on the Kubernetes cluster by running the following command:

    ```bash
    kubectl apply -f extras/kubernetes/portworx_essentials.yaml
    ```

1.  Wait until the Portworx pods are ready:

    ```bash
    kubectl get pods -n kube-system -l name=portworx -o wide
    ```

1.  Fetch the Portworx cluster status:

    ```bash
    PX_POD=$(kubectl get pods -l name=portworx -n kube-system -o jsonpath='{.items[0].metadata.name}')
    kubectl exec -it $PX_POD -n kube-system -- /opt/pwx/bin/pxctl status

## Related information

For information on related topics or procedures, refer to the following:

- [Portworx Installation for Kubernetes](https://docs.portworx.com/portworx-install-with-kubernetes/)

[portworx]:https://portworx.com
[portworxpartners]:https://portworx.com/partners/
