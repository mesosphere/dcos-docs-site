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
- individual system calls, such as `exit()`, `sigreturn()`, `read()`, or `write()`.
- filters for system calls, similar to `prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, filter)` and `prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0)`.
- the action to take when a program attempts to use any of those system calls. For example, you can specify whether a restricted system call results in a KILL, TRAP, ERRNO, TRACE, or ALLOW action.

For example, you can use the seccomp profile to automatically terminate any program that attempts to use any of the restricted system calls, reducing the potential for programs to exploit vulnerabilities and compromise systems where containers are launched.

# Default secure computing profile
DC/OS provides a default seccomp profile that you can use for UCR or Docker containers. The default DC/OS seccomp profile provides the same level of seccomp compatibility as the default [Docker seccomp profile](https://docs.docker.com/engine/security/seccomp/). You can enable the DC/OS default seccomp profile for all UCR and Docker containers in the cluster to secure your workloads from potential kernel-level exploits.

# Enabling secure computing
You can use advanced configuration parameters when you install or update the DC/OS cluster to deploy the [default DC/OS seecomp profile](https://github.com/moby/moby/blob/v1.13.1/profiles/seccomp/default.json) on agent nodes.

For information about the cnfiguration parameters used to enable secure computing mode on DC/OS clusters, see the [Configuration Reference](/1.13/installing/production/advanced-configuration/configuration-reference/).

# Secure computing isolator and filters
DC/OS provides support secure computing mode on Linux through the `linux/seccomp` isolator and seccomp filters. The DC/OS seccomp isolator for Linux implements filters by grouping system calls into a set of commands that are specifically denied (blacklist) and a set of command that are explicitly allowed (whitelist).

Seccomp filters reduce the attack surface of the Linux kernel by providing a mechanism for filtering of certain system calls. If you have agent nodes in the cluster with the Linux operating system, kernel version 3.5, or newer, you can use seccomp filters for containers launched using the DC/OS Universal Container Runtime (UCR) or Docker containers.

Seccomp filters are defined in seccomp profiles using JSON formatting similar to this [sample seccomp profile](http://mesos.apache.org/documentation/latest/examples/seccomp_default.json).

To support secure command execution for both UCR and Docker containers, the seccomp profile must include both the `pivot_root` system call and the `chroot` system call, in the `names` array. For example:

```bash
{
  "names": [
    "chroot",
    "pivot_root"
  ],
  "action": "SCMP_ACT_ALLOW",
  "args": [],
  "comment": "",
  "includes": {
    "caps": [
      "CAP_SYS_CHROOT"
    ]
  },
  "excludes": {}
},
```

# Configuring the agent for secure computing mode
You can add the DC/OS seccomp isolator `linux/seccomp` to an agent by setting the `--isolation` or `--mesos-seccomp-enabled` agent configuration option. You must have `root` privileges to install the seccomp isolator and seccomp filters to avoid the issues involved when using a user account without root-level privileges.

In addition to the `--isolation` or `--mesos-seccomp-enabled` option, you should configure the agent using the following settings:
- Use `--seccomp_config_dir` to specify the path to the directory containing seccomp profiles.
- Use `--mesos_seccomp_profile_name` to specify the default seccomp profile you want to apply by default for all DC/OS containers. The profile name must be relative to the `--seccomp_config_dir` path. If you don't specify this option, no default seccomp profile is defined and, therefore, no profile is applied by default.

The following illustrates how to start a DC/OS agent with secure computing mode enabled:

```bash
sudo mesos-agent --master=<master ip> --ip=<agent ip> --work_dir=/var/lib/mesos --isolation=linux/seccomp --seccomp_config_dir=/etc/mesos/seccomp --seccomp_profile_name=default.json
```

# Overriding the seccomp profile for a task
For maximum flexibility, you can configure tasks to override an agent’s default seccomp profile. To override an agent's seccomp profile, a task should declare the required profile in the `LinuxInfo` field of its `ContainerInfo`. For example, if the agent is launched with the default seccomp profile enabled, a framework can disable that profile for a particular task by setting an `unconfined` field in the corresponding `SeccompInfo`.