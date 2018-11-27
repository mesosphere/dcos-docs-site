---
layout: layout.pug
navigationTitle: 服务端口
title: 服务端口
menuWeight: 3
excerpt: 使用虚拟 IP 管理服务端口

enterprise: false
---


可以使用 [虚拟地址 (VIP)](/cn/1.11/networking/load-balancing-vips/virtual-ip-addresses/) 简化端口管理工作。VIP 简化了应用间通信，并实施可靠的服务导向型架构。VIP 将流量从单个虚拟地址映射到多个 IP 地址和端口。

# 定义

**containerPort**：容器端口指定容器内的端口。只有在使用 Docker 容器以 `BRIDGE` 或 `USER` 模式的网络进行端口映射时，才需要加入该定义。

**hostPort**：主机端口指定要绑定到的主机上的端口。在使用 `BRIDGE` 或 `USER` 模式的网络时，您将指定从主机端口到容器端口的映射。在 `HOST` 网络中，请求的端口默认为主机端口。请注意，只有主机端口可通过环境变量供任务使用。

**BRIDGE networking**：用于指定 `BRIDGE` 模式网络的 Docker 应用程序。在这一模式下，容器端口会被映射到主机端口。在这一模式下，应用程序绑定到容器内的指定端口，Docker 网络则被绑定到主机上的指定端口。

**USER networking**：用于指定 `USER` 模式网络的 Docker 应用程序。在这一模式下，容器端口会被映射到主机端口。在这一模式下，应用程序绑定到容器内的指定端口，Docker 网络则被绑定到主机上的指定端口。 `USER` 网络模式在与“用户定义”Docker 网络集成时，应该会很实用。在 Mesos 领域，通常可通过与 Mesos CNI 网络隔离器配合使用的 CNI 插件访问该网络。

**HOST networking**：用于非 Docker Marathon 应用程序和使用 `HOST` 模式网络的 Docker 应用程序。在这一模式下，应用程序直接绑定到主机上的一个或多个端口。

**portMapping**：在 Docker `BRIDGE` 模式下，能够从容器外访问的所有端口都需要进行端口映射。端口映射是一个包含主机端口、容器端口、服务端口和协议的元组。可为 Marathon 应用指定多个端口映射；未指定的 `hostPort` 默认为 `0` （表示 Marathon 会随机分配该值）。在 Docker `USER` 模式下，`hostPort` 的语义稍有变化：`USER` 模式不需要 `hostPort`，并且如果未指定，Marathon 也不会随机自动分配该值。这样可以将容器部署于包含 `containerPort` 和发现信息的 `USER` 网络，但不会在主机网络上披露这些端口（并且意味着不会占用主机端口资源）。

**ports**：端口阵列用于定义在 `HOST` 模式下应被视为包含在资源供应中的端口 。仅在未指定端口映射时才需要端口信息。一个应用只能定义 ports 和 portDefinitions 两者中的一个。

**portDefinitions**：portDefinitions 阵列用于定义应被视为资源供应一部分的端口。只有在您正在使用 `HOST` 网络且未指定端口映射时，才有必要定义这一阵列。此阵列用于替换端口阵列，并且可以指定端口名称、协议和标签。一个应用只能定义 ports 和 portDefinitions 两者中的一个。

**protocol**：协议指定为端口指定互联网协议（例如，`tcp`、 `udp` 或 `udp,tcp` 同时用于两者）。只有在使用具有 Docker 容器的 `BRIDGE` 或 `USER` 模式的网络时，才需要在端口映射中加入该定义。

**requirePorts**：requirePorts 属性可指定 Marathon 是否应在其收到的资源供应中专门寻找指定端口。这能确保可以将这些端口闲置着，可以用于绑定在 Mesos 代理节点上。该属性不适用于 `BRIDGE` 或 `USER` 模式网络。

**servicePort**：在 Marathon 中（通过 REST API 或前端）创建新应用程序时，可以为它分配一个或多个服务端口。可以指定所有有效的端口数作为服务端口，也可以使用 0 表示 Marathon 应自动向应用程序分配闲置服务端口。如果的确选择了自己的服务端口，就必须确保该端口在所有应用程序中都是唯一的。

# 随机端口分配

使用 `0` 值设置任何端口，都会告知 Marathon 您希望获得随机分配的端口。但是，如果 `portMapping` 中的 `containerPort` 设置为 `0`，则将该值设置为与 `hostPort` 相同的值。

# 环境变量

