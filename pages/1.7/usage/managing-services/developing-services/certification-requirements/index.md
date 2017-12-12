---
layout: layout.pug
title: DC/OS Service Certification Criteria
menuWeight: 1
excerpt:

enterprise: false
---








A **Certified** DC/OS Service:

*   Has been verified by Mesosphere as correctly integrating with DC/OS, however it makes no guarantees regarding the production worthiness of the underlying service. 
*   Has been verified by Mesosphere as meeting best practices for Mesos framework implementation.
*   Is regularly tested automatically by Mesosphere against all currently supported versions of DC/OS.

**Disclaimer** Mesosphere makes no guarantee of the correctness, performance or stability of Certified DC/OS Services. Mesosphere does not provide support for Certified DC/OS Services; It is the responsibility of the Service creator (see requirement 22).

# Certification Requirements

### 01. Scheduler SHOULD register with a failover timeout.

A failover timeout allows a scheduler time to recover from failure.

If a scheduler does not register with a failover timeout, Mesos will kill running tasks when that scheduler disconnects for any reason. It is common framework behavior to have running tasks continue in the absence of the scheduler for the period of time configured as the timeout. If a service specifically wants tasks to fail on loss of the scheduler, then this requirement can be ignored. The scheduler should then register with a new frameworkID upon re-launch and launch all tasks.

Although the requirement here is SHOULD, the scheduler MUST be registered with a failover timeout unless there is a specific design reason not to.

In order to have highly-available scheduler instances, Services must set this to a sensible value - for example, one week.

### 02. Scheduler SHOULD persist their FrameworkID for failover.

A scheduler must persist its FrameworkID to re-register with the same identity if its process restarts regardless of where the process is run. Schedulers can persist the FrameworkID using the Mesos state abstraction. If use of Mesos state abstraction is not possible, FrameworkID may be persisted in another manner. Under certain circumstances and with Mesosphere approval, the FrameworkID may be persisted in a HA store outside of the state abstraction (for example etcd). If there is a specific reason why the service is not using a failover timeout (requirement 01), then this requirement 02 can be ignored. Similarly, if the framework does not need to re-attach to running tasks and does not re-register with the same ID, this requirement can also be ignored.

### 03. Scheduler MUST recover from process termination.

If a scheduler is terminated for any reason, the Service must be able to recover. The services are launched under an instance of Marathon in DC/OS providing the first level of fault tolerance. However the recovery time is dependent on the download size of reprovisioning the service and the startup time of the scheduler.

For reduced latency and more fine grained control, we can run multiple scheduler instances via Marathon, coordinated by e.g. ZooKeeper. ZooKeeper is used to perform leader election in the event that the currently leading instance fails. This requires the scheduler author to develop when logic for managing the leader and leader election.

Scheduler container MUST recover from termination and/or node failure. Some scheduler containers run multiple processes - recovery from a single process termination may be different than recovery when the whole scheduler/framework container does down/away.

### 04. Scheduler MAY enable checkpointing.

Checkpointing enables a restarted Mesos scheduler process to reconnect to the running tasks. Typically we would want to implement this for failure recovery, but there are trade offs. Mesos framework checkpointing is disabled by default, which means that tasks from this Service would be killed on node failure. A framework author may decide it is more efficient to turn off checkpointing and relaunch the tasks rather than wait for agent relaunch.

### 05. Scheduler MUST decline offers it doesn’t need.

It is required that unwanted offers are declined, and are declined as soon as possible. If your Service doesn’t decline unwanted offers, those offers will eventually be rescinded to let other Services use those resources.

### 06. Scheduler MUST only use the necessary fraction of an offer.

Mesos will often make offers that are significantly larger than what is necessary for a service to run. It is required that after a scheduler determines that its task will fit inside an offer that it only use the fraction that it needs taking in account it’s executor and any tasks that it may need. Adding new tasks to an executor at a later time will expand the resources available to the container, not all resources need to be known up front.

### 07. Scheduler MUST NOT rely on running an Executor on a particular node.

The scheduler must launch executors and tasks on nodes based strictly on matching resource and attribute criteria of the offer.

### 08. Service MUST NOT require anything to be pre-installed on a node.

All dependencies MUST be shipped with your package. Although any given node in a given cluster might have arbitrary software installed, that software MUST NOT be relied upon.

You CAN rely on the local installation of:

*   A Linux kernel
*   Mesos
*   Docker
*   ulimit = infinity

A common situation is the use of Java and the need for a JRE. The JRE is not provided by DC/OS. If your Service requires a JRE, you must ship one with your package. The CDN backed url example below shows how to use a JRE with a Java framework.

Dependencies can be provided via:

*   Docker (e.g.: [docker config of marathon][1])
*   CDN backed URL (e.g.: [url configuration][2], [cdn backed urls][3]) 
*   You CAN NOT use the JRE hosted on downloads.mesosphere.io due to licensing restrictions. You must host your own JRE. For details, see the [JDK documentation][4].

### 09. Scheduler MUST support a custom framework name.

The name used by the scheduler during registration to the Mesos master must be based on the framework-name defined in the config.json and must be configurable. This allows for multiple instances of your Service to be run with different names.

### 10. Scheduler MUST support a custom framework role.

The configuration of the framework role must be possible at installation. This is accomplished by making the role configurable in config.json and using this configuration variable in the marathon.json. The scheduler must then use the configured role when registering with the Mesos master.

