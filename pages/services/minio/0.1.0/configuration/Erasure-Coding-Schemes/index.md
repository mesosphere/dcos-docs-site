---
layout: layout.pug
navigationTitle: Erasure Coding Scheme
title: Erasure Coding Scheme in Minio
menuWeight: 45
excerpt: Defining two Erasure Coding Schemes in Minio
featureMaturity:
enterprise: false
model: /services/minio/data.yml
render: mustache
---

# Erasure Coding 

Erasure code is a mathematical algorithm to reconstruct missing or corrupted data. DC/OS {{ model.techName }} specifies two storage classes to define an Erasure Coding Scheme: STANDARD Storage class and REDUCED_REDUNDANCY Storage class.

## Allowed values for STANDARD storage class

`STANDARD` storage class implies more parity than `REDUCED_REDUNDANCY` class. `STANDARD` parity disks should be

- Greater than or equal to 2, if `REDUCED_REDUNDANCY` parity is not set.
- Greater than `REDUCED_REDUNDANCY` parity, if it is set.

Parity blocks can not be higher than data blocks, so `STANDARD` storage class parity can not be higher than N/2. (N = total number of disks)

Default value for `STANDARD` storage class is `N/2` (N = the total number of drives).

## Allowed values for REDUCED_REDUNDANCY storage class
Default value for `REDUCED_REDUNDANCY` storage class is `2`.

`REDUCED_REDUNDANCY` implies lesser parity than `STANDARD` class. `REDUCED_REDUNDANCY` parity disks should be

- Less than N/2, if `STANDARD` parity is not set.
- Less than `STANDARD` Parity, if it is set.

Parity below 2 is not recommended, therefore a `REDUCED_REDUNDANCY` storage class is not supported for an erasure coding setup for four disks.

