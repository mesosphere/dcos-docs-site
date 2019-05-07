---
layout: layout.pug
navigationTitle:  Working with secure computing profiles
title: Working with secure computing profiles
menuWeight: 31
excerpt: Describes how to configure DC/OS to work with Linux secure computing (seccomp) profiles 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
Secure computing mode (seccomp) is a Linux kernel feature used to restrict the actions available within a running container. The seccomp() system call operates on the seccomp state of the calling process. You can use this feature to restrict your application’s access to the underlying system.

DC/OS 1.13 is based on Mesos 1.8 which [introduces the ability to configure seccomp](http://mesos.apache.org/documentation/latest/isolators/linux-seccomp/) through the UCR containerizer to provide a higher degree of isolation and security to services deployed on DC/OS. The default seccomp profile without DC/OS provides a sane default for running containers disabling around 300+ system calls.

# Enable/Disable Seccomp
DC/OS 1.13 defaults with seccomp enabled. It is possible to opt-out of using seccomp by installing DC/OS with `mesos_seccomp_enabled=false`. For the best experience, It is important that the installation of each agent be consistent with each other agent in the cluster. Deviating from this strategy should only be done by advanced users.

While seccomp is enabled on DC/OS, All tasks which are started with no other task configuration will start under seccomp using the default profile.

# Seccomp Profile Management
DC/OS uses the `/etc/dcos/mesos/seccomp/` folder for managing seccomp profiles and provides a default profile named 'default.json' that defines [306 restricted system commands](https://github.com/dcos/dcos/blob/113b8abacfd6d517594f329b621aaf4641b535e7/gen/dcos-config.yaml#L532-L838).

In addition to the default profile it is possible to create any number of additional profiles. The name of the file that defines a profile is considered the profile name. It is important that if additional profiles are added to an agent that the same profile is shared on all agents in the cluster.

**Notes:**
1. If seccomp is newly enabled on DC/OS, the agent process must be restarted for the configuration to take effect.
2. If an agent is being upgraded from a version without seccomp to a version with seccomp. All tasks on that agent will need to be restarted for them to be started under seccomp.
3. Profiles can be added to the seccomp folder and be available as a profile without restarting the agent.

# Running Services under Seccomp
When seccomp is enabled on DC/OS, all newly created containers running under UCR will be started under the default profile with no configuration on the service configuration. Seccomp is not a configuration option when running with the docker containerizer.

It is possible to have a service opt-out of running under seccomp. For a Marathon defined service, this is accomplished by defining `unconfined=true` in the seccomp object under the LinuxInfo defined in the configuration of a container.

```
{
  "id": "/mesos-seccomp-app",
  "cmd": "sleep 1000",
  "cpus": 0.5,
  "mem": 32,
  "container": {
    "type": "MESOS",
    "linuxInfo": {
      "seccomp": {
        "unconfined" : true
      }
    }
  }
}
```
By configuring a service definition with an `unconfined` seccomp, the container will NOT run under seccomp. This will allow this container to execute any syscall that might have been restricted by the default seccomp profile.

It is also possible to have a service definition run under a different seccomp profile other than the default. This is accomplished by specifying the profile name to seccomp definition for the service definition.

```
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
This service definition expects that any agent it might launch on has a seccomp profile named `relaxed.json`. When this container starts on that agent it will be run under seccomp however it will not be restricted by `default.json` it will run under the definition of restrictions defined in `relaxed.json`

# Consequence of Running under Seccomp
Seccomp is security mechanism to reduce the surface area of attack on a system by restricting what syscalls are allowed from inside the container. While a container is running under seccomp restrictions, if a restricted call is attempted, the result is the task process will fail. It is up to the recovery mechanism of the scheduler to determine what happens next. For example Marathon will reschedule the task based on task failure and Metronome will log the job run as failed but may or may not reschedule the job run based on retry configurations.
