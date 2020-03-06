---
layout: layout.pug
navigationTitle: Updating 
excerpt: Updating DSE
title: Updating 
menuWeight: 40
model: /mesosphere/dcos/services/dse/data.yml
render: mustache
---

<!-- #include /mesosphere/dcos/services/include/update.tmpl -->

# Upgrading your cluster from {{ model.techShortName }} 5.1.10 to 6.7.6
Due to the complexity of upgrading to {{ model.techShortName }} 6.7, we strongly advise that you attempt the upgrade on a test cluster before upgrading in your production environment. 

Also we advise that you upgrade 5.1.10 directly to 6.7.6, skipping 6.7.2, as it has a problem in upgrading when TLS is enabled. 

<p class="message--important"><strong>IMPORTANT: </strong> <br />
1. This action cannot be undone and you should plan for increased load activity on your cluster. This task should be scheduled for off-peak hours. Should any problems arise, <tt>pause</tt> the plan and investigate.<br />
2. You must set properties <tt>dse_search</tt> and <tt>dse_analytics</tt> to <tt>true</tt> before upgrading. Afterward, you can reset the configs to the desired value.<br />
3. Due to a bug in DC/OS 2.0.0, upgrading DSE to 6.7.6 will not work. Instead, first upgrade DC/OS to 2.0.1 and then upgrade DSE to 6.7.6.
</p>



## Prerequisites

In order to upgrade your cluster from {{ model.techShortName }} 5.1.10 to {{ model.techShortName }} 6.7.6 you must:
- Review official {{ model.techShortName }} [upgrade docs](https://docs.datastax.com/en/upgrade/doc/upgrade/datastax_enterprise/upgdDSE51to67.html)
  - follow instructions in the [Upgrade restrictions and limitations](https://docs.datastax.com/en/upgrade/doc/upgrade/datastax_enterprise/upgdDSE51to67.html#Upgraderestrictionsandlimitations)
  - if using CFS, copy your data from it
  - Using `cqlsh`, drop CFS keyspaces: `cfs` and `cfs_archive`
-  If authentication is configured by client in the cluster, then before running the upgrade command, you must create file `dse-data/cqlshrc` on node-0 with authentication options as below :
    ```
    [authentication]
    username = user
    password = password
    ```

## Procedure

1. Run the following command to upgrade your {{ model.techShortName }} package: 
    ```
    dcos datastax-dse update start --package-version=3.1.0-6.7.6
    ```
    This will run a script to drop `COMPACT_STORAGE` from all keyspaces and then upgrade each {{ model.techShortName }} node to version `6.7.6`

1. After {{ model.techShortName }} upgrade, you can upgrade {{ model.techOpsName }} with the following command: 

    ```
    dcos datastax-ops update start --package-version=3.1.0-6.7.6
    ```
1. After the {{ model.techOpsName }} upgrade finishes, run the following command to convert `sstables` to the proper version:
	```
	dcos datastax-dse plan start nodetool-ser \
	  [-p NODETOOL_CONNECTION_OPTS='-p 7199']  \  ## optional
	  -p NODETOOL_SUBCOMMAND='upgradesstables'  \
	  -p NODETOOL_CMD_ARGS='-a'
	```
	
