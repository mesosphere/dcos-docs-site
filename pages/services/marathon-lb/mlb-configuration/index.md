---
layout: layout.pug
excerpt: Working with templates and app labels for Marathon-LB
title: Working with templates and app labels
menuWeight: 15
---

Marathon-LB provides load balancing tool for Marathon-orchestrated applications.  Marathon-LB leverages the core features of the `HAProxy` program. For DC/OS clusters, Marathon-LB reads the Marathon task information and dynamically generates the required `HAProxy` configuration details. To gather this task information, you must specify the location of one or more Marathon instances. Marathon-LB  can then use the service configuration details stored globally in **templates** or defined in app definition **labels** to route traffic to the appropriate nodes and service ports.

# Using Marathon-LB templates and app labels
Marathon-LB provides templates and application labels that enable you to use default or set custom `HAProxy` configuration parameters. Configuration parameters provide details such as the algorithm you want to use for how workload is distributed. For example, you can set a configuration parameter to distribute processing for app access requests by using a "round-robin" model or to the server with the fewest current connections. The configuration templates can be set either globally for all apps, or overridden on a service-port or per-app basis.

# Overriding template and app label values
You can override the values set in Marathon-LB global templates by: 
- Creating an environment variable in the Marathon-LB container.
- Placing configuration files in the `templates` directory where the path is relative to the location from which the Marathon-LB script runs.
- Specifying labels in the app definition file. 

## Overriding settings using environment variables
One way you can override global settings is by modifying the definition for a default template setting. For example, you might modify the `HAPROXY_HTTPS_FRONTEND_HEAD` template to specify the following content:

<code>
frontend new_frontend_label
  bind *:443 ssl crt /etc/ssl/cert.pem
  mode http
</code>

You could then add this setting as an environment variable for the Marathon-LB configuration by specifying the following:

<code> "HAPROXY_HTTPS_FRONTEND_HEAD": "\\nfrontend new_frontend_label\\n  bind *:443 ssl {sslCerts}\\n  mode http"</code>

## Overriding settings using files in the templates directory
Alternatively, you could place a file called `HAPROXY_HTTPS_FRONTEND_HEAD ` in the `templates` directory through the use of an artifact URI. At periodic intervals, Marathon-LB checks the `templates` directory for new or changed configuration settings.

You can add your own custom templates to the Docker image directly, or provide them in the `templates` directory that Marathon-LB reads at startup.

## Overriding settings using app labels
Most of the Marathon-LB template settings can be overridden using app labels. By using app labels, you can override template settings per service port. App labels are specified in the Marathon app definition. For example, the following app definition excerpt uses app labels to specify the `external` load balancing group for an application with a virtual host named `service.mesosphere.com`:

<pre>
{
  "id": "http-service",
  "labels": {
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_VHOST":"service.mesosphere.com"
  }
}
</pre>

The following example illustrates settings for a service called `http-service` that requires `http-keep-alive` to be disabled:

<pre>
{
  "id": "http-service",
  "labels":{
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_BACKEND_HTTP_OPTIONS":"  option forwardfor\n  no option http-keep-alive\n  http-request set-header X-Forwarded-Port %[dst_port]\n  http-request add-header X-Forwarded-Proto https if { ssl_fc }\n"
  }
}
</pre>

### Specifying strings in app labels
In specifying labels for load balancing, keep in mind that strings are interpreted as literal `HAProxy` configuration parameters, with substitutions respected. The `HAProxy` configuration file settings are validated before reloading the `HAProxy` program after you make changes. Because the configuration is checked before reloading, problems with `HAProxy` labels can prevent the `HAProxy` service from restarting with the updated configuration.

### Specifying an index identifier in app labels
Settings that you can specify per service port include the port index identifier {n} in the label name, where {n} corresponds to the service port index, beginning at zero (0).

