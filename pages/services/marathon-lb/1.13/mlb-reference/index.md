---
layout: layout.pug
navigationTitle:  Reference information
title: Reference information
menuWeight: 50
excerpt: Marathon-LB endpoints, command-line reference, and configuration templates and labels
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

# Marathon-LB HAProxy endpoints
Marathon-LB automatically generates configuration information for the HAProxy program, then reloads and restarts HAProxy, as needed. Marathon-LB generates the HAProxy configuration based on application data available from the Marathon API. It can also subscribe to the [Marathon Event Bus](https://mesosphere.github.io/marathon/docs/event-bus.html) for real-time updates. 

When an application starts, stops, relocates, or has any change in health status, Marathon-LB automatically regenerates the HAProxy configuration and reloads HAProxy.

Marathon-LB exposes the following endpoints on port `9090` by default.

| <b>Endpoint</b> | <b>Description</b> |
| :--- | :-------- |
|<code>public-node:9090/haproxy?stats</code> | The **Statistics** endpoint produces an HTML page that provides statistical information about the current HAProxy instance and its load balancing activity. You can view the statistics from this endpoint in your browser. |
<code>public-node:9090/haproxy?stats;csv</code> | The **Statistics CSV** endpoint provides statistical information about the current HAProxy instance and load balancing activity as comma-separated values (CSV). In CSV format, the information can be consumed by other tools. For example, this endpoint produces the results used in the `zdd.py` script. |
<code>public-node:9090/_haproxy_health_check</code> | The **Health check** endpoint returns 200 OK if HAProxy is healthy. |
<code>public-node:9090/_haproxy_getconfig</code> | The **Configuration** endpoint returns the HAProxy configuration file as it was when HAProxy was started. Implemented in `getconfig.lua`. |
<code>public-node:9090/_haproxy_getvhostmap</code> | The **Virtual-host-to-backend** endpoint returns the HAProxy virtual host to backend map if the `--haproxy-map` flag is enabled. If you are not using the `--haproxy-map` option, the endpoint returns an empty string. Implemented in `getmaps.lua`. |
<code>public-node:9090/_haproxy_getappmap</code> | The **App-ID-to-backend** endpoint returns the HAProxy application identifier to backend map. Like `_haproxy_getvhostmap`, this endpoint requires you to enable the `--haproxy-map` option and returns an empty string otherwise. Also implemented in `getmaps.lua`. |
<code>public-node:9090/_haproxy_getpids</code> | The **Process identifiers** endpoint returns the PIDs for all HAProxy instances within the current process namespace. The endpoint literally returns the output of $(`pidof haproxy`). Implemented in `getpids.lua`. This endpoint is also used by the `zdd.py` script to determine if connections have finished draining during a deployment. |
<code>public-node:9090/_mlb_signal/hup</code> | The **Reload configuration** endpoint sends a SIGHUP signal to the `marathon-lb` process, causing it to fetch the running apps from Marathon and reload the `HAProxy` configuration as though an event was received from Marathon. |
<code>public-node:9090/_mlb_signal/usr1</code> | The **Restart configuration** endpoint sends a `SIGUSR1` signal to the `marathon-lb` process, causing it to restart the `HAProxy` load balancer with the existing configuration, without checking Marathon for changes. |

<p class="message--note"><strong>NOTE: </strong>The <code>/_mlb_signal/hup</code> and <code>/_mlb_signal/usr1</code> endpoints do not function if Marathon-LB is running in <code>poll</code> mode. With the <code>poll</code> argument, Marathon-LB exits after each poll, so there is no running <code>marathon_lb.py</code> process to be signaled.</p>

# Marathon-LB command reference
Marathon-LB manages operations for the `HAProxy` program to provide high availability for applications running on high-volume websites. Marathon-LB relies on the `marathon_lb.py` script to perform the following key tasks:
* Connects to the Marathon API to retrieve information about all running apps.
* Generates and validates the Marathon-LB `HAProxy` configuration file settings.
* Reloads the `HAProxy` program.

    <p>
    <img src="/services/img/simple-mlb-haproxy.png" alt="Marathon-LB works with HAProxy configuration settings to provide load balancing">
    </p>

By default, Marathon-LB binds to the service port of every application and sends incoming requests to the application instances. Services are exposed on their service port as defined in their Marathon app definition. Furthermore, apps are only exposed on the load balancers that have the same load balancer `group` setting. The `group` setting is defined globally or in the app definition file by specifying the `HAPROXY_GROUP` label for individual applications. 

## Invoking marathon-lb directly
In most cases, the `marathon_lb.py` script runs in the background. However, you can also run the script directly from the command-line. For example, you can generate the `HAProxy` configuration information from Marathon by running the `marathon_lb.py` script for `localhost:8080` with the following command:

```
./marathon_lb.py --marathon http://localhost:8080 --group external --strict-mode --health-check
```

## Specifying credentials when running marathon-lb
If Marathon requires authentication, you can include a user name and password using the `--auth-credentials` configuration option. For example:

```
./marathon_lb.py --marathon http://localhost:8080 --auth-credentials=admin:password
```

You can also provide credentials from the VAULT if you define the following environment variables before running Marathon-LB:
* `VAULT_TOKEN`
* `VAULT_HOST`
* `VAULT_PORT`
* `VAULT_PATH`

If you set these environment variables, you should set the `VAULT_PATH` to the root path where your user account and password are located.

## Skipping configuration validation
Running the `marathon-lb.py` script refreshes the `haproxy.cfg` configuration file. If there are any changes to the configuration file, the script automatically reloads the `HAProxy` program with the changes. You can skip the configuration file validation process if you don't have `HAProxy` installed or if you are running `HAProxy` on Docker containers.

To skip validation of configuration settings, run the following command:
```
./marathon_lb.py --marathon http://localhost:8080 --group external --skip-validation
```

## Viewing complete usage information
If you run the `marathon-lb.py` script directly from the command line, you can specify additional functionality such as sticky sessions, HTTP to HTTPS redirection, SSL offloading, virtual host support, and the configuration templates to use.

To get the full command reference, run the following command:

```
./marathon_lb.py --help
```

## Running Docker commands for Marathon-LB
Marathon supports both Universal Container Runtime (using `cgroups`) and Docker containers and images. You can run Marathon-LB using a command similar to the following for Docker images:

```
docker run -e PORTS=$portnumber --net=host mesosphere/marathon-lb ...
```

This command uses the `-e` option to set the `PORTS` environment variable. The port number is required to allow the `HAProxy` program bind to this port. The `-net` option enables the command to connect a container to a specified network.

For example, to expose load-balanced applications from a Docker image on port 9090, you might run the following command:

```
docker run -e PORTS=9090 mesosphere/marathon-lb sse [other arguments]
```

### Using server-sent events (sse)
If you specify the `sse` option, the Marathon-LB script connects to the Marathon events endpoint to get notified about state changes.
You can use a command similar to the following to capture server-sent events (`sse`).

```
docker run mesosphere/marathon-lb sse [other arguments]
```

### Determining the current status for Marathon-LB instances
If you can't use the HTTP callbacks, you can run a command similar to the following to poll the scheduler state periodically:

```
docker run mesosphere/marathon-lb poll [other args]
```

You can also use environment variables to set other configuration options for Marathon-LB. For example, you can set the `POLL_INTERVAL` environment variable to change the poll interval from its default of 60 seconds.

## Usage and command arguments
You can run the Marathon load balancer script (`marathon_lb.py`) directly from the command-line in a shell terminal or programmatically. The script accepts the following command-line options and arguments.

### Usage 
<pre>
marathon_lb.py [-h] [--longhelp] [--marathon MARATHON [MARATHON ...]]
                      [--haproxy-config HAPROXY_CONFIG] [--group GROUP]
                      [--command COMMAND]
                      [--max-reload-retries MAX_RELOAD_RETRIES]
                      [--reload-interval RELOAD_INTERVAL] [--strict-mode]
                      [--sse] [--archive-versions ARCHIVE_VERSIONS]
                      [--health-check]
                      [--lru-cache-capacity LRU_CACHE_CAPACITY]
                      [--haproxy-map] [--dont-bind-http-https]
                      [--group-https-by-vhost] [--ssl-certs SSL_CERTS]
                      [--skip-validation] [--dry]
                      [--min-serv-port-ip-per-task MIN_SERV_PORT_IP_PER_TASK]
                      [--max-serv-port-ip-per-task MAX_SERV_PORT_IP_PER_TASK]
                      [--syslog-socket SYSLOG_SOCKET]
                      [--log-format LOG_FORMAT] [--log-level LOG_LEVEL]
                      [--marathon-auth-credential-file MARATHON_AUTH_CREDENTIAL_FILE]
                      [--auth-credentials AUTH_CREDENTIALS]
                      [--dcos-auth-credentials DCOS_AUTH_CREDENTIALS]
                      [--marathon-ca-cert MARATHON_CA_CERT]
</pre>

### Required arguments
<table class="table">
  <tr>
    <th style="font-weight:bold">Argument</th>
    <th style="font-weight:bold">Description</th>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">-m, --marathon MARATHON [MARATHON ...]</span></td>
    <td>Specifies one or more Marathon endpoints. This argument specifies the location of the Marathon containers for Marathon-LB to use. The default endpoint is <span style="background-color: #f2f2f2">http://master.mesos:8080</span>. For example, you can use this argument to specify two Marathon instances like this: <span style="background-color: #f2f2f2">-m http://marathon1:8080 http://marathon2:8080</span>.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--group GROUP</span></td>
    <td>Generates configuration information only for the apps with the specified group names. Use `*` to match all groups, including groups without a group name specified. The default is an empty string.</td>
  </tr>
</table>

### Optional arguments
<table class="table">
  <tr>
    <th style="font-weight:bold">Argument</th>
    <th style="font-weight:bold">Description</th>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">-h, --help</span></td>
    <td>Show this help message and exit.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--longhelp</span></td>
    <td>Print out configuration details. The default is false.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--haproxy-config HAPROXY_CONFIG</span></td>
    <td>Specifies the location of the `haproxy` configuration file. The default is <span style="background-color: #f2f2f2">/etc/haproxy/haproxy.cfg</span></td>.
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--command COMMAND, -c COMMAND</span></td>
    <td>If set, run this command to reload haproxy. The default is none.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--max-reload-retries MAX_RELOAD_RETRIES</span></td>
    <td>Specifies the maximum number if reload retries before failure. Reloads happen every <span style="background-color: #f2f2f2">--reload-interval</span> seconds. Set to 0 to disable reloading attempts or -1 for infinite retries. The default is 10.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--reload-interval RELOAD_INTERVAL</span></td>
    <td>Waits the specified number of seconds between reload retries. The default is 10.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--strict-mode</span></td>
    <td>Enables backends to be advertised only if <span style="background-color: #f2f2f2">HAPROXY_{n}_ENABLED=true</span>. Strict mode might be enabled by default in a future release. The default is false.</td>
  </tr>
   <tr>
    <td><span style="background-color: #f2f2f2">--sse, -s</span></td>
    <td>Uses server-sent events. The default is false.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--archive-versions ARCHIVE_VERSIONS</span></td>
    <td>Specifies the number of configuration versions to archive. The default is 5.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--health-check, -H</span></td>
    <td>Determines Marathon's health check status before adding the app instance into the backend pool. The default is false.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--lru-cache-capacity LRU_CACHE_CAPACITY</span></td>
    <td>Specifies the LRU cache size (in number of items). This argument should be at least as large as the number of tasks exposed to marathon-lb. The default is 1000.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--haproxy-map</span></td>
    <td>Uses HAProxy maps for domain name to backend mapping. The default is false.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--dont-bind-http-https</span></td>
    <td>Prevents binding to HTTP and HTTPS frontends. The default is false.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--group-https-by-vhost</span></td>
    <td>Groups https frontends by virtual host. The default is false.</td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--ssl-certs SSL_CERTS</span></td>
    <td>Lists SSL certificates separated by commas for frontend <span style="background-color: #f2f2f2">marathon_https_in</span>. The default is <span style="background-color: #f2f2f2">/etc/ssl/cert.pem</span>. For example: <span style="background-color: #f2f2f2">/etc/ssl/site1.co.pem,/etc/ssl/site2.co.pem</span></td>
  </tr>
  <tr>
    <td><span style="background-color: #f2f2f2">--skip-validation</span></td>
    <td>Skips haproxy configuration file validation. The default is false.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--dry, -d</span></td>
    <td>Only prints configuration information to the console. The default is false.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--min-serv-port-ip-per-task MIN_SERV_PORT_IP_PER_TASK</span></td>
    <td>Specifies the minimum port number to use when auto-assigning service ports for IP-per-task applications. The default is 10050.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--max-serv-port-ip-per-task MAX_SERV_PORT_IP_PER_TASK</span></td>
    <td>Specifies the maximum port number to use when auto-assigning service ports for IP-per-task applications. The default is 10100.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--syslog-socket SYSLOG_SOCKET</span></td>
    <td>Specifies the socket to write syslog messages to. Use <span style="background-color: #f2f2f2">/dev/null</span> to disable logging to <span style="background-color: #f2f2f2">syslog</span>. The default is <span style="background-color: #f2f2f2">/dev/log</span>.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">-log-format LOG_FORMAT</span></td>
    <td>Sets the log message format. The default is <span style="background-color: #f2f2f2">%(asctime)-15s %(name)s: %(message)s</span>.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--log-level LOG_LEVEL</span></td>
    <td>Sets the log level, The default is DEBUG.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--marathon-auth-credential-file MARATHON_AUTH_CREDENTIAL_FILE</span></td>
    <td>Specifies the path to file containing a user name and password for the Marathon HTTP API in the format of <span style="background-color: #f2f2f2">user:pass</span>. The default is none.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--auth-credentials AUTH_CREDENTIALS</span></td>
    <td>Specifies the user name and password for the Marathon HTTP API in the format of <span style="background-color: #f2f2f2">user:pass</span>. The default is none.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--dcos-auth-credentials DCOS_AUTH_CREDENTIALS</span></td>
    <td>Specifies the DC/OS service account credentials. The default is none.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--dcos-auth-credentials DCOS_AUTH_CREDENTIALS</span></td>
    <td>Specifies the DC/OS service account credentials. The default is none.</td>
  </tr> 
  <tr>
    <td><span style="background-color: #f2f2f2">--marathon-ca-cert MARATHON_CA_CERT</span></td>
    <td>Specifies the CA certificate for Marathon HTTPS connections. The default is none.</td>
  </tr> 
</table>

# Template and label reference
The following is a list of the available `HAProxy` configuration **templates**. Some templates are global-only (such as `HAPROXY_HEAD`), but most can be specified on a per service port basis as **app labels** to override the global settings.

The templates and app labels that can be set per-service-port include an index identifier {n} in the template or label name. The index identifier corresponds to the service port index, beginning at 0, to which the app label applies. For example, you could specify `HAPROXY_0_BACKEND_HEAD` to override the global template `HAPROXY_BACKUP_HEAD` for the first port of a given application.

## Backend template settings
Use the following template and app labels to configure backend settings for the load balancer.

<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="45px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Template name</th>
<th style="font-weight:bold">Description and examples</th>
</tr>
<tbody valign="top">
<tr>
<td><code>HAPROXY_BACKEND_HEAD</code></td><td>Defines the type of load balancing and the connection mode for a backend. The default load balancing type (algorithm) is <code>roundrobin</code>. The default connection mode is <code>tcp</code>.

The valid values for the load balancing type include:

* <code>roundrobin</code> - Each server is used in turns, according to their weights. 
  This algorithm is dynamic and ensures processing time remains equally distributed. 
* <code>static-rr</code> - Each server is used in turns, according to their weights. 
  This algorithm is as similar to roundrobin except that it is static.
* <code>leastconn</code> - The server with the least number of connections receives the next connection request. 
  Round-robin selection is performed within groups of servers that have the same load to ensure that all servers are used. This algorithm is recommended when long sessions, such as LDAP or SQL sessions are expected, is not appropriate for protocols using short sessions such as HTTP.
* <code>source</code> - The source IP address is hashed and divided by the total weight of the running servers to designate which server should receive the request. 
  This algorithm ensures that the same client IP address always reaches the same server as long as no server goes down or up. If the hash result changes because the number of running servers has changed, clients  are directed to a different server. This algorithm is generally used with TCP mode or for clients that refuse session cookies.
* <code>uri</code> - This algorithm hashes either the left part of the URI (before the question mark) or the whole URI (if the "whole" parameter is present) and divides the hash value by the total weight of the running servers. 
  The result designates which server receives the request.
  
You can set the connection mode to `tcp`, `http`, or `health`. 

The default template for `HAPROXY_BACKEND_HEAD` is:
<code>backend {backend}
  balance {balance}
  mode {mode}
</code>

You can override this template using the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_HEAD": "\nbackend {backend}\n  balance {balance}\n  mode {mode}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_HSTS<br>_OPTIONS</code></td><td>Specifies the backend options to use where the <code>HAPROXY_{n}_USE_HSTS</code> app label that enables the HSTS response header for HTTP clients is set to true. 

The default template for `HAPROXY_BACKEND_HSTS_OPTIONS` is:
<code>rspadd Strict-Transport-Security:\ max-age=15768000</code>

You can override this template using the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_HSTS_OPTIONS": " rspadd Strict-Transport-Security:\\ max-age=15768000\n"</code>
</td></tr>

<tr><td><code>HAPROXY_BACKEND_HTTP<br>_HEALTHCHECK_OPTIONS</code></td><td>Sets HTTP health check options, such as the health check timeout interval and consecutive failures allowed. 

The valid options for the first health check or the first health check for a given service are exposed as follows:
- healthCheckPortIndex
- healthCheckPort
- healthCheckProtocol
- healthCheckPath
- healthCheckTimeoutSeconds
- healthCheckIntervalSeconds
- healthCheckGracePeriodSeconds
- healthCheckMaxConsecutiveFailures
- healthCheckFalls (healthCheckMaxConsecutiveFailures + 1)
- healthCheckPortOptions (port {healthCheckPort})

The default template for `HAPROXY_BACKEND_HTTP_HEALTHCHECK_OPTIONS` is:
<code>option  httpchk GET {healthCheckPath
  timeout check {healthCheckTimeoutSeconds}s</code>

You can override this template using the following app label for the first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_BACKEND_HTTP_HEALTHCHECK_OPTIONS": "  option  httpchk GET {healthCheckPath}\n  timeout check {healthCheckTimeoutSeconds}s\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_HTTP<br>_OPTIONS</code></td><td>Sets HTTP headers, for example, X-Forwarded-For and X-Forwarded-Proto. 

The default template for `HAPROXY_BACKEND_HTTP_OPTIONS` is:
<code>option forwardfor
  http-request set-header X-Forwarded-Port %[dst_port]
  http-request add-header X-Forwarded-Proto https if { ssl_fc }</code>

You can override this template using the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_HTTP_OPTIONS": "  option forwardfor\n  http-request set-header X-Forwarded-Port %[dst_port]\n  http-request add-header X-Forwarded-Proto https if { ssl_fc }\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_REDIRECT<br>_HTTP_TO_HTTPS</code></td><td>Redirects backends if the HAPROXY_{n}_REDIRECT_TO_HTTPS label is set to true. 

The default template for `HAPROXY_BACKEND_REDIRECT_HTTP_TO_HTTPS` is:
<code>redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>HAPROXY_0_BACKEND_REDIRECT_HTTP_TO_HTTPS": " redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_REDIRECT<br>_HTTP_TO_HTTPS_WITH_PATH</code></td><td>Redirects backends if the `HAPROXY_{n}_REDIRECT_TO_HTTPS_WITH_PATH` label is set to true, but includes a path. 

The default template for <code style="word-break: break-word;">HAPROXY_BACKEND_REDIRECT_HTTP_TO_HTTPS_WITH_PATH</code> is:
<code>redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_BACKEND_REDIRECT_HTTP_TO_HTTPS_WITH_PATH": " redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname} path_{backend}\n"</code>
</td></tr>
<tr><td><code>HAPROXY_BACKEND_SERVER<br>_HTTP_HEALTHCHECK_OPTIONS </code></td><td>Sets HTTP health check options, such as the health check timeout interval, for a single server. 

The valid options for the first health check or the first health check for a given service are exposed as follows:
- healthCheckPortIndex
- healthCheckPort
- healthCheckProtocol
- healthCheckPath
- healthCheckTimeoutSeconds
- healthCheckIntervalSeconds
- healthCheckGracePeriodSeconds
- healthCheckMaxConsecutiveFailures
- healthCheckFalls (healthCheckMaxConsecutiveFailures + 1)
- healthCheckPortOptions (port {healthCheckPort})

The default template for `HAPROXY_BACKEND_SERVER_HTTP_HEALTHCHECK_OPTIONS` is:
<code> check inter {healthCheckIntervalSeconds}s fall {healthCheckFalls}{healthCheckPortOptions}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_SERVER_HTTP_HEALTHCHECK_OPTIONS": "  check inter {healthCheckIntervalSeconds}s fall {healthCheckFalls}{healthCheckPortOptions}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_SERVER<br>_OPTIONS </code></td><td>Specifies the options for each server added to a backend. 

The default template for HAPROXY_BACKEND_SERVER_OPTIONS is:
<code> server {serverName} {host_ipv4}:{port}{cookieOptions}{healthCheckOptions}{otherOptions}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_SERVER_OPTIONS": "  server {serverName} {host_ipv4}:{port}{cookieOptions}{healthCheckOptions}{otherOptions}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_SERVER<br>_TCP_HEALTHCHECK<br>_OPTIONS </code></td><td>Sets TCP health check options, such as the health check timeout interval, for a single server.

The valid options for the first health check or the first health check for a given service are exposed as follows:
- healthCheckPortIndex
- healthCheckPort
- healthCheckProtocol
- healthCheckTimeoutSeconds
- healthCheckIntervalSeconds
- healthCheckGracePeriodSeconds
- healthCheckMaxConsecutiveFailures
- healthCheckFalls (healthCheckMaxConsecutiveFailures + 1)
- healthCheckPortOptions (port {healthCheckPort})

The default template for `HAPROXY_BACKEND_SERVER_TCP_HEALTHCHECK_OPTIONS` is:
<code>check inter {healthCheckIntervalSeconds}s fall {healthCheckFalls}{healthCheckPortOptions}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_SERVER_TCP_HEALTHCHECK_OPTIONS": "  check inter {healthCheckIntervalSeconds}s fall {healthCheckFalls}{healthCheckPortOptions}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_STICKY_OPTIONS </code></td><td>Sets a cookie for services where HAPROXY_{n}_STICKY is true.

The default template for `HAPROXY_BACKEND_STICKY_OPTIONS` is:
<code> cookie mesosphere_server_id insert indirect nocache</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_STICKY_OPTIONS": "  cookie mesosphere_server_id insert indirect nocache\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_TCP<br>_HEALTHCHECK_OPTIONS </code></td><td>Sets TCP health check options,such as the timeout check. 

The valid options for the first health check or the first health check for a given service are exposed as follows:
- healthCheckPortIndex
- healthCheckPort
- healthCheckProtocol
- healthCheckTimeoutSeconds
- healthCheckIntervalSeconds
- healthCheckGracePeriodSeconds
- healthCheckMaxConsecutiveFailures
- healthCheckFalls (healthCheckMaxConsecutiveFailures + 1)
- healthCheckPortOptions (port {healthCheckPort})

The default template for `HAPROXY_BACKEND_TCP_HEALTHCHECK_OPTIONS` is an empty string. 

The following example sets a timeout check:
<code> timeout check {healthCheckTimeoutSeconds}s</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_TCP_HEALTHCHECK_OPTIONS": ""</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_VHOST_BACKEND_HEAD </code></td><td>Defines the HTTPS backend for vhost. 

You must enable the `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application.

The default template for `HAPROXY_HTTPS_GROUPED_VHOST_BACKEND_HEAD` is:
<code>backend {name}
  server loopback-for-tls abns@{name} send-proxy-v2</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_ACL_ALLOW_DENY </code></td><td>Denies access for all IP addresses (or IP ranges) that are not explicitly allowed to access the HTTP backend. Use this template with HAPROXY_HTTP_BACKEND_NETWORK_ALLOWED_ACL. This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_BACKEND_ACL_ALLOW_DENY` is:
<code> http-request allow if network_allowed
  http-request deny</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_NETWORK_ALLOWED_ACL </code></td><td>Specifies the IP addresses (or IP  ranges) that have access to the HTTP backend. This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_BACKEND_NETWORK_ALLOWED_ACL` is:
<code>acl network_allowed src {network_allowed}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_NETWORK_ALLOWED_ACL": "  acl network_allowed src {network_allowed}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_PROXYPASS_GLUE</code></td><td>Specifies the backend glue for HAPROXY_{n}_HTTP_BACKEND_PROXYPASS_PATH. 

The default template for `HAPROXY_HTTP_BACKEND_PROXYPASS_GLUE` is:
<code>http-request set-header Host {hostname}
  reqirep  "^([^ :]*)\ {proxypath}/?(.*)" "\1\ /\2" </code>

You can override this template with the following app label for the first port (`0`)of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_PROXYPASS_GLUE": "  http-request set-header Host {hostname}\n  reqirep  \"^([^ :]*)\\ {proxypath}/?(.*)\" \"\\1\\ /\\2\"\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND_REDIR </code></td><td>Sets the path to which you want to redirect the root of the domain. 

The default template for `HAPROXY_HTTP_BACKEND_REDIR` is:
<code>acl is_root path -i /
  acl is_domain hdr(host) -i {hostname}
  redirect code 301 location {redirpath} if is_domain is_root</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_REDIR": "  acl is_root path -i /\n  acl is_domain hdr(host) -i {hostname}\n  redirect code 301 location {redirpath} if is_domain is_root\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_REVPROXY_GLUE </code></td><td>Specifies the backend glue for HAPROXY_{n}_HTTP_BACKEND_REVPROXY_PATH. 

The default template for `HAPROXY_HTTP_BACKEND_REVPROXY_GLUE` is:
<code>acl hdr_location res.hdr(Location) -m found
  rspirep "^Location: (https?://{hostname}(:[0-9]+)?)?(/.*)" "Location:   {rootpath} if hdr_location"</code>

You can override this template with the following app label for the first port (`0`)of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_REVPROXY_GLUE": "  acl hdr_location res.hdr(Location) -m found\n  rspirep \"^Location: (https?://{hostname}(:[0-9]+)?)?(/.*)\" \"Location:   {rootpath} if hdr_location\"\n"</code></td></tr>

<tr><td><code>HAPROXY_TCP_BACKEND<br>_ACL_ALLOW_DENY </code></td><td>Denies access for all IP addresses (or IP address ranges) that are not explicitly allowed to access the TCP backend. This global template cannot be overridden by service port or application. 

The default template for `HAPROXY_TCP_BACKEND_ACL_ALLOW_DENY` is:
<code>tcp-request content accept if network_allowed
  tcp-request content reject</code></td></tr>

<tr><td><code>HAPROXY_TCP_BACKEND<br>_NETWORK_ALLOWED_ACL </code></td><td>Specifies the IP addresses (or IP address ranges) that have been granted access to the TCP backend. 

The default template for `HAPROXY_TCP_BACKEND_NETWORK_ALLOWED_ACL` is:
<code>acl network_allowed src {network_allowed}</code>

You can override this template with the following app label for the first port (`0`) of a given app: 
<code>"HAPROXY_0_TCP_BACKEND_NETWORK_ALLOWED_ACL": "  acl network_allowed src {network_allowed}\n"</code></td></tr>
</tbody>
</table>

## Frontend template settings
Use the following template and app labels to configure frontend settings for the load balancer.

<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="45px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Template name</th>
<th style="font-weight:bold">Description and examples</th>
</tr>
<tbody valign="top">
<tr><td><code>HAPROXY_FRONTEND_BACKEND_GLUE </code></td><td>Glues the backend to the frontend. 

The default template for `HAPROXY_FRONTEND_BACKEND_GLUE` is:
<code> use_backend {backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_FRONTEND_BACKEND_GLUE": "  use_backend {backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_FRONTEND_HEAD </code></td><td>Defines the address and port to bind to for this frontend. 

The default template for `HAPROXY_FRONTEND_HEAD` is:
<code>frontend {backend}
  bind {bindAddr}:{servicePort}{sslCert}{bindOptions}
  mode {mode}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_FRONTEND_HEAD": "\nfrontend {backend}\n  bind {bindAddr}:{servicePort}{sslCert}{bindOptions}\n  mode {mode}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL </code></td><td>Specifies the ACL that performs the SNI based hostname matching for the HAPROXY_HTTPS_FRONTEND_HEAD template. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL` is:
<code>use_backend {backend} if {{ ssl_fc_sni {hostname} }}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL": "  use_backend {backend} if {{ ssl_fc_sni {hostname} }}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_ONLY_WITH_PATH </code></td><td>Defines the access control list (ACL) frontend that matches a particular host name with a path. This template is similar to HTTP_FRONTEND_ACL_ONLY_WITH_PATH, but is only applicable for HTTPS requests.

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_ONLY_WITH_PATH` is:
<code>acl path_{backend} path_beg {path}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_ONLY_WITH_PATH": "  acl path_{backend} path_beg {path}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_WITH_AUTH </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding virtual host of the HAPROXY_HTTPS_FRONTEND_HEAD through HTTP Basic authentication. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_WITH_AUTH` is:
<code> acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}
  use_backend {backend} if {{ ssl_fc_sni {hostname} }}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_WITH_AUTH": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}\n  use_backend {backend} if {{ ssl_fc_sni {hostname} }}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_WITH_AUTH<br>_AND_PATH</td><td>Specifies the ACL that glues a backend to the corresponding virtual host with path of the HAPROXY_HTTPS_FRONTEND_HEAD through HTTP Basic authentication. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_WITH_AUTH_AND_PATH` is:
