---
layout: layout.pug
navigationTitle:  Secure computing profiles
title: Secure computing profiles
menuWeight: 31
excerpt: Describes how to configure DC/OS to work with Linux secure computing (seccomp) profiles
render: mustache
model: /1.13/data.yml 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
Secure computing mode (seccomp) is a Linux kernel feature used to restrict the actions available within a running container. The seccomp() system call operates on the seccomp state of the calling process. You can use this feature to restrict your application’s access to the underlying system.

Seccomp support in DC/OS is based on Mesos 1.8 which [introduces the ability to configure seccomp](http://mesos.apache.org/documentation/latest/isolators/linux-seccomp/) through the UCR containerizer to provide a higher degree of isolation and security to services deployed on DC/OS. The default seccomp profile within DC/OS provides a reasonable default for running containers by disabling more than 300 system calls.

# Enabling and disabling secure computing mode
By default, DC/OS is installed with secure computing mode enabled. You can opt-out of using seccomp by installing DC/OS with `mesos_seccomp_enabled=false`. Before opting out, however, keep in mind that it is important for the installation of each agent to be consistent with every other agent in the cluster. Deviating from this strategy should only be done by advanced users.

If you enable seccomp for a DC/OS cluster, all tasks start under seccomp control using the default seccomp profile unless you explicitly configure tasks to override the default behavior.

# Managing seccomp profiles
DC/OS uses the `/etc/dcos/mesos/seccomp/` folder for managing seccomp profiles and provides a default profile named 'default.json' that defines [306 restricted system commands](https://github.com/dcos/dcos/blob/113b8abacfd6d517594f329b621aaf4641b535e7/gen/dcos-config.yaml#L532-L838).

In addition to the default profile, it is possible to create any number of additional profiles. The name of the file that defines a profile is considered the profile name. It is important that if additional profiles are added to an agent that the same profile is shared on all agents in the cluster.

# Restarting agents to use the seccomp profile
To make a seccomp profile available on a DC/OS cluster with previously-deployed agents, keep the following guidelines in mind:
- If you enable seccomp on a new or existing DC/OS cluster, the agent processes must be restarted for the seccomp profile configuration to take effect.
- If you are upgrading an agent from a DC/OS version without seccomp to a DC/OS version with seccomp, all tasks on that agent must be restarted for them to run under the seccomp profile.
- If you choose to add profiles to the seccomp folder on a DC/OS cluster where seccomp is already enabled, those profiles are available to use without restarting the agent.

# Running services under seccomp
When seccomp is enabled on DC/OS, all newly-created containers running under UCR are started under the default seccomp profile. Using the deafult profile does not require any changes to the service configuration. Using the seccomp profile is not a configuration option when running services with the Docker containerizer.

It is possible to have a service opt-out of running under seccomp. For a Marathon-defined service, this is accomplished by defining `unconfined=true` in the `seccomp` object under the `LinuxInfo` configuration setting for a container. For example:

```json
{
  "id": "/mesos-seccomp-app",
  "cmd": "sleep 1000",
  "cpus": 0.5,
  "mem": 32,
  "container": {
    "type": "MESOS",
    "linuxInfo": {
      "seccomp": {
        "unconfined": true
      }
    }
  }
}
```

By configuring a service definition with an `unconfined` seccomp setting, the container will NOT run under seccomp. This will allow this container to execute any syscall that might have been restricted by the default seccomp profile.

It is also possible to have a service definition run under a different seccomp profile other than the default. This is accomplished by specifying the profile name in the seccomp definition for the service definition. For example:

```json
{
  "id": "/mesos-seccomp-app",
  "cmd": "sleep 1000",
  "cpus": 0.5,
  "mem": 32,
  "container": {
    "type": "MESOS",
    "linuxInfo": {
      "seccomp": {
        "profileName": "relaxed.json",
        "unconfined" : false
      }
    }
  }
}
```

This service definition expects that any agent it might launch on has a seccomp profile named `relaxed.json`. When this container starts on that agent, it runs under seccomp control and the estrictions defined in the `relaxed.json` profile configuration. In this example, the service is not be restricted by the configuration defined in the `default.json` seccomp profile. Instead, the service runs under the restrictions defined in the custom `relaxed.json` profile.

# Consequence of running under seccomp
Seccomp is a security mechanism that reduces the surface area of attack on a system by restricting what syscalls are allowed from inside the container. While a container is running under seccomp restrictions, if a restricted call is attempted, the result is the task process will fail. It is up to the recovery mechanism of the scheduler to determine what happens next. For example, Marathon will reschedule the task based on the task failure and Metronome will log the job run as failed but may or may not reschedule the job run based on the job retry configuration settings.