# Setting global default options
As a shortcut for adding global default options without overriding the global template, you can specify a comma-separated list of options using the `HAPROXY_GLOBAL_DEFAULT_OPTIONS` environment variable. The default value for the `HAPROXY_GLOBAL_DEFAULT_OPTIONS` environment variable is:
<code>Redispatch,http-server-close,dontlognull</code>

To add the `httplog` option and keep the existing defaults, you could specify:

<code>
HAPROXY_GLOBAL_DEFAULT_OPTIONS=redispatch,http-server-close,dontlognull,httplog.
</code>

The setting takes effect the next time Marathon-LB checks for configuration changes. The setting does not take effect if the `HAPROXY_HEAD` template has been overridden.

# Creating a sample global template
Templates and app definition labels enable you to set custom `HAProxy` configuration parameters. Templates can be set either globally for all apps, or defined on a per-app basis using labels. The following steps summarize how to create a sample global template, add it as an archive file to the `templates` directory, and restart load balancing to use the new global template. 

To create a custom global template:

1. On your local computer, create a file called `HAPROXY_HEAD` in a directory called `templates` using commands similar to the following: 

  ``` bash
  mkdir -p templates
  cat > templates/HAPROXY_HEAD
  ```

1. Open the `HAPROXY_HEAD` file and add content similar to the following:

    ```
    global
      log /dev/log local0
      log /dev/log local1 notice
      spread-checks 5
      max-spread-checks 15000
      maxconn 4096
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
      maxconn                3000
      timeout connect          5s
      timeout client          20s
      timeout server          40s
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
    ```

      In this example, the `maxconn`, `timeout client`, and `timeout server` property values have changed from the default.

1. Create a compressed archive of the `HAPROXY_HEAD` file using a `tar` or `zip` command. 

    For example, type the following to add the `HAPROXY_HEAD` file.

    ``` #!/bin/bash
    mkdir -p templates
    cat > templates/HAPROXY_HEAD <<EOL
    tar czf templates.tgz templates/
    ```

1. Make the `templates.tgz` file available by uploading the file to an HTTP server. For example, you can use FTP or another file transfer program to copy the file to a static web server URL such as Amazon S3.

    You can download the sample template file using this URI: https://downloads.mesosphere.com/marathon/marathon-lb/templates.tgz

1. Add the Marathon-LB template configuration to the Marathon-LB service definition by including the path to the template file, `templates` directory, or URI in a custom JSON file.

    For example, you might create a new file called `marathon-lb-template-options.json` with the following lines:

    ```
    {
      "marathon-lb": {
        "template-url":"https://downloads.mesosphere.com/marathon/marathon-lb/templates.tgz"
      }
    }
    ```

1. Restart Marathon-LB with the new configuration settings:

    ```
    dcos package install marathon-lb --options=marathon-lb-template-options.json --yes
    ```

  Your customized Marathon-LB instance now runs using the new template.

# Creating a sample per-app template
To create a template for an individual app, modify the application definition. In the example below, the default template for the external NGINX application definition (`nginx-external.json`) has been modified to disable HTTP keep-alive. While this is an artificial example, there may be cases where you need to override certain defaults on a per-application basis.

1. Copy the following lines into the `nginx-external.json` app definition file:
    ```
    {
        "id": "nginx-external",
        "container": {
          "type": "DOCKER",
          "portMappings": [
            { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
          ],
          "docker": {
            "image": "nginx:1.7.7",
            "forcePullImage":true
          }
        },
        "instances": 1,
        "cpus": 0.1,
        "mem": 65,
        "network": "BRIDGE",
        "healthChecks": [{
            "protocol": "HTTP",
            "path": "/",
            "portIndex": 0,
            "timeoutSeconds": 10,
            "gracePeriodSeconds": 10,
            "intervalSeconds": 2,
            "maxConsecutiveFailures": 10
        }],
        "labels":{
          "HAPROXY_GROUP":"external",
          "HAPROXY_0_BACKEND_HTTP_OPTIONS":"  option forwardfor\n  no option http-keep-alive\n      http-request set-header X-Forwarded-Port %[dst_port]\n  http-request add-header X-Forwarded-Proto https if { ssl_fc }\n"
        }
      }
    ```