<code> acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if {{ ssl_fc_sni {hostname} }} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_WITH_AUTH_AND_PATH": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if {{ ssl_fc_sni {hostname} }} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_WITH_PATH </code></td><td>Specifies the ACL that performs the SNI based hostname matching with path for the HAPROXY_HTTPS_FRONTEND_HEAD template. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_WITH_PATH` is:
<code> use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_WITH_PATH": "  use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_AUTH_ACL_ONLY </code></td><td>Specifies the HTTP authentication ACL for the corresponding virtual host. 

The default template for `HAPROXY_HTTPS_FRONTEND_AUTH_ACL_ONLY` is:
<code> acl auth_{cleanedUpHostname} http_auth(user_{backend})<code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_AUTH_ACL_ONLY": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_AUTH_REQUEST_ONLY </code></td><td>Specifies the HTTP authentication request forthe corresponding virtual host. 

The default template for `HAPROXY_HTTPS_FRONTEND_AUTH_REQUEST_ONLY` is:
<code> http-request auth realm "{realm}" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_AUTH_REQUEST_ONLY": "  http-request auth realm \"{realm}\" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND_HEAD </code></td><td>Specifies an HTTPS frontend for encrypted connections that binds to port *:443 by default and gathers all virtual hosts as defined by the HAPROXY_{n}_VHOST label. This template is a global template that cannot be modified by service port or per application.

