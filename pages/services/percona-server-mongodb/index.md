---
layout: layout.pug
navigationTitle: Percona-Server-MongoDB
title: Percona-Server-MongoDB
menuWeight: 85
excerpt: Percona Server for MongoDB is a free, enhanced, fully compatible, open source, drop-in replacement for the MongoDB® Community Server that includes enterprise-grade features and functionality.
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-mongo -->


Welcome to the documentation for the DC/OS [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) service. For more information about new and changed features, see the [release notes](https://docs.mesosphere.com/services/percona-server-mongodb/0.4.1-3.6.8/release-notes/).

[Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is a free, enhanced, fully compatible, open source, drop-in replacement for the MongoDB® Community Server that includes enterprise-grade features and functionality. [Percona Server for MongoDB](https://www.percona.com/softtware/mongo-database/percona-server-for-mongodb) provides enterprises all the cost and agility benefits provided by free, proven open source software that delivers all the latest MongoDB Community Edition features, with additional Enterprise features and a greater choice of storage engines. Along with improved insight into the database environment, the solution provides enhanced control options for optimizing a wider range of database workloads with greater reliability and security.

This DC/OS service installs and configures a [MongoDB Replica Set](https://docs.mongodb.com/manual/replication/) and provides additional features for administration, monitoring and backups.

# Benefits

DC/OS Percona-Server-MongoDB offers the following benefits of a semi-managed service:

*   Easy installation
*   Multiple MongoDB Replica Sets within a single DC/OS cluster
*   Self-managing MongoDB Replica Sets for high availability
*   Scaling-up of MongoDB Replica Set members
*   Auto-recovery of down/failed MongoDB members
*   Automation of user-administration, monitoring and backups

# Features

DC/OS Percona-Server-MongoDB provides the following features:

*   Single-command installation for rapid provisioning
*   Multiple MongoDB Replica Sets within a single DC/OS cluster
*   Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
*   Simple installation of MongoDB via UI or CLI
*   Support for all Percona Server for MongoDB storage engines, including the [WiredTiger](https://docs.mongodb.com/manual/core/wiredtiger/), [InMemory](https://www.percona.com/software/mongo-database/percona-memory-engine-for-mongodb) and [MMAPv1](/services/include/uninstall.tmpl)
*   Auto-configuration of [MongoDB Replica Set Configuration](https://docs.mongodb.com/manual/reference/replica-configuration/)
*   Auto-configuration of system-level users for backups, monitoring and user management
    *   CLI actions for Add/Update/Remove of [MongoDB Users](https://docs.mongodb.com/manual/tutorial/manage-users-and-roles/)
    *   Logical backup support with [Amazon Web Services S3](https://aws.amazon.com/s3) remote upload
        *   Support for auto-deploy of [Hidden Replica Set Member](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) for zero-impact backups
*   Percona Server for MongoDB [Auditing support](https://www.percona.com/doc/percona-server-for-mongodb/auditing.html)

Choose a version at the left to get started!