1. Deploy the external NGINX app on DC/OS using the following command:

    ``` bash
    dcos marathon app add nginx-external.json
    ```

Other options you might want to specify using customized app definition labels include:
* enabling the sticky session option
* redirecting to HTTPS
* specifying a virtual host

For example:

```
   "labels":{
      "HAPROXY_0_STICKY":"true",
      "HAPROXY_0_REDIRECT_TO_HTTPS":"true",
      "HAPROXY_0_VHOST":"nginx.mesosphere.com"
    }
```

For more information about specifying a virtual host, see [Resolving virtual hosts](/services/marathon-lb/mlb-configuration/#virtual-hosts). For information about other configuration templates and app labels, see [Marathon-LB reference](/services/marathon-lb/mlb-reference/).

# Working with SSL certificates
Marathon-LB supports secure socket layer (SSL) encryption and certificates. You can provide the path to your SSL certificate as a command line argument or in the frontend section of the load balancer configuration file using the `--ssl-certs` option. For example, if you are running the script directly, you might provide a command line similar to the following:

```
./marathon_lb.py --marathon http://localhost:8080 --group external --ssl-certs /etc/ssl/site1.co,/etc/ssl/site2.co --health-check --strict-mode
```

## Options for specifying the SSL certificate
To use SSL certificates, you can:
- Use the default certificate path and file name specified in the `HAProxy` configuration file. In this case, you would either save the certificate as `/etc/ssl/cert.pem` using the default certificate path or edit the configuration file to specify the correct path.
- Provide the certificate path using the `--ssl-certs` command line option and have the `HAProxy` configuration file use that path.
- Provide the full SSL certificate text in the `HAPROXY_SSL_CERT` environment variable. The environment variable contents are then written to the  `/etc/ssl/cert.pem` file and used if you don’t specify any additional certificate paths.

If you don’t specify the SSL certificate when you run Marathon-LB (`marathon_lb.py`) on the command line, by using the Docker run script, or from the Docker image, `HAProxy` automatically creates a self-signed certificate in the default `/etc/ssl/cert.pem` location and the configuration file then uses the self-signed certificate.

## Specifying multiple SSL certificates
You can specify multiple SSL certificates per frontend. You can include the additional SSL certificates by passing a list of paths with the `--ssl-certs` command line option. You can also add multiple SSL certificates by specifying the `HAPROXY_SSL_CERT` environment variable in your application definition.

If you do not specify at least one SSL certificate, Marathon-LB generates a self-signed certificate at startup. If you are using multiple SSL certificates, you can select the SSL certificate per app service port by specifying the `HAPROXY_{n}_SSL_CERT` app label that corresponds to the file path for the SSL certificates you want to use. For example, you might have:

```
   "labels": {
      "HAPROXY_0_VHOST":"nginx.mesosphere.com",
      "HAPROXY_0_SSL_CERT":"/etc/ssl/certs/nginx.mesosphere.com"
    }
```

The SSL certificates must be pre-loaded into the container for Marathon-LB to load them. You can do this by building your own image of Marathon-LB, rather than using the Mesosphere-provided image.

# Applying sample configuration settings
The following examples illustrate some common load balancer operational behavior and corresponding configuration settings. For simplicity, the examples only provide relevant segments of JSON configuration settings rather than complete JSON application defintions.

## Adding HTTP headers to the health check
The following example adds the Host header to the health check executed by HAProxy:

```
{
  ```
  "id":"app",
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_BACKEND_HTTP_HEALTHCHECK_OPTIONS": "  option  httpchk GET {healthCheckPath} HTTP/1.1\\r\\nHost:\\ www\n  timeout check {healthCheckTimeoutSeconds}s\n"
  }
  ```
}
```