每个 **host port** 值都通过环境变量 `$PORT0`、`$PORT1` 等披露给正在运行的应用实例。每个 Marathon 应用程序默认获得单个端口，所以 `$PORT0` 始终可用。这些环境变量也在 Marathon 运行的 Docker 容器内可以使用。此外，命名为 `NAME` 的端口也可通过环境变量 `$PORT_NAME` 进行访问。

使用 `BRIDGE` 或 `USER` 模式网络时，务必将应用程序绑定到 `portMapping` 中指定的  `containerPort`。但是，如果已将 `containerPort` 设置为 0，就与 `hostPort` 相同，则可以使用 `$PORT` 环境变量。

# 示例配置

## 主机模式

主机模式网络是 Docker 容器的默认网络模式，也是非 Docker 应用程序的唯一网络模式。请注意，在 Dockerfile 中 `EXPOSE` （披露）端口是不必要的。

### 启用主机模式

容器默认启用主机模式。若要做到明确，也可以通过 `network` 属性手动指定：

```json
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "my-image:1.0",
      "network": "HOST"
    }
  },
```

无需为非 Docker 应用程序指定任何内容。

### 指定端口

可通过 `ports` 阵列指定可用端口：

```json
    "ports": [
        0, 0, 0
    ],
```

或通过 `portDefinitions` 阵列指定：

```json
    "portDefinitions": [
      {"port": 0}, {"port": 0}, {"port": 0}
    ],
```


在此示例中，我们指定了三个随机分配的主机端口，制定后即可通过环境变量 `$PORT0`、`$PORT1` 和 `$PORT2` 用于我们的命令。除了这三个主机端口外， Marathon 还会随机分配三个服务端口。

还可以指定特定的服务端口：

```json
    "ports": [
        2001, 2002, 3000
    ],
```

或：

```json
    "portDefinitions": [
        {"port": 2001}, {"port": 2002}, {"port": 3000}
    ],
```

此时，主机端口 `$PORT0`、`$PORT1` 和 `$PORT3` 继续接受随机分配。然而，此应用程序的三个服务端口现在是 `2001`、`2002` 和 `3000`。与之前的示例一样，必须使用例如 HAProxy 的服务发现解决方案，发送从服务端口到主机端口的代理请求。如果您希望应用程序服务端口等同于其主机端口，可以将 `requirePorts` 设置为 `true` （`requirePorts` 默认为 `false`）。这会告诉 Marathon 仅在有这些端口可用的代理上安排此应用程序：

```json
    "ports": [
        2001, 2002, 3000
    ],
    "requirePorts" : true
```

服务端口和主机端口（包括环境变量 `$PORT0`、 `$PORT1` 和 `$PORT2`）现在都是 `2001`、 `2002` 和 `3000`。如果不使用服务发现解决方案来发送从服务端口到主机端口的代理请求，则此属性非常有用。

定义 `portDefinitions` 阵列帮助您为每个端口指定协议、名称和标签。启动
新任务时， Marathon 会把这个元数据传递给 Mesos。Mesos 会在任务的 `discovery` 字段披露
这一信息。自定义网络发现解决方案可以占用此字段。

请求名称为 `http` ，标签为 `VIP_0` 设置为 `10.0.0.1:80` 的动态 `tcp` 端口，的示例：

```json
    "portDefinitions": [
        {
            "port": 0,
            "protocol": "tcp",
            "name": "http",
            "labels": {"VIP_0": "10.0.0.1:80"}
        }
    ],
```

`port` 字段为必填字段。`protocol`、`name` 和 `labels` 字段为可选字段。仅设置了
`port` 字段的端口定义相当于 `ports` 阵列的一个元素。

请注意， 只有 `ports` 阵列和 `portDefinitions` 阵列不应同时指定，除非其所有
元素都相等。

### 引用端口

可以参考用于如下虚拟应用程序的 Dockerfile 中的主机端口：

```sh
CMD ./my-app --http-port=$PORT0 --https-port=$PORT1 --monitoring-port=$PORT2
```

或者，如果在 Marathon 应用定义中不使用 Docker 或没有指定 `cmd`，则其原理相同：

```json
    "cmd": "./my-app --http-port=$PORT0 --https-port=$PORT1 --monitoring-port=$PORT2"
```

## 桥接模式

桥接模式网络帮助您进行主机端口到容器内的端口的映射，并且仅适用于 Docker 容器。如果您使用的容器镜像具有无法修改的固定端口分配，这一模式就会特别有用。请注意，不一定必须在 Dockerfile 中 `EXPOSE` （披露）端口。

### 启用桥接模式

