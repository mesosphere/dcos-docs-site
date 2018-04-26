---
layout: layout.pug
navigationTitle:  Filtering Logs with ELK
title: Filtering Logs with ELK
menuWeight: 2
excerpt: Filtering log output for specific tasks

enterprise: false
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->
The file system paths of DC/OS task logs contain information such as the agent ID, framework ID, and executor ID. You can use this information to filter the log output for specific tasks, applications, or agents.

**Prerequisite**

*   [An Elasticsearch installation that aggregates DC/OS logs][1]

# <a name="configuration"></a>Install, configure, and start Logstash

1.  Install [Logstash][7].

1.  Create the following `dcos` pattern file in your custom patterns directory, located at `$PATTERNS_DIR`:

    ```
    PATHELEM [^/]+
    TASKPATH ^/var/lib/mesos/slave/slaves/%{PATHELEM:agent}/frameworks/%{PATHELEM:framework}/executors/%{PATHELEM:executor}/runs/%{PATHELEM:run}
    ```

2.  Update the configuration file for your Logstash instance to include the following `grok` filter, where `$PATTERNS_DIR` is replaced with your custom patterns directory:

    ```
    filter {
        grok {
            patterns_dir => "$PATTERNS_DIR"
            match => { "file" => "%{TASKPATH}" }
        }
    }
    ```

3.  Start Logstash.

    Logstash will extract the `agent`, `framework`, `executor`, and `run` fields. These fields are shown in the metadata of all Mesos task log events. Elasticsearch queries will also show results from those fields.


# <a name="usage"></a>Usage example

In the screenshots below, we are using Kibana hosted by [logz.io][2], but your Kibana interface will look similar.

1. Type `framework:*` into the Search field. This will show all of the events where the `framework` field is defined:

   ![Logstash Example](/1.11/img/logstash-framework-exists.png)

1. Click the disclosure triangle next to one of these events to view the details. This will show all of the fields extracted from the task log file path:

   ![Logstash Example2](/1.11/img/logstash-fields.png)

1. Search for all of the events that reference the framework ID of the event shown in the screenshot above, but that do not contain the chosen `framework` field. This will show only non-task results:

   ![Logstash Framework Search](/1.11/img/logstash-framework-search.png)

# <a name="templates"></a>Template examples

Here are some example query templates. Replace the template parameters `$executor1`, `$framework2`, and any others with the actual values from your cluster.

**Important:** Do not change the quotation marks in these examples or the queries will not work. If you create custom queries, be careful with the placement of quotation marks.

*   Logs related to a specific executor `$executor1`, including logs for tasks run from that executor:

        "$executor1"

*   Non-task logs related to a specific executor `$executor1`:

        "$executor1" AND NOT executor:$executor1

*   Logs (including task logs) for a framework `$framework1`, if `$executor1` and `$executor2` are that framework's executors:

        "$framework1" OR "$executor1" OR "$executor2"

*   Non-task logs for a framework `$framework1`, if `$executor1` and `$executor2` are that framework's executors:

        ("$framework1" OR "$executor1" OR "$executor2") AND NOT (framework:$framework1 OR executor:$executor1 OR executor:$executor2)

*   Logs for a framework `$framework1` on a specific agent host `$agent_host1`:

        host:$agent_host1 AND ("$framework1" OR "$executor1" OR "$executor2")

*   Non-task logs for a framework `$framework1` on a specific agent `$agent1` with host `$agent_host1`:

        host:$agent_host1 AND ("$framework1" OR "$executor1" OR "$executor2") AND NOT agent:$agent

[1]: ../elk/
[2]: http://logz.io
[7]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