## Setting timeout for long-lived socket connections
If you're trying to run a TCP service that uses long-lived sockets through HAProxy, such as a MySQL instance, you should set longer timeouts for the backend. The following example sets the client and server timeout to 30 minutes for the specified backend.

```
{
  "id":"app",
  "labels":{
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_BACKEND_HEAD":"backend {backend}\n  balance {balance}\n  mode {mode}\n  timeout server 30m\n  timeout client 30m\n"
  }
}
```

## Terminating SSL requests at an Elastic Load Balancer
In some cases, you might want to allow an Elastic Load Balancer (ELB) to terminate a secure socket connection for you, but want Marathon-LB to continue to redirect non-HTTPS requests. In this scenario, the Elastic Load Balancer uses HTTP headers to communicate that the request it received came over a secure channel and has been decrypted. Specifically, the `X-Forwarded-Proto` header is set to `https`, indicating that the request was decrypted by the Elastic Load Balancer. If HAProxy isn’t configured to look for the `X-Forwarded-Proto` header, the request is processed as if it is unencrypted and is redirected using the standard redirection rules.

The following configuration setting illustrates how to have Marathon-LB generate a backend rule that looks for the X-Forwarded-Proto header or a regular TLS connection and redirects the request if neither are specified.

```
"labels": {
  "HAPROXY_0_BACKEND_HTTP_OPTIONS": "  acl is_proxy_https hdr(X-Forwarded-Proto) https\n  redirect scheme https unless { ssl_fc } or is_proxy_https\n"
}
```

## Disabling service port binding
If you do not want Marathon-LB to listen on service ports, the following example illustrates how you can disable the frontend definitions:

```
 {
    "labels": {
      "HAPROXY_GROUP": "external",
      "HAPROXY_0_FRONTEND_HEAD": "",
      "HAPROXY_0_FRONTEND_BACKEND_GLUE": ""
    }
  }
  ```
<a name="virtual-hosts">

## Resolving virtual hosts
To create a virtual host or hosts the `HAPROXY_{n}_VHOST` label needs to be set on the given application. Applications that have a virtual host set are exposed on ports 80 and 443, in addition to their service port. You can specify multiple virtual hosts with the `HAPROXY_{n}_VHOST` template using a comma as a delimiter between host names.

All applications are also exposed on port 9091, using the X-Marathon-App-Id HTTP header. For more information, see `HAPROXY_HTTP_FRONTEND_APPID_HEAD` in the templates section.

You can access the HAProxy statistics using the `haproxy_sta
ts` endpoint, and you can retrieve the current HAProxy configuration settings from the `haproxy_getconfig` endpoint.

If you want all subdomains for a given domain to resolve to a particular backend (for example, HTTP and HTTPS), use the following labels. Note that there is a period (.) required before the {hostname} in the `HAPROXY_0_HTTPS_FRONTEND_ACL` label. Note that you should disable virtual host mapping by removing the `--haproxy-map` argument, if you have not previously removed it.

```
{
  "labels": {
    "HAPROXY_0_BACKEND_WEIGHT": "-1",
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_HTTP_FRONTEND_ACL": "  acl host_{cleanedUpHostname} hdr_end(host) -i {hostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n",
    "HAPROXY_0_HTTPS_FRONTEND_ACL": "  use_backend {backend} if {{ ssl_fc_sni -m end .{hostname} }}\n",
    "HAPROXY_0_VHOST": "example.com"
  }
}
```

## Enabling HAProxy logging
HAProxy uses socket-based logging. It is configured by default to log information to the `/dev/log` directory. To begin logging HAProxy messages, you must first mount the `/dev/log` volume in the container, then enable logging for any backends or frontends for which you want to log information. 

After you enable logging, you can examine the log file results with the `journalctl` facility.

1. Mount the volume into your /marathon-lb app:
  ```
  {
    "id": "/marathon-lb",
    "container": {
      "type": "DOCKER",
      "volumes": [
        {
          "containerPath": "/dev/log",
          "hostPath": "/dev/log",
          "mode": "RW"
        }
      ],
      "docker": {
        "image": "mesosphere/marathon-lb:latest",
        "network": "HOST",
        "privileged": true,
        "parameters": [],
        "forcePullImage": true
      }
    }
  }
  ```

