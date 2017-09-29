---
layout: layout.pug
navigationTitle:  Log Management with Splunk
title: Log Management with Splunk
menuWeight: 3
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

You can pipe system and application logs from a DC/OS cluster to your existing Splunk server.

These instructions are based on CoreOS and might differ substantially from other Linux distributions. This document does not explain how to setup and configure a Splunk server.

**Prerequisites**

*   An existing Splunk installation that can ingest data for indexing.
*   All DC/OS nodes must be able to connect to your Splunk indexer via HTTP or HTTPS. (See Splunk's documentation for instructions on enabling HTTPS.)
*   The `ulimit` of open files must be set to `unlimited` for your user with root access.

# Step 1: All Nodes

For all nodes in your DC/OS cluster:

1.  Install Splunk's [universal forwarder][2]. Splunk provides packages and installation instructions for most platforms.
2.  Make sure the forwarder has the credentials it needs to send data to the indexer. See Splunk's documentation for details.
3.  Start the forwarder.

# Step 2: Master Nodes

For each Master node in your DC/OS cluster:

1.  Create a script `$SPLUNK_HOME/bin/scripts/journald-master.sh` that will obtain the Mesos master logs from `journald`:

        #!/bin/sh

        exec journalctl --since=now -f          \
            -u dcos-diagnostics.service                 \
            -u dcos-logrotate-master.timer      \
            -u dcos-adminrouter-reload.service  \
            -u dcos-marathon.service            \
            -u dcos-adminrouter-reload.timer    \
            -u dcos-mesos-dns.service           \
            -u dcos-adminrouter.service         \
            -u dcos-mesos-master.service        \
            -u dcos-cfn-signal.service          \
            -u dcos-metronome.service           \
            -u dcos-cosmos.service              \
            -u dcos-minuteman.service           \
            -u dcos-download.service            \
            -u dcos-navstar.service             \
            -u dcos-epmd.service                \
            -u dcos-oauth.service               \
            -u dcos-exhibitor.service           \
            -u dcos-setup.service               \
            -u dcos-gen-resolvconf.service      \
            -u dcos-signal.service              \
            -u dcos-gen-resolvconf.timer        \
            -u dcos-signal.timer                \
            -u dcos-history.service             \
            -u dcos-spartan-watchdog.service    \
            -u dcos-link-env.service            \
            -u dcos-spartan-watchdog.timer      \
            -u dcos-logrotate-master.service    \
            -u dcos-spartan.service

2.  Make the script executable:

        chmod +x "$SPLUNK_HOME/bin/scripts/journald-master.sh"

3.  Add the script as an input to the forwarder:

        "$SPLUNK_HOME/bin/splunk" add exec \
            -source "$SPLUNK_HOME/bin/scripts/journald-master.sh" \
            -interval 0

# Step 3: Agent Nodes

For each agent node in your DC/OS cluster:

1.  Create a script `$SPLUNK_HOME/bin/scripts/journald-agent.sh` that will obtain the Mesos agent logs from `journald`:

        #!/bin/sh

            journalctl --since="now" -f                 \
                -u dcos-ddt.service                     \
                -u dcos-epmd.service                    \
                -u dcos-gen-resolvconf.service          \
                -u dcos-logrotate.service               \
                -u dcos-mesos-slave.service             \
                -u dcos-mesos-slave-public.service      \
                -u dcos-minuteman.service               \
                -u dcos-spartan.service                 \
                -u dcos-spartan-watchdog.service        \
                -u dcos-vol-discovery-priv-agent.service

2.  Make the script executable:

        chmod +x "$SPLUNK_HOME/bin/scripts/journald-agent.sh"

3.  Add the script as an input to the forwarder:

        "$SPLUNK_HOME/bin/splunk" add exec \
            -source "$SPLUNK_HOME/bin/scripts/journald-agent.sh" \
            -interval 0

4.  Add the task logs as inputs to the forwarder:

        "$SPLUNK_HOME/bin/splunk" add monitor '/var/lib/mesos/slave' \
            -whitelist '/stdout$|/stderr$'

# Known Issue

*   The agent node Splunk forwarder configuration expects tasks to write logs to `stdout` and `stderr`. Some DC/OS services, including Cassandra and Kafka, do not write logs to `stdout` and `stderr`. If you want to log these services, you must customize your agent node Splunk forwarder configuration.

# What's Next

For details on how to filter your logs with Splunk, see [Filtering DC/OS logs with Splunk][3].

 [2]: http://www.splunk.com/en_us/download/universal-forwarder.html
 [3]: ../filter-splunk/
