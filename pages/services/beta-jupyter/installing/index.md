---
layout: layout.pug
navigationTitle: Installation
title: Installation
menuWeight: 30
excerpt: Installing and customizing JupyterLab
featureMaturity:
enterprise: false
model: /services/beta-jupyter/data.yml
render: mustache
---

# Install {{ model.techShortName }} without GPU support

The default installation brings {{ model.techName }} up and running as described in the [Quick Start](/services/beta-jupyter/quick-start/) section. The following installation procedure lets you customize your {{ model.techName }} installation even further. After installing, you can access the {{ model.techName }} installation through Marathon-LB and your `vhost`.

## Deploy {{ model.techShortName }} from the web interface

The DC/OS web interface provides a way to deploy the {{ model.techName }} package on your DC/OS cluster.

1. Click **Catalog** and search for the {{ model.techName }} package.
1. Select the package, then click **Review & Run** to display the **Edit Configuration** page.
1. Configure the package settings, as needed, using the DC/OS web interface or by clicking **JSON Editor** and modifying the app definition manually. For example, you might customize the package by enabling HDFS support.

    For more information about customizing the configuration, see [Advanced installation options](/services/beta-jupyter/installing/#advanced-installation).

1. Click **Review & Run**.
1. Review the installation notes, then **Run Service** to deploy the {{ model.techName }} package.

## Deploy {{ model.techShortName }} from the command-line

Alternatively, you can deploy the {{ model.techName }} package on the DC/OS cluster from the command-line. 

1. Run the following command to see what options are available for the {{ model.techName }} package:
    ```bash
    $ dcos package describe jupyterlab --config
    ```

1. Create an `options.json` file that specifies the properties you wan to set for the {{ model.techName }} package.
1. Run the following command to install the {{ model.techShortName }} service:
    ```bash
    $ dcos package install {{ model.packageName }} --options=options.json --yes
    ```

# Install {{ model.techShortName }} with GPU support

Before you start, make sure your DC/OS cluster runs at least one GPU agent. If your cluster supports GPU agents, you can enable `GPU Support` for the {{ model.techShortName }} service if you want to run your Notebook with GPU acceleration. You can deploy the {{ model.techShortName }} service using Terraform, from the DC/OS web interface, or from the CLI.

## Deploy {{ model.techShortName }} on AWS using Terraform

The instructions below illustrate using a Terraform template to create a DC/OS cluster that consists of one master and one GPU agent node for {{ model.techShortName }} installed on AWS.

**Prerequisites**
- Follow the [Getting Started Guide](https://github.com/dcos/terraform-dcos/blob/master/aws/README.md) available from the Terraform repository.
- Set your AWS credentials profile.
- Copy your `ssh-key` to AWS. 

To deploy on AWS with GPU support:
1. Create a new directory for Terraform to use to write its files.
1. Initialize the Terraform folder: 
    ```
    terraform init -from-module github.com/dcos/terraform-dcos//aws
    ```
1. Rename `desired_cluster_profile.tfvars.example` to `desired_cluster_profile.tfvar` and configure it similar to the following:
    ```
    dcos_cluster_name = "GPU JupyterLab Testcluster"
    dcos_version = "1.11.7"
    num_of_masters = "1"
    num_of_private_agents = "0"
    num_of_public_agents = "1"
    num_of_gpu_agents = "1"
    #
    aws_region = "us-west-2"
    aws_bootstrap_instance_type = "m3.large"
    aws_master_instance_type = "m4.2xlarge"
    aws_agent_instance_type = "m4.2xlarge"
    aws_profile = "123456-YourAWSProfile"
    aws_public_agent_instance_type = "m4.2xlarge"
    ssh_key_name = "yourSSHKey"
    # Inbound Master Access
    admin_cidr = "0.0.0.0/0"
    ```
1. Activate the GPU agent installation by renaming `dcos-gpu-agents.tf.disabled` as `dcos-gpu-agents.tf`.
1. Enable your GPU script using `terraform init`.
1. Apply your plan and run: `terraform apply -var-file desired_cluster_profile.tfvars`.
1. Approve Terraform to perform these actions by entering `yes` when prompted.

If everything runs successfully, the output looks like this:

```
Apply complete! Resources: 31 added, 0 changed, 0 destroyed.

Outputs:

Bootstrap Host Public IP = 34.215.7.137
GPU Public IPs = [
    34.216.236.253
]
Master ELB Public IP = fabianbaie-tf7fcf-pub-mas-elb-1180697995.us-west-2.elb.amazonaws.com
Master Public IPs = [
    35.164.70.195
]
Private Agent Public IPs = []
Public Agent ELB Public IP = fabianbaie-tf7fcf-pub-agt-elb-2143488909.us-west-2.elb.amazonaws.com
Public Agent Public IPs = [
    35.164.70.196
}
ssh_user = core
 ```

You can now connect to your newly installed DC/OS cluster by copying the Master ELB Public IP into your browser. For example, copy and paste a string similar to the following: 
`fabianbaie-tf7fcf-pub-mas-elb-1180697995.us-west-2.elb.amazonaws.com`

## Deploy {{ model.techShortName }} from the web interface

The DC/OS web interface provides a way to deploy the {{ model.techShortName }} package on your DC/OS cluster with GPU support.

1. Click **Catalog** and search for the {{ model.techShortName }} package.
1. Select the package, then click **Review & Run** to display the **Edit Configuration** page.
1. Select **Enabled** for GPU Support and set the number of GPU agents to one.
1. Configure any additional package settings, as needed, using the DC/OS web interface fields or by clicking **JSON Editor** and modifying the app definition manually. For example, you might customize the package to enable HDFS support.

    For more information about customizing the configuration, see [Advanced installation options](/services/beta-jupyter/installing/#advanced-installation).

1. Click **Review & Run**.
1. Review the installation notes, then **Run Service** to deploy the {{ model.techName }} package.

The package is several gigabytes in size. The deployment takes approximately five minutes to complete on AWS.

## Deploy {{ model.techShortName }} from the command-line

Alternatively, you can deploy the {{ model.techName }} package on the DC/OS cluster from the command line. 

1. Run the following command to see what options are available for the {{ model.techName }} package:

    ```bash
    $ dcos package describe jupyterlab --config
    ```
1. Create an `options.json` file that specifies the properties you want to set for the {{ model.techName }} package. For example, modify the `gpu_support` section.
    ```
    "gpu_support": {
          "description": "GPU support and useful packages for Data Scientists.\n\nGPU specific packages:\nCUDA 9.0.176-1, CUDNN 7.1.4.18-1+cuda9.0, NCCL 2.2.13-1+cuda9.0, TensorFlow-GPU 1.9.0",
          "properties": {
            "enabled": true {
              "default": false,
              "description": "Enable GPU support.\nNote: This requires at least 15GB disk space available with recent NVIDIA drivers installed.",
              "type": "boolean"
            },
            "gpus": 1 {
              "default": 0,
              "description": "Number of GPUs to allocate to the service instance.\nNote: GPU support has to be enabled.",
              "minimum": 0,
              "type": "number"
            }
          },
          "type": "object"
        },
    ```
    
    Notice that `enable` in the `gpu_support` section is set to `true` and the `gpus`  is set to `1`.

1. Run the following command to install the {{ model.techShortName }} service:
    ```bash
    $ dcos package install {{ model.packageName }} --options=options_advanced_gpu.json --yes
    ```

## Test {{ model.techShortName }} with GPU support and TensorFlow

After {{ model.techShortName }} is succesfully deployed, authenticate with your password as described in the [Quick Start](/services/beta-jupyter/quick-start/) section, and create a new notebook in Python 3.

<p class="message--note"><strong>NOTE: </strong>Make sure <code>Marathon-LB</code> is installed.</p>

Verify that you can access GPU acceleration by running the following lines in your new notebook:

```python
from tensorflow.python.client import device_lib

def get_available_devices():
    local_device_protos = device_lib.list_local_devices()
    return [x.name for x in local_device_protos]

print(get_available_devices())
```

The output should look like:

```apple js
['/device:CPU:0', '/device:GPU:0']
```

## Access TensorBoard

You can access TensorBoard within your {{ model.techShortName }} instance simply by adding `/tensorboard/` to your browser url: `https://<VHOST>/<Service Name>/tensorboard/`

<p class="message--note"><strong>NOTE: </strong>If you installed {{ model.packageName }}under a different name space, change the name in the URL.</p>

<a name="advanced-installation"></a>

# Advanced installation options
You should review and set the following advanced options for the {{ model.techName }} service.

## Storage

By enabling persistent storage, data is stored in the `persistent_data` folder in your {{ model.techShortName }} container under `/mnt/mesos/sandbox`. You can then access and upload files for the {{ model.techShortName }} service by accessing the `persistent_data` folder.

If you do not select `persistence` in the `storage` section, or provide a valid value for the `host_volume` on installation, your data is not saved in any way.
| Property | Description |
|---|---|
| `persistence` | Creates local persistent volumes for internal storage files to survive across restarts or failures. |
| `host_volume_size` | Defines the size of the persistent volume, for example, 4GB. |

## Networking and external access
To access the {{ model.techShortName }} service from within the DC/OS cluster, you typically set the `port` advanced configuration option.

To access the {{ model.techShortName }} service from outside the cluster, you must install the `Marathon-LB` service. You can then enable `external_access` properties in the `options.json` file to set the `EXTERNAL_PUBLIC_AGENT_HOSTNAME` field to the public agent DNS name. In specifying the host name, use the DNS name without any trailing slash (`/`) or the `http://` or `https://` portion of the URI.

| Property | Description | 
---|---
| `port` | Specifies the port number for accessing the DC/OS {{ model.techName }} service from within the DC/OS cluster. The port number is used to access the service from other applications through a NAMED virtual IP (VIP) in the format `service_name.marathon.l4lb.thisdcos.directory:port`. You can check status of the VIP in the Network tab of the DC/OS Dashboard (Enterprise DC/OS only).|
| `external_access` | Creates an entry in Marathon-LB for accessing the service from outside of the cluster. |
| `external_access_port` | Specifies the port used in Marathon-LB for accessing the service. |
| `external_public_agent_ip` | Specifies the DNS address for services exposed through Marathon-LB. In most cases, this option is set to the public IP address for a public agent. |

## HDFS configuration

A typical advanced installation that provides HDFS support includes the `external_public_agent_hostname` property set to the public host name of the AWS Elastic Load Balancing (ELB) service and the `jupyter_conf_urls` set to the appropriate endpoint. You can create the `options_advanced_hdfs.json` file to provide the options for HDFS support manually or through the DC/OS web interface.

The {{ model.techName }} service supports `HDFS`; using `HDFS` or `S3` is the recommended configuration for collaborating in multi-user environments. You can install  `HDFS` for your cluster in the default settings before you install the {{ model.techShortName }} service. After HDFS is installed, you can set the **Jupyter Conf Urls** (`jupyter_conf_urls`) property under **Environment** settings to the appropriate URL, such as  `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints` to complete the configuration. If the URL for the HDFS endpoint is not set, the {{ model.techShortName }} service fails.

# Terms and conditions
By deploying from the user interface or command-line, you agree to the [Terms and Conditions](https://mesosphere.com/catalog-terms-conditions/#community-services) that apply to the {{ model.techName }} service.
You should note that the {{ model.techName }} service is currently in **preview** mode. In **preview** mode, a service might have bugs, incomplete features, incorrect documentation, or other have significant changes before being released. You should not deploy a package that is in **preview** mode in a production environment.

# Default password
The default password for the {{ model.techName }} service account is: `jupyter-<Marathon-App-Prefix>`

# Using {{ model.techShortName }} and BeakerX

By accessing {{ model.techName }}, you are now able to authenticate and try the various [tutorials and examples](http://nbviewer.jupyter.org/github/twosigma/beakerx/blob/master/StartHere.ipynb) for Jupyter and BeakerX.

# Changing the Python version

Follow the instructions in [Installing the iPython Kernel](http://ipython.readthedocs.io/en/stable/install/kernel_install.html) to change the Python version you are using. 

1. In `File` click `new` and open a `Terminal`. 
1. In the terminal, create a new environment with your Python version of choice. 
    For example, run the following commands for Python `3.5`:

    ```bash
    $ conda create -n 3.5 python=3.5 ipykernel
    $ source activate 3.5
    $ python -m ipykernel install --user --name 3.5 --display-name "Python (3.5)"
    $ source deactivate
    ```
1. Reload the `Jupyter` page and click `Kernel`.
1. Click `Change Kernel...` to change the new installed Python `3.5` environment.
