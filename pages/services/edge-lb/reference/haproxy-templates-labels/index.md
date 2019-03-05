---
layout: layout.pug
navigationTitle:  HAProxy templates and labels
title: HAProxy templates and labels
menuWeight: 86
excerpt: Lists configuration templates and labels you can use for HAProxy load balancers
enterprise: true
---

# Template and label reference
The following is a list of available `HAProxy` configuration **templates**. Some templates are global-only (such as `HAPROXY_HEAD`), but most can be specified on a per service port basis as **app labels** to override global settings.

The templates and app labels that can be set per-service-port include an index identifier {n} in template or label name. The index identifier corresponds to service port index, beginning at 0, to which app label applies. For example, you could specify `HAPROXY_0_BACKEND_HEAD` to override global template `HAPROXY_BACKUP_HEAD` for first port of a given application.

## Backend template settings
Use following template and app labels to configure backend settings for load balancer.

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
<td><code>HAPROXY_BACKEND_HEAD</code></td><td>Defines type of load balancing and connection mode for a backend. The default load balancing type (algorithm) is <code>roundrobin</code>. The default connection mode is <code>tcp</code>.

The valid values for load balancing type include:

* <code>roundrobin</code> - Each server is used in turns, according to their weights. 
  This algorithm is dynamic and ensures processing time remains equally distributed. 
* <code>static-rr</code> - Each server is used in turns, according to their weights. 
  This algorithm is as similar to roundrobin except that it is static.
* <code>leastconn</code> - The server with least number of connections receives next connection request. 
  Round-robin selection is performed within groups of servers that have same load to ensure that all servers are used. This algorithm is recommended when long sessions, such as LDAP or SQL sessions are expected, is not appropriate for protocols using short sessions such as HTTP.
* <code>source</code> - The source IP address is hashed and divided by total weight of running servers to designate which server should receive request. 
  This algorithm ensures that same client IP address always reaches same server as long as no server goes down or up. If hash result changes because number of running servers has changed, clients  are directed to a different server. This algorithm is generally used with TCP mode or for clients that refuse session cookies.
* <code>uri</code> - This algorithm hashes either left part of URI (before question mark) or whole URI (if "whole" parameter is present) and divides hash value by total weight of running servers. 
  The result designates which server receives request.
  
You can set connection mode to `tcp`, `http`, or `health`. 

The default template for `HAPROXY_BACKEND_HEAD` is:
<code>backend {backend}
  balance {balance}
  mode {mode}
</code>

You can override this template using following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_HEAD": "\nbackend {backend}\n  balance {balance}\n  mode {mode}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_HSTS<br>_OPTIONS</code></td><td>Specifies backend options to use where <code>HAPROXY_{n}_USE_HSTS</code> app label that enables HSTS response header for HTTP clients is set to true. 

The default template for `HAPROXY_BACKEND_HSTS_OPTIONS` is:
<code>rspadd Strict-Transport-Security:\ max-age=15768000</code>

You can override this template using following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_HSTS_OPTIONS": " rspadd Strict-Transport-Security:\\ max-age=15768000\n"</code>
</td></tr>

<tr><td><code>HAPROXY_BACKEND_HTTP<br>_HEALTHCHECK_OPTIONS</code></td><td>Sets HTTP health check options, such as health check timeout interval and consecutive failures allowed. 

The valid options for first health check or first health check for a given service are exposed as follows:
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

You can override this template using following app label for first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_BACKEND_HTTP_HEALTHCHECK_OPTIONS": "  option  httpchk GET {healthCheckPath}\n  timeout check {healthCheckTimeoutSeconds}s\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_HTTP<br>_OPTIONS</code></td><td>Sets HTTP headers, for example, X-Forwarded-For and X-Forwarded-Proto. 

The default template for `HAPROXY_BACKEND_HTTP_OPTIONS` is:
<code>option forwardfor
  http-request set-header X-Forwarded-Port %[dst_port]
  http-request add-header X-Forwarded-Proto https if { ssl_fc }</code>

You can override this template using following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_HTTP_OPTIONS": "  option forwardfor\n  http-request set-header X-Forwarded-Port %[dst_port]\n  http-request add-header X-Forwarded-Proto https if { ssl_fc }\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_REDIRECT<br>_HTTP_TO_HTTPS</code></td><td>Redirects backends if HAPROXY_{n}_REDIRECT_TO_HTTPS label is set to true. 

