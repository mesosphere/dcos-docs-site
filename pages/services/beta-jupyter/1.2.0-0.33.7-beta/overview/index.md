---
layout: layout.pug
navigationTitle: Overview
title: Overview
menuWeight: 10
excerpt: Learning about JupyterLab
featureMaturity:
enterprise: false
model: /services/beta-jupyter/data.yml
render: mustache
---

[JupyterLab](https://github.com/jupyterlab/jupyterlab) is the next-generation web-based user interface for [Project Jupyter](http://http://jupyter.org). It is an extensible environment for interactive and reproducible computing, based on the Jupyter Notebook and Architecture. The [Jupyter Notebook](https://github.com/jupyter/notebook) is an open-source web application that allows you to create and share documents that contain live code, equations, visualizations and narrative text. Uses include: data cleaning and transformation, numerical simulation, statistical modeling, data visualization, machine learning, and much more.

The initial release of the {{ model.techShortName }} Notebook Service for Mesosphere DC/OS contains:

* [Apache Spark](https://spark.apache.org/docs/2.2.1) 2.2.1 -
Apache Spark™ is a unified analytics engine for large-scale data processing.
* [BeakerX](http://beakerx.com) 1.0.0 -
BeakerX is a collection of kernels and extensions to the Jupyter interactive computing environment. It provides JVM support, Spark cluster support, polyglot programming, interactive plots, tables, forms, publishing, and more.
* [Dask](https://dask.readthedocs.io) 0.18.2 -
Dask is a flexible parallel computing library for analytic computing.
* [Distributed](https://distributed.readthedocs.io) 1.22.0 -
Dask.distributed is a lightweight library for distributed computing in Python. It extends both the concurrent.futures and dask APIs to moderate sized clusters.
* [JupyterLab](https://jupyterlab.readthedocs.io) 0.33.4 -
JupyterLab is the next-generation web-based user interface for [Project Jupyter](https://jupyter.org).
* [PyTorch](https://pytorch.org) 0.4.0 -
Tensors and Dynamic neural networks in Python with strong GPU acceleration. PyTorch is a deep learning framework for fast, flexible experimentation.
* [Ray](https://ray.readthedocs.io) 0.5.0 -
Ray is a flexible, high-performance distributed execution framework.
  * Ray Tune: Hyperparameter Optimization Framework
  * Ray RLlib: Scalable Reinforcement Learning
* [TensorFlow](https://www.tensorflow.org) 1.9.0 -
TensorFlow™ is an open source software library for high performance numerical computation.
* [TensorFlowOnSpark](https://github.com/yahoo/TensorFlowOnSpark) 1.3.2 -
TensorFlowOnSpark brings TensorFlow programs onto Apache Spark clusters.
* [XGBoost](https://xgboost.ai) 0.72 -
Scalable, Portable and Distributed Gradient Boosting (GBDT, GBRT or GBM) Library, for Python, R, Java, Scala, C++ and more.

It also includes support for:
* OpenID Connect Authentication and Authorization based on email address or User Principal Name (UPN) (for Windows Integrated Authentication and AD FS 4.0 with Windows Server 2016)
* HDFS connectivity
* S3 connectivity
* GPUs with the `<image>:<tag>-gpu` Docker Image variant built from `Dockerfile-cuDNN`

# Further resources
Pre-built JupyterLab Docker Images for Mesosphere DC/OS: [https://hub.docker.com/r/dcoslabs/dcos-jupyterlab/tags/](https://hub.docker.com/r/dcoslabs/dcos-jupyterlab/tags/)

Related Docker Images:
 * Machine Learning Worker for Mesosphere DC/OS: [https://hub.docker.com/r/dcoslabs/dcos-ml-worker/tags/](https://hub.docker.com/r/dcoslabs/dcos-ml-worker/tags/)
 * Apache Spark (with GPU support) for Mesosphere DC/OS: [https://hub.docker.com/r/dcoslabs/dcos-spark/tags/](https://hub.docker.com/r/dcoslabs/dcos-spark/tags/)
