---
layout: layout.pug
navigationTitle: Upgrade 
excerpt: Upgrading DC/OS Data Science Engine
title: Upgrade
menuWeight: 7
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

{{ model.techName }} does not support in-place upgrades. In order to transition to a new version you must manually back up your data located in your `jupyter_data` folder and upload it to a new instance of {{ model.techName }}, running on the latest version using the following guide.

1. Navigate to the root of your Jupyter Notebook UI and run the following command to compress the contents of your jupyter_data folder:
    ```bash
    nobody@95602332-7dd1-4a24-b2a5-b0fa028c0998:/mnt/mesos/sandbox$ tar -cvf jupyter_data.tar.gz jupyter_data
    ```

    <p class="message--note"><strong>NOTE: </strong> If you have files you would like to keep from outside of the <tt>jupyter_data</tt> folder, you should also back up these files, but keep in mind that only the data in the <tt>jupyter_data</tt> folder persists between service restarts. If you copy files from outside of the <tt>jupyter_data</tt> directory, please ensure you do not copy any hidden files that could interfere with the operation of {{ model.techName }} after being uploaded to the new instance.</p>
1. Use the **Download** button to download `jupyter_data.tar.gz`.

    <img src="/mesosphere/dcos/services/data-science-engine/img/dcos-data-science-engine-notebook-download.png" alt="{{ model.techName }} Notebook Download"/>

1. Deploy a new instance of {{ model.techName }},  specifying the upgrade version. You may need to tear down your existing {{ model.techName }} instance depending on the available resources in the cluster.
1. From the new instance's UI, select the **Upload** button to transfer `jupyter_data.tar.gz` to the sandbox of the new {{ model.techName }} instance.
    
    <img src="/mesosphere/dcos/services/data-science-engine/img/dcos-data-science-engine-notebook-upload.png" alt="{{ model.techName }} Notebook Upload"/>

1. Then run the following command to unzip the contents of the archive to the `jupyter_data` folder:

    ```bash
    nobody@e08af121-e9e7-4c0f-8188-23bfead5080a:/mnt/mesos/sandbox$ tar -xvf jupyter_data.tar.gz
    ```
    
    <img src="/mesosphere/dcos/services/data-science-engine/img/dcos-data-science-engine-notebook-untar.png" alt="{{ model.techName }} Notebook Unzip"/>