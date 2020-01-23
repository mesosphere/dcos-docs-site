---
layout: layout.pug
navigationTitle: Quick Start Guide
excerpt: Get up and running with DC/OS Data Science Engine
title: Quick Start
menuWeight: 2
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true

---

This guide explains how to install the {{ model.techName }} Service.

# Prerequisites


- DC/OS and DC/OS CLI installed with a minimum of {{ model.nodeDescription }}.
- Depending on your security mode, {{ model.techName }} requires service authentication for access to DC/OS. See [Provisioning a service account](/mesosphere/dcos/services/data-science-engine/1.0.1/security/#provisioning-a-service-account) for more information.

<p class="message--note"><strong>NOTE: </strong> If you are planning to use <a href="https://docs.d2iq.com/mesosphere/dcos/services/data-science-engine/1.0.1/integrations/hdfs/">HDFS</a> on {{ model.techName }}, you will need a minimum of five nodes.</p>

| Security Mode | Service Account |
|----------------|------------------|
| Disabled | Not available |
| Permissive | Optional |
| Strict | Required |

The following points should be considered before installing the service:
* {{ model.techName }} uses WebSockets to drive the console, so load balancers and proxies must be configured accordingly.
* AWS Classic Load Balancer should not be used, because it does not support WebSockets.
* The DC/OS Universal Installer uses Classic ELBs (Elastic Load Balancers) for both external and internal load balancing till version 2.0 by default.


# Install {{ model.techName }}

## From the DC/OS UI

1. Select the **Catalog** tab, and search for {{ model.techName }}. Select the {{ model.packageName }} package.

2. Choose the **Review & Run** button to display the **Edit Configuration** page.

3. Configure the package settings using the DC/OS UI or by choosing **JSON Editor** and modifying the app definition manually. For example, you might customize the package by enabling HDFS support.

4. Click **Review & Run**.

5. Review the installation notes, then click **Run Service** to deploy the {{ model.packageName }} package.


## From the command line

Install the {{ model.packageName }} package. This may take a few minutes. This step installs the {{ model.packageName }} service.

   ```bash
   dcos package install {{ model.packageName }}
   ```

   Expected output:

   ```bash
   Installing Marathon app for package [{{ model.packageName }}] version [2.8.0-2.4.0]
   DC/OS {{ model.packageName }} is being installed!

       Documentation: https://docs.d2iq.com/services/{{ model.packageName }}/
       Issues: https://docs.d2iq.com/support/
   ```


# Run a Python Notebook Using Spark

1. From DC/OS , select **Services**, then click on the "Open" icon for the {{ model.serviceName }}.

    ![Open JupyterLab](/mesosphere/dcos/services/data-science-engine/img/dcos-jupyter-new-window.png)

    Figure 1 - Open new Jupyter window

    This will open a new window or tab in the browser for JupyterLab.  Log in using the password specified during the installation of the {{ model.packageName }} package in **Service -> Jupyter Password** option or use `jupyter` by default.

1. In JupyterLab, create a new notebook by selecting **File > New > Notebook**:

   ![Create new notebook](/mesosphere/dcos/services/data-science-engine/img/jupyterlab-menu-file-new-notebook.png)

   Figure 2 - Create a new notebook

1. Select Python 3 as the kernel language.

1. Rename the notebook to "Estimate Pi.ipynb" using the menu at **File -> Rename Notebook**.

1. Paste the following Python code into the notebook.  If desired, you can type sections of code into separate cells as shown below.


   ```python
   from pyspark import SparkContext, SparkConf
   import random

   conf = SparkConf().setAppName("pi-estimation")
   sc = SparkContext(conf=conf)

   num_samples = 100000000
   def inside(p):     
     x, y = random.random(), random.random()
     return x*x + y*y < 1
   count = sc.parallelize(range(0, num_samples)).filter(inside).count()
   pi = 4 * count / num_samples
   print(pi)

   sc.stop()
   ```


1. Run the notebook. From the menu, select **Run -> Run All Cells**. The notebook will run for some time, then print out the calculated value.

   - Expected output: 3.1413234


# Enable GPU support

{{ model.techName }} supports GPU acceleration if the cluster nodes have GPUs available and CUDA drivers installed. To enable GPU support for {{ model.techName }} add the following configuration in service config:

```json
"service": {
    "gpu": {
        "enabled": true,
        "gpus": "<desired number of GPUs to allocate for the service>"
    }
}
```
