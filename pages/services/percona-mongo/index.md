---
layout: layout.pug
navigationTitle: Percona-mongo
title: Percona-mongo
menuWeight: 70
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-mongo -->


Welcome to the documentation for the DC/OS Percona Server for MongoDB service. For more information about new and changed features, see the [release notes](https://github.com/mesosphere/dcos-mongo/releases/).

DC/OS Percona Server for MongoDB is an automated service that makes it easy to deploy and manage Percona Server for MongoDB on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing a MongoDB Replica Set. [Percona Server for MongoDB](https://www.percona.com/software/mongo-database/percona-server-for-mongodb) is a free, enhanced, fully compatible, open source, drop-in replacement for the MongoDB® Community Server that includes enterprise-grade features and functioality. MongoDB Replica Sets are highly available, fault tolerant and provide tuneable consistency and durability.

DC/OS percona-mongo gives you direct access to the Kafka API so that existing producers and consumers can interoperate. You can configure and install DC/OS percona-mongo in moments. Multiple Percona-mongo replica sets can be installed on DC/OS and managed independently.

Benefits

DC/OS percona-mongo offers the following benefits of a semi-managed service:

*   Easy installation
*   Multiple MongoDB Replica Sets within a single DC/OS cluster
*   Scaling-up of Replica Set members
*   Replication for high availability
*   Optional Percona PMM agent installation for database and container-level monitoring 
*   Optional, manual backup support using Percona-Lab/mongodb_consistent_backup

# Features

DC/OS percona-mongo provides the following features:

*   Single-command installation for rapid provisioning
*   Multiple clusters for multiple tenancy with DC/OS
*   Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes

Choose a version at the left to get started!
