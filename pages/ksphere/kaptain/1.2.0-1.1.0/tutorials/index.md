---
layout: layout.pug
navigationTitle: Tutorials
title: Tutorials
menuWeight: 10
excerpt: End-to-end tutorials for model development, distributed training, pipelines and metadata management
enterprise: false
---

Kaptain offers several ways to train models (incl. distributed), tune hyperparameters, and deploy optimized models that autoscale.

The Kaptain SDK is the best choice for a data science-friendly user experience.
It is designed to be a great first experience with Kaptain.

If you prefer to have full control and are familiar and comfortable with Kubeflow SDKs, or YAML specifications in Kubernetes, then we suggest you consult the other tutorials.

Note that everything can be done from within notebooks, thanks to Kaptain's notebooks-first approach to machine learning. 

## How to Navigate the User Interface

The Kubeflow _central dashboard_ is the main entry point to Kaptain after logging in:

![Central dashboard](./img/central-dashboard.png)

The central area shows recent pipelines, pipeline runs, and notebooks as well as links to documentation.

The namespace is shown at the top: `demo` in the image above.

The menu on the left has the following entries
- Home, which is shown in the image
- Pipelines
- Notebook Servers
- Katib

These are discussed in more detail below.

## Pipelines
Pipelines and runs with their logged artifacts are available from the _Pipelines_ menu.
Details on how to create pipelines are in the [pipelines tutorial](./pipelines/).

### Pipeline Runs
A list of pipeline runs is available in the _Experiments_ menu.
It shows a list of runs along with their status, duration, and model performance metrics.
As an example, the accuracy and loss are shown in the image below.

![Pipeline runs](./img/pipeline-runs.png)

### Pipeline Run Logs
After selecting a single run, logs for individual steps of a pipeline can be displayed:

![Pipeline run logs](./img/pipeline-logs.png)

This is particularly helpful when debugging pipeline steps.

Each step logs its inputs and outputs, which can be accessed via the _Input/Output_ tab.

### Pipeline Artifacts
Input and outputs of steps, also known as artifacts, are stored in the Artifacts Store.
These are available from the _Artifacts_ menu.
The lineage of pipeline artifacts is displayed in the _Lineage Explorer_ tab:

![Pipeline artifacts](./img/pipeline-artifacts.png)

## Notebook Servers
Notebook servers can be set up from the _Notebook Servers_ menu on the central dashboard.
From there, users can choose a quick-start image for any of the supported deep learning frameworks: TensorFlow, PyTorch, and MXNet.
Each quick-start image comes in two flavors: CPU and GPU.
The latter has all the drivers needed for training on GPUs included.
Custom images can also be provided.

### How to Set Up a Notebook Server
A notebook server is the entry point to cluster resources for machine learning.
Each notebook server is a Docker container with Jupyter as well as various frameworks included out of the box.

To set up a new notebook server, click on "New Server" at the top right in the _Notebook Servers_ page.
If no notebook servers have been set up previously, the list is empty:

![Notebook Servers](./img/notebook-servers.png)

A new page opens that is used to configure the notebook server:

![Notebook Server Setup](./img/notebook-server-setup-1.png)

The notebook server requires a name and a namespace associated with it.
Multi-tenancy in Kaptain is by namespace, so resources and access to these are restricted by namespace.
You can set up as many notebook servers within a namespace as required.
Users with access to the namespace will have access to all notebook servers within the same namespace.

The Docker image for the notebook server can be selected from the drop-down or entered manually.
The images included in Kaptain are _quick-start_ images designed to help you get started with Kaptain with ease.
Each quick-start image includes Spark and Horovod, standard Python libraries, and a single deep learning framework: TensorFlow, PyTorch, or MXNet.
Each image comes in two flavors: CPU and GPU.
These are identical except for GPU drivers and GPU-enabled framework libraries.

If you run CPU-only machine learning workloads from a notebook server, please choose the CPU images, as these are typically a few GB smaller and therefore load more quickly.
For notebook servers that can run on CPU, GPU, or a combination thereof, please select one of the GPU images, indicated with the suffix "-gpu".

Custom images can be added by an administrator to be made available to the entire organization.
Such custom images can include company-internal libraries or frameworks compiled against specific hardware.

Each notebook server receives a number of resources attached to it:
- CPUs (mandatory)
- RAM (mandatory)
- GPUs (optional)

These resources are _per pod_.
The GPU vendor is always NVIDIA, but it must be selected nevertheless.

Code run from within a Jupyter notebook on Kaptain runs on these resources.
This means that it is possible to restrict the number of resources attached to a particular notebook server even though the cluster may have more resources available for additional workloads or other notebook servers.

The next configuration option for a notebook server allows workspace volumes to be added.
This enables notebook workspaces to be persisted.
Data volumes can also be mounted to notebook servers.
These are mounted to each pod on the notebook server.

![Notebook Server Setup](./img/notebook-server-setup-2.png)

Affinity and tolerations are advanced configuration options that allow the notebook server's workloads to run on specific resources within the cluster using [toleration groups](../custom-configuration/notebook-servers-configuration/).
This allows for separation of, say, development and production workloads on the same underlying Kubernetes cluster without having to set up multiple clusters.
It also enables specific workloads to be run on dedicated hardware, e.g. large-scale image processing on state-of-the-art GPUs that are off limits for other workloads or notebook servers.

Custom configurations, such as for instance [secrets](../secrets-management/), can be added to the notebook server with the "Configurations" option:

![Notebook Server Setup](./img/notebook-server-setup-3.png)

The toggle for "Enabled Shared Memory" is recommended as certain machine learning frameworks (e.g. PyTorch) require it.

Once you have completed the required configuration options for the notebook server, the "Launch" button becomes active and can be clicked.
The setup may take a few minutes depending on the size of the notebook image chosen.
The progress can be monitored on the _Activity_ tab of the central dashboard.
The result is as follows:

![Notebook Server Setup](./img/notebook-server-setup-4.png)

Please consult Kubeflow's documentation on [setting up notebook servers](https://www.kubeflow.org/docs/components/notebooks/setup/) for additional details. 

### Jupyter Notebooks
Once a notebook server has been set up, a familiar Jupyter notebook environment is available:

![Notebooks](./img/notebooks.png)

The numbered sections are as follows:

1. Directory tree on the notebook server
2. Visual git module
3. Table of contents for the currently visible notebook
4. Notebook diff viewer
5. Notebook cells with embedded output

Additional details on the JupyterLab environment can be found in the [JupyterLab documentation](https://jupyterlab.readthedocs.io/en/2.2.x/).

## Katib
Katib is the hyperparameter tuner and neural architecture search module in Kaptain.
To learn how to create hyperparameter tuning experiments, read the [tutorial](./katib/).

These experiments can be accessed through the _HP &rarr; Monitor_ submenu:

![Katib monitor](./img/katib-monitor.png)

For each experiment a chart of the main objective and different hyperparameter values is shown:

![Katib experiment](./img/katib.png)

The _View Experiment_ button shows the details of the experiment itself.
The _View Suggestion_ button yields the hyperparameters of the best trial in the experiment.

At the bottom of the chart is a list of all trials, their statuses, objective values, and hyperparameters.
