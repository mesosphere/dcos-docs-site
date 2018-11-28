---
layout: layout.pug
navigationTitle: 在 Admin Router 前配置 HAProxy
title: 在 Admin Router 前配置 HAProxy
menuWeight: 6
excerpt: 使用 HAProxy 为 DC/OS Admin Router 设置 HTTP 代理

enterprise: false
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


您可以使用 HAProxy 在 DC/OS [Admin Router](/cn/1.11/overview/architecture/components/#admin-router) 前设置 HTTP 代理。例如，如果您想向通过 HTTPS 连接到集群的用户代理程序提供自定义服务器证书，这可能非常有用。DC/OS 当前不支持将您自己的证书直接添加到 Admin Router 中。

HTTP 代理必须执行即时 HTTP 请求和响应报文头修改，因为 DC/OS 不知道用户代理程序用于寻址 HTTP 代理的自定义主机名和端口。

以下说明提供了经测试的 [HAProxy](http://www.haproxy.org/) 配置示例，其处理命名请求/响应重写。此示例确保 HAProxy 和 DC/OS Admin Router 之间的通信是 TLS 加密的。

1. 安装 HAProxy [1.6.9](http://www.haproxy.org/#down)。

1. 为 DC/OS 创建 HAProxy 配置。本示例适用于 AWS 上的 DC/OS 集群。有关 HAProxy 配置参数的更多信息，请参阅[文档](https://cbonte.github.io/haproxy-dconv/configuration-1.6.html#3)。

 您可以使用代理 IP 地址 DNS 条目找到您的任务 IP。

    ```
    <taskname>.<framework_name>.agentip.dcos.thisdcos.directory
    ```

 其中：

 * `taskname`：任务名称。
 * `framework_name`：框架名称，如果您不确定，可能 `marathon`。

    ```
    global
      daemon
      log 127.0.0.1 local0
      log 127.0.0.1 local1 notice
      maxconn 20000
      pidfile /var/run/haproxy.pid
    defaults
      log            global
      option         dontlog-normal
      mode		 http
      retries             3
      maxconn          20000
      timeout connect  5000
      timeout client  50000
      timeout server  50000

    frontend http
      # Bind on port 9090. HAProxy will listen on port 9090 on each
      # available network for new HTTP connections.
      bind 0.0.0.0:9090
      # Specify your own server certificate chain and associated private key.
      # See https://cbonte.github.io/haproxy-dconv/configuration-1.6.html#5.1-crt
      # bind *:9091 ssl crt /path/to/browser-trusted.crt
      #
      # Name of backend configuration for DC/OS.
      default_backend dcos

      # Store request Host header temporarily in transaction scope
      # so that its value is accessible during response processing.
      # Note: RFC 7230 requires clients to send the Host header and
      # specifies it to contain both, host and port information.
      http-request set-var(txn.request_host_header) req.hdr(Host)

      # Overwrite Host header to 'dcoshost'. This makes the Location
      # header in DC/OS Admin Router upstream responses contain a
      # predictable hostname (NGINX uses this header value when
      # constructing absolute redirect URLs). That value is used
      # in the response Location header rewrite logic (see regular
      # expression-based rewrite in the backend section below).
      http-request set-header Host dcoshost

    backend dcos
      # Option 1: use TLS-encrypted communication with DC/OS Admin Router and
      # perform server certificate verification (including hostname verification).
      # If you are using the community-supported version of DC/OS, you must
      # configure Admin Router with a custom TLS server certificate, see
      # /1.11/administering-clusters/. This step
      # is not required for DC/OS Enterprise.
      #
      # Explanation for the parameters in the following `server` definition line:
      #
      # 1.2.3.4:443
      #
      #   IP address and port that HAProxy uses to connect to DC/OS Admin
      #   Router. This needs to be adjusted to your setup.
      #   
      #
      # ssl verify required
      #
      #   Instruct HAProxy to use TLS, and to error out if server certificate
      #   verification fails.
      #
      # ca-file dcos-ca.crt
      #
      #   The local file `dcos-ca.crt` is expected to contain the CA certificate
      #   that Admin Router's certificate will be verified against. It must be
      #   retrieved out-of-band (on Mesosphere DC/OS Enterprise this can be
      #   obtained via https://dcoshost/ca/dcos-ca.crt)
      #
      # verifyhost frontend-xxx.eu-central-1.elb.amazonaws.com
      #
      #   When verifying the TLS certificate presented by DC/OS Admin Router,
      #   perform hostname verification using the hostname specified here
      #   (expect the server certificate to contain a DNSName SAN that is
      #   equivalent to the hostname defined here). The hostname shown here is
      #   just an example and needs to be adjusted to your setup.

      server dcos-1 1.2.3.4:443 ssl verify required ca-file dcos-ca.crt verifyhost frontend-xxx.eu-central-1.elb.amazonaws.com

      # Option 2: use TLS-encrypted communication with DC/OS Admin Router, but do
      # not perform server certificate verification (warning: this is insecure, and
      # we hope that you know what you are doing).
      # server dcos-1 1.2.3.4:443 ssl verify none
      #
      # Rewrite response Location header if it contains an absolute URL
      # pointing to the 'dcoshost' host: replace 'dcoshost' with original
      # request Host header (containing hostname and port).
      http-response replace-header Location https?://dcoshost((/.*)?) "http://%[var(txn.request_host_header)]\1"
    ```

1. 使用这些设置启动 HAProxy。
