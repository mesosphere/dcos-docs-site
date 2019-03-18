---
layout: layout.pug
navigationTitle:  Configuring Task Log Output and Retention
title: Configuring Task Log Output and Retention
menuWeight: 2
excerpt: Task environment variables that influence logging
beta: false
enterprise: false
---


You can modify the destination and log retention of task logs
by specifying any of the following environment variables within
the task definition:

| Environment Variable | Default | Short Description |
|----------------------|---------|-------------------|
| `CONTAINER_LOGGER_DESTINATION_TYPE`          | `logrotate` | Where the task logs should be directed: either the task's sandbox or journald. |
| `CONTAINER_LOGGER_LOGROTATE_MAX_STDOUT_SIZE` | `2MB`       | The maximum size of the stdout file in the sandbox before log rotation is triggered. |
| `CONTAINER_LOGGER_LOGROTATE_STDOUT_OPTIONS`  | `rotate 9`  | Options to pass to `logrotate` when rotating the stdout file. |
| `CONTAINER_LOGGER_LOGROTATE_MAX_STDERR_SIZE` | `2MB`       | The maximum size of the stderr file in the sandbox before log rotation is triggered. |
| `CONTAINER_LOGGER_LOGROTATE_STDERR_OPTIONS`  | `rotate 9`  | Options to pass to `logrotate` when rotating the stderr file. |
| `CONTAINER_LOGGER_EXTRA_LABELS`              | `"{}"`      | Extra key-value pairs to tag each log line when outputting to journald. |


# Details

<p class="message--warning"><strong>WARNING: </strong>Specifying invalid values for these options will cause the task
launch to fail.</p>

## Destination Type

The `CONTAINER_LOGGER_DESTINATION_TYPE` takes three possible arguments:

* `logrotate` (default)
* `journald`
* `journald+logrotate`

The use of `journald` options is **not** recommended, due to
[journald performance issues](https://github.com/systemd/systemd/issues/5102).
When enabled, logs are piped directly into the node's journald, along
with some labels like the `AGENT_ID`, `EXECUTOR_ID`, and `CONTAINER_ID`.

The `logrotate` option will place logs (files named `stdout` and `stderr`)
inside the task sandbox and create additional files for rotating these
logs (`*.logrotate.conf` and `*.logrotate.state`).

See the [Logging API](/1.13/monitoring/logging/logging-api/)
for information on how to read these logs.

## Max Sizes

The `CONTAINER_LOGGER_LOGROTATE_MAX_STDOUT_SIZE` and
`CONTAINER_LOGGER_LOGROTATE_MAX_STDERR_SIZE` options control the maximum
size of these log files.  Upon reaching this threshold, logrotation
is triggered.

Sizes must be an integer of less than 2^64 and must be suffixed with a
unit such as `B` (bytes), `KB`, `MB`, `GB`, or `TB`.  There should be no
whitespace between the integer and unit.

Examples:

* `2MB`
* `1234B`
* `1TB`

<p class="message--important"><strong>IMPORTANT: </strong>The hard cap on size is 2^64 bytes.  Attempting to specify a higher
value (for example, 2^64 TB) will lead to undetermined results.</p>

## Logrotate Options

The `CONTAINER_LOGGER_LOGROTATE_STDOUT_OPTIONS` and
`CONTAINER_LOGGER_LOGROTATE_STDERR_OPTIONS` options control the parameters
passed to `logrotate` for each rotation.  There are no restrictions on
arguments.  Refer to the [man page](https://linux.die.net/man/8/logrotate)
for possible values.

Each logrotate rule should be newline (`\n`) separated.  For example:

* `rotate 10\ncompress\ndelaycompress`
* `daily\nmaxage 10\nnomail`

Some rules are unnecessary or will be overriden:

* `size` is overridden by the values of
  `CONTAINER_LOGGER_LOGROTATE_MAX_STDOUT_SIZE`
  or `CONTAINER_LOGGER_LOGROTATE_MAX_STDERR_SIZE`.
* Time-based rotation will not work as expected.  Rotation is triggered
  based purely on how much has been written.  So if rotation is set
  to fire at 2MB, but less than 2MB is written, then rotation will never
  occur.
* `copy` and `copytruncate` are not necessary because the log files
  will not be written to while rotating.  This means no log lines
  can be lost (although they can be cut into separate files if too long).
