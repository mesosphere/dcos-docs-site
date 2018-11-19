---
layout: layout.pug
navigationTitle:  V2 Pool Reference
title: V2 Pool Reference
menuWeight: 85
excerpt: Reference for all Edge-LB pool configurations options in the V2 API

enterprise: false
---


# V2 池参考

下表描述了所有可能的配置选项。大部分字段具有合理的默认值，应谨慎修改。

## 配置指南

- 如果未设置默认值，即使是对象，也将留空。
- 在离 root 对象最远的对象中设置默认值。
- 始终为阵列设置默认值。
- “nullable”的目的是允许将输出 JSON 字段设置为 golang“零值”。如果没有“nullable”，则该字段将从生成的 JSON 中完全删除。
- 实际的验证是在代码中进行的，而不是在 swagger 中。
- 空的 boolean 被解释为“false”，因此，不设置默认值。
- CamelCase。
- 如果是顶级定义，那么 Swagger 只能进行 enum 验证。

<a name="pool"></a>
# 池
池包含有关池所需资源的信息。对此部分所做的更改将重新启动任务。
| 密钥 | 类型 | Nullable | 属性 | 说明 |
| --------------------------- | -------- | ----------- | --------------  | -------------- |
| apiVersion | 字符串 | | | 该池对象的 api/schema 版本。新池应为 V2。 |
| 名称 | 字符串 | | | 池名称。 |
| namespace | 字符串 | 正确 | | DC/OS 空间（有时也称为“组”）。|
| packagEname | 字符串 | | | |
| packagEversion | 字符串 | | | |
| 角色 | 字符串 | | | 负载均衡器的 Mesos 角色。默认为“slave_public”，以便负载均衡器在共用代理上运行。使用“*”在专用代理上运行负载均衡器。请访问 http://mesos.apache.org/documentation/latest/roles/，了解更多关于 Mesos 角色的信息。 |
| cpu | 数量 | | | |
| cpusAdminOverhead | 数量 | | | |
| mem | int32 | | | 内存要求 (MB)。 |
| memAdminOverhead | int32 | | | 内存要求 (MB)。 |
| disk | int32 | | | 磁盘大小 (MB)。 |
| 计数 | integer | 正确 | | 池中负载均衡器实例的数量 |
| 约束 | 字符串 | 正确 | | 负载均衡器实例放置的 Marathon 式约束。 |
| 端口 | 阵列 | | | <ul><li>覆盖为每个负载均衡器实例分配的端口。</li><li>默认为 {{haproxy.frontend.objs[].bindPort}} 和 {{haproxy.stats.bindPort}}。</li><li>使用此字段，以预先分配所有需要的端口（有或没有前端）。例如：[80, 443, 9090]。</li><li>如果端口阵列的长度不是零，那么只有指定的端口将由池调度器进行分配。</li></ul> |
| 项 | int32 | | | |
| 密码 | 阵列 | | <ul><li>[密码](#secret-prop)</li><li>[文件](#secret-prop)</li></ul> | DC/OS 密码。 |
| environmentVariables | 对象 | | [additionalProperties](#env-var) | 要传递到任务的环境变量。以 `ELB_FILE_` 为前缀，并将其写入文件。例如， `ELB_FILE_MYENV` 的内容将被写入 `$ENVFILE/ELB_FILE_MYENV`。 |
| autoCertificate | boolean | | | 自动生成自签名 SSL/TLS 证书。默认情况下不会生成。将被写入 `$AUTOCERT`。 |
| virtualNetworks | 阵列 | | <ul><li>[名称](#vn-prop)</li><li>[标签](#vn-prop)</li></ul> | 要加入的虚拟网络。 |
| haproxy | | | | |

<a name="secrets-prop"></a>
## pool.secrets

| 密钥 | 类型 | 说明 |
| ------------- | ----------- | ----------- |
| 密码 | 对象 | |

### pool.secrets.secret

| 密钥 | 类型 | 说明 |
| ------------- | ----------- | ----------- |
| 密码 | 字符串 | 密码名称。 |
| 文件 | 字符串 | 文件名。<br />将在 `$SECRETS/myfile` 找到文件 `myfile`。 |

<a name="env-var"></a>
## pool.environmentVariables

| 密钥 | 类型 | 说明 |
| --------------------- | ----------- | ----------- |
| additionalProperties  | string      | Environment variables to pass to tasks.<br />Prefix with "ELB_FILE_" and it will be written to a file. For example, the contents of "ELB_FILE_MYENV" will be written to "$ENVFILE/ELB_FILE_MYENV". |

<a name="vn-prop"></a>
## pool.virtualNetworks

| Key           | Type        | Description |
| ------------- | ----------- | ----------- |
| name          | string      | The name of the virtual network to join. |
| labels        | string      | Labels to pass to the virtual network plugin. |

<a name="haproxy-prop"></a>
# pool.haproxy

| Key             | Type    | Description         |
| --------------- | ------- | ------------------- |
| 统计信息 | | |
| 前端 | 阵列 | 前端阵列。 |
| 后端 | 阵列 | 后端阵列。 |

<a name="stats-prop"></a>
# pool.haproxy.stats

| 密钥 | 类型 |
| -------------- | -------- |
| bindAddress | 字符串 |
| bindPort | int 32 |

<a name="frontend-prop"></a>
# pool.haproxy.frontend

| 密钥 | 类型 | 属性 | 说明 | x-nullable  | 格式 |
| --------------- | ------- | -------------- | -------------- | ---------- | ------ |
| 名称 | 字符串 | | 默认为 `frontend_{{bindAddress}}_{{bindPort}}`。| | | bindAddress | 字符串 | | 仅使用前端名称中允许的字符。已知无效前端名称字符包括 `*`、`[` 和 `]`。 | | |
| bindPort | 整数 | | 此前端将绑定的端口（如例如，针对 HTTP 的 80 或针对 HTTP 的 443）。| | int32 |
| bindModifier | 字符串 | | 要放入绑定字段的其他文本 | | |
| 证书 | 阵列 | | 负载均衡器中的 SSL/TLS 证书。<br /><br />对于密码，使用 `$SECRETS/my_file_name`<br />对于环境文件，使用 `$ENVFILE/my_file_name`<br />对于 autoCertificate，使用 `$AUTOCERT`。<br />类型：字符串 | | |
| redirectToHttps | 对象 | <ul><li>[except](#redirect-https-prop)</li><li>[项](#redirect-https-prop)</li></ul> | 将其设置为空对象，足以将所有流量从 HTTP（该前端）重定向至 HTTPS（端口 443）。默认： except: [] | | |
| miscStrs | 字符串阵列 | | 在 use_backend 前插入的其他模板行 | | |
| protocol | | | 前端协议是客户/用户与 HAProxy 通信的方式。 | | |
| linkBackend | 对象 | <ul><li>defaultBackend</li><li>map</li></ul> | 这描述了将流量发送到哪个后端。这可以用多种筛选器表示，例如，与主机名或 HTTP URL 路径匹配。<br />默认： map: [] | | |

<a name="redirect-https-prop"></a>
## pool.haproxy.frontend.redirectToHttps

| 密钥 | 类型 | 属性 | 说明 |
| --------------- | ------- | ----------- | --------------- |
| except          | array   |             | You can additionally set a whitelist of fields that must be matched to allow HTTP.  |
| items           | object  | <ul><li>[host](#items-prop)</li><li>[pathBeg](#items-prop)</li></ul> | Boolean AND will be applied with every selected value. |

<a name="items-prop"></a>
### pool.frontend.redirectToHttps.items

| Key             | Type    | Description |
| --------------- | ------- | ----------- |
| host            | string  | Match on host. |
| pathBeg         | string  | Math on path.  |

## pool.haproxy.frontend.linkBackend

| Key             | Type    | Properties | Description |
| --------------- | ------- | ---------- | ----------- |
| defaultBackend | 字符串 | | 如果没有匹配其他筛选器，则路由到该默认后端 |。
| map | 阵列 | <ul><li>[后端](#map-prop)</li><li>[hostEq](#map-prop)</li><li>[hostReg](#map-prop)</li><li>[pathBeg](#map-prop)</li><li>[pathEnd](#map-prop)</li><li>[pathReg](#map-prop)</li></ul> | 这是一个可选字段，指定各个后端的映射。按顺序应用这些规则。<br />必须填写“后端”和至少一个条件字段。如果填写多个条件，那么它们将与一个 boolean "AND" 结合。|

<a name="map-prop"></a>
### pool.frontend.linkBackend.map

| 密钥 | 类型 | 说明 |
| --------------- | ------- | ----------- |
| 后端 | 字符串 | |
| hostEq | 字符串 | 必须都为小写。 |
| hostReg | 字符串 | 必须都为小写。 | 端口（如 `foo.com:80`）可以在此 regex 中。 |
| pathBeg | 字符串 | |
| pathEnd | 字符串 | |
| pathReg  | 字符串 | |

<a name="backend-prop"></a>
# pool.haproxy.backend

| 密钥 | 类型 | 属性 | 说明 |
| --------------- | ------- | -------------- | -------------- |
| name            | string  |                | The name the frontend refers to. |
| protocol        | string  |                | The backend protocol is how HAProxy communicates with the servers it is load balancing. |
| rewriteHttp     |         |                | Manipulate HTTP headers. There is no effect unless the protocol is either HTTP or HTTPS. |
| balance         | string  |                | Load balancing strategy. E.g., roundrobin, leastconn, etc. |
| customCheck     | object  | <ul><li>[httpchk](#customCheck-prop)</li><li>[httpchkMiscStr](#customCheck-prop)</li><li>[sslHelloChk](#customCheck-prop)</li><li>[miscStr](#customCheck-prop)</li></ul>  | Specify alternate forms of healthchecks.  |
| miscStrs        | array of strings |       | Additional template lines inserted before servers  |
| services        | array   |                | Array of backend service selectors.  |

<a name="customCheck-prop"></a>
## pool.haproxy.backend.customCheck

| Key            | Type     |
| -------------  | -------- |
| httpchk        | boolean  |
| httpchkMiscStr | string   |
| sslHelloChk    | boolean  |
| miscStr        | string   |

<a name="#rewrite-prop"></a>
# pool.haproxy.backend.rewriteHttp

| Key             | Type    | Properties     | Description    |
| --------------- | ------- | -------------- | -------------- |
| 主机 | 字符串 | | 设置主机标题值。 |
| 路径 | 对象 | <ul><li>[fromPath](#path-prop)</li><li>[toPath](#path-prop)</li></ul> | 重写 HTTP URL 路径。所有字段必填，否则会被忽略。|
| 请求 | | | |
| 响应 | | | |
| 粘滞 | 对象 | <ul><li>[已启用](#sticky-prop)</li><li>[customStr](#sticky-prop)</li></ul> | 通过 Cookie 进行粘滞会话。<br />要使用默认值（建议），则将此字段设置为空对象。|

<a name="path-prop"></a>
## pool.haproxy.backend.rewriteHttp.path

| 密钥 | 类型 |
| --------------- | ------- |
| fromPath        | string  |
| toPath          | string  |

<a name="sticky-prop"></a>
## pool.haproxy.backend.rewriteHttp.sticky

| Key             | Type    | nullable   |
| --------------- | ------- | ---------- |
| enabled         | boolean | true       |
| customStr       | string  |            |

<a name="rewrite-req-prop"></a>
# pool.haproxy.backend.rewriteHttp.request

| Key                         | Type       | nullable   |
| --------------------------- | ---------- | ---------- |
| forwardfor | boolean | 正确 |
| xForwardedPort | boolean | 正确 |
| xForwardedProtoHttpSiFtls |  | 正确 |
| setHostHeader | boolean | 正确 |
| rewritePath | boolean | 正确 |

<a name="rewrite-resp-prop"></a>
# pool.haproxy.backend.rewriteHttp.response

| 密钥 | 类型 | nullable |
| --------------- | ---------- | ---------- |
| rewriteLocation | boolean    | true       |

<a name="service-prop)"></a>
# pool.haproxy.backend.service

| Key             | Type       |
| --------------- | ---------- |
| marathon        | object     |
| mesos           | object     |
| endpoint        | object     |

<a name="service-marathon-prop)"></a>
# pool.haproxy.backend.service.marathon

| Key                  | Type      | Description                                                       |
| -----------          | --------- | -----------                                                       |
| serviceID | 字符串 | Marathon pod 或应用程序 ID。 |
| serviceIDPattern | 字符串 | serviceID 作为 regex pattern。 |
| containerName | 字符串 | Marathon pod 容器名称，可选，除非使用 Marathon Pod。|
| containerNamEpattern | 字符串 | containerName 作为 regex pattern。 |

<a name="service-mesos-prop)"></a>
# pool.haproxy.backend.service.mesos

| 密钥 | 类型 | 说明 |
| -----------          | --------- | -----------                       |
| frameworkName        | string    | Mesos framework name.             |
| frameworkNamePattern | string    | frameworkName as a regex pattern. |
| frameworkID          | string    | Mesos framework ID.               |
| frameworkIDPattern   | string    | frameworkID as a regex pattern.   |
| taskName             | string    | Mesos task name.                  |
| taskNamePattern      | string    | taskName as a regex pattern.      |
| taskID               | string    | Mesos task ID.                    |
| taskIDPattern        | string    | taskID as a regex pattern.        |

<a name="service-endpoint-prop)"></a>
# pool.haproxy.backend.service.endpoint

| Key         | Type      | Description                                                                                   |
| ----------- | --------- | -----------                                                                                   |
| 类型 | 字符串 | Enum 字段，可以是 `AUTO_IP`、`AGENT_IP`、`CONTAINER_IP` 或 `ADDRESS`。默认为 `AUTO_IP`。 |
| miscStr | 字符串 | 将任意字符串附加到“服务器”指令的末尾。 |
| 检查 | 对象 | 启用健康检查。默认情况下，这些是 TCP 健康检查。有关更多选项，请参阅“customCheck”。这些是 DNS 解析功能正常运行所需的。 |
| 地址 | 字符串 | 服务器地址覆盖，可用于指定集群内部地址，如 VIP。仅在使用类型 `ADDRESS` 时允许。 |
| 端口 | 整数 | 端口号。 |
| portName | 整数 | 端口名称。 |
| allPorts | boolean | 当 `true` 时，选择在服务中定义的所有端口。 |

<a name="service-endpoint-check-prop)"></a>
# pool.haproxy.backend.service.endpoint.check

| 密钥 | 类型 |
| ----------- | --------- |
| 已启用 | boolean |
| customStr | 字符串 |

<a name="error-prop"></a>
# 错误

| 密钥 | 类型 |
| --------------- | ----------- |
| 代码 | int32 |
| 消息 | 字符串 |
