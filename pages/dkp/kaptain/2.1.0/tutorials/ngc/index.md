---
layout: layout.pug
navigationTitle: NGC catalog
title: NVIDIA NGC catalog
menuWeight: 30
excerpt: Use NVIDIA's NGC catalog with Kaptain
beta: false
enterprise: false
---

Kaptain is compatible with the usage of Nvidia’s NGC catalog in networked environments, which you can access and set up via the Kubeflow UI; however, usage of NGC catalog components is not covered under D2iQ's support policy.   

The NGC catalog includes containers, charts, pre-trained models, toolkits and more, which are optimized for GPU deployment and can be used to run AI workflows in Kaptain.

Since the NGC catalog is a constantly growing third-party catalog developed by NVIDIA, not all available images have been tested. Also, note that for some examples, you may need to install additional tools like TAO Toolkit, DeepStream SDK, NVIDIA TensorRT and others, which is beyond the scope of this documentation.  

You can find resources for your AI/ML workflow in the [NVIDIA NGC catalog][NGC_catalog], and detailed instructions on how to use these resources in the [NGC documentation][NGC_docs] site.

## Prerequisites

-   You have [deployed Kaptain into a cluster](../../install/).

-   You have a Kubeflow profile, and [permissions to create notebooks](../../user-management/).

-   You have permissions to access the [NGC component](https://docs.nvidia.com/ngc/ngc-catalog-user-guide/index.html#registering-activating-ngc-account).

## Prepare your Kubeflow user profile

You do not need to download, nor install anything to be able to access the NGC catalog. You can visit NVIDIA's [NGC catalog page][NGC_catalog] directly or access it from your Kaptain instance. However, you have to set the default entry point for Jupyter Lab first.

In your Kubeflow profile, create a custom configuration for a notebook server to launch in Jupyter Lab. Specify the `kubeflow-profile` where you want to create the notebook.

1.  Create or edit a `PodDefault` YAML file:

    ```yaml
    apiVersion: "kubeflow.org/v1alpha1"
    kind: PodDefault
    metadata:
      name: custom-entrypoint
      namespace: <kubeflow-profile>
    spec:
      selector:
        matchLabels:
          custom-entrypoint: "true"
      desc: "Launch as Jupyter Lab"
      command:
      - jupyter
      args:
      - lab
      - --notebook-dir=/workspace
      - --ip=0.0.0.0
      - --no-browser
      - --allow-root
      - --port=8888
      - --NotebookApp.token=''
      - --NotebookApp.password=''
      - --NotebookApp.allow_origin='*'
      - --NotebookApp.base_url=$(NB_PREFIX)
    ```

1.  Run this command to apply the new entry point:

    ```bash
    kubectl apply -f poddefault.yaml
    ```

## Find a notebook, container or resource in the NGC catalog

1.  Browse through NGC’s website and select the container (image, notebook, or resource) you would like to run. You can do this by visiting the [NGC catalog][NGC_catalog] directly or by [logging in to your Kaptain](../../install/deploy-kaptain#log-in-to-kaptain-using-the-management-clusters-dex-instance) instance and selecting **NGC catalog** on the sidebar menu.

1.  Copy and note down the download command for the container by selecting **Pull Tag** and choosing the required version. This copies the command and image name into your clipboard. You only need the image name.

## Launch a container with the image you want to run

1.  [Log into your Kaptain instance](../../install/deploy-kaptain#log-in-to-kaptain-using-the-management-clusters-dex-instance) in the **Kubeflow UI** and select **Notebooks** > **New notebook**.

1.  Fill out the fields as required, and ensure you provide the right information in these fields:

    In the **Custom Image** field, paste the image name (without the command) you copied in the [previous section](#find-a-notebook-container-or-resource-in-the-ngc-catalog).

    In the **Configurations** field, select **Launch as Jupyter Lab**.

    <p class="message--note"><strong>NOTE: </strong>If you configured your cluster with GPU support, and you want to give your notebook access to GPU resources, go to the <b>GPU</b> section, enter the number of GPUs, and select <b>NVIDIA</b> as a <b>GPU Vendor</b>.</p>

1.  Select **Launch**.

## Download and run a Jupyter notebook

Once you have launched the container, you can continue to run a Jupyter notebook, as shown in this example. You can find the Jupyter notebook in the notebook list in Kubeflow.

1.  [Log in to your Kaptain](../../install/deploy-kaptain#log-in-to-kaptain-using-the-management-clusters-dex-instance) instance via the Kubeflow UI, and select **Notebooks**.

1.  Select **Connect** next to the notebook.

1.  In Jupyter Lab, change to your `workspace`:

    ```bash
    cd /workspace/
    ```

1.  In the NGC catalog, find a resource, and use the **Download** button to copy the WGET command for your notebook resources.

1.  In your Jupyter Lab environment, paste and run that command.

1.  Unzip the file to access the resources.

    ```bash
    unzip <notebook-name>
    ```

1.  Locate and run the notebooks from the downloaded files.

## Use the NGC catalog

For more information on how to use resources of the NGC catalog, refer to the [NGC catalog documentation][NGC_docs].

[NGC_catalog]: https://catalog.ngc.nvidia.com/
[NGC_docs]: https://docs.nvidia.com/ngc/ngc-catalog-user-guide/index.html