The default template for `HAPROXY_BACKEND_REDIRECT_HTTP_TO_HTTPS` is:
<code>redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>HAPROXY_0_BACKEND_REDIRECT_HTTP_TO_HTTPS": " redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_REDIRECT<br>_HTTP_TO_HTTPS_WITH_PATH</code></td><td>Redirects backends if `HAPROXY_{n}_REDIRECT_TO_HTTPS_WITH_PATH` label is set to true, but includes a path. 

The default template for <code style="word-break: break-word;">HAPROXY_BACKEND_REDIRECT_HTTP_TO_HTTPS_WITH_PATH</code> is:
<code>redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_BACKEND_REDIRECT_HTTP_TO_HTTPS_WITH_PATH": " redirect scheme https code 301 if !{{ ssl_fc }} host_{cleanedUpHostname} path_{backend}\n"</code>
</td></tr>
<tr><td><code>HAPROXY_BACKEND_SERVER<br>_HTTP_HEALTHCHECK_OPTIONS </code></td><td>Sets HTTP health check options, such as health check timeout interval, for a single server. 

The valid options for first health check or first health check for a given service are exposed as follows:
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

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_SERVER_HTTP_HEALTHCHECK_OPTIONS": "  check inter {healthCheckIntervalSeconds}s fall {healthCheckFalls}{healthCheckPortOptions}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_SERVER<br>_OPTIONS </code></td><td>Specifies options for each server added to a backend. 

The default template for HAPROXY_BACKEND_SERVER_OPTIONS is:
<code> server {serverName} {host_ipv4}:{port}{cookieOptions}{healthCheckOptions}{otherOptions}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_SERVER_OPTIONS": "  server {serverName} {host_ipv4}:{port}{cookieOptions}{healthCheckOptions}{otherOptions}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_SERVER<br>_TCP_HEALTHCHECK<br>_OPTIONS </code></td><td>Sets TCP health check options, such as health check timeout interval, for a single server.

The valid options for first health check or first health check for a given service are exposed as follows:
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

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_SERVER_TCP_HEALTHCHECK_OPTIONS": "  check inter {healthCheckIntervalSeconds}s fall {healthCheckFalls}{healthCheckPortOptions}\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_STICKY_OPTIONS </code></td><td>Sets a cookie for services where HAPROXY_{n}_STICKY is true.

The default template for `HAPROXY_BACKEND_STICKY_OPTIONS` is:
<code> cookie mesosphere_server_id insert indirect nocache</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_STICKY_OPTIONS": "  cookie mesosphere_server_id insert indirect nocache\n"</code></td></tr>

<tr><td><code>HAPROXY_BACKEND_TCP<br>_HEALTHCHECK_OPTIONS </code></td><td>Sets TCP health check options,such as timeout check. 

The valid options for first health check or first health check for a given service are exposed as follows:
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

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_BACKEND_TCP_HEALTHCHECK_OPTIONS": ""</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_VHOST_BACKEND_HEAD </code></td><td>Defines HTTPS backend for vhost. 

You must enable `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application.

The default template for `HAPROXY_HTTPS_GROUPED_VHOST_BACKEND_HEAD` is:
<code>backend {name}
  server loopback-for-tls abns@{name} send-proxy-v2</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_ACL_ALLOW_DENY </code></td><td>Denies access for all IP addresses (or IP ranges) that are not explicitly allowed to access HTTP backend. Use this template with HAPROXY_HTTP_BACKEND_NETWORK_ALLOWED_ACL. This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_BACKEND_ACL_ALLOW_DENY` is:
<code> http-request allow if network_allowed
  http-request deny</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_NETWORK_ALLOWED_ACL </code></td><td>Specifies IP addresses (or IP  ranges) that have access to HTTP backend. This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_BACKEND_NETWORK_ALLOWED_ACL` is:
<code>acl network_allowed src {network_allowed}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_NETWORK_ALLOWED_ACL": "  acl network_allowed src {network_allowed}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_PROXYPASS_GLUE</code></td><td>Specifies backend glue for HAPROXY_{n}_HTTP_BACKEND_PROXYPASS_PATH. 

The default template for `HAPROXY_HTTP_BACKEND_PROXYPASS_GLUE` is:
<code>http-request set-header Host {hostname}
  reqirep  "^([^ :]*)\ {proxypath}/?(.*)" "\1\ /\2" </code>

You can override this template with following app label for first port (`0`)of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_PROXYPASS_GLUE": "  http-request set-header Host {hostname}\n  reqirep  \"^([^ :]*)\\ {proxypath}/?(.*)\" \"\\1\\ /\\2\"\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND_REDIR </code></td><td>Sets path to which you want to redirect root of domain. 

The default template for `HAPROXY_HTTP_BACKEND_REDIR` is:
<code>acl is_root path -i /
  acl is_domain hdr(host) -i {hostname}
  redirect code 301 location {redirpath} if is_domain is_root</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_REDIR": "  acl is_root path -i /\n  acl is_domain hdr(host) -i {hostname}\n  redirect code 301 location {redirpath} if is_domain is_root\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_BACKEND<br>_REVPROXY_GLUE </code></td><td>Specifies backend glue for HAPROXY_{n}_HTTP_BACKEND_REVPROXY_PATH. 

The default template for `HAPROXY_HTTP_BACKEND_REVPROXY_GLUE` is:
<code>acl hdr_location res.hdr(Location) -m found
  rspirep "^Location: (https?://{hostname}(:[0-9]+)?)?(/.*)" "Location:   {rootpath} if hdr_location"</code>

You can override this template with following app label for first port (`0`)of a given app:
<code>"HAPROXY_0_HTTP_BACKEND_REVPROXY_GLUE": "  acl hdr_location res.hdr(Location) -m found\n  rspirep \"^Location: (https?://{hostname}(:[0-9]+)?)?(/.*)\" \"Location:   {rootpath} if hdr_location\"\n"</code></td></tr>

<tr><td><code>HAPROXY_TCP_BACKEND<br>_ACL_ALLOW_DENY </code></td><td>Denies access for all IP addresses (or IP address ranges) that are not explicitly allowed to access TCP backend. This global template cannot be overridden by service port or application. 

The default template for `HAPROXY_TCP_BACKEND_ACL_ALLOW_DENY` is:
<code>tcp-request content accept if network_allowed
  tcp-request content reject</code></td></tr>

<tr><td><code>HAPROXY_TCP_BACKEND<br>_NETWORK_ALLOWED_ACL </code></td><td>Specifies IP addresses (or IP address ranges) that have been granted access to TCP backend. 

The default template for `HAPROXY_TCP_BACKEND_NETWORK_ALLOWED_ACL` is:
<code>acl network_allowed src {network_allowed}</code>

You can override this template with following app label for first port (`0`) of a given app: 
<code>"HAPROXY_0_TCP_BACKEND_NETWORK_ALLOWED_ACL": "  acl network_allowed src {network_allowed}\n"</code></td></tr>
</tbody>
</table>

## Frontend template settings
Use following template and app labels to configure frontend settings for load balancer.

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
<tr><td><code>HAPROXY_FRONTEND_BACKEND_GLUE </code></td><td>Glues backend to frontend. 

The default template for `HAPROXY_FRONTEND_BACKEND_GLUE` is:
<code> use_backend {backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_FRONTEND_BACKEND_GLUE": "  use_backend {backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_FRONTEND_HEAD </code></td><td>Defines address and port to bind to for this frontend. 

The default template for `HAPROXY_FRONTEND_HEAD` is:
<code>frontend {backend}
  bind {bindAddr}:{servicePort}{sslCert}{bindOptions}
  mode {mode}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_FRONTEND_HEAD": "\nfrontend {backend}\n  bind {bindAddr}:{servicePort}{sslCert}{bindOptions}\n  mode {mode}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL </code></td><td>Specifies ACL that performs SNI based hostname matching for HAPROXY_HTTPS_FRONTEND_HEAD template. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL` is:
<code>use_backend {backend} if {{ ssl_fc_sni {hostname} }}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL": "  use_backend {backend} if {{ ssl_fc_sni {hostname} }}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_ONLY_WITH_PATH </code></td><td>Defines access control list (ACL) frontend that matches a particular host name with a path. This template is similar to HTTP_FRONTEND_ACL_ONLY_WITH_PATH, but is only applicable for HTTPS requests.

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_ONLY_WITH_PATH` is:
<code>acl path_{backend} path_beg {path}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_ONLY_WITH_PATH": "  acl path_{backend} path_beg {path}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_WITH_AUTH </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding virtual host of HAPROXY_HTTPS_FRONTEND_HEAD through HTTP Basic authentication. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_WITH_AUTH` is:
<code> acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}
  use_backend {backend} if {{ ssl_fc_sni {hostname} }}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_WITH_AUTH": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}\n  use_backend {backend} if {{ ssl_fc_sni {hostname} }}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_WITH_AUTH<br>_AND_PATH</td><td>Specifies ACL that glues a backend to corresponding virtual host with path of HAPROXY_HTTPS_FRONTEND_HEAD through HTTP Basic authentication. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_WITH_AUTH_AND_PATH` is:
<code> acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if {{ ssl_fc_sni {hostname} }} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_WITH_AUTH_AND_PATH": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if {{ ssl_fc_sni {hostname} }} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ACL_WITH_PATH </code></td><td>Specifies ACL that performs SNI based hostname matching with path for HAPROXY_HTTPS_FRONTEND_HEAD template. 

The default template for `HAPROXY_HTTPS_FRONTEND_ACL_WITH_PATH` is:
<code> use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ACL_WITH_PATH": "  use_backend {backend} if {{ ssl_fc_sni {hostname} }} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_AUTH_ACL_ONLY </code></td><td>Specifies HTTP authentication ACL for corresponding virtual host. 

The default template for `HAPROXY_HTTPS_FRONTEND_AUTH_ACL_ONLY` is:
<code> acl auth_{cleanedUpHostname} http_auth(user_{backend})<code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_AUTH_ACL_ONLY": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_AUTH_REQUEST_ONLY </code></td><td>Specifies HTTP authentication request forthe corresponding virtual host. 

The default template for `HAPROXY_HTTPS_FRONTEND_AUTH_REQUEST_ONLY` is:
<code> http-request auth realm "{realm}" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_AUTH_REQUEST_ONLY": "  http-request auth realm \"{realm}\" if {{ ssl_fc_sni {hostname} }} !auth_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND_HEAD </code></td><td>Specifies an HTTPS frontend for encrypted connections that binds to port *:443 by default and gathers all virtual hosts as defined by HAPROXY_{n}_VHOST label. This template is a global template that cannot be modified by service port or per application.

You must modify this template setting if you want to include your SSL certificate. The default template for `HAPROXY_HTTPS_FRONTEND_HEAD` is:
<code>frontend marathon_https_in
  bind *:443 ssl {sslCerts}
  mode http</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_FRONTEND<br>_ROUTING_ONLY_WITH<br>_PATH_AND_AUTH </code></td><td>Works in combination with HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH to glue ACL names to appropriate backend. 
The default template for `HAPROXY_HTTPS_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH` is:
<code> http-request auth realm "{realm}" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTPS_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH": "  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_FRONTEND_HEAD </code></td><td>Defines HTTPS frontend for encrypted connections that binds to port *:443 by default and gathers all virtual hosts as defined by HAPROXY_{n}_VHOST label. This template is useful for adding client certificates per domain. 

You must enable `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application.

The default template for `HAPROXY_HTTPS_GROUPED_FRONTEND_HEAD` is:
<code>frontend marathon_https_in
  bind *:443
  mode tcp
  tcp-request inspect-delay 5s
  tcp-request content accept if { req_ssl_hello_type 1 }</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_VHOST_FRONTEND_ACL </code></td><td>Specifies a route rule HTTPS entrypoint. 

You must enable `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application.

The default template for `HAPROXY_HTTPS_GROUPED_VHOST_FRONTEND_ACL` is:
<code> use_backend {backend} if {{ req_ssl_sni -i {host} }}</code></td></tr>

<tr><td><code>HAPROXY_HTTPS_GROUPED<br>_VHOST_FRONTEND_HEAD </code></td><td>Specifies HTTPS frontend for virtual host. 

You must enable `group-https-by-vhost` option to use this setting. This template is a global template that cannot be modified by service port or per application. The default template for `HAPROXY_HTTPS_GROUPED_VHOST_FRONTEND_HEAD` is:
<code>frontend {name}
  mode http
  bind abns@{name} accept-proxy ssl {sslCerts}{bindOpts}</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND_ACL </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding virtual host of HAPROXY_HTTP_FRONTEND_HEAD. 