You must modify this template setting if you want to include your SSL certificate. The default template for `HAPROXY_HTTPS_FRONTEND_HEAD` is:
<code>frontend marathon_https_in
  bind *:443 ssl {sslCerts}
  mode http</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ROUTING_ONLY_WITH<br>_PATH_AND_AUTH </code></td><td>Works in combination with HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH to glue ACL names to the appropriate backend. 
The default template for `HAPROXY_HTTPS_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH` is:
<code> http-request auth realm "{realm}" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH": "  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_FRONTEND_HEAD </code></td><td>Defines the HTTPS frontend for encrypted connections that binds to port *:443 by default and gathers all virtual hosts as defined by the HAPROXY_{n}_VHOST label. This template is useful for adding client certificates per domain. 

You must enable the `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application.

The default template for `HAPROXY_HTTPS_GROUPED_FRONTEND_HEAD` is:
<code>frontend marathon_https_in
  bind *:443
  mode tcp
  tcp-request inspect-delay 5s
  tcp-request content accept if { req_ssl_hello_type 1 }</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_VHOST_FRONTEND_ACL </code></td><td>Specifies a route rule HTTPS entrypoint. 

You must enable the `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application.

The default template for `HAPROXY_HTTPS_GROUPED_VHOST_FRONTEND_ACL` is:
<code> use_backend {backend} if {{ req_ssl_sni -i {host} }}</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_VHOST_FRONTEND_HEAD </code></td><td>Specifies the HTTPS frontend for the virtual host. 

