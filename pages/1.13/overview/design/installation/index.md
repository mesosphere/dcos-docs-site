---
layout: layout.pug
excerpt: Understanding how the installation process works
title: Installation Design
navigationTitle: Installation
menuWeight: 4
---

Building, installing and operating DC/OS must be a repeatable process. Even small error rates are unacceptable when you are working with 10,000 hosts.  DC/OS comprises more than 30 different libraries, services and support packages, so a non-standard approach is required. Trying to treat each of those components as independent artifacts to install and configure on target hosts would introduce failures that would prevent customers from relying on the system.

It is possible to build a system that is bulletproof. Once the build process is complete, you will have a single artifact that contains all the components required to install and run. Having a single artifact allows us to make some assumptions and guarantees.

- The bits are identical on every host, with different roles; they just use a different subset of components.
- Upgrades are atomic and do not have odd component incompatibilities.
- Downloads do not depend on multiple different sources, since there is just a single file that is trivial to verify for completion and corruption.


# Design Goals

It is important to understand the constraints you are working with. Here are the design goals for DC/OS:

- Minimize dependencies on the host OS. This enables DC/OS to run in as many environments as possible.
- The host OS should be fully customizable. Everyone has a different set of tools that they are currently using. Those tools should work without any changes or porting. This is particularly important when it comes to hardware specific features like kernel modules.
- Minimize dependencies on the host. It is hard to orchestrate the order in which dependent hosts come up (master, agents). They should be able to come up in any order and only start working when their dependencies are established and provided to the cluster.
- The minimum external infrastructure should be required. It is rare for external infrastructure such as PXE boot images and NFS storage to exist.
- There should be a choice of method for deployment. If you are comfortable with your existing system, there should be no need to learn a new one. The integration should have a clean interface and be as simple as possible.
- Make it easy to integrate between DC/OS and existing systems such as config management tools and CloudFormation. The integration interface must be simple and well documented.
- Bundle all dependencies and libraries as a single artifact. Normal lifecycle processes will upgrade or downgrade libraries and dependencies entirely outside of DC/OS. The system will be less fragile and more stable if it does not rely on these.
- Allow users to modify code and configuration in a live system, if necessary. While this is an anti-pattern, it will help keep your infrastructure up at critical times.
- Installs must work as close to 100% as possible. Even a 1% failure rate when you are operating a 1000 host cluster will cause 10 failure cases that require manual intervention.
- Upgrade and rollback of upgrades must be atomic at a host level.
- Make it possible to audit the state of the cluster. When you are running large clusters, it is easy to get into a situation that makes it hard to rely on the state of a single host.


## Packaging

We chose tarballs for the packaging format because they work everywhere. A tarball is a compressible file format that bundles a number of files together into a single archive. There are many common packaging formats out there (deb, rpm, wheel, gem, jar, etc), but they are all just tarballs. Unfortunately, almost all the common formats are built around a single distribution or language, making them hard to use across distros and languages. Some features like pre-install and post-install scripts are really handy to help nudge a system into the right “state”. That is not worth the possibility of having unpredictable results and/or untested corner cases. Therefore, we simplified the process and made the package installation one step: tarball extraction. No arbitrary code execution is required, and reproducibility is guaranteed.

All of the components in DC/OS are built into a single tarball that is extracted to `/opt/mesosphere` on the host system. Inside that directory is something that looks a lot like `/usr/local`. Each component lives in its own package directory. The important files are linked to the important directories like `bin` and `lib`.

## Building

The master artifact must be assembled. The DC/OS build is made up of a changing list of components, so the build tooling looks like its own little package manager. Each component must be built from source, configured in a repeatable fashion and then added into the master artifact.

A DC/OS package is defined by two files: [`build`][1] and [`buildinfo.json`][2]. These state what must be downloaded and how to build it. At build time, the toolchain takes care of building, packaging and including all the artifacts required into the master tarball.

## Installing

Now that there is a single package containing all the built components to run DC/OS, each installation must be configured before being placed on hosts. If you keep this configuration small and immutable, you can be sure that every host in your cluster will act the same way.

The configuration tool builds all components into a package that contains everything to get the cluster running. You will pick from a small list of details like DNS configuration and bootstrap information. This gets added to the single tarball that you built. You then have a package that is customized for your hardware and will repeatably create clusters of any size over and over.

Orchestrating the rollout of an installation is difficult, particularly when you are required to do things in a specific order. To keep everything as simple as possible, at the host level DC/OS makes no assumptions about the state of the cluster. You can install agents and then masters or even install both at the same time!

Once your package is built, you can get going by running `dcos_install.sh` on every host. This script only does three things:

