---
layout: layout.pug
navigationTitle:  Troubleshooting Marathon-LB
title: Troubleshooting Marathon-LB  
menuWeight: 45
excerpt: Common issues and troubleshooting tips for Marathon-LB
enterprise: false
---
This section covers potential issues and troubleshooting techniques for Marathon-LB load balancer running on DC/OS clusters.

# Removing orphaned processes
`HAProxy` typically produces orphan processes because of its two-step reloading process. In most cases, Marathon-LB removes the orphan processes it generates using the tini program. The Tini program runs transparently on a container as a single child process. It is responsible for removing orphan processes and performing signal forwarding.

Over time, orphan processes consume resources and affect the process identifier namespace where they run, making the environment unstable or unusable. Therefore, you should be sure to remove any orphaned child processes either manually or programmatically.

By default, Tini needs to run using the process identifier (PID) 1 to remove orphaned processes. If you cannot run Tini as PID 1 or if you are running containers without PID namespace isolation, you should register the Tini program as a process subreaper by  setting the TINI_SUBREAPER environment variable.  Setting the TINI_SUBREAPER environment variable ensures that the orphaned processes get re-parented as children of the Tini program which can then remove them to complete its execution.

# Using a single PID namespace
Some features, such as `/_mlb_signal endpoints`, `/_haproxy_getpids endpoints`, and `zero-downtime deployments`, require that only one Marathon-LB instance is running and that it runs in its own processing namespace as a container. If more than one instance of Marathon-LB is running in the same PID namespace, you might see unexpected results or errors that interfere with normal operations.

# Enabling support for TLS v1.0
Transport Layer Security (TLS), version 1.0, has been deprecated, and is no longer supported by the default Marathon-LB configuration. If you are using Marathon-LB based on `debian:stretch`, or earlier, and you require TLS v1.0 support, you must supply a custom template for `HAPROXY_HEAD` in your `marathon-lb` app definition that includes a configuration setting similar to this:

```
 {
    "id":"/marathon-lb",   "uris":["https://downloads.mesosphere.com/marathon/marathon-lb/templates-with-tls-10.tgz"]
  }
```

The following versions of Marathon-LB do not support TLS v1.0 or TLS v1.1:
* 1.8.1
* 1.11.1

If possible, you should discontinue using Transport Layer Security (TLS), version 1.0 or 1.1.