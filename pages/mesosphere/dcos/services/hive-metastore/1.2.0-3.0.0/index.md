---
layout: layout.pug
navigationTitle: Hive Metastore 1.2.0-3.0.0
excerpt: DC/OS Hive Metastore is an automated service that makes it easy to deploy and manage Hive Metastore on Mesosphere DC/OS.
title: Hive Metastore 1.2.0-3.0.0
menuWeight: 1
model: /mesosphere/dcos/services/hive-metastore/data.yml
render: mustache
---

DC/OS {{ model.techName }} is an automated service that makes it easy to deploy 
and manage {{ model.techName }} on Mesosphere DC/OS, eliminating nearly all of 
the complexity traditionally associated with managing a {{ model.techShortName }} 
cluster. {{ model.techName }} is a metadata store for all Hive object definitions 
such as databases, tables, and functions. The Metastore can persist these definitions
to a relational database (RDBMS) and can be configured to embed the Apache Derby 
RDBMS or connect to an external RDBMS (such as MySQL). The {{ model.techShortName }} 
can be configured to be highly available, fault tolerant, and durable. 
For more information on {{ model.techName }}, see the {{ model.techName }} 
[documentation](https://cwiki.apache.org/confluence/display/Hive/AdminManual+Metastore+3.0+Administration). 


## Benefits

DC/OS {{ model.techShortName }} offers the following benefits of a semi-managed service:

*   Easy installation
*   Simple horizontal scaling of {{ model.techShortName }} nodes
*   Multiple {{ model.techShortName }} nodes enable high availability

## Features

DC/OS {{ model.techShortName }} provides the following features:

*   Single-command installation for rapid provisioning
*   Multiple clusters for multi-tenancy with DC/OS
*   High availability runtime configuration and software updates

