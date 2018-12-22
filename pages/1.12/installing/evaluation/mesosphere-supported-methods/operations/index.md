---
layout: layout.pug
excerpt: Working with your DC/OS cluster using the Universal Installer
title: DC/OS Operations using the Universal Installer
navigationTitle: Day 2 Operations
menuWeight: 15
---

Once you have a cluster up and running using the Mesosphere Universal Installer, here are the most common operations for scaling, upgrading, and destroying.

# Scaling Your Cluster
Terraform makes it easy to scale your cluster to add additional agents (public or private) once the initial cluster has been created. Simply follow the instructions below.

1. Increase the value for the `num_private_agents` and/or `num_public_agents` in your `main.tf` file. In this example we are going to scale our cluster from 2 private agents to 3, changing just that line, and saving the file.

    ```bash
    num_masters        = "1"
    num_private_agents = "3"
    num_public_agents  = "1"
    ```

1. Now that we’ve made changes to our `main.tf`, we need to re-run our new execution plan.

    ```bash
    terraform plan -out=plan.out
    ```

    Doing this helps us to ensure that our state is stable and to confirm that we will only be creating the resources necessary to scale our Private Agents to the desired number.

    <p align=center>
    <img src="./images/scale/terraform-plan.png" />
    </p>

    You should see a message similar to above.  There will be 3 resources added as a result of scaling up our cluster’s Private Agents (1 instance resource & 2 null resources which handle the DC/OS installation & prerequisites behind the scenes).

1. Now that our plan is set, just like before, let’s get Terraform to build/deploy it.

    ```bash
    terraform apply plan.out
    ```

    <p align=center>
    <img src="./images/scale/terraform-apply.png" />
    </p>

    Once you see an output like the message above, check your DC/OS cluster to ensure the additional agents have been added.

    You should see now 4 total nodes connected like below via the DC/OS UI.

    <p align=center>
    <img src="./images/scale/node-count-4.png" />
    </p>

# Upgrading Your Cluster

The current getting started guide has already started you on the latest version of DC/OS, 1.12.0. Terraform also makes it easy to upgrade our cluster to a newer version of DC/OS. If you are interested in learning more about the upgrade procedure that Terraform performs, please see the official [DC/OS Upgrade documentation](/1.12/installing/production/upgrading/).

<p class="message--warning"><strong>Warning: </strong>Rollbacks are not supported by this method. This example is written for an operator who is starting from DC/OS 1.11.4 and performing a minor upgrade.</p>

1. In order to perform an upgrade, we need to go back to our `main.tf` and modify the current DC/OS Version (`dcos_version`) to a newer version, such as `1.11.5` for this example, and also specify an additional parameter (`dcos_install_mode`). By default this parameter is set to `install`, which is why we were able to leave it unset when creating the initial DC/OS cluster and scaling it.

    <p class="message--important"><strong>IMPORTANT: </strong>Do not change any number of masters, agents or public agents while performing an upgrade.</p>

    ```hcl
    dcos_version = "1.11.5"
    ```

1. Re-run the execution plan, temporarily overriding the default install mode by setting the flag to read in the extra variable.

    ```bash
    terraform plan -out=plan.out -var dcos_install_mode=upgrade
    ```

    You should see an output like below, with your `main.tf` now set for normal operations on a new version of DC/OS.

    <p align=center>
    <img src="./images/upgrade/terraform-plan.png" />
    </p>

1. Apply the plan.

    ```bash
    terraform apply plan.out
    ```

    Once the apply completes, you can verify that the cluster was upgraded via the DC/OS UI.

    <p align=center>
    <img src="./images/upgrade/cluster-details-open.png" />
    </p>

# Deleting Your Cluster

If you want to destroy your cluster, then use the following command and wait for it to complete.

```bash
terraform destroy
```

<p class="message--important"><strong>Important: </strong>Running this command will cause your entire cluster and all at its associated resources to be destroyed. Only run this command if you are absolutely sure you no longer need access to your cluster.</p>

You will be required to enter `yes` to verify.

<p align=center>
<img src="./images/destroy/terraform-destory.png" />
</p>