1. Set option `httplog` on one backend to enable logging. In this example, the backend is `my_crappy_website`:

  ```
  {
    "id": "/my-crappy-website",
    "cmd": null,
    "cpus": 0.5,
    "mem": 64,
    "disk": 0,
    "instances": 2,
    "container": {
      "type": "DOCKER",
      "volumes": [],
      "docker": {
        "image": "brndnmtthws/my-crappy-website",
        "network": "BRIDGE",
        "portMappings": [
          {
            "containerPort": 80,
            "hostPort": 0,
            "servicePort": 10012,
            "protocol": "tcp",
            "labels": {}
          }
        ],
        "privileged": false,
        "parameters": [],
        "forcePullImage": true
      }
    },
    "healthChecks": [
      {
        "path": "/",
        "protocol": "HTTP",
        "portIndex": 0,
        "gracePeriodSeconds": 10,
        "intervalSeconds": 15,
        "timeoutSeconds": 2,
        "maxConsecutiveFailures": 3,
        "ignoreHttp1xx": false
      }
    ],
    "labels": {
      "HAPROXY_0_USE_HSTS": "true",
      "HAPROXY_0_REDIRECT_TO_HTTPS": "true",
      "HAPROXY_GROUP": "external",
      "HAPROXY_0_BACKEND_HTTP_OPTIONS": "  option httplog\n  option forwardfor\n  http-request set-header X-Forwarded-Port %[dst_port]\n  http-request add-header X-Forwarded-Proto https if { ssl_fc }\n",
      "HAPROXY_0_VHOST": "diddyinc.com,www.diddyinc.com"
    },
    "portDefinitions": [
      {
        "port": 10012,
        "protocol": "tcp",
        "labels": {}
      }
    ]
  }
  ```

  Enabling the `httplog` option only affects the backend for the service port. To enable logging for ports 80 and 443, you must modify the global HAProxy template.
1. Open a secure shell (SSH) on any public agent node.
1. View the logs using `journalctl`:

  ```
  journalctl -f -l SYSLOG_IDENTIFIER=haproxy
  ```

## Adding a custom HAProxy error response
You can specify a custom HAProxy error response by overriding the default errorfile directive in a template or an app definition label. For example, you could customize the template to return a redirect to a different backend if no backends are available. 

To illustrate using a custom error response:
1. Open the application definition file for the application.
1. Add a template URI to your Marathon-LB app definition like this:

  ```
  {
      "id":"/marathon-lb",
      "fetch":["https://downloads.mesosphere.com/marathon/marathon-lb/templates-custom-500-response.tar.gz"]
    }
  ```

  This example returns a custom 503 page by updating the `templates/500.http` file within the `templates-custom-500-response.tar.gz` archive file.  Alternatively, you could return a redirect to a URI by updating the `templates-custom-500-response.tar.gz` archive file like this:

  ```
  HTTP/1.1 302 Found
  Location: http://my-redirect-handler.computers.com/
  ```

## Using HAProxy maps for backend lookup
You can use HAProxy maps to speed up virtual hosts to backend lookup requests.

This configuration setting is very useful for large installations where the traditional virtual-host-to-backend rules comparison takes considerable time because each rule is evaluated sequentially. HAProxy map creates a hash-based lookup table so that it is faster than the traditional rules-based approach. 

You can add HAProxy maps for Marathon-LB by using the `--haproxy-map` flag. For example:

```
./marathon_lb.py --marathon http://localhost:8080 --group external --haproxy-map
```
This command creates a lookup dictionary for the host header (both HTTP and HTTPS) and X-Marathon-App-Id header. For path-based routing and authentication, Marathon-LB continues to use the backend rules comparison.