You must enable the `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application. The default template for `HAPROXY_HTTPS_GROUPED_VHOST_FRONTEND_HEAD` is:
<code>frontend {name}
  mode http
  bind abns@{name} accept-proxy ssl {sslCerts}{bindOpts}</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND_ACL </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding virtual host of the HAPROXY_HTTP_FRONTEND_HEAD. 

The default template for `HAPROXY_HTTP_FRONTEND_AC`L` is:
<code> acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  use_backend {backend} if host_{cleanedUpHostname}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_ONLY </code></td><td>Defines the access control list (ACL) that matches a particular host name. Unlike HAPROXY_HTTP_FRONTEND_ACL, this template only includes the ACL portion. It does not glue the access control list (ACL) to the backend. You should only use this template if you have multiple virtual hosts routing to the same backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_ONLY` is:
<code> acl host_{cleanedUpHostname} hdr(host) -i {hostname}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_ONLY": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_ONLY_WITH_PATH </code></td><td>Defines the access control list (ACL) that matches a particular host name with a path. Unlike HAPROXY_HTTP_FRONTEND_ACL_WITH_PATH, this template only includes the ACL portion. It does not glue the access control list (ACL) to the backend. You should only use this template if you have multiple virtual hosts routing to the same backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH` is:
<code> acl path_{backend} path_beg {path} </code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_ONLY_WITH_PATH": " acl path_{backend} path_beg {path}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_ONLY_WITH<br>_PATH_AND_AUTH </code></td><td>Defines the access control list (ACL) that matches a particular host name with a path and authentication method. Unlike HAPROXY_HTTP_FRONTEND_ACL_WITH_PATH, this template only includes the ACL portion. It does not glue the access control list (ACL) to the backend. You should only use this template if you have multiple virtual hosts routing to the same backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH_AND_AUTH` is:
<code>acl path_{backend} path_beg {path}
  acl auth_{cleanedUpHostname} http_auth(user_{backend})</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_ONLY_WITH_PATH_AND_AUTH": "  acl path_{backend} path_beg {path}\n  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_WITH_AUTH </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding virtual host specified by the HAPROXY_HTTP_FRONTEND_HEAD setting through HTTP Basic authentication. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_WITH_AUTH` is:
<code>
 acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname}<code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_WITH_AUTH": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_WITH_AUTH<br>_AND_PATH </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding virtual host with the path specified by the HAPROXY_HTTP_FRONTEND_HEAD setting through HTTP Basic authentication. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_WITH_AUTH_AND_PATH` is:
<code>
 acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  acl auth_{cleanedUpHostname} http_auth(user_{backend})
  acl path_{backend} path_beg {path}
  http-request auth realm "{realm}" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_WITH_AUTH_AND_PATH": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  acl path_{backend} path_beg {path}\n  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_WITH_PATH </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding virtual host with the path specified by the HAPROXY_HTTP_FRONTEND_HEAD setting. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_WITH_PATH` is:
<code>acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  acl path_{backend} path_beg {path}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_WITH_PATH": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  acl path_{backend} path_beg {path}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_APPID_ACL </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding app specified by the HAPROXY_HTTP_FRONTEND_APPID_HEAD setting. 

The default template for `HAPROXY_HTTP_FRONTEND_APPID_ACL` is:
<code>acl app_{cleanedUpAppId} hdr(x-marathon-app-id) -i {appId}
  use_backend {backend} if app_{cleanedUpAppId}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_APPID_ACL": "  acl app_{cleanedUpAppId} hdr(x-marathon-app-id) -i {appId}\n  use_backend {backend} if app_{cleanedUpAppId}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_APPID_HEAD </code></td><td>Specifies the HTTP frontend that binds to port *:9091 by default and gathers all apps in HTTP mode. To use this frontend to forward to your app, configure the app with HAPROXY_0_MODE=http then you can access it via a call to the :9091 with the header "X-Marathon-App-Id" set to the Marathon AppId. Note multiple HTTP ports being exposed by the same marathon app are not supported. Only the first HTTP port is available using this frontend. 

