---
layout: layout.pug
navigationTitle: Overview
excerpt: Overview of DC/OS Data Science Engine features
title: Overview
menuWeight: 1
model: /services/data-science-engine/data.yml
render: mustache
---

{{ model.techName }} supports and develops the interactive computing products Jupyter Notebook and Jupyter Hub. 

# The Jupyter Family

The data science community has converged around Jupyter Notebook; an interactive computing notebook developed and supported by Project Jupyter, as the de facto user interface for cloud computing. Jupyter Notebook has proven itself to be a phenomenally effective tool for prototyping and exploration. 
{{ model.techName }} is the next-generation interface for Project Jupyter, offering the same tools that are familiar to Jupyter Notebook users: terminal, text editor, notebook, file browser, and so forth. Users can work with text editors, terminals, data file viewers, and other components in a notebook with tabbed work areas.

# {{ model.techName }} at the Enterprise level
There are several reasons for adopting {{ model.techName }} at the Enterprise level. 
- Set-up is too long - While Jupyter Notebooks has been a great and easy tool for data scientists to work with on their laptops, provisioning it for enterprise level use is a much more complex task. When data science teams collaborate on large projects, they spend a significant portion of their time installing the software and libraries they need to work on their projects. Version dependencies and operating system incompatibilities make set-up slow and painful. It can take data scientists days or weeks just to prepare the working environment needed to run a complex project. {{ model.techName }} shortens the time to deployment for large projects.
- Security and silo environments restrain collaboration - Jupyter Notebooks are an effective tool for prototyping and exploratoration. But when data scientists work in a vacuum on their local machine or workstations, cut off from their peers, they can't easily collaborate and get real-time feedback. In addition, enforcing data security policy across a large number of silo environments not only slows down data access but increases the risk of data breaches. These challenges can slow model development and deployment.  
- Training and tuning large data models takes a long time - The new generation of sophisticated models perform better when you feed them more data. To be able to train these sophisticated models in a timely manner, data scientists need to have access to a large pool of compute resources. Integrating and utilizing distributed and parallel computing tools may present a steep learning curve or prove challenging to exploit by data scientists.
## What is included in {{ model.techName }}?

{{ model.techName }} works on any infrastructure (cloud, bare metal and virtual)
- Framework lifecycle for upgrades and updates 
- 24/7 Mesosphere engineering support for all components included in the stack
    - {{ model.techName }}
    - Spark and Spark History Server 
    - TensorFlow
    - TensorFlow on Spark
    - Tensorboard
    - Integration to pool CPU and GPU compute resources in the entire cluster
    - Easy configurable resource quota to dynamically share cluster resources
    - Secure AuthN+Z to the Notebook UI with OpenID Connect 
    - Secured access to datasets on Kerberized HDFS and Authenticated S3 Buckets
    - Pre-installed Python, R , Scala and many more kernels
    - Pre-installed Apache Toree kernels (Spark, R, Scala) 
    - Pre-installed popular Python and R libraries
