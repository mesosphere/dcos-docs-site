---
layout: layout.pug
navigationTitle: Lab Extension
excerpt: Using JupyterLab Extension with DC/OS Data Science Engine
title: Lab Extension
menuWeight: 12
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
enterprise: true

---

This guide will show you how to install JupyterLab Extension. You can use these extensions to customize the JupyterLab UI.

<p class="message--note"><strong>NOTE: </strong> Installing extension in this way is not persistent during service restart. If you want persistent installation of the extension you should try <a href="https://docs.d2iq.com/mesosphere/dcos/services/data-science-engine/2.0.1/customizations/custom-images#customize-notebook-image">Custom Image</a> with the extension of your choice installed in it.</p>


## Steps to Install

1. Go to the **Commands (Ctrl+Shift+C) -> Extension Manager -> Enable Extension Manager** in the left panel.

    ![Enable Extension Manager](/mesosphere/dcos/services/data-science-engine/img/jupyterlab-enable-extension-manager.png)

    Figure 1 - Enable Extension Manager

1. It will show you the prompt asking for confirmation, click on **Enable**.

    ![Extension Manager Prompt](/mesosphere/dcos/services/data-science-engine/img/jupyterlab-extension-manager-prompt.png)

    Figure 2 - Enable Extension Manager Prompt

1. Now you would be able to see Extension Manager option in the left panel. Once you go to the Extension Manager, you could search for an extension and install it. For the example purpose, we are going to install `@jupyterlab/fasta-extension`.

    ![Extension Manager Search](/mesosphere/dcos/services/data-science-engine/img/jupyterlab-extension-search.png)

    Figure 3 - Search For An Extension

1. Once extension is installed, open Terminal and run following command:
    ```bash
    jupyter lab build --minimize=False --dev-build=False
    ```

1. After successful build, refresh the page. Now you are ready to use the extension.


## Example Notebook

In the following example, you will use a newly installed extension.

Open a `Python Notebook` and put the following in a code cell:

```python
from IPython.display import display
 
def Fasta(data=''):
    bundle = {}
    bundle['application/vnd.fasta.fasta'] = data
    bundle['text/plain'] = data
    display(bundle, raw=True)
 
Fasta(""">SEQUENCE_1
MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG
LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK
IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL
MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL
>SEQUENCE_2
SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQI
ATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH""")
```

Expected output would be:

![FASTA Extension Example](/mesosphere/dcos/services/data-science-engine/img/jupyterlab-fasta-extension-example.png)
