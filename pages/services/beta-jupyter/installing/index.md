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

# Install {{ model.techShortName }} without GPU Support

The default installation brings {{ model.techName }} up and running as described in the [Quick Start](/services/beta-jupyter/quick-start/) section. The following installation procedure lets you customize your {{ model.techName }} installation even further. You can easily reach your {{ model.techName }} installation through Marathon-LB via your `vhost`.

## Deploy via web interface

The DC/OS web interface provides a way to deploy the {{ model.techName }} package on your DC/OS cluster.

1. Click on your **Catalog** tab and search for the {{ model.techName }} package.
1. Click **REVIEW & RUN** and then **EDIT** in the now opened modal.
1. Configure your package as needed in the [advanced installation](/services/beta-jupyter/installing/#advanced-installation) section; for example, enabling HDFS support (more details provided in the package description).
1. Click **REVIEW & RUN** and then **RUN SERVICE** to deploy your {{ model.techName }} package as a service.

## Deploy via web interface

The DC/OS web interface provides a convenient way to deploy applications on your DC/OS cluster. 

1. Create an `options.json` that looks like this: default [options.json](options.json)
1. Install your {{ model.techShortName }} service:

```bash
$ dcos package install {{ model.packageName }} --options=options.json --yes
By Deploying, you agree to the Terms and Conditions https://mesosphere.com/catalog-terms-conditions/#community-services
This DC/OS Service is currently in preview. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.

Default password is set to 'jupyter-<Marathon-App-Prefix>'

Advanced Installation options notes

storage / persistence: create local persistent volumes for internal storage files to survive across restarts or failures.

storage / host_volume_size: define the size of your persistent volume, e.g. 4GB.

Note: If you did not select persistence in the storage section, or provided a valid value for host_volume on installation, your data will not be saved in any way

networking / port: This DC/OS service can be accessed from any other application through a NAMED VIP in the format service_name.marathon.l4lb.thisdcos.directory:port. Check status of the VIP in the Network tab of the DC/OS Dashboard (Enterprise DC/OS only).

networking / external_access: create an entry in Marathon-LB for accessing the service from outside of the cluster

networking / external_access_port: port to be used in Marathon-LB for accessing the service.

networking / external_public_agent_ip: dns for Marathon-LB, typically set to your public agents public ip.
Installing Marathon app for package [{{ model.packageName }}] version [1.1.0-0.33.4]
Service installed.
```

## Install {{ model.techShortName }} with GPU support

Before you can start, please make sure your cluster runs at least 1 GPU agent. See the instructions below that use Terraform to spin up a 1 master/1 GPU agent DC/OS cluster.

#### Installing a GPU Cluster on AWS via Terraform

**Prerequisites:**
- Follow the [Getting Started Guide](https://github.com/dcos/terraform-dcos/blob/master/aws/README.md) of our Terraform repo
- Set your AWS Credentials profile
- Copy your ssh-key to AWS. For an example Terraform deployment with GPU support on AWS follow these steps:

<p class="message--note"><strong>NOTE: </strong>Create a new directory before the command below, as Terraform will write its files within the current directory.</p>

1. Initialize your Terraform folder: 
    ```
    terraform init -from-module github.com/dcos/terraform-dcos//aws
    ```
1. Rename `desired_cluster_profile.tfvars.example` to `desired_cluster_profile.tfvar` and configure it like:
    ```
    dcos_cluster_name = "GPU JupyterLab Testcluster"
    dcos_version = "1.11.4"
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
1. Activate GPU agent installation by renaming `dcos-gpu-agents.tf.disabled` into `dcos-gpu-agents.tf`
1. Enable your GPU script via `terraform init`
1. Apply your plan and run: `terraform apply -var-file desired_cluster_profile.tfvars`
1. Approve Terraform to perform these actions by entering `yes` when prompted

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

You can now connect to your newly installed DC/OS cluster by copying the Master ELB Public IP into your browser. In our example this is `fabianbaie-tf7fcf-pub-mas-elb-1180697995.us-west-2.elb.amazonaws.com`

## Deploy {{ model.techShortName }} with GPU Support

You can enable `GPU Support` for your {{ model.techShortName }} service if you want to run your Notebook with GPU acceleration. You can deploy it either via the web interface or via the CLI.

### Deploy via web interface

The DC/OS web interface provides a way to deploy the {{ model.techShortName }} package on your DC/OS cluster with GPU support.

1. Click on your `Catalog` tab and search for the {{ model.techShortName }} package.
1. Click `REVIEW & RUN` and then `EDIT` in the now opened modal.
1. Configure your package as needed (more details are in [advanced installation](#advanced-installation)), in this example we enable GPU support and add 1 GPU.
1. Click `REVIEW & RUN` and then `RUN SERVICE` to deploy your {{ model.techShortName }} package as a service.
1. The package is several gigabytes in size; typically the deployment takes 5 minutes on AWS.

### Deploy via CLI

The DC/OS CLI provides a convenient way to deploy {{ model.techShortName }} to your cluster. 

1. Create an `options.json` that looks like this:

    ```json
    GPU enabled [options_advanced_gpu.json](options_advanced_gpu.json)
    ```

<p class="message--note"><strong>NOTE: </strong>The <code>enable</code> field inside <code>gpu_support</code> is set to <code>true</code> and the <code>gpus</code> field is set to (for example) <code>1</code>.</p>

1. Deploy the package via:

```bash
$ dcos package install {{ model.packageName }} --options=options_advanced_gpu.json --yes
By Deploying, you agree to the Terms and Conditions https://mesosphere.com/catalog-terms-conditions/#community-services
This DC/OS Service is currently in preview. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.

Default password is set to 'jupyter-<Marathon-App-Prefix>'

Advanced Installation options notes

storage / persistence: create local persistent volumes for internal storage files to survive across restarts or failures.

storage / host_volume_size: define the size of your persistent volume, e.g. 4GB.

<p class="message--warning"><strong>WARNING: </strong>If you did not select persistence in the storage section, or provided a valid value for host_volume on installation, <strong>your data will not be saved in any way</strong>.</p>

networking / port: This DC/OS service can be accessed from any other application through a NAMED VIP in the format service_name.marathon.l4lb.thisdcos.directory:port. Check status of the VIP in the Network tab of the DC/OS Dashboard (Enterprise DC/OS only).

networking / external_access: create an entry in Marathon-LB for accessing the service from outside of the cluster

networking / external_access_port: port to be used in Marathon-LB for accessing the service.

networking / external_public_agent_ip: dns for Marathon-LB, typically set to your public agents public ip.
Installing Marathon app for package [{{ model.packageName }}] version [1.1.0-0.33.4]
Service installed.
```

#### Test {{ model.techShortName }} with GPU Support and TensorFlow

After {{ model.techShortName }} is succesfully deployed, authenticate with your password described in the [Quick Start](/services/beta-jupyter/quick-start/) section and create a new notebook in Python 3.

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

#### Access TensorBoard

You can access TensorBoard within your {{ model.techShortName }} instance simply by adding `/tensorboard/` to your browser url: `https://<VHOST>/<Service Name>/tensorboard/`

<p class="message--note"><strong>NOTE: </strong>If you installed your <code>{{ model.packageName }}</code> service under a different name space, just adjust the name in the url.</p>

# Advanced Installation

## Configuration

A typical advanced installation with (for example) HDFS support looks like this, where `external_public_agent_hostname` is the public hostname of your AWS ELB.

HDFS enabled [options_advanced_hdfs.json](options_advanced_hdfs.json)

<p class="message--note"><strong>NOTE: </strong>To use HDFS, set your <code>jupyter_conf_urls</code> to the appropriate endpoint.</p>

You can create this `options_advanced_hdfs.json` manually or via the web interface installation.

## External Access

In order to access your {{ model.techShortName }} service from outside the cluster, the `Marathon-LB` service must be installed.

When enabling `external_access` you point via the `EXTERNAL_PUBLIC_AGENT_HOSTNAME` field to your public agent DNS name. Please be sure to only use the DNS name, without any trailing `/` and leading `http://` or `https://`.

## HDFS Support

The {{ model.techName }} Service fully supports `HDFS`. `HDFS` or `S3` is the recommended go-to when collaborating in multi-user environments. Simply install beforehand `HDFS` to your cluster, for example, in the default settings. Also make sure you point `jupyter_conf_urls` under `Environment` to the appropriate URL, such as  `http://api.hdfs.marathon.l4lb.thisdcos.directory/v1/endpoints`. Missing this step leads to a failing {{ model.techShortName }} service.

## Persistent Storage

When persistent storage is enabled, you will find the `persistent_data` folder in your {{ model.techShortName }} container under `/mnt/mesos/sandbox`.

Now when accessing your {{ model.techShortName }} service and uploading files to your `persistent_data` folder, they are persistently stored.

## Use {{ model.techName }} and BeakerX

By accessing {{ model.techName }}, you are now able to authenticate and try the various [tutorials and examples](http://nbviewer.jupyter.org/github/twosigma/beakerx/blob/master/StartHere.ipynb) from and for `BeakerX`.

## Configuration options

There are a number of configuration options, which can be specified in the following
way:

```bash
$ dcos package install --config=<options> {{ model.packageName }}
```

where `options` is the path to a JSON file, like `options.json`. For a list of possible
attribute values, see

```bash
$ dcos package describe --config {{ model.packageName }}
```

### Changing your Python Version

This section follows the instructions in  [Installing the iPython Kernel](http://ipython.readthedocs.io/en/stable/install/kernel_install.html).

1. In `File` click `new` and open a `Terminal`. 
1. In the terminal, create a new environment with your Python version of choice. For Python `3.5`
```bash
$ conda create -n 3.5 python=3.5 ipykernel
$ source activate 3.5
$ python -m ipykernel install --user --name 3.5 --display-name "Python (3.5)"
$ source deactivate
```
1. When you reload your `Jupyter` page and click `Kernel` you can change now via `Change Kernel...` to your new installed Python `3.5` environment.