This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_FRONTEND_APPID_HEAD` is:
<code>frontend marathon_http_appid_in
  bind *:9091
  mode http</code></td></tr>
<tr><td><code>HAPROXY_HTTP_FRONTEND_HEAD </code></td><td>Specifies the HTTP frontend that binds to port *:80 by default and gathers all virtual hosts as defined by the HAPROXY_{n}_VHOST label. This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_FRONTEND_HEAD` is:
<code>frontend marathon_http_in
  bind *:80
  mode http</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY </code></td><td>Works in combination with the HAPROXY_HTTP_FRONTEND_ACL_ONLY setting to map access control list (ACL) names to their appropriate backends. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY` is:
<code> use_backend {backend} if host_{cleanedUpHostname}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY": "  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY_WITH_AUT </code></td><td>Works in combination with the HAPROXY_HTTP_FRONTEND_ACL_ONLY setting to map the access control list name to the appropriate backend and to add HTTP Basic authentication. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY_WITH_AUTH` is:
<code>acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY_WITH_AUTH": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY_WITH_PATH</code></td><td>Works in combination with the HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH setting to map access control list (ACL) names to the appropriate backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH` is:
<code>use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH": "  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY_WITH<br>_PATH_AND_AUTH </code></td><td>Works in combination with the HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH setting to map access control list names to the appropriate backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH` is:
<code>http-request auth realm "{realm}" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH": "  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTPS<br>_FRONTEND_ACL </code></td><td>Specifies the access control list (ACL) that performs the SNI-based host name matching for the HAPROXY_HTTPS_FRONTEND_HEAD template using HAProxy maps. 

The default template for `HAPROXY_MAP_HTTPS_FRONTEND_ACL` is:
<code>use_backend %[ssl_fc_sni,lower,map({haproxy_dir}/domain2backend.map)</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_MAP_HTTPS_FRONTEND_ACL": "  use_backend %[ssl_fc_sni,lower,map({haproxy_dir}/domain2backend.map)]\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTP<br>_FRONTEND_ACL </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding virtual host specified by the HAPROXY_HTTP_FRONTEND_HEAD setting using HAProxy maps. 

The default template for `HAPROXY_MAP_HTTP_FRONTEND_ACL` is:
<code style="word-break: break-word;">use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_MAP_HTTP_FRONTEND_ACL": "  use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)]\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTP<br>_FRONTEND_ACL_ONLY </code></td><td> Defines the access control list (ACL) that matches a particular host name, You should only use this template if you have multiple virtual hosts routing to the same backend in the HAProxy map. 

The default template for `HAPROXY_MAP_HTTP_FRONTEND_ACL_ONLY` is:
<code style="word-break: break-word;">use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_MAP_HTTP_FRONTEND_ACL_ONLY": "  use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)]\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTP<br>_FRONTEND_APPID_ACL </code></td><td>Specifies the access control list (ACL) that glues a backend to the corresponding app specified by the HAPROXY_HTTP_FRONTEND_APPID_HEAD setting using HAProxy maps. 

The default template for `HAPROXY_MAP_HTTP_FRONTEND_APPID_ACL` is:
<code>use_backend %[req.hdr(x-marathon-app-id),lower,map({haproxy_dir}/app2backend.map)</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_MAP_HTTP_FRONTEND_APPID_ACL": "  use_backend %[req.hdr(x-marathon-app-id),lower,map({haproxy_dir}/app2backend.map)]\n"</code>
</td></tr>
</tbody>
</table>

## User authentication list setting
Use the following template and app label to configure basic user name and password settings for the load balancer.

<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="45px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Template name</th>
<th style="font-weight:bold">Description and examples</th>
</tr>
<tbody valign="top">
<tr><td><code>HAPROXY_USERLIST_HEAD </code></td><td>Specifies the user list for HTTP Basic authentication. 

The default template for `HAPROXY_USERLIST_HEAD` is:
<code>userlist user_{backend}
  user {user} password {passwd}</code>

You can override this template with the following app label for the first port (`0`) of a given app:
<code>"HAPROXY_0_USERLIST_HEAD": "\nuserlist user_{backend}\n  user {user} password {passwd}\n"</code></td></tr>
</tbody>
</table>

## Global header settings
Use the following template to configure default header settings for the load balancer.

<table class="table" style="table-layout: fixed">
<colgroup>
    <col span="1" width="45px">
    <col span="1" width="80px">
</colgroup>
<tr>
<th style="font-weight:bold">Template name</th>
<th style="font-weight:bold">Description and examples</th>
</tr>
<tbody valign="top">
<tr><td><code>HAPROXY_HEAD </code></td><td>Specifies header information for the HAProxy configuration file. This template contains global settings and defaults. This template cannot be overridden by service port or application-based settings.

The default template for `HAPROXY_HEAD` is:
<pre>
global
  log /dev/log local0
  log /dev/log local1 notice
  spread-checks 5
  max-spread-checks 15000
  maxconn 50000
  tune.ssl.default-dh-param 2048
  ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:!aNULL:!MD5:!DSS
  ssl-default-bind-options no-sslv3 no-tlsv10 no-tls-tickets
  ssl-default-server-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:!aNULL:!MD5:!DSS
  ssl-default-server-options no-sslv3 no-tlsv10 no-tls-tickets
  stats socket /var/run/haproxy/socket expose-fd listeners
  server-state-file global
  server-state-base /var/state/haproxy/
  lua-load /marathon-lb/getpids.lua
  lua-load /marathon-lb/getconfig.lua
  lua-load /marathon-lb/getmaps.lua
  lua-load /marathon-lb/signalmlb.lua
defaults
  load-server-state-from-file global
  log               global
  retries                   3
  backlog               10000
  maxconn               10000
  timeout connect          3s
  timeout client          30s
  timeout server          30s
  timeout tunnel        3600s
  timeout http-keep-alive  1s
  timeout http-request    15s
  timeout queue           30s
  timeout tarpit          60s
  option            dontlognull
  option            http-server-close
  option            redispatch
listen stats
  bind 0.0.0.0:9090
  balance
  mode http
  stats enable
  monitor-uri /_haproxy_health_check
  acl getpid path /_haproxy_getpids
  http-request use-service lua.getpids if getpid
  acl getvhostmap path /_haproxy_getvhostmap
  http-request use-service lua.getvhostmap if getvhostmap
  acl getappmap path /_haproxy_getappmap
  http-request use-service lua.getappmap if getappmap
  acl getconfig path /_haproxy_getconfig
  http-request use-service lua.getconfig if getconfig

  acl signalmlbhup path /_mlb_signal/hup
  http-request use-service lua.signalmlbhup if signalmlbhup
  acl signalmlbusr1 path /_mlb_signal/usr1
  http-request use-service lua.signalmlbusr1 if signalmlbusr1
  </pre>
  </td></tr>
</tbody>
</table>

## Additional application labels
You can use the following labels to configure additional application settings.

<table>
  <colgroup>
    <col span="1" width="20px">
    <col span="1" width="60px">
  </colgroup>
  <tr>
    <th style="font-weight:bold">Label name</th>
    <th style="font-weight:bold">Description and examples</th>
  </tr>
  <tbody valign="top">
    <tr>
    <td><code>HAPROXY_{n}_AUTH</code></td>
    <td>Specifies the HTTP authentication method to use for the application on the given service port index. 
    
  For example, you can use this label to specify the realm name for Basic authentication:
  
  <code>
    HAPROXY_0_AUTH = realm:username:encryptedpassword
  </code>

  For details on configuring authentication methods, see [HTTP Basic authentication]( https://github.com/mesosphere/marathon-lb/wiki/HTTP-Basic-Auth)</td>
  </tr>

  <tr><td><code>HAPROXY_{n}_BACKEND_<br>HEALTHCHECK_PORT_<br>INDEX</code></td>
  <td>Sets the index of the port to use as the dedicated port for the backend health checks associated with a given service port. By default, the index for the backend health check is the same as the index used for the service port.

  For example, if an app exposes two ports--`9000` and `9001`--you can specify one port for application activity, and one port for for receiving health check information:

  <code>portMappings": [ 
    { "containerPort": 9000, "hostPort": 0, "servicePort": 0, "protocol": "tcp" },
    { "containerPort": 9001, "hostPort": 0, "servicePort": 0, "protocol": "tcp" }
  </code>

  You can then specify that you want to use port 9001 to perform the backend health checks:

  <code>
  HAPROXY_0_BACKEND_HEALTHCHECK_PORT_INDEX=1
  </code> </td>
</tr>

<tr><td><code>HAPROXY_{n}_BACKEND<br>_NETWORK_ALLOWED_ACL</code></td> 
<td>Sets the IP addresses (or IP address ranges) that have been granted access to the backend.  

For example, you could set the following app label to restrict access to the specified IP addresses `10.1.40.0/24` and `10.1.55.43`:

<code>
HAPROXY_0_BACKEND_NETWORK_ALLOWED_ACL = '10.1.40.0/24 10.1.55.43'
</code>

By default, every IP address is allowed.
</td>
</tr>

<tr><td><code>HAPROXY_{n}_BACKEND_<br>WEIGHT</code></td>
<td>Specifies the order in which to enforce permissions if there are multiple backends sharing the access control lists for virtual hosts and paths. For example, if you are using a virtual host and have path access control lists that are shared by multiple backends, the order of the ACLs affects how permissions are granted for the application. 

With `HAPROXY_{n}_BACKEND_WEIGHT`, you can change the order used to evaluated the ACLs by specifying a weight. The ACLs for the backends are then applied from largest to smallest weight. 

If you don’t specify a value, the default weight of zero (0) is used. By default, any backends that use `HAPROXY_{n}_PATH` will have a weight of 1.

<code>HAPROXY_0_BACKEND_WEIGHT = 1</code>
</td>
</tr>

<tr><td><code>HAPROXY_{n}_BALANCE</code></td>
<td>Sets the load balancing algorithm to be used in a backend. The default is `roundrobin`. 

For example: 

<code>
HAPROXY_0_BALANCE = 'leastconn'
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_BIND_ADDR</code></td>
<td>Binds the load balancer to the specific address for the service. 

For example:

<code>
HAPROXY _0_BIND_ADDR = '10.0.0.42'
</code>
</td>
</tr>

<tr><td><code>HAPROXY_{n}_BIND_<br>OPTIONS</code></td><td>Sets additional bind options.

For example: 

<code>
HAPROXY_0_BIND_OPTIONS = 'ciphers AES128+EECDH:AES128+EDH force-tlsv12 no-sslv3 no-tlsv10'
</code></td>
</tr>

<tr><td><code>HAPROXY_DEPLOYMENT<br>_ALT_PORT</code></td>
<td>Specifies an alternate service port to be used during a blue/green deployment.</td>
</tr>

<tr><td><code>HAPROXY_DEPLOYMENT<br>_COLOUR</code></td>
<td>Specifies the color to use for blue/green deployment. This label is used if you run the `bluegreen_deploy.py` script to determine the state of a deployment. You generally do not need to modify this label setting unless you implement your own deployment orchestrator.</td>
</tr>

<tr><td><code>HAPROXY_DEPLOYMENT<br>_GROUP</code></td>
<td>Specifies the deployment group to which this app belongs.</td>
</tr>

<tr><td><code>HAPROXY_DEPLOYMENT<br>_STARTED_AT</code></td>
<td>Specifies the time at which a deployment started. You generally do not need to modify this unless you implement your own deployment orchestrator.</td></tr>
<tr><td><code>HAPROXY_DEPLOYMENT_<br>TARGET_INSTANCES</code></td>
<td>Specifies the target number of app instances to seek during deployment. You generally do not need to modify this unless you implement your own deployment orchestrator.</td>
</tr>

<tr><td><code>HAPROXY_{n}_ENABLED</code></td>
<td>Enables this backend. By default, all backends are enabled. To disable backends by default, specify the `--strict-mode` option. 

For example:

<code>HAPROXY_0_ENABLED = true</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_GROUP</code></td>
<td>Specifies the HAProxy group per service. This app label enables you to use a different HAProxy group per service port. This label setting overrides `HAPROXY_GROUP` for the particular service. If you have both external and internal services running on same set of instances on different ports, you can use this setting to add them to different HAProxy configurations. 

For example:

<code> 
HAPROXY_0_GROUP = 'external'
HAPROXY_1_GROUP = 'internal'
</code>

If you run `marathon_lb` with the `--group` external option, the command adds the service on `HAPROXY_0_PORT` (or the first service port if `HAPROXY_0_HOST` is not configured) to the HAProxy configuration. 

Similarly, if you run `marathon-lb` with the `--group` internal, the command adds the service on `HAPROXY_1_PORT` to the HAProxy configuration. If the HAProxy configuration includes a combination of `HAPROXY_GROUP` and `HAPROXY_{n}_GROUP` settings, the more specific definition takes precedence.

For example, you might have a load balancing configuration where a service running on `HAPROXY_0_PORT` is associated with just the 'external' HAProxy group and not the 'internal' HAProxy group.

<code>
HAPROXY_0_GROUP = 'external' 
HAPROXY_GROUP = 'internal'
</code>

In this example, there is no group setting defined for the second service. With this configuration, `marathon-lb` falls back to using the default `HAPROXY_GROUP`, which is then associated with the `internal` HAPorxy group. Load balancers with the group set to '*' collect all groups.</td>
</tr>

<tr><td><code>HAPROXY_{n}_HTTP_<br>BACKEND_PROXYPASS_<br>PATH</code></td>
<td>Sets the location to use for mapping local server URLs to remote servers + URL.

For example:

<code>HAPROXY_0_HTTP_BACKEND_PROXYPASS_PATH = '/path/to/redirect'</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_HTTP_<br>BACKEND_REVPROXY_PATH</code></td>
<td>Sets the URL in HTTP response headers sent from a reverse proxied server. This label only updates the Location, Content-Location, and URL fields. 

For example:

<code>HAPROXY_0_HTTP_BACKEND_REVPROXY_PATH = '/my/content'</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_MODE</code></td>
<td>Sets the connection mode to either TCP or HTTP. The default is TCP. 

The following exceptions apply:
If you don’t specify the `HAPROXY_{n}_VHOST` label and have not set `HAPROXY_{n}_MODE`, the mode is set to `http`.

If you have configured a health check for the given port and the protocol field is set to one of 'HTTP', 'HTTPS', 'MESOS_HTTP', 'MESOS_HTTPS', the mode is overridden to 'http', regardless of the value of the `HAPROXY_{n}_MODE` label. For example: 

<code>
HAPROXY_0_MODE = 'http'
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_PATH</code></td>
<td>Specifies the HTTP path to match, starting at the beginning. You can specify multiple paths separated by spaces. The syntax matches that of the `path_beg` configuration option used in other templates and labels. 

To use the path routing, you must also define a virtual host. 

If you have multiple backends which share virtual hosts or paths, you can manually specify the order of the backend ACLs with the `HAPROXY_{n}_BACKEND_WEIGHT` setting. For HAProxy, the use_backend directive is evaluated in the order it appears in the configuration. 

For example:<br>
<code> 
HAPROXY_0_PATH = '/v2/api/derp'
HAPROXY_0_PATH = '-i /multiple /paths'
</code></td>
</tr>
<tr><td><code>HAPROXY_{n}_PORT</code></td>
<td>Binds to the specified port number for the service. This setting overrides the servicePort which has to be unique. For example:

<code>
HAPROXY_0_PORT = 80
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_REDIRECT_<br>TO_HTTPS</code></td>
<td>Redirects HTTP traffic to HTTPS. Requires at least one virtual host be set. For example:

<code> 
HAPROXY_0_REDIRECT_TO_HTTPS = true
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_SSL_CERT</code></td>
<td>Enables the given SSL certificate for TLS/SSL traffic. 
For example:

<code> 
HAPROXY_0_SSL_CERT = '/etc/ssl/cert.pem'
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_STICKY</code></td>
<td>Enables sticky request routing for the service. For example:

<code>HAPROXY_0_STICKY = true
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_USE_HSTS</code></td>
<td>Enables the HSTS response header for the HTTP clients that support it. For example:

<code>HAPROXY_0_USE_HSTS = true</code></td>
</tr>
<tr><td><code>HAPROXY_{n}_VHOST</code></td>
<td>Specifies the Marathon HTTP virtual host proxy host name(s) to gather. 

If you have multiple backends that share the same virtual host names or paths, you might need to manually specify the appropriate order to use for the backend access control lists using the <code>HAPROXY_{n}_BACKEND_WEIGHT</code> setting. The HAProxy `use_backend` directive is evaluated in the order it appears in the configuration.

For example:

<code>
HAPROXY_0_VHOST = 'marathon.mesosphere.com'<br>
HAPROXY_0_VHOST = 'marathon.mesosphere.com,marathon'
</code>
</td></tr>
</tbody>
</table>