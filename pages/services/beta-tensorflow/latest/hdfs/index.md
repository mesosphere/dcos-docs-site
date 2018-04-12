---
layout: layout.pug
excerpt:
title: Integration with HDFS
navigationTitle: HDFS
model: /services/beta-tensorflow/data.yml
hdfs_model: /services/hdfs/data.yml
menuWeight: 20
---

# Connecting to HDFS

## Configuring the connection

If you plan to read and write from HDFS using {{ model.techName}}, there are two Hadoop configuration files that should be included on {{ model.techShortName }}'s classpath:
* `hdfs-site.xml`, which defines default behaviors for the HDFS client
* `core-site.xml`, which sets the default filesystem name.

In order to get access to these file, set the `service.hdfs.config_uri` option in the {{ model.techShortName }} service configuration to be an URL that serves your `hdfs-site.xml` and `core-site.xml` files.

For example, if `http://mydomain.com/hdfs-config/hdfs-site.xml` and `http://mydomain.com/hdfs-config/core-site.xml` are valid URLs, add the following options in addition to your own
```json
{
  "service": {
    "hdfs": {
      "config_url": "http://mydomain.com/hdfs-config"
    }
  }
}
```
This can also be done through the UI.

If you are using a DC/OS {{ hdfs_model.techName }} service with a service name of {{ hdfs_mode.serviceName }}, the endpoint to specify here would be {{ hdfs_mode.endpoint }}.

## Accessing files

In order to access files on HDFS, the path of the file should be specified starting with `hdfs://default`. In the case of summaries or checkpoints, an HDFS path should be specified in the `service.shared_filesystem` configuration option which in turn is passed to the job `main` entrypoint as the `log_dir` parameter where it can be used with code such as the following:
```python
train_writer = tf.summary.FileWriter(os.path.join(log_dir, 'train'), tf.get_default_graph())
```

If the `service.shared_filesystem` setting was defined as `hdfs://default`, the resultant summary file will be created in the `/train` folder on HDFS.


## Authorization

If the HDFS being used by {{ model.techName }} supports or requires Kerberos, it is important to set up the relevant permissions on the HDFS folders so that the Kerberos principal used by {{ model.techName }} has the required access permissions.