需要通过 `network` 属性指定桥接模式：

```json
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "my-image:1.0",
      "network": "BRIDGE"
    }
  },
```

### 启用用户模式

需要通过 `network` 属性指定用户模式：

```json
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "my-image:1.0",
      "network": "USER"
    }
  },
  "ipAddress": {
    "networkName": "someUserNetwork"
  }
```

### 指定端口

端口映射类似于将 -p 传递到 Docker 命令行，并指定主机上端口与容器内的端口之间的关系。此时使用`portMappings` 阵列， **而非**在主机模式下使用的 `ports` 或 `portDefinitions` 阵列。

在 `portMappings` 对象内为 `container` 容器指定端口映射：

```json
"networks": [
      { "mode": "container/bridge" }
],
"container": {
  "type": "DOCKER",
  "docker": {
    "image": "my-image:1.0",
  },
  "portMappings": [
    { "containerPort": 0, "hostPort": 0 },
    { "containerPort": 0, "hostPort": 0 },
    { "containerPort": 0, "hostPort": 0 }
  ]
}
```

在本示例中，我们指定了 3 个映射。值为 0 时，会要求 Marathon 为 `hostPort` 随机分配一个值。此时，将 `containerPort` 设置为 0 会使其具有与 `hostPort` 相同的值。这些值可在容器内分别作为 `$PORT0`、 `$PORT1` 和 `$PORT2` 提供。

另外，如果我们在容器中运行的流程有固定端口，我们就可能会执行如下操作：

```json
"networks": [
      { "mode": "container/bridge" }
],
"container": {
  "type": "DOCKER",
  "docker": {
    "image": "my-image:1.0"
  },
  "portMappings": [
    { "containerPort": 80, "hostPort": 0 },
    { "containerPort": 443, "hostPort": 0 },
    { "containerPort": 4000, "hostPort": 0 }
  ]
}
```

此时， Marathon 将随机分配主机端口并进行到端口 `80`、 `443` 和 `4000` 的映射。必须注意 `$PORT` 变量指主机端口。此时，将为第一次及后续映射设置 `$PORT0` 为 `hostPort`。

#### 指定协议

也可以为这些端口映射指定协议。默认为 `tcp`：

```json
"networks": [
  { "mode": "container/bridge" }
],
"container": {
  "type": "DOCKER",
  "docker": {
    "image": "my-image:1.0"
  },
  "portMappings": [
    { "containerPort": 80, "hostPort": 0, "protocol": "tcp" },
    { "containerPort": 443, "hostPort": 0, "protocol": "tcp" },
    { "containerPort": 4000, "hostPort": 0, "protocol": "udp" }
  ]
}
```

#### 指定服务端口

Marathon 将默认为每个端口创建服务端口，并为其分配随机值。服务端口供服务发现解决方案使用，通常建议将这些端口设置为常见的值。可以通过为每个映射设置一个 `servicePort` 来实现：

```json
"networks": [
  { "mode": "container/bridge" }
],
"container": {
  "type": "DOCKER",
  "docker": {
    "image": "my-image:1.0"
  },
  "portMappings": [
    { "containerPort": 80, "hostPort": 0, "protocol": "tcp", "servicePort": 2000 },
    { "containerPort": 443, "hostPort": 0, "protocol": "tcp", "servicePort": 2001 },
    { "containerPort": 4000, "hostPort": 0, "protocol": "udp", "servicePort": 3000 }
  ]
}
```

在本示例中，主机端口 `$PORT0`、`$PORT1` 和 `$PORT3` 仍旧接受随机分配。但是此应用程序的服务端口现在为 `2001`、 `2002` 和 `3000`。HAProxy 等外部代理应设置为从服务端口路由到主机端口。

### 指代端口

如果将 `containerPort` 设为 0，就应该在 Dockerfile 中为虚拟应用程序指定如下端口：

```sh
CMD ./my-app --http-port=$PORT0 --https-port=$PORT1 --monitoring-port=$PORT2
```

但是，如果已指定 `containerPort` 值，则只需在 Dockerfile 中使用相同的值：

```sh
CMD ./my-app --http-port=80 --https-port=443 --monitoring-port=4000
```

或者，可以在 Marathon 应用定义中指定 `cmd`，其原理和之前相同：

```json
    "cmd": "./my-app --http-port=$PORT0 --https-port=$PORT1 --monitoring-port=$PORT2"
```

或者，如果使用了固定值：

```json
    "cmd": "./my-app --http-port=80 --https-port=443 --monitoring-port=4000"
```
