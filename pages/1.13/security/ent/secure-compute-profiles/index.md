---
layout: layout.pug
navigationTitle:  Secure computing profiles
title: Secure computing profiles
menuWeight: 31
excerpt: Describes how you can work with Linux secure computing (seccomp) profiles 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
The Linux kernel provides a native computer security facility that you can configure to control the system-level operations that can be performed. This native security facility, the secure computing mode (Seccomp), is included by default in most distributions of the Linux kernel. 

The secure computing mode (seccomp) is used to define specific capabilities for programs attempting to invoke privileged system calls. You can take advantage of the secure computing mode by providing a seccomp profile. With the seccomp profile, you control access to specific programs and to the specific system calls that can be used to perform privileged operations, explicitly allowing, denying, or limiting the actions that can be taken. 

The seccomp profile identifies:
- individual restricted or permitted system calls, such as `exit()`, `sigreturn()`, `read()`, or `write()`.
- filters for system calls by its syscall arguments, for example, you can restrict system call `prctl` in case it is called with the following arguments `prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, filter)` or `prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0)`.
- the action to take when a program attempts to use any of those system calls. For example, you can specify whether a restricted system call results in a KILL, TRAP, ERRNO, TRACE, or ALLOW action.

For example, you can use the seccomp profile to automatically terminate any program that attempts to use any of the restricted system calls, reducing the potential for programs to exploit vulnerabilities and compromise systems where containers are launched.

# Default secure computing profile
DC/OS provides a default seccomp profile that you can use to enable the secure computing mode (Seccomp) for all agents in the cluster and for all services in Universal Container Runtime (UCR) containers. If you choose to enable secure computing, the recommended best practice is to use this DC/OS default seccomp profile without any modification to ensure proper operation and isolation for DC/OS services. For example, you might have some DC/OS services that rely on custom executors that are only compatible with the default seccomp profile.

To ensure your cluster and workloads are adequately protected from potential kernel-level exploits:

- Do not attempt to modify the DC/OS default seccomp profile. 

    The default seccomp profile restricts system calls--such as `perf_event_open`, `keyctl`, and `reboot`--that are known to be vulnerable to security breaches. Modifying the default seccomp profile could have unintended consequences and make systems vulnerable to kernel-level attacks. 

- Use the same DC/OS default seccomp profile for all UCR containers in the cluster.

The default seccomp profile provides a general rule that denies access to system calls, then defines the specific system calls and actions that are allowed so that the default profile prevents programs from exploiting administrative access to kernel-level system resources without being so restrictive that programs are unable to complete routine operations. 

# Deploying the default profile to agents

Once you enable seccomp for an agent, all processes on that agent run under the default profile. In effect, the default profile is applied even if you don’t specifically enable the profile for a service. After you enable secure computing mode through the default secure computing profile, you must use the same profile for all agents in the cluster. You cannot selectively disable the default profile or use a different profile for any agents or services.

In addition, if you enable secure computing when you install or upgrade the agent nodes in a DC/OS cluster, the profile enforcement automatically applies for all newly created processes. However, the profile will not apply for existing process until all of the processes in the cluster are restarted.

# Enabling secure computing
You can use advanced configuration parameters when you install or update the DC/OS cluster to deploy the [default DC/OS seecomp profile](https://github.com/moby/moby/blob/v1.13.1/profiles/seccomp/default.json) on agent nodes.

For information about the configuration parameters used to enable secure computing mode on DC/OS clusters, see the [Configuration Reference](/1.13/installing/production/advanced-configuration/configuration-reference/).
