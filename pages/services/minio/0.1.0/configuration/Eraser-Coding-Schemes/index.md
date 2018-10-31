---
layout: layout.pug
navigationTitle: Eraser Coding Scheme in MInio
title: Eraser Coding Scheme in Minio
menuWeight: 45
excerpt: Eraser Coding Scheme
featureMaturity:
enterprise: false
---

## Erasure Coding Schemes

Minio specifies two storage classes to define Erasure Coding Scheme: Standard Storage class and Reduced Redundancy Storage class.

### Allowed values for STANDARD storage class

`STANDARD` storage class implies more parity than `REDUCED_REDUNDANCY` class. So, `STANDARD` parity disks should be

- Greater than or equal to 2, if `REDUCED_REDUNDANCY` parity is not set.
- Greater than `REDUCED_REDUNDANCY` parity, if it is set.

Parity blocks can not be higher than data blocks, so `STANDARD` storage class parity can not be higher than N/2. (N being total number of disks)

Default value for `STANDARD` storage class is `N/2` (N is the total number of drives).

### Allowed values for REDUCED_REDUNDANCY storage class

`REDUCED_REDUNDANCY` implies lesser parity than `STANDARD` class. So,`REDUCED_REDUNDANCY` parity disks should be

- Less than N/2, if `STANDARD` parity is not set.
- Less than `STANDARD` Parity, if it is set.

As parity below 2 is not recommended, `REDUCED_REDUNDANCY` storage class is not supported for 4 disks erasure coding setup.

Default value for `REDUCED_REDUNDANCY` storage class is `2`.