- Downloads the package to the current host.
- Extracts the package into `/opt/mesosphere`.
- Initiates installation using the [DC/OS Component Package Manager (Pkgpanda)](/1.13/overview/architecture/components/#dcos-component-package-manager).

Once the ZooKeeper cluster reaches quorum on the masters and Mesos comes up, every agent will join the cluster. We have kept the steps to a minimum to make sure they are as reliable as possible.

## Tradeoffs

Obviously, there are other ways that this could have been architected. Let us take a look at some of the common questions and why the current decisions were made.


## Immutable configuration

The configuration for each cluster is generated at the beginning and becomes immutable. This allows us to guarantee that the configuration is correct on every host after install. Remember, you will be doing this for thousands of nodes. These guarantees around configuration reduce the amount of documentation required to run DC/OS and make it easier to support.

With an immutable configuration, there is no chance of a host getting part of its configuration updated or changed. Many of the production issues we have encountered are ameliorated by this design decision.

### What IP should I bind to?

Deciding the IP and network interface that has access to the network and the Mesos master is non-trivial. Here are examples of environments where we cannot make default assumptions:

- In split horizon environments like AWS, the hostname might resolve to an external IP address instead of an internal one.
- In environments without DNS, we need you to tell us what IP address it has.
- In environments with multiple interfaces, we are unable to automatically pick which interface to use.
- Not all machines have resolvable hostnames, so you cannot do a reverse lookup.

We have struggled to produce a solid default because of these constraints. To make it as configurable as possible, we have a script that can be written to return the IP address we should bind to on every host. There are multiple examples in the documentation of how to write `ip-detect` script for different environments, which should cover most use cases. For those for which the default does not work, you will be able to write your own `ip-detect` script and integrate it with your configuration. The most important part of the configuration is `ip-detect`, and it is the only way your clusters will be able to come up successfully.

### Single vs. multiple packages, per-provider packages (RPM, DEB, etc)

Rather than bundle all the packages together into a single image, we could have gone the default route that most use today and install them all separately. This would immediately pose a couple of problems:

- Moving between distributions requires porting and testing the packages.
- Package installs have non-zero failure rates. We have seen 10-20% failure rates when trying to install packages. This prevents the cluster coming up successfully and makes it harder to operate.
- It is far more difficult to ship multiple packages than to hand out a single tarball. There is overhead in ensuring multiple packages are robust.
- Upgrades must be atomic. It is much more difficult to ensure this across multiple packages.

### Tarball vs. container

We could package DC/OS as a plethora of containers (or a single container with multiple processes). That approach combines the drawbacks of multiple packages with the instability of the Docker daemon. We have found that the Docker daemon crashes regularly; while that is acceptable for some applications, it is not something you want from the base infrastructure.

### Installation method

We could support any installation method; however, the large number of configuration and package management that is currently used is intimidating. We have seen everything from Puppet to custom built internal tools. We want to enable these methods by providing a simple interface that works with as many tools as possible. The lowest common denominator here is `bash`.

As it is difficult to maintain `bash`, we simplified the installation method as far as possible. The “image” that is built can be placed on top of a running host and operate independently. Extraction is all that is needed to install this. That is a small, simple `bash` script that can work everywhere and integrate easily with other tooling. The entire exposed surface is minimal, and does not give access to internals which, if changed, would make your cluster unsupportable and void the warranty.

### Host images

It is possible to make an entire host image that has been configured instead of a tarball that goes on top. Here are some reasons why this does not make sense as the sole method for installation:

- Endless distribution updates. Every time RHEL released a package update, we would be required to test, bundle and distribute that. This becomes even harder with CoreOS as we would end up actually forking the project.
- You want to choose their distribution. Some have existing support contracts with Canonical and some with RedHat.
- You want to configure the base OS. There are security policies and configuration that must be applied to the host.

Host images are a great way to distribute and install DC/OS. Using the `bash` install method, it is just as easy to create a new host image for your infrastructure as it would be to integrate with a tool like Puppet.

### Exposing config files directly to the user

DC/OS includes a significant number of components with configuration options. We have spent a long time piecing the correct ones together. These are guaranteed to give you the best operations in production at scale. If we were to expose these options, it would increase the amount of knowledge required to run an DC/OS cluster.

Remember that clusters must look almost the same for package install to work. If we change the configuration parameters that the frameworks rely on, we cannot guarantee that a package can install or run reliably.

[1]: https://github.com/dcos/dcos/blob/master/packages/mesos/build
[2]: https://github.com/dcos/dcos/blob/master/packages/mesos/buildinfo.json