The default template for `HAPROXY_HTTP_FRONTEND_AC`L` is:
<code> acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  use_backend {backend} if host_{cleanedUpHostname}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_ONLY </code></td><td>Defines access control list (ACL) that matches a particular host name. Unlike HAPROXY_HTTP_FRONTEND_ACL, this template only includes ACL portion. It does not glue access control list (ACL) to backend. You should only use this template if you have multiple virtual hosts routing to same backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_ONLY` is:
<code> acl host_{cleanedUpHostname} hdr(host) -i {hostname}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_ONLY": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_ONLY_WITH_PATH </code></td><td>Defines access control list (ACL) that matches a particular host name with a path. Unlike HAPROXY_HTTP_FRONTEND_ACL_WITH_PATH, this template only includes ACL portion. It does not glue access control list (ACL) to backend. You should only use this template if you have multiple virtual hosts routing to same backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH` is:
<code> acl path_{backend} path_beg {path} </code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_ONLY_WITH_PATH": " acl path_{backend} path_beg {path}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_ONLY_WITH<br>_PATH_AND_AUTH </code></td><td>Defines access control list (ACL) that matches a particular host name with a path and authentication method. Unlike HAPROXY_HTTP_FRONTEND_ACL_WITH_PATH, this template only includes ACL portion. It does not glue access control list (ACL) to backend. You should only use this template if you have multiple virtual hosts routing to same backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH_AND_AUTH` is:
<code>acl path_{backend} path_beg {path}
  acl auth_{cleanedUpHostname} http_auth(user_{backend})</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_ONLY_WITH_PATH_AND_AUTH": "  acl path_{backend} path_beg {path}\n  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_WITH_AUTH </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding virtual host specified by HAPROXY_HTTP_FRONTEND_HEAD setting through HTTP Basic authentication. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_WITH_AUTH` is:
<code>
 acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname}<code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_WITH_AUTH": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_WITH_AUTH<br>_AND_PATH </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding virtual host with path specified by HAPROXY_HTTP_FRONTEND_HEAD setting through HTTP Basic authentication. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_WITH_AUTH_AND_PATH` is:
<code>
 acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  acl auth_{cleanedUpHostname} http_auth(user_{backend})
  acl path_{backend} path_beg {path}
  http-request auth realm "{realm}" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_WITH_AUTH_AND_PATH": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  acl path_{backend} path_beg {path}\n  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ACL_WITH_PATH </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding virtual host with path specified by HAPROXY_HTTP_FRONTEND_HEAD setting. 

The default template for `HAPROXY_HTTP_FRONTEND_ACL_WITH_PATH` is:
<code>acl host_{cleanedUpHostname} hdr(host) -i {hostname}
  acl path_{backend} path_beg {path}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ACL_WITH_PATH": "  acl host_{cleanedUpHostname} hdr(host) -i {hostname}\n  acl path_{backend} path_beg {path}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_APPID_ACL </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding app specified by HAPROXY_HTTP_FRONTEND_APPID_HEAD setting. 

The default template for `HAPROXY_HTTP_FRONTEND_APPID_ACL` is:
<code>acl app_{cleanedUpAppId} hdr(x-marathon-app-id) -i {appId}
  use_backend {backend} if app_{cleanedUpAppId}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_APPID_ACL": "  acl app_{cleanedUpAppId} hdr(x-marathon-app-id) -i {appId}\n  use_backend {backend} if app_{cleanedUpAppId}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_APPID_HEAD </code></td><td>Specifies HTTP frontend that binds to port *:9091 by default and gathers all apps in HTTP mode. To use this frontend to forward to your app, configure app with HAPROXY_0_MODE=http then you can access it via a call to :9091 with header "X-Marathon-App-Id" set to Marathon AppId. Note multiple HTTP ports being exposed by same marathon app are not supported. Only first HTTP port is available using this frontend. 

This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_FRONTEND_APPID_HEAD` is:
<code>frontend marathon_http_appid_in
  bind *:9091
  mode http</code></td></tr>
<tr><td><code>HAPROXY_HTTP_FRONTEND_HEAD </code></td><td>Specifies HTTP frontend that binds to port *:80 by default and gathers all virtual hosts as defined by HAPROXY_{n}_VHOST label. This template is a global template that cannot be modified by service port or per application. 

The default template for `HAPROXY_HTTP_FRONTEND_HEAD` is:
<code>frontend marathon_http_in
  bind *:80
  mode http</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY </code></td><td>Works in combination with HAPROXY_HTTP_FRONTEND_ACL_ONLY setting to map access control list (ACL) names to their appropriate backends. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY` is:
