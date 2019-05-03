---
layout: layout.pug
navigationTitle:  Working with secure computing profiles
title: Working with secure computing profiles
menuWeight: 31
excerpt: Describes how you can work with Linux secure computing (seccomp) profiles 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
The Linux kernel provides a native computer security facility that you can configure to control the system-level operations that can be performed. This native security facility, the secure computing mode (Seccomp), is included by default in most distributions of the Linux kernel. The secure computing mode (seccomp) provides system call isolation that enables programs to run safely without compromising the systems where the programs run.

In a distributed network environment, you can use the secure computing mode (Seccomp) to isolate applications running inside of containers from critical system resources and programs. The secure computing mode isolates containers and tasks by enabling you to restrict access to certain system calls through a secure computing profile. By configuring a seccomp profile, you can specify a list of restricted and permitted system calls for containers launched by the DC/OS Universal Container Runtime (UCR).

The seccomp profile identifies:
- individual restricted or permitted system calls, such as `exit()`, `sigreturn()`, `read()`, or `write()`.
- filters for system calls by its syscall arguments, for example, you can restrict system call `prctl` in case it is called with the following arguments `prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, filter)` or `prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0)`.
- the action to take when a program attempts to use any of those system calls. For example, you can specify whether a restricted system call results in a KILL, TRAP, ERRNO, TRACE, or ALLOW action.

For example, you can use the seccomp profile to automatically terminate any program that attempts to use any of the restricted system calls, reducing the potential for programs to exploit vulnerabilities and compromise systems where containers are launched.

# Default secure computing profile
DC/OS provides a default seccomp profile that you can use for UCR containers. The default DC/OS seccomp profile provides the same level of seccomp compatibility as the default [Docker seccomp profile](https://docs.docker.com/engine/security/seccomp/). You can enable the DC/OS default seccomp profile for all UCR containers in the cluster to secure your workloads from potential kernel-level exploits.

Although the DC/OS default seccomp profile is Docker-compatible and can, therefore, be used for services in any UCR containers, the recommended best practice is to use the DC/OS default seccomp profile without modification to ensure proper operation and isolation for DC/OS services. For example, you might have DC/OS services that rely on custom executors that are not compatible with the Docker seccomp profile.

To ensure your cluster and workloads are adequately protected, you should not modify the DC/OS default seccomp profile. The default seccomp profile restricts system calls--such as `perf_event_open`, `keyctl`, and `reboot`--that are known to be vulnerable to security breaches. Modifying the default seccomp profile could have unintended consequences and make systems vulnerable to kernel-level attacks. 

# Enabling secure computing
You can use advanced configuration parameters when you install or update the DC/OS cluster to deploy the [default DC/OS seecomp profile](https://github.com/moby/moby/blob/v1.13.1/profiles/seccomp/default.json) on agent nodes.

For information about the configuration parameters used to enable secure computing mode on DC/OS clusters, see the [Configuration Reference](/1.13/installing/production/advanced-configuration/configuration-reference/).