### 11. Scheduler MUST provide framework webui_url for admin UIs or service end-points that control the framework.

In cases when a Service has a web interface that is useful to the DC/OS end user, the Service MUST make that URL available using framework webui_url when registering with the Mesos master.

The webui_url may also be used for a RESTful service endpoint to control the framework. This is the preferred approach if also implementing a CLI.

The DC/OS GUI uses this value to create ‘clickable’ Service names for the end user. When providing a UI, it is important to recognize that the assets of the UI must be relative paths (and not absolute).

The webui_url will be proxied by the Admin Router at a URL created passed on the convention /service/.

### 12. Scheduler MUST reconcile tasks during failover.

The scheduler MUST persist task states, and compare this against Mesos’ reported state from reconciliation, reacting to differences appropriately. If a service runs tasks that terminate when the scheduler terminates, task reconciliation is not necessary.

This may involve starting new tasks to cover lost tasks; killing unrecognized/unexpected tasks; or just updating any internal/persistent state.

See [Mesos task reconciliation][5] for more detail. Keep in mind that it may take some time and several iterations of reconciliation requests to synchronize all task states. It is recommended to use the Mesos State Abstraction for persistence.

### 13. Scheduler MUST use a reliable store for persistent state.

A scheduler MUST NOT store critical state in memory, since failover can happen at any time.

The scheduler MUST use a reliable store - such as ZooKeeper, or the Mesos replicated log - for critical persistent state related to the running of tasks on Mesos. It is recommended to use the Mesos State Abstraction for persistence.

Persistent state is primarily required when it is necessary for a framework to reconcile running tasks.

### 14. Executors SHOULD kill their tasks if they themselves terminate.

An executor that is killed should ensure its tasks are killed. This could mean:

*   Starting the tasks as subprocesses of the executor process;
*   Placing them all under the same pid namespace, or
*   Bundling them all into an executor’s JVM.

### 15. Executors MUST only persist data in approved locations.

Approved locations for persisting data:

*   In the Mesos sandbox, or
*   Using Mesos ephemeral and persistent volumes, available in Mesos 0.23. You can track related issues at [MESOS-1554][6].
*   In a distributed or network-attached filesystem, e.g. HDFS or S3.
*   In a distributed or network-attached database.
*   In a raw block device

Services MUST NOT persist data outside of the locations listed above.

### 16. Executors of the same Service type SHOULD safely co-exist on a given node.

Executors of the same Service type should have the ability to co-exist on the same node and should have configurable options such that there is no interference.

### 17. Service MUST recover from lost executors and tasks.

If any task/executor component fails, the component MUST be restarted automatically by the executor or scheduler, as is appropriate for the Service.

### 18. Scheduler MUST support a custom framework user.

By default, tasks are run on nodes as the same user that launched the scheduler process.

You can override this by specifying a user in FrameworkInfo when registering the scheduler.

You can also override this on a per-task basis, by specifying a user in the CommandInfo, if your Service has a notion of different users launching tasks.

This requirement expects that the scheduler supports the setting of a user at least at the framework level during registration to the mesos master. It is also required that the user is configurable in the config.json and supported in the marathon.json.

### 19. Scheduler MUST support framework authentication.

When registering a scheduler, the scheduler MUST support passing a principal (and optional secret) to Mesos.

Note: This includes the FrameworkInfo.principal as well as the Credential parameter to MesosSchedulerDriver.

This requirement expects that the authorization parameters are externalized to the config.json so they can be overridden. The default installation with no configuration should be absent of authorization. Authorization must be enabled via configuration and the scheduler must support this configuration.

### 20. Executors and tasks must recover from failures appropriately.

If executor(s) or task(s) terminate, we must be sure that the service recovers appropriately and reaches healthy state. Specific error handling will depend on the service. However, we want to ensure that failures do not cause service failure and that recovery mechanisms are in place. Typical types of distributed systems failures should be accounted for are node and process failures as well as network partitions. We should also account for error states that are specific to the underlying service itself.

### 21. Service MUST be documented.

The Service MUST have documentation for the following users:

*   An end user. 
    *   How to use the functionality and UIs of your Service.
    *   A template for end user documentation for repositories hosted on GitHub is provided in the dcos-service-docs project. 
*   An API developer. How to code against the APIs exposed by your Service.
*   The DC/OS operator. 
    *   How to install and maintain your Service.
    *   How to monitor and troubleshoot your Service. 
        *   Including detailed explanation of how health checks are implemented and how to resolve unhealthy states.
    *   How to uninstall your Service completely.

### 22. Service MUST be supported.

The Service documentation must include support information for end users, including: Contact information for obtaining support. An issue tracker URL for reporting bugs and feature requests.

 [1]: https://github.com/mesosphere/universe/blob/version-1.x/repo/packages/M/marathon/4/marathon.json#L26-L30
 [2]: https://github.com/mesosphere/universe/blob/version-1.x/repo/packages/H/hdfs/1/marathon.json#L11
 [3]: https://github.com/mesosphere/universe/blob/version-1.x/repo/packages/H/hdfs/1/config.json#L14-L15
 [4]: http://www.oracle.com/technetwork/java/javase/readme-142177.html#redistribution
 [5]: http://mesos.apache.org/documentation/latest/reconciliation/
 [6]: https://issues.apache.org/jira/browse/MESOS-1554