<code> use_backend {backend} if host_{cleanedUpHostname}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY": "  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY_WITH_AUT </code></td><td>Works in combination with HAPROXY_HTTP_FRONTEND_ACL_ONLY setting to map access control list name to appropriate backend and to add HTTP Basic authentication. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY_WITH_AUTH` is:
<code>acl auth_{cleanedUpHostname} http_auth(user_{backend})
  http-request auth realm "{realm}" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY_WITH_AUTH": "  acl auth_{cleanedUpHostname} http_auth(user_{backend})\n  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY_WITH_PATH</code></td><td>Works in combination with HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH setting to map access control list (ACL) names to appropriate backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH` is:
<code>use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH": "  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_HTTP_FRONTEND<br>_ROUTING_ONLY_WITH<br>_PATH_AND_AUTH </code></td><td>Works in combination with HAPROXY_HTTP_FRONTEND_ACL_ONLY_WITH_PATH setting to map access control list names to appropriate backend. 

The default template for `HAPROXY_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH` is:
<code>http-request auth realm "{realm}" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}
  use_backend {backend} if host_{cleanedUpHostname} path_{backend}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_HTTP_FRONTEND_ROUTING_ONLY_WITH_PATH_AND_AUTH": "  http-request auth realm \"{realm}\" if host_{cleanedUpHostname} path_{backend} !auth_{cleanedUpHostname}\n  use_backend {backend} if host_{cleanedUpHostname} path_{backend}\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTPS<br>_FRONTEND_ACL </code></td><td>Specifies access control list (ACL) that performs SNI-based host name matching for HAPROXY_HTTPS_FRONTEND_HEAD template using HAProxy maps. 

The default template for `HAPROXY_MAP_HTTPS_FRONTEND_ACL` is:
<code>use_backend %[ssl_fc_sni,lower,map({haproxy_dir}/domain2backend.map)</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_MAP_HTTPS_FRONTEND_ACL": "  use_backend %[ssl_fc_sni,lower,map({haproxy_dir}/domain2backend.map)]\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTP<br>_FRONTEND_ACL </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding virtual host specified by HAPROXY_HTTP_FRONTEND_HEAD setting using HAProxy maps. 

The default template for `HAPROXY_MAP_HTTP_FRONTEND_ACL` is:
<code style="word-break: break-word;">use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)</code>

You can override this template with following app label for first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_MAP_HTTP_FRONTEND_ACL": "  use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)]\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTP<br>_FRONTEND_ACL_ONLY </code></td><td> Defines access control list (ACL) that matches a particular host name, You should only use this template if you have multiple virtual hosts routing to same backend in HAProxy map. 

The default template for `HAPROXY_MAP_HTTP_FRONTEND_ACL_ONLY` is:
<code style="word-break: break-word;">use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)</code>

You can override this template with following app label for first port (`0`) of a given app:
<code style="word-break: break-word;">"HAPROXY_0_MAP_HTTP_FRONTEND_ACL_ONLY": "  use_backend %[req.hdr(host),lower,regsub(:.*$,,),map({haproxy_dir}/domain2backend.map)]\n"</code></td></tr>

<tr><td><code>HAPROXY_MAP_HTTP<br>_FRONTEND_APPID_ACL </code></td><td>Specifies access control list (ACL) that glues a backend to corresponding app specified by HAPROXY_HTTP_FRONTEND_APPID_HEAD setting using HAProxy maps. 