## Running multiple instances
For practical purposes, you should consider running three or more instances of Marathon-LB to provide high availability for production workloads. You should never run a single load balancing instance because a single instance cannot provide high-availability or fault tolerance for applications. Except in the case of extreme processing load, running five or more load-balancing instances does not typically add significant value in term of application availability or performance.

The specific number of Marathon-LB instances you should run to best suit your environment depends on the workload you expect, characteristics of the application itself, and the level of failure tolerance required. 

You should not run Marathon-LB on every node in your cluster. Running too many instances of Marathon-LB can affect processing, efficiency, and overall performance because of additional calls to the Marathon API and excess health checking.

## Using internal and external groups for load balancing
You should consider using a dedicated load balancer in front of Marathon-LB to simplify upgrades and changes. Common choices for a dedicated load balancer to work with Marathon-LB include an Elastic Load Balancer (on AWS) or a hardware load balancer for on-premise installations.

Use separate Marathon-LB groups (specified with the `–group` option) for internal and external load balancing. On DC/OS, the default group is `external`. The basic configuration setting for an internal load balancer would be:

```
 {
    "marathon-lb": {
      "name": "marathon-lb-internal",
      "haproxy-group": "internal",
      "bind-http-https": false,
      "role": ""
    }
  }
```

## Specifying reserved ports for load-balanced applications
You should use service ports within the reserved range (which is 10000 to 10100 by default). Using the reserved port identifiers:
* prevents port conflicts
* ensures that reloads don't result in connection errors

In general, you should define service ports and avoid using the `HAPROXY_{n}_PORT` label.

For HTTP services, you should consider setting the virtual host and, optionally, a path to access services on ports 80 and 443. Alternatively, you can access the service on port 9091 using the `X-Marathon-App-Id header`. 

For example, if you want to configure access to an app with the ID tweeter:

1. Open a terminal then run the following command to switch to a master node.

    ```bash
    dcos node ssh --master-proxy --leader
    ```

1. From the master node, run the following command:

    ``` bash
    curl -vH “X-Marathon-App-Id: /tweeter” marathon-lb.marathon.mesos:9091/
    ```

1. Review the connection result.

    ```
    $ curl -vH "X-Marathon-App-Id: /tweeter" marathon-lb.marathon.mesos:9091/
    *   Trying 10.0.5.190...
    * TCP_NODELAY set
    * Connected to marathon-lb.marathon.mesos (10.0.5.190) port 9091 (#0)
    > GET / HTTP/1.1
    > Host: marathon-lb.marathon.mesos:9091
    > User-Agent: curl/7.50.3
    > Accept: */*
    > X-Marathon-App-Id: /tweeter
    >    
    * HTTP 1.0, assume close after body
    < HTTP/1.0 503 Service Unavailable
    < Cache-Control: no-cache
    < Connection: close
    < Content-Type: text/html
    <
    <html><body><h1>503 Service Unavailable</h1>
    No server is available to handle this request.
    </body></html>
    * Curl_http_done: called premature == 0
    * Closing connection 0

## Collecting container and HAProxy information
You can collect detailed information about containers and HAProxy activity to analyze and troubleshoot operations, identify potential problems, and view connections for frontends and backends. You collect this information by setting the `HAPROXY_SYSLOGD` environment variable or the `container-syslogd` value in a custom `options.json` file like this:

```
  {
    "marathon-lb": {
      "container-syslogd": true
    }
  }
```

## Assigning ports for IP-per-task apps
Marathon-LB supports load balancing for applications that are assigned an IP address and port on a per-task basis. If each task is assigned its own unique IP address, access to the task is routed directly through the application’s service discovery port. If the service ports are not defined, Marathon-LB automatically assigns port values from a configurable range. 

You can configure the range for port assignment values using the `--min-serv-port-ip-per-task` and `--max-serv-port-ip-per-task` options. 

You should note that the port assignment is not guaranteed if you change the set of deployed apps. For example, if you deploy a new app with a per-task IP address, the port assignments might change.
