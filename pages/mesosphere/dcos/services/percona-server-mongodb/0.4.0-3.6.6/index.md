---
layout: layout.pug
navigationTitle:  Percona-Server-MongoDB 0.4.0-3.6.6
title: Percona-Server-MongoDB 0.4.0-3.6.6
menuWeight: 10
excerpt: Percona-Server-MongoDB 0.4.0-3.6.6
featureMaturity:
community: true
---

DC/OS Percona-Server-MongoDB is an automated service that makes it easy to deploy and manage [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) on Mesosphere [DC/OS](https://mesosphere.com/product/), eliminating nearly all of the complexity traditionally associated with managing a cluster of Percona-Server-MongoDB nodes.

<p class="message--warning"><strong>WARNING: </strong>This is a Community service. Community services are not tested for production environments. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.</p>

## Features

[Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is a free, enhanced, fully compatible, open source, drop-in replacement for the MongoDB® Community Server. It includes enterprise-grade features and functionality.[ Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) provides enterprises all the cost and agility benefits provided by free, proven open source software that delivers all the latest MongoDB Community Edition features, with additional Enterprise features and a greater choice of storage engines. Along with improved insight into the database environment, the solution provides enhanced control options for optimizing a wider range of database workloads with greater reliability and security.

This DC/OS service installs and configures a [MongoDB Replica Set](https://docs.mongodb.com/manual/replication/) and provides additional features for administration, monitoring and backups.

DC/OS Percona-Server-MongoDB service features:
*   Single-command installation for rapid provisioning
*   Multiple MongoDB Replica Sets within a single DC/OS cluster
*   Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
*   Simple installation of MongoDB via UI or CLI
*   Support for all Percona Server for MongoDB storage engines, including the [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/), [InMemory](https://www.percona.com/software/mongo-database/percona-memory-engine-for-mongodb) and [MMAPv1](https://docs.mongodb.com/manual/core/mmapv1/)
*   Scaling of MongoDB Replica Set Members via UI or CLI
*   Auto-configuration of [MongoDB Replica Set Configuration](https://docs.mongodb.com/manual/reference/replica-configuration/)
*   Auto-configuration of system-level users for backups, monitoring and user management
    *   CLI actions for Add/Update/Remove of [MongoDB Users](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/)
    *   CLI actions for Backup and Restore
    *   Logical backup support with [Amazon Web Services S3](https://aws.amazon.com/s3) remote upload
        *   Support for auto-deployment of [Hidden Replica Set Member](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) for zero-impact backups
*   Percona Server for MongoDB [Auditing support](https://www.percona.com/doc/percona-server-for-mongodb/auditing.html)
*   MongoDB TLS/SSL transport encryption **(Requires Secret Store feature - DC/OS Enterpise Edition only)**