The default template for `HAPROXY_MAP_HTTP_FRONTEND_APPID_ACL` is:
<code>use_backend %[req.hdr(x-marathon-app-id),lower,map({haproxy_dir}/app2backend.map)</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_MAP_HTTP_FRONTEND_APPID_ACL": "  use_backend %[req.hdr(x-marathon-app-id),lower,map({haproxy_dir}/app2backend.map)]\n"</code>
</td></tr>
</tbody>
</table>

## User authentication list setting
Use following template and app label to configure basic user name and password settings for load balancer.

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
<tr><td><code>HAPROXY_USERLIST_HEAD </code></td><td>Specifies user list for HTTP Basic authentication. 

The default template for `HAPROXY_USERLIST_HEAD` is:
<code>userlist user_{backend}
  user {user} password {passwd}</code>

You can override this template with following app label for first port (`0`) of a given app:
<code>"HAPROXY_0_USERLIST_HEAD": "\nuserlist user_{backend}\n  user {user} password {passwd}\n"</code></td></tr>
</tbody>
</table>

## Global header settings
Use following template to configure default header settings for load balancer.

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
<tr><td><code>HAPROXY_HEAD </code></td><td>Specifies header information for HAProxy configuration file. This template contains global settings and defaults. This template cannot be overridden by service port or application-based settings.

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
You can use following labels to configure additional application settings.

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
    <td>Specifies HTTP authentication method to use for application on given service port index. 
    
  For example, you can use this label to specify realm name for Basic authentication:
  
  <code>
    HAPROXY_0_AUTH = realm:username:encryptedpassword
  </code>

  For details on configuring authentication methods, see [HTTP Basic authentication]( https://github.com/mesosphere/marathon-lb/wiki/HTTP-Basic-Auth)</td>
  </tr>

  <tr><td><code>HAPROXY_{n}_BACKEND_<br>HEALTHCHECK_PORT_<br>INDEX</code></td>
  <td>Sets index of port to use as dedicated port for backend health checks associated with a given service port. By default, index for backend health check is same as index used for service port.

  For example, if an app exposes two ports--`9000` and `9001`--you can specify one port for application activity, and one port for for receiving health check information:

  <code>portMappings": [ 
    { "containerPort": 9000, "hostPort": 0, "servicePort": 0, "protocol": "tcp" },
    { "containerPort": 9001, "hostPort": 0, "servicePort": 0, "protocol": "tcp" }
  </code>

  You can then specify that you want to use port 9001 to perform backend health checks:

  <code>
  HAPROXY_0_BACKEND_HEALTHCHECK_PORT_INDEX=1
  </code> </td>
</tr>

<tr><td><code>HAPROXY_{n}_BACKEND<br>_NETWORK_ALLOWED_ACL</code></td> 
<td>Sets IP addresses (or IP address ranges) that have been granted access to backend.  

For example, you could set following app label to restrict access to specified IP addresses `10.1.40.0/24` and `10.1.55.43`:

<code>
HAPROXY_0_BACKEND_NETWORK_ALLOWED_ACL = '10.1.40.0/24 10.1.55.43'
</code>

By default, every IP address is allowed.
</td>
</tr>

<tr><td><code>HAPROXY_{n}_BACKEND_<br>WEIGHT</code></td>
<td>Specifies order in which to enforce permissions if there are multiple backends sharing access control lists for virtual hosts and paths. For example, if you are using a virtual host and have path access control lists that are shared by multiple backends, order of ACLs affects how permissions are granted for application. 

With `HAPROXY_{n}_BACKEND_WEIGHT`, you can change order used to evaluated ACLs by specifying a weight. The ACLs for backends are then applied from largest to smallest weight. 

If you don’t specify a value, default weight of zero (0) is used. By default, any backends that use `HAPROXY_{n}_PATH` will have a weight of 1.

<code>HAPROXY_0_BACKEND_WEIGHT = 1</code>
</td>
</tr>

<tr><td><code>HAPROXY_{n}_BALANCE</code></td>
<td>Sets load balancing algorithm to be used in a backend. The default is `roundrobin`. 

For example: 

<code>
HAPROXY_0_BALANCE = 'leastconn'
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_BIND_ADDR</code></td>
<td>Binds load balancer to specific address for service. 

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
<td>Specifies color to use for blue/green deployment. This label is used if you run `bluegreen_deploy.py` script to determine state of a deployment. You generally do not need to modify this label setting unless you implement your own deployment orchestrator.</td>
</tr>

<tr><td><code>HAPROXY_DEPLOYMENT<br>_GROUP</code></td>
<td>Specifies deployment group to which this app belongs.</td>
</tr>

<tr><td><code>HAPROXY_DEPLOYMENT<br>_STARTED_AT</code></td>
<td>Specifies time at which a deployment started. You generally do not need to modify this unless you implement your own deployment orchestrator.</td></tr>
<tr><td><code>HAPROXY_DEPLOYMENT_<br>TARGET_INSTANCES</code></td>
<td>Specifies target number of app instances to seek during deployment. You generally do not need to modify this unless you implement your own deployment orchestrator.</td>
</tr>

<tr><td><code>HAPROXY_{n}_ENABLED</code></td>
<td>Enables this backend. By default, all backends are enabled. To disable backends by default, specify `--strict-mode` option. 

For example:

<code>HAPROXY_0_ENABLED = true</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_GROUP</code></td>
<td>Specifies HAProxy group per service. This app label enables you to use a different HAProxy group per service port. This label setting overrides `HAPROXY_GROUP` for particular service. If you have both external and internal services running on same set of instances on different ports, you can use this setting to add them to different HAProxy configurations. 

For example:

<code> 
HAPROXY_0_GROUP = 'external'
HAPROXY_1_GROUP = 'internal'
</code>

If you run `marathon_lb` with `--group` external option, command adds service on `HAPROXY_0_PORT` (or first service port if `HAPROXY_0_HOST` is not configured) to HAProxy configuration. 

Similarly, if you run `marathon-lb` with `--group` internal, command adds service on `HAPROXY_1_PORT` to HAProxy configuration. If HAProxy configuration includes a combination of `HAPROXY_GROUP` and `HAPROXY_{n}_GROUP` settings, more specific definition takes precedence.

For example, you might have a load balancing configuration where a service running on `HAPROXY_0_PORT` is associated with just 'external' HAProxy group and not 'internal' HAProxy group.

<code>
HAPROXY_0_GROUP = 'external' 
HAPROXY_GROUP = 'internal'
</code>

In this example, there is no group setting defined for second service. With this configuration, `marathon-lb` falls back to using default `HAPROXY_GROUP`, which is then associated with `internal` HAPorxy group. Load balancers with group set to '*' collect all groups.</td>
</tr>

<tr><td><code>HAPROXY_{n}_HTTP_<br>BACKEND_PROXYPASS_<br>PATH</code></td>
<td>Sets location to use for mapping local server URLs to remote servers + URL.

For example:

<code>HAPROXY_0_HTTP_BACKEND_PROXYPASS_PATH = '/path/to/redirect'</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_HTTP_<br>BACKEND_REVPROXY_PATH</code></td>
<td>Sets URL in HTTP response headers sent from a reverse proxied server. This label only updates Location, Content-Location, and URL fields. 

For example:

<code>HAPROXY_0_HTTP_BACKEND_REVPROXY_PATH = '/my/content'</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_MODE</code></td>
<td>Sets connection mode to either TCP or HTTP. The default is TCP. 

The following exceptions apply:
If you don’t specify `HAPROXY_{n}_VHOST` label and have not set `HAPROXY_{n}_MODE`, mode is set to `http`.

If you have configured a health check for given port and protocol field is set to one of 'HTTP', 'HTTPS', 'MESOS_HTTP', 'MESOS_HTTPS', mode is overridden to 'http', regardless of value of `HAPROXY_{n}_MODE` label. For example: 

<code>
HAPROXY_0_MODE = 'http'
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_PATH</code></td>
<td>Specifies HTTP path to match, starting at beginning. You can specify multiple paths separated by spaces. The syntax matches that of `path_beg` configuration option used in other templates and labels. 

To use path routing, you must also define a virtual host. 

If you have multiple backends which share virtual hosts or paths, you can manually specify order of backend ACLs with `HAPROXY_{n}_BACKEND_WEIGHT` setting. For HAProxy, use_backend directive is evaluated in order it appears in configuration. 

For example:<br>
<code> 
HAPROXY_0_PATH = '/v2/api/derp'
HAPROXY_0_PATH = '-i /multiple /paths'
</code></td>
</tr>
<tr><td><code>HAPROXY_{n}_PORT</code></td>
<td>Binds to specified port number for service. This setting overrides servicePort which has to be unique. For example:

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
<td>Enables given SSL certificate for TLS/SSL traffic. 
For example:

<code> 
HAPROXY_0_SSL_CERT = '/etc/ssl/cert.pem'
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_STICKY</code></td>
<td>Enables sticky request routing for service. For example:

<code>HAPROXY_0_STICKY = true
</code></td>
</tr>

<tr><td><code>HAPROXY_{n}_USE_HSTS</code></td>
<td>Enables HSTS response header for HTTP clients that support it. For example:

<code>HAPROXY_0_USE_HSTS = true</code></td>
</tr>
<tr><td><code>HAPROXY_{n}_VHOST</code></td>
<td>Specifies Marathon HTTP virtual host proxy host name(s) to gather. 

If you have multiple backends that share same virtual host names or paths, you might need to manually specify appropriate order to use for backend access control lists using <code>HAPROXY_{n}_BACKEND_WEIGHT</code> setting. The HAProxy `use_backend` directive is evaluated in order it appears in configuration.

For example:

<code>
HAPROXY_0_VHOST = 'marathon.mesosphere.com'<br>
HAPROXY_0_VHOST = 'marathon.mesosphere.com,marathon'
</code>
</td></tr>
</tbody>
</table>