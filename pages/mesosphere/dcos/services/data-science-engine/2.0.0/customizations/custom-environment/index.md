---
layout: layout.pug
navigationTitle: Custom Environment
excerpt: Using Custom Conda Environment with DC/OS Data Science Engine
title: Custom Environment
menuWeight: 12
enterprise: true

---

This guide will show you how to create a custom Conda Virtual Environment and use it to launch the notebook. You can use these custom-built environment to install Python/Conda libraries which are not part of the existing environment.

## Steps to Create

Open a `Terminal` Notebook and run the following commands.

1. **Initialize the environment**:
    
    ```bash
    cd ~              # Make sure you are in the HOME directory.
    conda init bash
    source .bashrc
    ```

1. **Create an environment file**:
    For the example sake, we are assuming that the library we want to install is `arrow`, name of the environment is `myenv` and environment file name is `env.yml`. The content of the environment file would be as follows:

    ```yml
    name: myenv
    channels:
        - conda-forge
    dependencies:
        - python==3.7
        - pip:
            - arrow
            - ipykernel
    ```

1. **Create and activate the environment**:

    ```bash
    conda env create -f env.yml
    conda activate myenv
    ```

1. **Create a kernel with the environment**:

    ```bash
    python -m ipykernel install --user --name=myenv --display-name="MyEnv"
    # Reload the browser to refelect the installed kernel
    ```

## Example Notebook

In the following example, you will use a newly installed kernel.

Open a `Python Notebook`, select kernel `MyEnv` and put the following in a code cell:

```python
import arrow

utc = arrow.utcnow()
utc = utc.shift(hours=-1)
local = utc.to('US/Pacific')
local.humanize()
```

Expected output would be:

```text
an hour ago
```
